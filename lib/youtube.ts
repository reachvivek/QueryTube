import YouTube from "youtube-sr";
import fs from "fs";
import path from "path";
import { Innertube } from "youtubei.js";

/**
 * Gets video information without downloading
 * @param youtubeUrl - The YouTube video URL or ID
 * @returns Video metadata
 */
export async function getVideoInfo(youtubeUrl: string) {
  try {
    console.log(`[getVideoInfo] Fetching info for: ${youtubeUrl}`);

    // youtube-sr can accept URL or video ID
    const video = await YouTube.getVideo(youtubeUrl);

    if (!video) {
      throw new Error("Video not found or unavailable");
    }

    console.log(`[getVideoInfo] Successfully fetched: ${video.title}`);

    // youtube-sr returns duration in milliseconds, convert to seconds
    const durationInSeconds = Math.floor((video.duration || 0) / 1000);

    return {
      title: video.title || "Untitled Video",
      duration: durationInSeconds, // Duration in seconds
      description: video.description || "",
      thumbnail: video.thumbnail?.url || "",
      uploader: video.channel?.name || "Unknown",
    };
  } catch (error: any) {
    console.error("[getVideoInfo] Error:", error);

    // Provide user-friendly error messages
    let errorMessage = error.message || "Unknown error occurred";

    if (errorMessage.includes("unavailable")) {
      throw new Error("This video is unavailable or has been removed");
    } else if (errorMessage.includes("private")) {
      throw new Error("This video is private and cannot be accessed");
    } else if (errorMessage.includes("age")) {
      throw new Error("This video is age-restricted");
    }

    throw new Error(`Failed to get video info: ${errorMessage}`);
  }
}

/**
 * Downloads audio from a YouTube URL using youtubei.js
 * @param youtubeUrl - The YouTube video URL or ID
 * @param outputPath - Directory to save the audio file
 * @param onProgress - Optional callback for download progress
 * @returns Path to the downloaded audio file with metadata
 */
export async function downloadYouTubeAudio(
  youtubeUrl: string,
  outputPath: string = "./downloads",
  onProgress?: (progress: { percent: number; downloaded: number; total: number }) => void
): Promise<{ filePath: string; duration: number; fileSize: number; title: string }> {
  try {
    console.log(`[Download] Starting download for: ${youtubeUrl}`);

    // Create downloads directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Initialize YouTube client with cache to fix "No valid URL to decipher" error
    // This is required as of January 2026 due to YouTube API changes
    const youtube = await Innertube.create({
      cache: undefined, // Disable caching to force fresh player retrieval
      retrieve_player: true, // Force player retrieval
    });

    // Extract video ID from URL
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Get video info
    const videoInfo = await youtube.getInfo(videoId);
    const title = videoInfo.basic_info.title || "Untitled Video";
    const duration = videoInfo.basic_info.duration || 0;

    console.log(`[Download] Video: ${title}`);
    console.log(`[Download] Duration: ${duration}s`);

    // Get audio format (best audio quality)
    const format = videoInfo.chooseFormat({
      type: "audio",
      quality: "best",
    });

    if (!format) {
      throw new Error("No audio format available for this video");
    }

    // Generate output filename
    const sanitizedTitle = title
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 50);
    const filename = `${sanitizedTitle}_${videoId}.mp4`;
    const filePath = path.join(outputPath, filename);

    // Download audio stream
    const stream = await videoInfo.download({
      type: "audio",
      quality: "best",
    });

    // Write to file with progress tracking
    const writeStream = fs.createWriteStream(filePath);
    let downloaded = 0;
    const total = format.content_length || 0;

    const reader = stream.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        writeStream.write(value);
        downloaded += value.length;

        if (onProgress && total > 0) {
          const percent = Math.floor((downloaded / total) * 100);
          onProgress({ percent, downloaded, total });
        }
      }
    } finally {
      reader.releaseLock();
    }

    writeStream.end();

    // Wait for write to complete
    await new Promise<void>((resolve, reject) => {
      writeStream.on("finish", () => resolve());
      writeStream.on("error", reject);
    });

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;

    console.log(`[Download] Complete: ${filePath}`);
    console.log(`[Download] Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

    return {
      filePath,
      duration,
      fileSize,
      title,
    };
  } catch (error: any) {
    console.error("[Download] Error:", error);
    throw new Error(`Failed to download YouTube audio: ${error.message}`);
  }
}

/**
 * Extracts video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If no pattern matches, assume it's already a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}
