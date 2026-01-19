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
        durationFormatted: body.durationFormatted,
        youtubeId: body.youtubeId,
        uploader: body.uploader,
        description: body.description,
        currentStep: body.currentStep || 'upload',
        completionPercentage: body.completionPercentage || 0,
        status: 'draft',
        processingStatus: body.processingStatus || 'idle',
        transcriptData: body.transcriptData || undefined,
        transcriptSource: body.transcriptSource,
        data: body.data,
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

// PUT /api/drafts - Update existing draft
export async function PUT(request: NextRequest) {
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

    if (!body.id) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingDraft = await prisma.draft.findFirst({
      where: {
        id: body.id,
        userId,
      },
    });

    if (!existingDraft) {
      return NextResponse.json(
        { error: 'Draft not found or unauthorized' },
        { status: 404 }
      );
    }

    const draft = await prisma.draft.update({
      where: {
        id: body.id,
      },
      data: {
        youtubeUrl: body.youtubeUrl || existingDraft.youtubeUrl,
        title: body.title || existingDraft.title,
        thumbnail: body.thumbnail || existingDraft.thumbnail,
        duration: body.duration !== undefined ? body.duration : existingDraft.duration,
        durationFormatted: body.durationFormatted || existingDraft.durationFormatted,
        youtubeId: body.youtubeId || existingDraft.youtubeId,
        uploader: body.uploader || existingDraft.uploader,
        description: body.description || existingDraft.description,
        currentStep: body.currentStep || existingDraft.currentStep,
        completionPercentage: body.completionPercentage !== undefined ? body.completionPercentage : existingDraft.completionPercentage,
        processingStatus: body.processingStatus || existingDraft.processingStatus,
        transcriptData: body.transcriptData !== undefined ? body.transcriptData : existingDraft.transcriptData,
        transcriptSource: body.transcriptSource !== undefined ? body.transcriptSource : existingDraft.transcriptSource,
        data: body.data !== undefined ? body.data : existingDraft.data,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error: any) {
    console.error('[Drafts] PUT error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update draft' },
      { status: 500 }
    );
  }
}
