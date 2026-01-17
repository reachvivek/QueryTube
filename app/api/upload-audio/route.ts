import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/upload-audio
 * Handles audio file uploads for transcription
 *
 * Accepts: multipart/form-data with 'file' field
 * Max size: 25MB (Whisper API limit)
 * Supported formats: mp3, mp4, wav, m4a, webm
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "audio/mpeg", // mp3
      "audio/mp4", // m4a
      "audio/wav",
      "audio/x-wav",
      "audio/webm",
      "video/mp4", // mp4 video
      "video/webm",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type}. Allowed: MP3, MP4, WAV, M4A, WebM`,
        },
        { status: 400 }
      );
    }

    // Validate file size (25MB limit for Whisper API)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 25MB`,
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const fileId = uuidv4();
    const fileExtension = path.extname(file.name);
    const filename = `audio_${fileId}${fileExtension}`;
    const filepath = path.join(uploadsDir, filename);

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    console.log(`✅ File uploaded: ${filename} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    return NextResponse.json({
      success: true,
      fileId,
      filename,
      filepath,
      fileSize: file.size,
      originalName: file.name,
      mimeType: file.type,
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
