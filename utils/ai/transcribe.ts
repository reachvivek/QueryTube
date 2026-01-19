import Groq from "groq-sdk";
import OpenAI from "openai";
import fs from "fs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribes an audio file using Whisper (Groq or OpenAI)
 * @param audioFilePath - Path to the audio file
 * @param language - Language code (optional, auto-detects if not provided)
 * @param provider - "groq" (faster, 25MB limit) or "openai" (slower, 25MB limit but more reliable for large files)
 * @returns Transcription text and detected language
 */
export async function transcribeAudio(
  audioFilePath: string,
  language?: string,
  provider: "groq" | "openai" = "groq"
): Promise<{ text: string; language: string; duration: number }> {
  try {
    // Check if file exists
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    // Get file size
    const stats = fs.statSync(audioFilePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    console.log(`[Transcribe] Using ${provider.toUpperCase()} Whisper for ${fileSizeMB.toFixed(2)}MB file`);

    const startTime = Date.now();
    let transcription: any;

    if (provider === "openai") {
      // OpenAI Whisper (more reliable for large files)
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to .env");
      }

      transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
        language: language,
        response_format: "verbose_json",
      });
    } else {
      // Groq Whisper (faster, free tier)
      if (!process.env.GROQ_API_KEY) {
        throw new Error("Groq API key not configured. Please add GROQ_API_KEY to .env");
      }

      if (fileSizeMB > 25) {
        throw new Error(
          `File too large (${fileSizeMB.toFixed(2)}MB). Groq Whisper supports files up to 25MB. Use OpenAI provider instead.`
        );
      }

      transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-large-v3-turbo",
        language: language,
        response_format: "verbose_json",
      }) as any;
    }

    const duration = (Date.now() - startTime) / 1000;

    // Extract detected language from response
    const detectedLanguage = transcription.language || language || "unknown";

    console.log(`[Transcribe] ✅ Transcription completed in ${duration.toFixed(2)}s (language: ${detectedLanguage})`);

    return {
      text: transcription.text,
      language: detectedLanguage,
      duration,
    };
  } catch (error: any) {
    console.error(`[${provider.toUpperCase()} Whisper] Transcription error:`, error);
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
