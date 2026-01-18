import { NextRequest, NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";
import { downloadYouTubeAudio } from "@/lib/youtube";
import { transcribeAudio, splitTranscriptIntoChunks, addTimestampsToChunks } from "@/lib/transcribe";
import fs from "fs";
import path from "path";

/**
 * Complete transcript processing with fallback:
 * 1. Try YouTube captions (fast) - auto-detects language from available captions
 * 2. If fail, download audio + Groq Whisper (slower but works for all videos)
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

    let subtitles;
    try {
      // Try requested language first
      subtitles = await getSubtitles({ videoID: videoId, lang: requestedLang });
      detectedLanguage = requestedLang;
    } catch (error) {
      // Fallback to French if not the requested language
      if (requestedLang !== "fr") {
        try {
          subtitles = await getSubtitles({ videoID: videoId, lang: "fr" });
          detectedLanguage = "fr";
        } catch (frError) {
          // Fallback to English
          subtitles = await getSubtitles({ videoID: videoId, lang: "en" });
          detectedLanguage = "en";
        }
      } else {
        // If French was requested and failed, try English
        subtitles = await getSubtitles({ videoID: videoId, lang: "en" });
        detectedLanguage = "en";
      }
    }

    if (subtitles && subtitles.length > 0) {
      // Convert to our format - COMBINE captions into larger, meaningful chunks
      const fullTranscript = subtitles.map((sub: any) => sub.text).join(" ");

      // Combine caption segments into ~5 minute chunks for better context
      const targetChunkDuration = 300; // seconds (5 minutes)
      const combinedChunks: any[] = [];
      let currentChunk: any = null;

      for (const sub of subtitles) {
        const subStartSec = Math.floor(sub.start / 1000);
        const subEndSec = Math.floor((sub.start + sub.dur) / 1000);

        if (!currentChunk) {
          // Start new chunk
          currentChunk = {
            text: sub.text,
            startTime: subStartSec,
            endTime: subEndSec,
          };
        } else {
          const chunkDuration = subEndSec - currentChunk.startTime;

          if (chunkDuration < targetChunkDuration) {
            // Add to current chunk
            currentChunk.text += " " + sub.text;
            currentChunk.endTime = subEndSec;
          } else {
            // Save current chunk and start new one
            combinedChunks.push(currentChunk);
            currentChunk = {
              text: sub.text,
              startTime: subStartSec,
              endTime: subEndSec,
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

    let audioPath: string | null = null;

    try {
      // Download audio
      const downloadResult = await downloadYouTubeAudio(youtubeUrl, "./downloads");
      audioPath = downloadResult.filePath;

      // Check file size (Groq Whisper limit is 25MB)
      if (downloadResult.fileSize > 25 * 1024 * 1024) {
        throw new Error(
          `Audio file too large (${(downloadResult.fileSize / 1024 / 1024).toFixed(2)}MB). Groq Whisper supports up to 25MB.`
        );
      }

      // Transcribe with Groq Whisper (let it auto-detect language)
      const transcription = await transcribeAudio(audioPath, requestedLang);

      // Split into chunks
      const chunks = splitTranscriptIntoChunks(transcription.text, 90, 10);
      const chunksWithTimestamps = addTimestampsToChunks(chunks, 90);

      // Clean up audio file
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }

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

      console.error("[ProcessTranscript] Whisper failed:", whisperError);

      return NextResponse.json(
        {
          success: false,
          error: `Failed to transcribe: ${whisperError.message}`,
          method: "whisper-transcription",
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
