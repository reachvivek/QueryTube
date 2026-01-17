import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribes an audio file using OpenAI Whisper API
 * @param audioFilePath - Path to the audio file
 * @param language - Language code (optional, auto-detects if not provided)
 * @returns Transcription text and detected language
 */
export async function transcribeAudio(
  audioFilePath: string,
  language?: string
): Promise<{ text: string; language: string; duration: number }> {
  try {
    console.log(`Starting transcription for: ${audioFilePath}`);

    // Check if file exists
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    // Get file size (Whisper API has 25MB limit)
    const stats = fs.statSync(audioFilePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB > 25) {
      throw new Error(
        `File too large (${fileSizeMB.toFixed(2)}MB). Whisper API supports files up to 25MB.`
      );
    }

    const startTime = Date.now();

    // Create transcription
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
      language: language, // Optional: 'fr' for French, auto-detects if not provided
      response_format: "verbose_json", // Get detailed response with timestamps
      timestamp_granularities: ["segment"], // Get segment-level timestamps
    });

    const duration = (Date.now() - startTime) / 1000;

    console.log(`Transcription complete in ${duration}s`);
    console.log(`Detected language: ${transcription.language}`);

    return {
      text: transcription.text,
      language: transcription.language || language || "unknown",
      duration,
    };
  } catch (error: any) {
    console.error("Transcription error:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

/**
 * Splits transcript into chunks with timestamps
 * @param transcript - Full transcript text
 * @param chunkSizeSeconds - Target chunk size in seconds (default: 90)
 * @param overlapSeconds - Overlap between chunks in seconds (default: 10)
 * @returns Array of text chunks
 */
export function splitTranscriptIntoChunks(
  transcript: string,
  chunkSizeSeconds: number = 90,
  overlapSeconds: number = 10
): string[] {
  // Simple chunking by word count for MVP
  // Estimate: average speaking rate is ~150 words per minute
  const wordsPerSecond = 150 / 60; // ~2.5 words per second
  const wordsPerChunk = Math.floor(chunkSizeSeconds * wordsPerSecond);
  const overlapWords = Math.floor(overlapSeconds * wordsPerSecond);

  const words = transcript.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerChunk - overlapWords) {
    const chunkWords = words.slice(i, i + wordsPerChunk);
    if (chunkWords.length > 0) {
      chunks.push(chunkWords.join(" "));
    }
  }

  console.log(`Split transcript into ${chunks.length} chunks`);
  return chunks;
}

/**
 * Adds timestamps to transcript chunks (simplified version)
 * @param chunks - Array of text chunks
 * @param startTime - Starting timestamp
 * @param chunkDuration - Duration per chunk in seconds
 * @returns Chunks with timestamp metadata
 */
export function addTimestampsToChunks(
  chunks: string[],
  chunkDuration: number = 90
): Array<{ text: string; startTime: number; endTime: number }> {
  return chunks.map((chunk, index) => ({
    text: chunk,
    startTime: index * chunkDuration,
    endTime: (index + 1) * chunkDuration,
  }));
}
