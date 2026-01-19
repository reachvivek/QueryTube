/**
 * Pinecone Vector Database Utility
 *
 * Centralized Pinecone operations for vector storage and retrieval
 */

import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
});

const DEFAULT_INDEX = process.env.PINECONE_INDEX || 'youtube-qa';

/**
 * Get Pinecone index instance
 */
export function getPineconeIndex(indexName: string = DEFAULT_INDEX) {
  return pinecone.index(indexName);
}

/**
 * Upsert vectors to Pinecone in batches
 *
 * @param vectors - Array of vectors to upsert
 * @param batchSize - Batch size (default: 100)
 * @param indexName - Index name (optional)
 * @returns Number of vectors uploaded
 */
export async function upsertVectors(
  vectors: Array<{
    id: string;
    values: number[];
    metadata?: Record<string, any>;
  }>,
  batchSize: number = 100,
  indexName: string = DEFAULT_INDEX
): Promise<number> {
  const index = getPineconeIndex(indexName);
  let uploadedCount = 0;

  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert(batch);
    uploadedCount += batch.length;
  }

  return uploadedCount;
}

/**
 * Query vectors by similarity
 *
 * @param queryVector - Query vector
 * @param topK - Number of results to return
 * @param filter - Metadata filter
 * @param indexName - Index name (optional)
 * @returns Query results
 */
export async function queryVectors(
  queryVector: number[],
  topK: number = 20,
  filter?: Record<string, any>,
  indexName: string = DEFAULT_INDEX
) {
  const index = getPineconeIndex(indexName);

  return await index.query({
    vector: queryVector,
    topK,
    filter,
    includeMetadata: true,
  });
}

/**
 * Delete vectors by IDs
 *
 * @param vectorIds - Array of vector IDs to delete
 * @param indexName - Index name (optional)
 */
export async function deleteVectors(
  vectorIds: string[],
  indexName: string = DEFAULT_INDEX
): Promise<void> {
  const index = getPineconeIndex(indexName);
  const batchSize = 100;

  for (let i = 0; i < vectorIds.length; i += batchSize) {
    const batch = vectorIds.slice(i, i + batchSize);
    await index.deleteMany(batch);
  }
}

/**
 * Delete all vectors for a specific video
 *
 * @param videoId - Video ID
 * @param indexName - Index name (optional)
 */
export async function deleteVectorsByVideoId(
  videoId: string,
  indexName: string = DEFAULT_INDEX
): Promise<void> {
  const index = getPineconeIndex(indexName);

  await index.deleteMany({
    filter: { videoId }
  });
}

/**
 * Get index stats
 *
 * @param indexName - Index name (optional)
 * @returns Index statistics
 */
export async function getIndexStats(indexName: string = DEFAULT_INDEX) {
  const index = getPineconeIndex(indexName);
  return await index.describeIndexStats();
}
