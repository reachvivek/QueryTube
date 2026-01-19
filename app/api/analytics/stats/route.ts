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
    const userVideos = await prisma.video.findMany({
      where: { userId: user.id },
      select: { id: true },
    });

    const videoIds = userVideos.map((v: { id: string }) => v.id);

    if (videoIds.length === 0) {
      return NextResponse.json({
        totalQuestions: 0,
        avgResponseTime: "0s",
        successRate: 0,
        popularVideos: [],
        popularQuestions: [],
        weeklyStats: [],
      });
    }

    // Get all analytics for user's videos
    const analytics = await prisma.analytics.findMany({
      where: {
        videoId: { in: videoIds },
      },
      include: {
        video: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
    });

    // Total questions
    const totalQuestions = analytics.length;

    // Average response time
    const avgResponseTime =
      analytics.length > 0
        ? (
            analytics.reduce((sum, a) => sum + a.responseTime, 0) / analytics.length
          ).toFixed(1) + "s"
        : "0s";

    // Success rate (placeholder - would need rating data in schema)
    const successRate = 0; // No rating data in current schema

    // Popular videos by question count
    const videoQuestionCounts = analytics.reduce((acc, a) => {
      const videoId = a.video.id;
      acc[videoId] = acc[videoId] || {
        id: videoId,
        title: a.video.title,
        questions: 0,
      };
      acc[videoId].questions += 1;
      return acc;
    }, {} as Record<string, { id: string; title: string; questions: number }>);

    const popularVideos = Object.values(videoQuestionCounts)
      .sort((a, b) => b.questions - a.questions)
      .slice(0, 5)
      .map((v) => ({
        ...v,
        avgRating: 0, // No rating in schema
        views: 0, // No view tracking in schema
      }));

    // Popular questions by frequency
    const questionCounts = analytics.reduce((acc, a) => {
      const q = a.question.trim();
      acc[q] = (acc[q] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({
        question,
        count,
        avgRating: 0, // No rating in schema
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Weekly stats (last 7 days)
    const now = new Date();
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const questionsForDay = analytics.filter((a) => {
        const timestamp = new Date(a.timestamp);
        return timestamp >= date && timestamp < nextDay;
      }).length;

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        questions: questionsForDay,
      };
    });

    return NextResponse.json({
      totalQuestions,
      avgResponseTime,
      successRate,
      popularVideos,
      popularQuestions,
      weeklyStats,
    });
  } catch (error) {
    console.error("[API] Analytics stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics statistics" },
      { status: 500 }
    );
  }
}
