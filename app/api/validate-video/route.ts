import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo } from "@/lib/youtube";

/**
 * GET /api/validate-video?url=<youtube_url>
 * Validates a YouTube URL and returns video metadata
 *
 * Query params:
 * - url: YouTube video URL
 *
 * Returns:
 * - valid: boolean
 * - video: { title, duration, thumbnail, uploader, description }
 * - error: string (if invalid)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    // Validate URL parameter exists
    if (!url) {
      return NextResponse.json(
        {
          valid: false,
          error: "URL parameter is required"
        },
        { status: 400 }
      );
    }

    // Validate YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    if (!youtubeRegex.test(url)) {
      return NextResponse.json({
        valid: false,
        error: "Invalid YouTube URL format. Please enter a valid YouTube video link.",
      });
    }

    // Extract video ID for additional validation
    const videoIdMatch = url.match(/(?:v=|\/)([\w-]{11})/);
    if (!videoIdMatch) {
      return NextResponse.json({
        valid: false,
        error: "Could not extract video ID from URL",
      });
    }

    console.log(`Validating YouTube URL: ${url}`);

    // Fetch video information using yt-dlp
    const videoInfo = await getVideoInfo(url);

    // Format duration (convert seconds to HH:MM:SS or MM:SS)
    const formatDuration = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    // Calculate estimated file size (rough estimate: ~1MB per minute for audio)
    const estimatedSizeMB = Math.ceil((videoInfo.duration / 60) * 1);

    console.log(`✅ Valid video: ${videoInfo.title} (${formatDuration(videoInfo.duration)})`);

    return NextResponse.json({
      valid: true,
      video: {
        id: videoIdMatch[1],
        title: videoInfo.title,
        duration: videoInfo.duration,
        durationFormatted: formatDuration(videoInfo.duration),
        thumbnail: videoInfo.thumbnail,
        uploader: videoInfo.uploader,
        description: videoInfo.description?.substring(0, 200) || "",
        estimatedSizeMB,
        url,
      },
    });

  } catch (error: any) {
    console.error("Video validation error:", error);

    // Handle specific errors
    let errorMessage = "Failed to validate video. Please check the URL and try again.";

    if (error.message.includes("Private video")) {
      errorMessage = "This video is private and cannot be accessed.";
    } else if (error.message.includes("Video unavailable")) {
      errorMessage = "This video is unavailable or has been removed.";
    } else if (error.message.includes("age-restricted")) {
      errorMessage = "This video is age-restricted and may require authentication.";
    } else if (error.message.includes("region")) {
      errorMessage = "This video is not available in your region.";
    } else if (error.message.includes("copyright")) {
      errorMessage = "This video has copyright restrictions.";
    }

    return NextResponse.json({
      valid: false,
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
