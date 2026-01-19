import { NextResponse } from "next/server";
import prisma from "@/utils/db/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all videos for this user
    const videos = await prisma.video.findMany({
      where: { userId: user.id },
      include: {
        macroChunks: true,
        _count: {
          select: {
            macroChunks: true,
            analytics: true,
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });

    // Calculate stats
    const totalVideos = videos.length;
    const totalMacroChunks = videos.reduce((sum, v) => sum + v._count.macroChunks, 0);
    const totalVectors = videos.reduce(
      (sum, v) => sum + v.macroChunks.filter((c) => c.vectorId).length,
      0
    );

    // Calculate total storage from audio files
    const totalStorage = videos.reduce((sum, v) => sum + (v.audioFileSize || 0), 0);
    const storageMB = (totalStorage / (1024 * 1024)).toFixed(2);

    // Get latest processing timestamp
    const latestVideo = videos.find((v) => v.processedAt);
    const lastSync = latestVideo?.processedAt?.toISOString() || null;

    // Format macro chunks for table display
    const macroChunks = videos.flatMap((video) =>
      video.macroChunks.map((chunk) => ({
        id: chunk.id,
        videoId: video.id,
        videoTitle: video.title,
        text: chunk.text,
        timestamp: chunk.timestamp,
        chunkIndex: chunk.chunkIndex,
        vectorId: chunk.vectorId || "N/A",
        language: video.language,
        uploadedAt: video.uploadedAt.toISOString(),
      }))
    );

    return NextResponse.json({
      stats: {
        totalChunks: totalMacroChunks,
        totalVideos,
        totalVectors,
        storageUsed: `${storageMB} MB`,
        lastSync,
      },
      macroChunks,
      videos: videos.map((v) => ({
        id: v.id,
        title: v.title,
        status: v.status,
      })),
    });
  } catch (error) {
    console.error("[API] Videos stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video statistics" },
      { status: 500 }
    );
  }
}
