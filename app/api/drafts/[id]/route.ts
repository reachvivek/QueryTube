import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/drafts/[id] - Get specific draft
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const { id } = await params;

    const draft = await prisma.draft.findFirst({
      where: {
        id,
        userId, // Ensure user owns this draft
      },
    });

    if (!draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    // Update lastAccessedAt
    await prisma.draft.update({
      where: { id },
      data: { lastAccessedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error: any) {
    console.error('[Draft] GET error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}

// PATCH /api/drafts/[id] - Update draft (auto-save)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const { id } = await params;

    const body = await request.json();

    // Verify ownership
    const existing = await prisma.draft.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    const draft = await prisma.draft.update({
      where: { id },
      data: {
        youtubeUrl: body.youtubeUrl ?? undefined,
        title: body.title ?? undefined,
        thumbnail: body.thumbnail ?? undefined,
        duration: body.duration ?? undefined,
        youtubeId: body.youtubeId ?? undefined,
        uploader: body.uploader ?? undefined,
        description: body.description ?? undefined,
        currentStep: body.currentStep ?? undefined,
        status: body.status ?? undefined,
        processingStatus: body.processingStatus ?? undefined,
        transcriptData: body.transcriptData ?? undefined,
        transcriptSource: body.transcriptSource ?? undefined,
        videoId: body.videoId ?? undefined,
        errorMessage: body.errorMessage ?? undefined,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error: any) {
    console.error('[Draft] PATCH error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update draft' },
      { status: 500 }
    );
  }
}

// DELETE /api/drafts/[id] - Delete draft
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const { id } = await params;

    // Verify ownership
    const existing = await prisma.draft.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    await prisma.draft.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    });
  } catch (error: any) {
    console.error('[Draft] DELETE error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
