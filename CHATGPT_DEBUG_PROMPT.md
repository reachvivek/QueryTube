# ChatGPT Debugging Prompt for QueryTube Q&A Issue

## Problem Description

I'm building a YouTube Q&A system called QueryTube. Users can upload YouTube videos, extract transcripts, and ask questions about the content using RAG (Retrieval Augmented Generation).

**Current Issue**: The AI responses are poor quality and don't provide meaningful answers about video content.

## System Architecture

1. **Transcript Extraction**: YouTube captions → 2833 small segments (1-6 seconds each)
2. **Embedding Generation**: Each segment → Mistral AI embeddings (1024-dim vectors)
3. **Vector Storage**: Embeddings → Pinecone vector database with metadata
4. **Q&A Flow**:
   - User question → Mistral embedding
   - Pinecone similarity search → Top 5 chunks
   - Chunks as context → Groq LLM (Llama 3.3 70B)
   - LLM → Answer

## Example Poor Response

**Question**: "What is this video about?"

**Console Logs**:
```
[QA] Question: "What is this video about?" | Video: 1bf1342f-a31b-4a92-855d-d448c2b3ed25 | Provider: groq | Model: llama-3.3-70b-versatile | Language: en
[QA] Generating question embedding with mistral...
[QA] Found 5 matching chunks from Pinecone
[QA] Top match score: 0.787236452, text preview: "- You think that's what it's about?..."
```

**AI Response**:
```
Unfortunately, I couldn't find a clear answer to what the video is about in the provided transcript context. The lines seem to be more questioning and uncertain, rather than revealing the main topic of the video. At [00:01] and [00:06], the speakers express confusion and skepticism, but they don't give away the subject of the video. Around [00:02], there's a mention of "Many videos," but it's not enough to determine the video's main theme.
```

## Root Cause Analysis

The match score is GOOD (0.787), but the retrieved chunks are conversational fragments:
- "You think that's what it's about?"
- "I don't know what it's really about"
- "Many videos"

These are literally dialogue snippets, not meaningful content about the video topic.

## Current Data Structure

**Transcript Segments** (stored in database):
```typescript
{
  chunkIndex: number,
  text: string,           // "You think that's what it's about?"
  startTime: number,      // 1 second
  endTime: number,        // 6 seconds
  timestamp: string,      // "00:01"
}
```

**Pinecone Metadata**:
```typescript
{
  text: string,           // Same small fragment
  videoId: string,
  title: string,
  startTime: number,
  chunkIndex: number,
  language: string,
  embeddingProvider: string
}
```

## My Hypothesis

YouTube captions come in tiny word-by-word or sentence-by-sentence segments. When embedded individually, they lack context. The semantic search finds matching **keywords** ("what it's about") but not **meaningful content**.

## Questions for ChatGPT

1. **Chunking Strategy**: Should I combine small segments into 30-60 second chunks before embedding? What's the optimal chunk size for video transcripts?

2. **Sliding Windows**: Should I use overlapping windows to preserve context across boundaries?

3. **Hierarchical Retrieval**: Should I embed both small and large chunks, then do two-stage retrieval (find large chunks, then refine with small ones)?

4. **Re-ranking**: Should I add a re-ranking step after Pinecone retrieval to score chunks by relevance?

5. **Metadata Enhancement**: Should I add more metadata (topic, speaker, section) to improve filtering?

6. **Context Window**: Currently sending top 5 chunks to LLM. Should I increase this? Use smarter context assembly?

7. **Prompt Engineering**: Is my system prompt adequate for handling fragmented context?

## Current System Prompt

```typescript
const defaultSystemPrompt =
  "You are a helpful, friendly AI assistant that answers questions about video content. " +
  "Use the provided transcript context to give accurate, conversational answers. " +
  "\n\nIMPORTANT INSTRUCTIONS:" +
  "\n1. Be conversational and natural - respond like a friendly human would" +
  "\n2. ALWAYS reference specific timestamps when mentioning video content (format: [MM:SS])" +
  "\n3. If multiple relevant moments exist, mention all of them with timestamps" +
  "\n4. If you cannot find the answer in the context, politely say so" +
  "\n5. Use phrases like 'At [MM:SS], they discuss...' or 'Around [MM:SS], you'll find...'" +
  "\n6. Respond in English/French/Hindi based on user selection" +
  "\n\nExample: 'At [12:34], Sam explains that AI will transform education. He also mentions this topic again at [45:12] when discussing...'";
```

## What I Need

1. **Best practices** for chunking video transcripts for RAG
2. **Recommended chunk size** (seconds or word count)
3. **Whether to keep original small chunks** or completely replace with larger ones
4. **Code suggestions** for smart chunking algorithm
5. **Alternative approaches** to fix poor retrieval quality
6. **Evaluation metrics** to measure improvement

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Pinecone (vector DB)
- Mistral AI (embeddings - mistral-embed model)
- Groq (LLM - llama-3.3-70b-versatile)
- Prisma + SQLite (metadata storage)

## Expected Outcome

When user asks "What is this video about?", the AI should:
1. Find chunks that contain actual topic discussion (not just keywords)
2. Provide a coherent summary of the video's main theme
3. Reference specific timestamps where key points are discussed
4. Give useful, accurate information

Please provide detailed recommendations and code examples if possible.
