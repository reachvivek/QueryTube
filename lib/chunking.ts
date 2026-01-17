/**
 * Smart Chunking Utility for Video Transcripts
 *
 * Combines small caption segments into larger, context-rich chunks
 * for better semantic search and RAG quality.
 */

export interface Segment {
  chunkIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  timestamp: string;
}

export interface MacroChunk {
  chunkId: string;
  videoId: string;
  startTime: number;
  endTime: number;
  text: string;
  segmentStartIndex: number;
  segmentEndIndex: number;
  timestamp: string; // formatted start timestamp
}

/**
 * Clean up transcript text by removing filler words and normalizing whitespace
 */
function cleanupTranscriptText(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/(\buh\b|\bum\b|\byou know\b)/gi, "") // optional filler removal
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Format seconds into timestamp string (MM:SS or HH:MM:SS)
 */
function formatTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Build macro chunks from small segments using sliding window with overlap
 *
 * @param videoId - Video identifier
 * @param segments - Array of small caption segments
 * @param chunkSeconds - Target chunk duration (default: 45s)
 * @param overlapSeconds - Overlap between chunks (default: 12s)
 * @returns Array of macro chunks
 */
export function buildMacroChunks(
  videoId: string,
  segments: Segment[],
  chunkSeconds = 45,
  overlapSeconds = 12
): MacroChunk[] {
  if (!segments.length) return [];

  const chunks: MacroChunk[] = [];
  let i = 0;

  while (i < segments.length) {
    const startIdx = i;
    const windowStart = segments[i].startTime;
    const windowEndTarget = windowStart + chunkSeconds;

    let textParts: string[] = [];
    let endIdx = i;
    let endTime = segments[i].endTime;

    // Collect all segments within the time window
    while (endIdx < segments.length && segments[endIdx].startTime < windowEndTarget) {
      const t = segments[endIdx].text?.trim();
      if (t) textParts.push(t);
      endTime = Math.max(endTime, segments[endIdx].endTime);
      endIdx++;
    }

    const merged = cleanupTranscriptText(textParts.join(" "));

    // Only create chunk if it has content
    if (merged.length > 0) {
      chunks.push({
        chunkId: `${videoId}:${chunks.length}`,
        videoId,
        startTime: windowStart,
        endTime,
        text: merged,
        segmentStartIndex: startIdx,
        segmentEndIndex: Math.max(startIdx, endIdx - 1),
        timestamp: formatTimestamp(windowStart),
      });
    }

    // Advance pointer with overlap
    // Move start forward by (chunkSeconds - overlapSeconds)
    const nextStartTime = windowStart + (chunkSeconds - overlapSeconds);

    // Move i to the first segment whose startTime >= nextStartTime
    while (i < segments.length && segments[i].startTime < nextStartTime) {
      i++;
    }

    // Safety: ensure we always advance at least one segment
    if (i === startIdx) i++;
  }

  console.log(`[Chunking] Created ${chunks.length} macro chunks from ${segments.length} segments`);
  console.log(`[Chunking] Avg chunk duration: ${chunks.length > 0 ? ((chunks[chunks.length - 1].endTime - chunks[0].startTime) / chunks.length).toFixed(1) : 0}s`);

  return chunks;
}

/**
 * Get neighboring chunk IDs for context expansion
 *
 * @param chunkId - Current chunk ID (format: "videoId:chunkNumber")
 * @param totalChunks - Total number of chunks for this video
 * @param neighborCount - Number of neighbors on each side (default: 1)
 * @returns Array of chunk IDs including neighbors
 */
export function getNeighborChunkIds(
  chunkId: string,
  totalChunks: number,
  neighborCount = 1
): string[] {
  const [videoId, chunkNumStr] = chunkId.split(":");
  const chunkNum = parseInt(chunkNumStr, 10);

  if (isNaN(chunkNum)) return [chunkId];

  const neighbors: string[] = [];

  // Add previous neighbors
  for (let i = neighborCount; i >= 1; i--) {
    const prevNum = chunkNum - i;
    if (prevNum >= 0) {
      neighbors.push(`${videoId}:${prevNum}`);
    }
  }

  // Add current chunk
  neighbors.push(chunkId);

  // Add next neighbors
  for (let i = 1; i <= neighborCount; i++) {
    const nextNum = chunkNum + i;
    if (nextNum < totalChunks) {
      neighbors.push(`${videoId}:${nextNum}`);
    }
  }

  return neighbors;
}
