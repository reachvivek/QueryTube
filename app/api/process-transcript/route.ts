import { NextRequest, NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";
import { downloadYouTubeAudio } from "@/lib/youtube";
import { transcribeAudio, splitTranscriptIntoChunks, addTimestampsToChunks } from "@/lib/transcribe";
import fs from "fs";
import path from "path";

/**
 * Complete transcript processing with fallback:
 * 1. Try YouTube captions (fast)
 * 2. If fail, download audio + Whisper (slower but works for all videos)
 */
export async function POST(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  const youtubeUrl = request.nextUrl.searchParams.get("url");
  const language = request.nextUrl.searchParams.get("lang") || "fr";

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
    console.log(`[ProcessTranscript] Starting for video: ${videoId}`);

    // ============= STEP 1: Try YouTube Captions (Fast Method) =============
    console.log("[ProcessTranscript] Step 1: Trying YouTube captions...");

    try {
      const subtitles = await getSubtitles({ videoID: videoId, lang: language });

      if (subtitles && subtitles.length > 0) {
        console.log(`[ProcessTranscript] ✓ Got captions! ${subtitles.length} segments`);

        // Convert to our format
        const fullTranscript = subtitles.map((sub: any) => sub.text).join(" ");
        const chunks = subtitles.map((sub: any, index: number) => ({
          text: sub.text,
          startTime: Math.floor(sub.start / 1000),
          endTime: Math.floor((sub.start + sub.dur) / 1000),
          chunkIndex: index,
        }));

        return NextResponse.json({
          success: true,
          method: "youtube-captions",
          transcript: fullTranscript,
          chunks,
          language: language,
          stats: {
            totalChunks: chunks.length,
            totalDuration: chunks[chunks.length - 1]?.endTime || 0,
          },
        });
      }
    } catch (captionError: any) {
      console.log(`[ProcessTranscript] ✗ Captions failed: ${captionError.message}`);
      console.log("[ProcessTranscript] Step 2: Falling back to audio download + Whisper...");
    }

    // ============= STEP 2: Fallback to Audio Download + Whisper =============

    let audioPath: string | null = null;

    try {
      // Download audio
      console.log("[ProcessTranscript] Downloading audio...");
      const downloadResult = await downloadYouTubeAudio(youtubeUrl, "./downloads");
      audioPath = downloadResult.filePath;

      console.log(`[ProcessTranscript] ✓ Downloaded: ${audioPath}`);
      console.log(`[ProcessTranscript] Size: ${(downloadResult.fileSize / 1024 / 1024).toFixed(2)} MB`);

      // Check file size (Whisper limit is 25MB)
      if (downloadResult.fileSize > 25 * 1024 * 1024) {
        throw new Error(
          `Audio file too large (${(downloadResult.fileSize / 1024 / 1024).toFixed(2)}MB). Whisper supports up to 25MB.`
        );
      }

      // Transcribe with Whisper
      console.log("[ProcessTranscript] Transcribing with Whisper...");
      const transcription = await transcribeAudio(audioPath, language);

      console.log(`[ProcessTranscript] ✓ Transcribed! Language: ${transcription.language}`);

      // Split into chunks
      const chunks = splitTranscriptIntoChunks(transcription.text, 90, 10);
      const chunksWithTimestamps = addTimestampsToChunks(chunks, 90);

      // Clean up audio file
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
        console.log("[ProcessTranscript] ✓ Cleaned up audio file");
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
