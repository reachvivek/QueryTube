import { NextRequest, NextResponse } from "next/server";
import { getSubtitles } from "youtube-caption-extractor";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
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

    // Try to get transcript with language fallback
    const requestedLang = language || "en";
    let actualLang = requestedLang;
    let transcript;

    try {
      // youtube-caption-extractor uses modern Innertube API
      transcript = await getSubtitles({ videoID: videoId, lang: requestedLang });
    } catch (error: any) {
      // If specific language fails, try English as fallback
      try {
        transcript = await getSubtitles({ videoID: videoId, lang: "en" });
        actualLang = "en"; // Language was auto-detected
      } catch (fallbackError: any) {
        return NextResponse.json(
          {
            success: false,
            error: "No transcript available for this video",
            available: false,
            fallbackRequired: true
          },
          { status: 200 }
        );
      }
    }

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No transcript available for this video",
          available: false,
          fallbackRequired: true
        },
        { status: 200 }
      );
    }

    // Convert transcript to our format
    const fullTranscript = transcript.map((item: any) => item.text).join(" ");

    // Create chunks with timestamps (youtube-caption-extractor uses 'start' and 'dur' in seconds as strings)
    const chunks = transcript.map((item: any, index: number) => ({
      text: item.text,
      startTime: Math.floor(Number(item.start)),
      endTime: Math.floor(Number(item.start) + Number(item.dur)),
      chunkIndex: index,
    }));

    return NextResponse.json({
      success: true,
      available: true,
      transcript: fullTranscript,
      chunks,
      language: actualLang,
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
