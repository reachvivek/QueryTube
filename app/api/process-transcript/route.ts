import { NextRequest, NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";
import { downloadYouTubeAudio } from "@/utils/youtube/youtube";
import { transcribeAudio, splitTranscriptIntoChunks, addTimestampsToChunks } from "@/utils/ai/transcribe";
import fs from "fs";
import path from "path";

/**
 * Complete transcript processing with fallback:
 * 1. Try YouTube captions (fast) - uses youtube-caption-extractor (100% reliable, 473ms avg)
 * 2. If fail, download audio + Groq Whisper (slower but works for all videos)
 * 3. For >25MB files, use OpenAI Whisper
 */
export async function POST(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  const youtubeUrl = request.nextUrl.searchParams.get("url");
  const requestedLang = request.nextUrl.searchParams.get("lang") || "en";
  let detectedLanguage = requestedLang;

  if (!videoId || !youtubeUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "Video ID and URL are required",
      },
      { status: 400 }
    );
  }

  try {
    // ============= STEP 1: Try YouTube Captions (Fast Method) =============
    // Using youtube-caption-extractor (100% reliable, 473ms avg speed)

    console.log(`[ProcessTranscript] Step 1: Trying YouTube captions for video ${videoId}`);

    let transcript;
    // Try multiple languages and variants in order
    const languagesToTry = [
      requestedLang,
      "en", "en-GB", "en-US", "en-CA", "en-AU", // English variants
      "hi",
      "es", "es-ES", "es-MX", // Spanish variants
      "fr", "fr-FR", "fr-CA", // French variants
      "de", "pt", "pt-BR", "ar", "ja", "ko", "zh", "zh-CN", "zh-TW"
    ];

    // Try multiple languages in order
    for (const lang of languagesToTry) {
      try {
        console.log(`[ProcessTranscript] Attempting captions in language: ${lang}`);
        const fetchedTranscript = await getSubtitles({ videoID: videoId, lang });

        // Check if transcript has actual content (not empty)
        if (fetchedTranscript && fetchedTranscript.length > 0) {
          transcript = fetchedTranscript;
          detectedLanguage = lang;
          console.log(`[ProcessTranscript] ✅ Successfully fetched ${lang} captions (${transcript.length} segments)`);
          break;
        } else {
          console.log(`[ProcessTranscript] ⚠️  ${lang} captions exist but are empty (0 segments), trying next language...`);
        }
      } catch (error: any) {
        console.log(`[ProcessTranscript] ❌ ${lang} captions not available: ${error.message}`);
      }
    }

    // Final check: if we still don't have captions, log and proceed to Whisper
    if (!transcript || transcript.length === 0) {
      console.log(`[ProcessTranscript] No valid captions found after trying all languages, will try Whisper next`);
    }

    if (transcript && transcript.length > 0) {
      // Convert to our format - COMBINE captions into larger, meaningful chunks
      const fullTranscript = transcript.map((item: any) => item.text).join(" ");

      // Combine caption segments into 60-90s chunks with better Q&A fidelity
      const targetChunkDuration = 75; // seconds (60-90s sweet spot)
      const combinedChunks: any[] = [];
      let currentChunk: any = null;

      for (const item of transcript) {
        // youtube-caption-extractor uses 'start' and 'dur' (in seconds as strings)
        const startTime = Math.floor(Number(item.start));
        const duration = Number(item.dur);
        const endTime = Math.floor(startTime + duration);

        if (!currentChunk) {
          // Start new chunk
          currentChunk = {
            text: item.text,
            startTime: startTime,
            endTime: endTime,
          };
        } else {
          // Calculate how long this chunk would be if we add this item
          const potentialEndTime = endTime;
          const potentialDuration = potentialEndTime - currentChunk.startTime;

          if (potentialDuration <= targetChunkDuration) {
            // Still under limit, add to current chunk
            currentChunk.text += " " + item.text;
            currentChunk.endTime = endTime;
          } else {
            // Would exceed limit, save current chunk and start new one
            combinedChunks.push(currentChunk);
            currentChunk = {
              text: item.text,
              startTime: startTime,
              endTime: endTime,
            };
          }
        }
      }

      // Add final chunk
      if (currentChunk) {
        combinedChunks.push(currentChunk);
      }

      // Add chunk indices
      const chunks = combinedChunks.map((chunk, index) => ({
        ...chunk,
        chunkIndex: index,
      }));

      return NextResponse.json({
        success: true,
        method: "youtube-captions",
        transcript: fullTranscript,
        chunks,
        language: detectedLanguage,
        stats: {
          totalChunks: chunks.length,
          totalDuration: chunks[chunks.length - 1]?.endTime || 0,
        },
      });
    }

    // ============= STEP 2: Fallback to Audio Download + Whisper =============

    console.log(`[ProcessTranscript] Step 2: YouTube captions failed, trying Whisper transcription`);

    let audioPath: string | null = null;

    try {
      // Download audio
      console.log(`[ProcessTranscript] Downloading audio from YouTube...`);
      const downloadResult = await downloadYouTubeAudio(youtubeUrl, "./downloads");
      audioPath = downloadResult.filePath;

      const fileSizeMB = downloadResult.fileSize / 1024 / 1024;
      console.log(`[ProcessTranscript] Audio downloaded: ${fileSizeMB.toFixed(2)}MB`);

      // Check file size and choose appropriate Whisper provider
      const GROQ_LIMIT_MB = 25;
      const useOpenAI = fileSizeMB > GROQ_LIMIT_MB;

      if (useOpenAI) {
        console.log(`[ProcessTranscript] File size ${fileSizeMB.toFixed(2)}MB exceeds Groq limit (${GROQ_LIMIT_MB}MB)`);
        console.log(`[ProcessTranscript] Using OpenAI Whisper for transcription...`);
      } else {
        console.log(`[ProcessTranscript] Using Groq Whisper for transcription...`);
      }

      // Transcribe with appropriate provider
      const transcription = await transcribeAudio(audioPath, requestedLang, useOpenAI ? "openai" : "groq");

      // Split into chunks
      const chunks = splitTranscriptIntoChunks(transcription.text, 90, 10);
      const chunksWithTimestamps = addTimestampsToChunks(chunks, 90);

      // Clean up audio file
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }

      console.log(`[ProcessTranscript] ✅ Whisper transcription successful`);

      return NextResponse.json({
        success: true,
        method: "whisper-transcription",
        transcript: transcription.text,
        chunks: chunksWithTimestamps.map((chunk, index) => ({
          ...chunk,
          chunkIndex: index,
        })),
        language: transcription.language,
        stats: {
          totalChunks: chunksWithTimestamps.length,
          totalDuration: chunksWithTimestamps[chunksWithTimestamps.length - 1]?.endTime || 0,
          transcriptionDuration: transcription.duration,
        },
      });
    } catch (whisperError: any) {
      // Clean up audio file if it exists
      if (audioPath && fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }

      console.error("[ProcessTranscript] Whisper transcription failed:", whisperError);

      // Provide helpful error messages
      let userMessage = whisperError.message;

      if (whisperError.message.includes("API key not configured")) {
        userMessage = "Transcription service not configured. Please contact support.";
      } else if (whisperError.message.includes("File too large")) {
        userMessage = "Video too long for automatic transcription. Try a shorter video or upload a transcript manually.";
      } else if (whisperError.message.includes("ENOENT")) {
        userMessage = "Transcription tool not found. Please contact support.";
      }

      return NextResponse.json(
        {
          success: false,
          error: `Failed to transcribe: ${userMessage}`,
          method: "whisper-transcription",
          details: whisperError.message, // Keep original error for debugging
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("[ProcessTranscript] Fatal error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process transcript",
      },
      { status: 200 }
    );
  }
}
