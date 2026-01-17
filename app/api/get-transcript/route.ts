import { NextRequest, NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body. Expected JSON.",
          available: false
        },
        { status: 400 }
      );
    }

    const { videoId, language } = body;

    if (!videoId) {
      return NextResponse.json(
        {
          success: false,
          error: "Video ID is required",
          available: false
        },
        { status: 400 }
      );
    }

    console.log(`Fetching transcript for video: ${videoId}`);

    // Try to get transcript in specified language or auto-detect
    const lang = language || "en"; // Default to English, but will try other languages if not available

    let subtitles;
    try {
      // Try the specified language first
      subtitles = await getSubtitles({ videoID: videoId, lang });
    } catch (error) {
      // If specified language fails, try French
      if (lang !== "fr") {
        try {
          console.log(`Language ${lang} not available, trying French...`);
          subtitles = await getSubtitles({ videoID: videoId, lang: "fr" });
        } catch (frError) {
          // If French fails, try English
          console.log("French not available, trying English...");
          subtitles = await getSubtitles({ videoID: videoId, lang: "en" });
        }
      } else {
        // If French was requested and failed, try English
        console.log("French not available, trying English...");
        subtitles = await getSubtitles({ videoID: videoId, lang: "en" });
      }
    }

    if (!subtitles || subtitles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No transcript available for this video",
          available: false,
          fallbackRequired: true
        },
        { status: 200 } // Changed to 200 so client can handle gracefully
      );
    }

    // Convert subtitles to our format
    const fullTranscript = subtitles.map((sub: any) => sub.text).join(" ");

    // Create chunks with timestamps (similar to our transcribe API)
    const chunks = subtitles.map((sub: any, index: number) => ({
      text: sub.text,
      startTime: Math.floor(sub.start / 1000), // Convert ms to seconds
      endTime: Math.floor((sub.start + sub.dur) / 1000),
      chunkIndex: index,
    }));

    return NextResponse.json({
      success: true,
      available: true,
      transcript: fullTranscript,
      chunks,
      language: lang,
      source: "youtube-captions",
      stats: {
        totalChunks: chunks.length,
        totalDuration: chunks[chunks.length - 1]?.endTime || 0,
      },
    });
  } catch (error: any) {
    console.error("Error fetching transcript:", error);
    console.error("Error stack:", error.stack);

    // Check if it's a "no captions available" error
    if (error.message?.includes("Could not find captions") ||
        error.message?.includes("No captions") ||
        error.message?.includes("Transcript is disabled")) {
      return NextResponse.json(
        {
          success: false,
          error: "No captions available for this video. The video may not have subtitles enabled.",
          available: false,
          fallbackRequired: true,
        },
        { status: 200 } // Return 200 so client can parse JSON
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch transcript",
        available: false,
        fallbackRequired: true,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 200 } // Return 200 so client can parse JSON
    );
  }
}
