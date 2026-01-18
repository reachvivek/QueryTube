import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { validatePagination, validateString, validateNumber, validateLanguage } from "@/lib/validation";

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

    // Validate pagination parameters
    const pagination = validatePagination(
      searchParams.get("limit"),
      searchParams.get("offset")
    );
    const limit = pagination.limit;
    const offset = pagination.offset;

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

    // Validate required fields
    const titleValidation = validateString(body.title, 500, true);
    if (!titleValidation.valid) {
      return NextResponse.json(
        { error: "Invalid or missing title" },
        { status: 400 }
      );
    }
    const title = titleValidation.value!;

    // Validate duration
    const duration = validateNumber(body.duration, 1, 86400, 0); // Max 24 hours
    if (duration === 0) {
      return NextResponse.json(
        { error: "Invalid or missing duration" },
        { status: 400 }
      );
    }

    // Validate durationFormatted
    const durationFormattedValidation = validateString(body.durationFormatted, 20, true);
    if (!durationFormattedValidation.valid) {
      return NextResponse.json(
        { error: "Invalid or missing durationFormatted" },
        { status: 400 }
      );
    }
    const durationFormatted = durationFormattedValidation.value!;

    // Validate optional fields
    const youtubeUrl = body.youtubeUrl;
    const youtubeId = body.youtubeId;
    const thumbnail = body.thumbnail;
    const uploader = body.uploader;

    // Validate description if provided
    let description: string | undefined;
    if (body.description) {
      const descValidation = validateString(body.description, 5000, false);
      if (descValidation.valid) {
        description = descValidation.value;
      }
    }

    // Validate language
    const language = validateLanguage(body.language);

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
