import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio, splitTranscriptIntoChunks, addTimestampsToChunks } from "@/lib/transcribe";
import { existsSync } from "fs";

/**
 * POST /api/transcribe
 * Transcribes an audio file using Groq's Whisper API
 *
 * Body:
 * {
 *   "filepath": "/path/to/audio.mp3",
 *   "language": "fr" // optional - will auto-detect if not provided
 *   "chunkSize": 90 // optional, in seconds
 *   "overlap": 10 // optional, in seconds
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filepath, language, chunkSize = 90, overlap = 10 } = body;

    if (!filepath) {
      return NextResponse.json(
        { error: "filepath is required" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "Audio file not found" },
        { status: 404 }
      );
    }

    // Step 1: Transcribe audio using Groq's Whisper
    const transcriptionResult = await transcribeAudio(filepath, language);
    const { text: transcript, language: detectedLanguage, duration } = transcriptionResult;

    // Step 2: Split transcript into chunks
    const textChunks = splitTranscriptIntoChunks(transcript, chunkSize, overlap);
    const chunksWithTimestamps = addTimestampsToChunks(textChunks, chunkSize);

    return NextResponse.json({
      success: true,
      transcript,
      language: detectedLanguage,
      transcriptionDuration: duration,
      chunks: chunksWithTimestamps,
      stats: {
        totalChunks: textChunks.length,
        chunkSize,
        overlap,
        transcriptLength: transcript.length,
      },
    });

  } catch (error: any) {
    console.error("[Groq Transcribe] Error:", error);

    // Handle specific Whisper API errors
    let errorMessage = "Failed to transcribe audio";

    if (error.message.includes("File too large")) {
      errorMessage = "Audio file is too large (max 25MB for Groq Whisper)";
    } else if (error.message.includes("Invalid file format")) {
      errorMessage = "Unsupported audio format";
    } else if (error.message.includes("API key")) {
      errorMessage = "Groq API key is invalid or missing";
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
