import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import Groq from 'groq-sdk';
import prisma from '@/lib/db';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { videoId, chunks, embeddings, metadata, embeddingProvider } = await request.json();

    if (!videoId || !chunks || !embeddings) {
      return NextResponse.json(
        { error: 'Missing required fields: videoId, chunks, embeddings' },
        { status: 400 }
      );
    }

    const provider = embeddingProvider || process.env.DEFAULT_EMBEDDING_PROVIDER || 'mistral';
    console.log(`[Upload Vectors] Using embedding provider: ${provider}`);

    if (chunks.length !== embeddings.length) {
      return NextResponse.json(
        { error: 'Chunks and embeddings arrays must have the same length' },
        { status: 400 }
      );
    }

    const indexName = process.env.PINECONE_INDEX || 'youtube-qa';
    console.log(`[Upload Vectors] Uploading ${chunks.length} vectors to Pinecone index: ${indexName}`);

    const index = pinecone.index(indexName);

    // Prepare vectors for Pinecone
    const vectors = chunks.map((chunk: any, i: number) => {
      const vectorId = `${videoId}-chunk-${chunk.chunkIndex || i}`;

      return {
        id: vectorId,
        values: embeddings[i],
        metadata: {
          videoId,
          text: chunk.text || '',
          startTime: chunk.startTime ?? 0,  // Convert null to 0
          endTime: chunk.endTime ?? 0,      // Convert null to 0
          chunkIndex: chunk.chunkIndex ?? i,
          title: metadata?.title || '',
          youtubeUrl: metadata?.youtubeUrl || '',
          language: metadata?.language || 'fr',
          uploader: metadata?.uploader || '',
        },
      };
    });

    // Upload in batches of 100
    const batchSize = 100;
    let uploadedCount = 0;

    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      uploadedCount += batch.length;
    }

    // Update database chunks with vectorId and embeddingProvider
    for (const vector of vectors) {
      const chunkIndex = vector.metadata.chunkIndex;
      await prisma.chunk.updateMany({
        where: { videoId, chunkIndex },
        data: {
          vectorId: vector.id,
          embeddingProvider: provider,
        },
      });
    }

    console.log(`[Upload Vectors] Updated ${vectors.length} chunks with provider: ${provider}`);

    // Generate AI summary from video content
    console.log('[Upload Vectors] Generating AI summary...');
    let summary = '';
    try {
      // Sample first 30 chunks to get comprehensive overview
      const sampleChunks = chunks.slice(0, Math.min(30, chunks.length));
      const sampleText = sampleChunks
        .map((c: any) => c.text)
        .join(' ')
        .slice(0, 2000); // Limit to 2000 chars for efficiency

      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Provide a concise, engaging one-sentence summary (max 20 words) of what the video content is about.',
          },
          {
            role: 'user',
            content: `Summarize this video content in one sentence: ${sampleText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      });

      summary = completion.choices[0]?.message?.content?.trim() || '';
      console.log(`[Upload Vectors] Generated summary: "${summary}"`);

      // Save summary to database
      if (summary) {
        await prisma.video.update({
          where: { id: videoId },
          data: { summary },
        });
        console.log('[Upload Vectors] Summary saved to database');
      }
    } catch (error) {
      console.error('[Upload Vectors] Failed to generate summary:', error);
      // Don't fail the entire upload if summary generation fails
    }

    return NextResponse.json({
      success: true,
      vectorsUploaded: uploadedCount,
      batches: Math.ceil(vectors.length / batchSize),
      index: indexName,
      videoId,
      summary,
    });
  } catch (error: any) {
    console.error('[Upload Vectors] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload vectors' },
      { status: 500 }
    );
  }
}