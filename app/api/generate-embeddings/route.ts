import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * POST /api/generate-embeddings
 * Generates embeddings for text chunks using OpenAI
 *
 * Body:
 * {
 *   "chunks": ["text chunk 1", "text chunk 2", ...],
 *   "model": "text-embedding-3-small" // optional
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chunks, model = "text-embedding-3-small" } = body;

    // Validate input
    if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json(
        { error: "chunks array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    console.log(`[Embeddings] Generating embeddings for ${chunks.length} chunks`);
    console.log(`[Embeddings] Using model: ${model}`);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate embeddings for all chunks
    const startTime = Date.now();
    const response = await openai.embeddings.create({
      model,
      input: chunks,
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const embeddings = response.data.map((item) => item.embedding);

    console.log(`[Embeddings] Generated ${embeddings.length} embeddings in ${duration}s`);
    console.log(`[Embeddings] Dimensions: ${embeddings[0]?.length || 0}`);

    return NextResponse.json({
      success: true,
      embeddings,
      model,
      dimensions: embeddings[0]?.length || 0,
      totalChunks: chunks.length,
      duration: parseFloat(duration),
      usage: {
        totalTokens: response.usage.total_tokens,
      },
    });

  } catch (error: any) {
    console.error("[Embeddings] Error:", error);

    let errorMessage = "Failed to generate embeddings";

    if (error.message.includes("API key")) {
      errorMessage = "OpenAI API key is invalid or missing";
    } else if (error.message.includes("rate limit")) {
      errorMessage = "OpenAI API rate limit exceeded. Please try again later.";
    } else if (error.message.includes("quota")) {
      errorMessage = "OpenAI API quota exceeded. Please check your billing.";
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
