import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/drafts - List all drafts for current user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // draft, completed, abandoned

    const drafts = await prisma.draft.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      drafts,
      total: drafts.length,
    });
  } catch (error: any) {
    console.error('[Drafts] GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}

// POST /api/drafts - Create new draft
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    const body = await request.json();

    const draft = await prisma.draft.create({
      data: {
        userId,
        youtubeUrl: body.youtubeUrl,
        title: body.title || 'Untitled Draft',
        thumbnail: body.thumbnail,
        duration: body.duration,
        youtubeId: body.youtubeId,
        uploader: body.uploader,
        description: body.description,
        currentStep: body.currentStep || 'upload',
        status: 'draft',
        processingStatus: body.processingStatus || 'idle',
        transcriptData: body.transcriptData || undefined,
        transcriptSource: body.transcriptSource,
      },
    });

    return NextResponse.json({
      success: true,
      draft,
      sessionUrl: `/pages/new/${draft.id}`,
    });
  } catch (error: any) {
    console.error('[Drafts] POST error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create draft' },
      { status: 500 }
    );
  }
}
