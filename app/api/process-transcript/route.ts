import { NextRequest, NextResponse } from "next/server";

/**
 * Process transcript by calling the transcription microservice
 * The microservice handles:
 * 1. YouTube caption extraction (fast, free)
 * 2. Groq Whisper transcription (fallback, <25MB files)
 * 3. OpenAI Whisper transcription (fallback, >25MB files)
 */
export async function POST(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId");
  const youtubeUrl = request.nextUrl.searchParams.get("url");
  const requestedLang = request.nextUrl.searchParams.get("lang") || "en";

  if (!videoId || !youtubeUrl) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing videoId or url parameter",
      },
      { status: 400 }
    );
  }

  try {
    console.log(`[ProcessTranscript] Calling transcription microservice for ${videoId}`);

    // Get transcription service URL from environment
    const transcriptionServiceUrl = process.env.TRANSCRIPTION_SERVICE_URL;

    if (!transcriptionServiceUrl) {
      throw new Error(
        "TRANSCRIPTION_SERVICE_URL not configured. Please add it to your environment variables."
      );
    }

    // Call the microservice
    const response = await fetch(`${transcriptionServiceUrl}/api/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optional: Add authentication if configured
        ...(process.env.TRANSCRIPTION_SERVICE_KEY && {
          'Authorization': `Bearer ${process.env.TRANSCRIPTION_SERVICE_KEY}`
        })
      },
      body: JSON.stringify({
        videoId,
        url: youtubeUrl,
        lang: requestedLang
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Transcription service returned ${response.status}`);
    }

    const result = await response.json();

    console.log(`[ProcessTranscript] ✅ Success via ${result.method} (${result.chunks?.length || 0} chunks)`);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("[ProcessTranscript] Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process transcript",
        method: "microservice-error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
