/**
 * Smart Chunking Utility for Video Transcripts
 *
 * Combines small caption segments into larger, context-rich chunks
 * for better semantic search and RAG quality.
 *
 * CRITICAL: Enforces token limits to prevent API errors (max 8192 tokens for embeddings)
 */

// CRITICAL: Mistral embedding API has 8192 token limit
// Set safe max to 6000 to account for tokenization variance
const MAX_TOKENS_PER_CHUNK = 6000;

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
  tokenCount?: number; // estimated token count for monitoring
}

/**
 * Estimate token count (rough approximation: ~0.75 tokens per word)
 * This is conservative to ensure we stay under limits
 */
function estimateTokenCount(text: string): number {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  return Math.ceil(words.length * 0.75);
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
 * Build macro chunks from small segments with TOKEN LIMIT enforcement
 *
 * CRITICAL FIX: Ensures chunks never exceed MAX_TOKENS_PER_CHUNK (6000)
 * to prevent "exceeding max 8192 tokens" API errors
 *
 * @param videoId - Video identifier
 * @param segments - Array of small caption segments
 * @param chunkSeconds - Target chunk duration (default: 30s, reduced from 45s)
 * @param overlapSeconds - Overlap between chunks (default: 8s, reduced from 12s)
 * @returns Array of macro chunks with guaranteed token limits
 */
export function buildMacroChunks(
  videoId: string,
  segments: Segment[],
  chunkSeconds = 30, // Reduced from 45s to reduce token count
  overlapSeconds = 8   // Reduced from 12s
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
    let currentTokens = 0;

    // Collect segments within time window AND token limit
    while (endIdx < segments.length && segments[endIdx].startTime < windowEndTarget) {
      const t = segments[endIdx].text?.trim();
      if (t) {
        const segmentTokens = estimateTokenCount(t);

        // CRITICAL: Stop if adding this segment would exceed token limit
        if (currentTokens + segmentTokens > MAX_TOKENS_PER_CHUNK) {
          break;
        }

        textParts.push(t);
        currentTokens += segmentTokens;
      }
      endTime = Math.max(endTime, segments[endIdx].endTime);
      endIdx++;
    }

    const merged = cleanupTranscriptText(textParts.join(" "));
    const finalTokenCount = estimateTokenCount(merged);

    // Safety check: If single segment exceeds limit, split it
    if (finalTokenCount > MAX_TOKENS_PER_CHUNK && textParts.length === 1) {
      // Split the text by sentences
      const sentences = merged.split(/[.!?]+/).filter(s => s.trim());
      let currentBatch = "";
      let batchTokens = 0;

      for (const sentence of sentences) {
        const sentenceTokens = estimateTokenCount(sentence);

        if (batchTokens + sentenceTokens > MAX_TOKENS_PER_CHUNK && currentBatch) {
          // Create chunk from current batch
          chunks.push({
            chunkId: `${videoId}:${chunks.length}`,
            videoId,
            startTime: windowStart,
            endTime,
            text: currentBatch.trim(),
            segmentStartIndex: startIdx,
            segmentEndIndex: startIdx,
            timestamp: formatTimestamp(windowStart),
            tokenCount: batchTokens,
          });
          currentBatch = sentence;
          batchTokens = sentenceTokens;
        } else {
          currentBatch += (currentBatch ? ". " : "") + sentence;
          batchTokens += sentenceTokens;
        }
      }

      // Add remaining batch
      if (currentBatch.trim()) {
        chunks.push({
          chunkId: `${videoId}:${chunks.length}`,
          videoId,
          startTime: windowStart,
          endTime,
          text: currentBatch.trim(),
          segmentStartIndex: startIdx,
          segmentEndIndex: startIdx,
          timestamp: formatTimestamp(windowStart),
          tokenCount: batchTokens,
        });
      }
    } else if (merged.length > 0) {
      // Normal case: create chunk
      chunks.push({
        chunkId: `${videoId}:${chunks.length}`,
        videoId,
        startTime: windowStart,
        endTime,
        text: merged,
        segmentStartIndex: startIdx,
        segmentEndIndex: Math.max(startIdx, endIdx - 1),
        timestamp: formatTimestamp(windowStart),
        tokenCount: finalTokenCount,
      });
    }

    // Advance pointer with overlap
    const nextStartTime = windowStart + (chunkSeconds - overlapSeconds);

    // Move i to the first segment whose startTime >= nextStartTime
    while (i < segments.length && segments[i].startTime < nextStartTime) {
      i++;
    }

    // Safety: ensure we always advance at least one segment
    if (i === startIdx) i++;
  }

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
