import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

/**
 * Generates embeddings for text chunks using OpenAI Embeddings API
 * @param textChunks - Array of text chunks
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(
  textChunks: string[]
): Promise<number[][]> {
  try {
    console.log(`Generating embeddings for ${textChunks.length} chunks...`);

    // OpenAI embeddings API supports batch processing
    // text-embedding-3-small: 1536 dimensions, cost-effective
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: textChunks,
    });

    const embeddings = response.data.map((item) => item.embedding);

    console.log(`Generated ${embeddings.length} embeddings`);
    return embeddings;
  } catch (error: any) {
    console.error("Embedding generation error:", error);
    throw new Error(`Failed to generate embeddings: ${error.message}`);
  }
}

/**
 * Uploads embeddings to Pinecone vector database
 * @param videoId - Unique identifier for the video
 * @param chunks - Text chunks with timestamps
 * @param embeddings - Embedding vectors
 * @param metadata - Additional metadata
 */
export async function uploadToPinecone(
  videoId: string,
  chunks: Array<{ text: string; startTime: number; endTime: number }>,
  embeddings: number[][],
  metadata: { title: string; url: string; language: string }
) {
  try {
    console.log(`Uploading ${embeddings.length} vectors to Pinecone...`);

    // Get or create index
    const indexName = process.env.PINECONE_INDEX || "youtube-qa";
    const index = pinecone.index(indexName);

    // Prepare vectors for upsert
    const vectors = chunks.map((chunk, i) => ({
      id: `${videoId}_chunk_${i}`,
      values: embeddings[i],
      metadata: {
        videoId,
        text: chunk.text,
        startTime: chunk.startTime,
        endTime: chunk.endTime,
        title: metadata.title,
        url: metadata.url,
        language: metadata.language,
        chunkIndex: i,
      },
    }));

    // Upsert vectors in batches (Pinecone recommends batches of 100)
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
    }

    console.log(`Successfully uploaded all vectors to Pinecone`);
  } catch (error: any) {
    console.error("Pinecone upload error:", error);
    throw new Error(`Failed to upload to Pinecone: ${error.message}`);
  }
}

/**
 * Queries Pinecone for relevant chunks based on a question
 * @param question - User's question
 * @param videoId - Optional video ID to filter results
 * @param topK - Number of results to return
 * @returns Relevant text chunks with scores
 */
export async function queryPinecone(
  question: string,
  videoId?: string,
  topK: number = 5
): Promise<
  Array<{
    text: string;
    score: number;
    videoId: string;
    title: string;
    startTime: number;
    endTime: number;
  }>
> {
  try {
    console.log(`Querying Pinecone for: "${question}"`);

    // Generate embedding for the question
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });

    const questionEmbedding = response.data[0].embedding;

    // Query Pinecone
    const indexName = process.env.PINECONE_INDEX || "youtube-qa";
    const index = pinecone.index(indexName);

    const queryRequest: any = {
      vector: questionEmbedding,
      topK,
      includeMetadata: true,
    };

    // Add filter if videoId is provided
    if (videoId) {
      queryRequest.filter = { videoId: { $eq: videoId } };
    }

    const queryResponse = await index.query(queryRequest);

    // Extract and format results
    const results = queryResponse.matches?.map((match: any) => ({
      text: match.metadata?.text || "",
      score: match.score || 0,
      videoId: match.metadata?.videoId || "",
      title: match.metadata?.title || "",
      startTime: match.metadata?.startTime || 0,
      endTime: match.metadata?.endTime || 0,
    })) || [];

    console.log(`Found ${results.length} relevant chunks`);
    return results;
  } catch (error: any) {
    console.error("Pinecone query error:", error);
    throw new Error(`Failed to query Pinecone: ${error.message}`);
  }
}

/**
 * Generates an answer using OpenAI chat completion with RAG
 * @param question - User's question
 * @param relevantChunks - Array of relevant text chunks
 * @param systemPrompt - Custom system prompt (optional)
 * @param model - OpenAI model to use (default: gpt-4o-mini)
 * @returns Generated answer with metadata
 */
export async function generateAnswer(
  question: string,
  relevantChunks: Array<{ text: string; startTime: number; endTime: number }>,
  systemPrompt?: string,
  model: string = "gpt-4o-mini"
): Promise<{ answer: string; tokensUsed: number }> {
  try {
    console.log(`Generating answer using ${model}...`);

    // Build context from relevant chunks with timestamps
    const context = relevantChunks
      .map((chunk, i) => {
        const timestamp = formatTimestamp(chunk.startTime);
        return `[${timestamp}] ${chunk.text}`;
      })
      .join("\n\n");

    const defaultSystemPrompt = `You are an AI assistant that answers questions based on educational video content.
Use the provided transcript segments to answer the user's question accurately and concisely.
If the answer is not in the provided context, say so clearly.
Always cite timestamps when referencing specific information.`;

    const messages = [
      {
        role: "system" as const,
        content: systemPrompt || defaultSystemPrompt,
      },
      {
        role: "user" as const,
        content: `Context from video transcript:\n\n${context}\n\nQuestion: ${question}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content || "No answer generated";
    const tokensUsed = response.usage?.total_tokens || 0;

    console.log(`Generated answer (${answer.length} chars, ${tokensUsed} tokens)`);

    return { answer, tokensUsed };
  } catch (error: any) {
    console.error("Answer generation error:", error);
    throw new Error(`Failed to generate answer: ${error.message}`);
  }
}

/**
 * Format seconds to HH:MM:SS or MM:SS
 */
function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
