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

    // Get video with ALL chunks from database
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' },
          // Get ALL chunks for comprehensive summary
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

    console.log(`[Generate Summary] Found ${video.chunks.length} chunks, generating summary...`);

    // Generate summary from chunks - use strategic sampling for long videos
    const totalChunks = video.chunks.length;
    let sampleText = '';

    if (totalChunks <= 100) {
      // Short video: use all chunks
      sampleText = video.chunks.map((chunk) => chunk.text).join(' ');
    } else {
      // Long video: sample from beginning, middle, and end for representative summary
      const beginning = video.chunks.slice(0, 50).map((chunk) => chunk.text).join(' ');
      const middleStart = Math.floor(totalChunks / 2) - 25;
      const middle = video.chunks.slice(middleStart, middleStart + 50).map((chunk) => chunk.text).join(' ');
      const end = video.chunks.slice(-50).map((chunk) => chunk.text).join(' ');
      sampleText = `${beginning} ... ${middle} ... ${end}`;
    }

    // Limit total context to avoid token limits
    const contextText = sampleText.slice(0, 8000);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Analyze the video transcript and provide a comprehensive 2-3 sentence summary that captures the main topic, key points discussed, and overall theme.',
        },
        {
          role: 'user',
          content: `Summarize what this video is about based on the transcript:\n\n${contextText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
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
