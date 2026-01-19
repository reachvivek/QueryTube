import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db/db";
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        chunks: {
          orderBy: {
            chunkIndex: "asc",
          },
        },
        analytics: {
          orderBy: {
            timestamp: "desc",
          },
          take: 10,
        },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error: any) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch video" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Extract chunks if present (they need to be handled separately)
    const { chunks, ...videoData } = body;

    // Update video record
    const video = await prisma.video.update({
      where: { id },
      data: videoData,
    });

    // If chunks are provided, save them to database
    if (chunks && Array.isArray(chunks)) {
      console.log(`[PATCH Video] Saving ${chunks.length} chunks to database...`);

      // Delete existing chunks first (in case of re-processing)
      await prisma.chunk.deleteMany({
        where: { videoId: id },
      });

      // Create new chunks
      await prisma.chunk.createMany({
        data: chunks.map((chunk: any, index: number) => ({
          videoId: id,
          chunkIndex: chunk.chunkIndex ?? index,
          text: chunk.text || '',
          startTime: chunk.startTime ?? 0,
          endTime: chunk.endTime ?? 0,
          timestamp: `${Math.floor((chunk.startTime ?? 0) / 60)}:${String((chunk.startTime ?? 0) % 60).padStart(2, '0')}`,
        })),
      });

      console.log(`[PATCH Video] ✓ Saved ${chunks.length} chunks`);
    }

    return NextResponse.json({
      success: true,
      video,
    });
  } catch (error: any) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`[DELETE Video] Deleting video ${id}...`);

    // Step 1: Get all chunks to find their vectorIds
    const chunks = await prisma.chunk.findMany({
      where: { videoId: id },
      select: { vectorId: true },
    });

    const vectorIds = chunks
      .map((chunk) => chunk.vectorId)
      .filter((vectorId): vectorId is string => vectorId !== null);

    console.log(`[DELETE Video] Found ${vectorIds.length} vectors to delete from Pinecone`);

    // Step 2: Delete vectors from Pinecone
    if (vectorIds.length > 0) {
      try {
        const indexName = process.env.PINECONE_INDEX || "youtube-qa";
        const index = pinecone.index(indexName);

        // Delete in batches of 100
        const batchSize = 100;
        for (let i = 0; i < vectorIds.length; i += batchSize) {
          const batch = vectorIds.slice(i, i + batchSize);
          await index.deleteMany(batch);
          console.log(`[DELETE Video] Deleted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectorIds.length / batchSize)} from Pinecone`);
        }

        console.log(`[DELETE Video] ✓ Deleted ${vectorIds.length} vectors from Pinecone`);
      } catch (pineconeError) {
        console.error("[DELETE Video] Failed to delete from Pinecone:", pineconeError);
        // Continue with database deletion even if Pinecone fails
      }
    }

    // Step 3: Delete from database (CASCADE will handle chunks and analytics)
    await prisma.video.delete({
      where: { id },
    });

    console.log(`[DELETE Video] ✓ Deleted video ${id} from database`);

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
      vectorsDeleted: vectorIds.length,
    });
  } catch (error: any) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete video" },
      { status: 500 }
    );
  }
}
