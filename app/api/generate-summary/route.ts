import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import prisma from '@/lib/db';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'videoId is required' },
        { status: 400 }
      );
    }

    console.log(`[Generate Summary] Generating summary for video: ${videoId}`);

    // Get video with chunks from database
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
          take: 30, // First 30 chunks for comprehensive overview
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // If summary already exists, return it
    if (video.summary) {
      console.log(`[Generate Summary] Summary already exists: "${video.summary}"`);
      return NextResponse.json({
        success: true,
        summary: video.summary,
        fromCache: true,
      });
    }

    // Check if we have chunks
    if (!video.chunks || video.chunks.length === 0) {
      console.log(`[Generate Summary] No chunks found for video ${videoId}`);
      return NextResponse.json(
        { error: 'No transcript chunks available for this video' },
        { status: 400 }
      );
    }

    console.log(`[Generate Summary] Found ${video.chunks.length} chunks`);

    // Check if embeddings were created (vectorId is set in Step 3)
    const chunksWithVectorId = video.chunks.filter(chunk => chunk.vectorId !== null);
    const hasEmbeddings = chunksWithVectorId.length > 0;

    console.log(`[Generate Summary] Chunks with embeddings: ${chunksWithVectorId.length}/${video.chunks.length}`);

    if (!hasEmbeddings) {
      console.log(`[Generate Summary] No embeddings found - vectorId is null on all chunks`);
      return NextResponse.json(
        { error: 'No embeddings found - please complete Step 3 (Vectorize) first' },
        { status: 400 }
      );
    }

    // Generate summary from chunks
    const sampleText = video.chunks
      .map((chunk) => chunk.text)
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

    const summary = completion.choices[0]?.message?.content?.trim() || '';
    console.log(`[Generate Summary] Generated: "${summary}"`);

    // Save summary to database
    if (summary) {
      await prisma.video.update({
        where: { id: videoId },
        data: { summary },
      });
      console.log('[Generate Summary] Summary saved to database');
    }

    return NextResponse.json({
      success: true,
      summary,
      fromCache: false,
    });
  } catch (error: any) {
    console.error('[Generate Summary] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
