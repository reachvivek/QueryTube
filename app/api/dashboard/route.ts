import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get all videos with their chunk counts
    const videos = await prisma.video.findMany({
      include: {
        chunks: true,
        analytics: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 10, // Get latest 10 videos for dashboard
    });

    // Calculate statistics
    const totalVideos = await prisma.video.count();
    const totalChunks = await prisma.chunk.count();
    const totalQuestions = await prisma.analytics.count();

    // Calculate storage (sum of audio file sizes)
    const storageResult = await prisma.video.aggregate({
      _sum: {
        audioFileSize: true,
      },
    });

    const storageBytes = storageResult._sum.audioFileSize || 0;
    const storageMB = (storageBytes / (1024 * 1024)).toFixed(2);

    // Format videos for frontend
    const formattedVideos = videos.map((video) => {
      // Calculate progress based on status
      let progress = 0;
      if (video.status === "completed") progress = 100;
      else if (video.status === "processing") progress = 50;
      else if (video.status === "failed") progress = 0;

      return {
        id: video.id,
        title: video.title,
        url: video.youtubeUrl,
        youtubeId: video.youtubeId,
        status: video.status,
        progress,
        duration: video.durationFormatted,
        chunks: video.chunks.length,
        uploadedAt: video.uploadedAt.toISOString().split("T")[0],
        language: video.language,
        errorMessage: video.errorMessage,
        transcriptSource: video.transcriptSource,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalVideos,
        totalChunks,
        storageUsed: `${storageMB} MB`,
        questionsAnswered: totalQuestions,
      },
      videos: formattedVideos,
    });
  } catch (error: any) {
    // Log detailed error server-side only
    console.error("[Dashboard API] Database error:", {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });

    // Check if database is not initialized
    const isDatabaseError =
      error.message?.includes("does not exist") ||
      error.message?.includes("no such table") ||
      error.code === "P2021";

    if (isDatabaseError) {
      console.warn("[Dashboard API] Database not initialized. Returning empty state.");

      // Return empty state instead of error
      return NextResponse.json({
        success: true,
        stats: {
          totalVideos: 0,
          totalChunks: 0,
          storageUsed: "0 MB",
          questionsAnswered: 0,
        },
        videos: [],
        _info: "Database is being initialized. Please refresh in a moment.",
      });
    }

    // For other errors, return user-friendly message
    return NextResponse.json(
      {
        success: false,
        error: "Unable to load dashboard data. Please try again later.",
        stats: {
          totalVideos: 0,
          totalChunks: 0,
          storageUsed: "0 MB",
          questionsAnswered: 0,
        },
        videos: [],
      },
      { status: 200 }
    );
  }
}
