import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { validateArray } from "@/lib/validation";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate chunks array
    const chunksValidation = validateArray(body.chunks, 1000, "Invalid chunks array");
    if (!chunksValidation.valid) {
      return NextResponse.json(
        { error: chunksValidation.error },
        { status: 400 }
      );
    }
    const chunks = chunksValidation.array!;

    // Validate that each chunk has text
    const invalidChunk = chunks.find((chunk: any) => !chunk.text);
    if (invalidChunk) {
      return NextResponse.json(
        { error: "Each chunk must have a text property" },
        { status: 400 }
      );
    }

    // Process chunks in batches
    const batchSize = 10;
    const improvedChunks = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchTexts = batch.map((c: any) => c.text).join("\n\n");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Fix grammar, spelling, and punctuation errors in the transcript. Maintain the original meaning and structure. Return only the corrected text, preserving line breaks."
          },
          {
            role: "user",
            content: batchTexts
          }
        ],
        temperature: 0.3,
      });

      const improvedText = completion.choices[0]?.message?.content || "";
      const improvedBatch = improvedText.split("\n\n");

      // Merge improved text back into chunks
      for (let j = 0; j < batch.length; j++) {
        const chunk = batch[j] as any;
        improvedChunks.push({
          ...chunk,
          text: improvedBatch[j] || chunk.text
        });
      }

      console.log(`[ImproveTranscript] Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);
    }

    return NextResponse.json({
      success: true,
      chunks: improvedChunks
    });
  } catch (error: any) {
    console.error("[ImproveTranscript] Error:", error);
    return NextResponse.json(
      { error: "Failed to improve transcript" },
      { status: 500 }
    );
  }
}
