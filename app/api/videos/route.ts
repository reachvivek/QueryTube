import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); //  Filter by status
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where = {
      userId: user.id,
      ...(status ? { status } : {}),
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { uploadedAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              chunks: true,
              analytics: true,
            },
          },
        },
      }),
      prisma.video.count({ where }),
    ]);

    return NextResponse.json({
      videos,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      youtubeUrl,
      youtubeId,
      title,
      description,
      duration,
      durationFormatted,
      thumbnail,
      uploader,
      language = "en",
    } = body;

    if (!title || !duration || !durationFormatted) {
      return NextResponse.json(
        { error: "Missing required fields: title, duration, durationFormatted" },
        { status: 400 }
      );
    }

    // Check if video already exists by youtubeId for this user
    let video = null;
    let isExisting = false;

    if (youtubeId) {
      video = await prisma.video.findFirst({
        where: {
          youtubeId,
          userId: user.id,
        },
      });

      if (video) {
        console.log(`[Videos API] Video already exists for user: ${youtubeId}, returning existing record`);
        isExisting = true;
      }
    }

    // Create only if it doesn't exist for this user
    if (!video) {
      video = await prisma.video.create({
        data: {
          userId: user.id,
          youtubeUrl,
          youtubeId,
          title,
          description,
          duration,
          durationFormatted,
          thumbnail,
          uploader,
          language,
          status: "pending",
        },
      });
      console.log(`[Videos API] Created new video for user ${user.id}: ${video.id}`);
    }

    return NextResponse.json({
      success: true,
      video,
      isExisting,
    });
  } catch (error: any) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create video" },
      { status: 500 }
    );
  }
}
