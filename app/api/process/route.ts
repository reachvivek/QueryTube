import { NextRequest, NextResponse } from "next/server";
import { downloadYouTubeAudio } from "@/lib/youtube";
import { transcribeAudio, splitTranscriptIntoChunks, addTimestampsToChunks } from "@/lib/transcribe";
import { generateEmbeddings, uploadToPinecone } from "@/lib/embeddings";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/process
 * Processes a YouTube video: downloads, transcribes, generates embeddings, and uploads to Pinecone
 *
 * Request body:
 * {
 *   "youtubeUrl": "https://youtube.com/watch?v=...",
 *   "chunkSize": 90,  // optional, in seconds
 *   "overlap": 10,    // optional, in seconds
 *   "language": "fr"  // optional, auto-detects if not provided
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { youtubeUrl, chunkSize = 90, overlap = 10, language } = body;

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    if (!process.env.PINECONE_API_KEY) {
      return NextResponse.json(
        { error: "PINECONE_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const videoId = uuidv4();

    console.log(`[${videoId}] Starting video processing...`);

    // Step 1: Download YouTube audio
    console.log(`[${videoId}] Step 1: Downloading audio from YouTube...`);
    const downloadResult = await downloadYouTubeAudio(youtubeUrl);
    const { filePath, title, duration, fileSize } = downloadResult;

    console.log(`[${videoId}] Downloaded: ${title} (${duration}s, ${(fileSize / 1024 / 1024).toFixed(2)}MB)`);

    // Step 2: Transcribe audio using OpenAI Whisper
    console.log(`[${videoId}] Step 2: Transcribing audio...`);
    const transcriptionResult = await transcribeAudio(filePath, language);
    const { text: transcript, language: detectedLanguage } = transcriptionResult;

    console.log(`[${videoId}] Transcription complete. Detected language: ${detectedLanguage}`);
    console.log(`[${videoId}] Transcript length: ${transcript.length} characters`);

    // Step 3: Split transcript into chunks
    console.log(`[${videoId}] Step 3: Splitting transcript into chunks...`);
    const textChunks = splitTranscriptIntoChunks(transcript, chunkSize, overlap);
    const chunksWithTimestamps = addTimestampsToChunks(textChunks, chunkSize);

    console.log(`[${videoId}] Created ${textChunks.length} chunks`);

    // Step 4: Generate embeddings
    console.log(`[${videoId}] Step 4: Generating embeddings...`);
    const embeddings = await generateEmbeddings(textChunks);

    console.log(`[${videoId}] Generated ${embeddings.length} embeddings`);

    // Step 5: Upload to Pinecone
    console.log(`[${videoId}] Step 5: Uploading to Pinecone...`);
    await uploadToPinecone(
      videoId,
      chunksWithTimestamps,
      embeddings,
      {
        title,
        url: youtubeUrl,
        language: detectedLanguage,
      }
    );

    // Clean up: Delete downloaded audio file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[${videoId}] Cleaned up audio file`);
      }
    } catch (cleanupError) {
      console.error(`[${videoId}] Failed to cleanup audio file:`, cleanupError);
    }

    console.log(`[${videoId}] ✅ Video processing complete!`);

    // Return success response
    return NextResponse.json({
      success: true,
      videoId,
      title,
      duration,
      language: detectedLanguage,
      chunks: textChunks.length,
      transcript: transcript.substring(0, 500) + "...", // Preview only
      message: "Video processed successfully",
    });

  } catch (error: any) {
    console.error("Error processing video:", error);

    return NextResponse.json(
      {
        error: "Failed to process video",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
