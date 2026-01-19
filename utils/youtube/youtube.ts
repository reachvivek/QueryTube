import YouTube from "youtube-sr";
import fs from "fs";
import path from "path";
import YTDlpWrap from "yt-dlp-wrap";

/**
 * Extracts video ID from YouTube URL or returns the ID if already an ID
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
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

/**
 * Parse ISO 8601 duration to seconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = (parseInt(match[1]) || 0);
  const minutes = (parseInt(match[2]) || 0);
  const seconds = (parseInt(match[3]) || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Gets video information using YouTube Data API v3
 * Falls back to youtube-sr if API key is not available
 * @param youtubeUrl - The YouTube video URL or ID
 * @returns Video metadata
 */
export async function getVideoInfo(youtubeUrl: string) {
  try {
    console.log(`[getVideoInfo] Fetching info for: ${youtubeUrl}`);

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL or video ID");
    }

    // Try YouTube Data API v3 first (more reliable in serverless)
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      console.log(`[getVideoInfo] Using YouTube Data API v3`);

      const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.error) {
        console.error(`[getVideoInfo] API Error:`, data.error);
        throw new Error(data.error.message || "YouTube API error");
      }

      if (!data.items || data.items.length === 0) {
        throw new Error("Video not found or unavailable");
      }

      const video = data.items[0];
      const snippet = video.snippet;
      const contentDetails = video.contentDetails;

      const durationInSeconds = parseDuration(contentDetails.duration);

      console.log(`[getVideoInfo] Successfully fetched: ${snippet.title}`);

      return {
        title: snippet.title || "Untitled Video",
        duration: durationInSeconds,
        description: snippet.description || "",
        thumbnail: snippet.thumbnails?.maxres?.url ||
                   snippet.thumbnails?.high?.url ||
                   snippet.thumbnails?.medium?.url || "",
        uploader: snippet.channelTitle || "Unknown",
      };
    }

    // Fallback to youtube-sr (web scraping - may fail in production)
    console.log(`[getVideoInfo] Falling back to youtube-sr (scraping)`);
    const video = await YouTube.getVideo(youtubeUrl);

    if (!video) {
      throw new Error("Video not found or unavailable");
    }

    console.log(`[getVideoInfo] Successfully fetched: ${video.title}`);

    const durationInSeconds = Math.floor((video.duration || 0) / 1000);

    return {
      title: video.title || "Untitled Video",
      duration: durationInSeconds,
      description: video.description || "",
      thumbnail: video.thumbnail?.url || "",
      uploader: video.channel?.name || "Unknown",
    };
  } catch (error: any) {
    console.error("[getVideoInfo] Error:", error);

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
 * Downloads audio from a YouTube URL using yt-dlp
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

    // Extract video ID from URL
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // Initialize yt-dlp wrapper
    const ytDlpWrap = new YTDlpWrap();

    // Get video info first
    const videoInfo = await getVideoInfo(youtubeUrl);
    const title = videoInfo.title;
    const duration = videoInfo.duration;

    console.log(`[Download] Video: ${title}`);
    console.log(`[Download] Duration: ${duration}s`);

    // Generate output filename
    const sanitizedTitle = title
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 50);
    const filename = `${sanitizedTitle}_${videoId}.%(ext)s`;
    const outputTemplate = path.join(outputPath, filename);

    // Download audio using yt-dlp with best audio quality
    // Format: bestaudio[ext=m4a]/bestaudio/best
    const downloadedFiles = await ytDlpWrap.execPromise([
      youtubeUrl,
      "-f", "bestaudio[ext=m4a]/bestaudio/best",
      "-o", outputTemplate,
      "--no-playlist",
      "--no-warnings",
      "--quiet",
      "--progress",
    ]);

    // Find the downloaded file
    const files = fs.readdirSync(outputPath).filter(f => f.startsWith(sanitizedTitle));
    if (files.length === 0) {
      throw new Error("Download completed but file not found");
    }

    const filePath = path.join(outputPath, files[0]);
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

