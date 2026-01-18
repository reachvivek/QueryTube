import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "",
});

// Helper function to add delay between requests (rate limiting)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry on rate limit with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRateLimit = error?.statusCode === 429 || error?.status === 429;
      const isLastAttempt = attempt === maxRetries - 1;

      if (!isRateLimit || isLastAttempt) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const waitTime = baseDelay * Math.pow(2, attempt);
      console.log(`[Embeddings] Rate limit hit, retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
      await delay(waitTime);
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(request: NextRequest) {
  try {
    const { chunks, model, provider } = await request.json();

    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json(
        { error: "Invalid chunks array" },
        { status: 400 }
      );
    }

    // Determine provider and model
    const embeddingProvider = provider || process.env.DEFAULT_EMBEDDING_PROVIDER || "mistral";
    const embeddingModel = model ||
      (embeddingProvider === "mistral" ? "mistral-embed" : "text-embedding-3-small");

    console.log(`[Embeddings] Generating embeddings for ${chunks.length} chunks using ${embeddingProvider}:${embeddingModel}`);

    const embeddings: number[][] = [];
    const batchSize = 50;

    // Mistral rate limit: 60 requests/minute = 1 request per second
    // Add 1.1s delay between batches to stay safely under limit
    const RATE_LIMIT_DELAY_MS = 1100;

    if (embeddingProvider === "mistral") {
      // Mistral AI Embeddings (FREE - 1B tokens/month)
      // Rate limit: 60 requests/minute
      const totalBatches = Math.ceil(chunks.length / batchSize);
      console.log(`[Embeddings] Processing ${totalBatches} batches with ${RATE_LIMIT_DELAY_MS}ms delay to respect rate limits`);

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;

        // Retry with exponential backoff on rate limit errors
        const response = await retryWithBackoff(async () => {
          return await mistral.embeddings.create({
            model: "mistral-embed",
            inputs: batch.map((chunk: any) => chunk.text || chunk),
          });
        });

        embeddings.push(...response.data.map((item: any) => item.embedding));

        console.log(`[Embeddings] Processed batch ${batchNum}/${totalBatches}`);

        // Add delay between batches (except after the last batch)
        if (batchNum < totalBatches) {
          await delay(RATE_LIMIT_DELAY_MS);
        }
      }
    } else {
      // OpenAI Embeddings (Paid)
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);

        const response = await openai.embeddings.create({
          model: embeddingModel,
          input: batch.map((chunk: any) => chunk.text || chunk),
        });

        embeddings.push(...response.data.map((item) => item.embedding));

        console.log(
          `[Embeddings] Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      embeddings,
      model: embeddingModel,
      provider: embeddingProvider,
      dimensions: embeddings[0]?.length || 1024,
      totalChunks: chunks.length,
    });
  } catch (error: any) {
    console.error("[Embeddings] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}
