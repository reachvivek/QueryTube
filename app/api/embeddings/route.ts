import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "",
});

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

    if (embeddingProvider === "mistral") {
      // Mistral AI Embeddings (FREE - 1B tokens/month)
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);

        const response = await mistral.embeddings.create({
          model: "mistral-embed",
          inputs: batch.map((chunk: any) => chunk.text || chunk),
        });

        embeddings.push(...response.data.map((item: any) => item.embedding));

        console.log(
          `[Embeddings] Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`
        );
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
