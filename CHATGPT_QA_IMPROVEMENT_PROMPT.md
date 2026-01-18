# Q&A Response Generation - Code & Prompts for Improvement

## Problem Statement
Our video Q&A system is retrieving context from YouTube captions but the AI responses feel "hardcoded" and lack detail. We need to improve the prompts and context formatting to get better, more comprehensive answers.

## Current Architecture

### Data Flow:
1. **User asks question** → e.g., "What is this video about?"
2. **Mistral AI** generates embedding for the question (1024 dimensions)
3. **Pinecone** searches for top 10 most similar chunks (semantic search)
4. **Groq (Llama 3.3 70B)** generates answer using retrieved chunks as context
5. **Response** returned to user with timestamps

### Current Issues:
- Responses feel shallow and repetitive
- AI points to timestamps without explaining the content
- Not synthesizing information across multiple segments well
- Example bad response: "Around [00:05], the speaker mentions something about this topic. You might find more information at [00:01]."

## Current Implementation

### 1. Context Retrieval (app/api/qa/route.ts)

```typescript
// We retrieve top 10 chunks from Pinecone
const topK = 10;

// Format context for the AI
const context = chunks
  .map((chunk, i) => `
Segment ${i + 1} [Timestamp: ${chunk.timestamp}] (Relevance: ${(chunk.score * 100).toFixed(1)}%)
Content: ${chunk.text}
`)
  .join("\n---\n");
```

### 2. System Prompt (app/api/qa/route.ts)

```typescript
const defaultSystemPrompt =
  "You are a knowledgeable video content assistant. Your role is to provide detailed, comprehensive answers based on the video transcript segments provided." +
  "\n\nIMPORTANT INSTRUCTIONS:" +
  "\n1. Provide DETAILED answers - don't just point to timestamps, explain the content thoroughly" +
  "\n2. ALWAYS cite specific timestamps using the format [MM:SS] when referencing content" +
  "\n3. Combine information from multiple segments when they're related to the question" +
  "\n4. Structure your response clearly - start with a direct answer, then provide supporting details" +
  "\n5. Quote or paraphrase the actual content from the segments - don't be vague" +
  "\n6. If multiple segments discuss the same topic, synthesize them into a coherent explanation" +
  "\n7. Only say you can't find information if NONE of the provided segments are relevant" +
  "\n8. Respond in English. Only use a different language if the user explicitly asks." +
  "\n\nGOOD Example: 'This video discusses AI's impact on education. At [12:34], the speaker explains that AI will enable personalized learning paths for each student, adapting to their pace and style. They elaborate on this at [45:12], describing how AI tutors can provide instant feedback and identify knowledge gaps. The key benefits mentioned include...'" +
  "\n\nBAD Example: 'Around [00:05], the speaker mentions something about this topic. You might find more information at [00:01].'" +
  "\n\nRemember: Each segment provided is highly relevant to the question. Use ALL relevant segments to build a complete, detailed answer.";
```

### 3. User Message Format

```typescript
const userMessage = `Below are the most relevant segments from the video transcript for answering this question. Each segment includes a timestamp and relevance score.

${context}

---

User Question: ${question}

Provide a detailed, comprehensive answer using the information from these segments. Cite timestamps for all claims.`;
```

### 4. AI API Call (Groq)

```typescript
const completion = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [
    {
      role: 'system',
      content: systemPrompt || defaultSystemPrompt,
    },
    {
      role: 'user',
      content: userMessage,
    },
  ],
  temperature: 0.7,
  max_tokens: 1000,
});
```

## Current Chunking Strategy

YouTube captions are combined into ~5 minute chunks (300 seconds each):

```typescript
// app/api/process-transcript/route.ts
const targetChunkDuration = 300; // seconds (5 minutes)

// Combine small caption segments into larger chunks
for (const sub of subtitles) {
  const potentialEndTime = subEndSec;
  const potentialDuration = potentialEndTime - currentChunk.startTime;

  if (potentialDuration <= targetChunkDuration) {
    // Add to current chunk
    currentChunk.text += " " + sub.text;
    currentChunk.endTime = subEndSec;
  } else {
    // Save chunk and start new one
    combinedChunks.push(currentChunk);
    currentChunk = { text: sub.text, startTime: subStartSec, endTime: subEndSec };
  }
}
```

## What We Need Help With

Please analyze the above code and prompts, then provide:

1. **Improved System Prompt**: Better instructions for the AI to generate detailed, comprehensive responses
2. **Better Context Formatting**: How should we format the chunks we send to the AI?
3. **Prompt Engineering Tips**: Any techniques to improve response quality (few-shot examples, chain-of-thought, etc.)
4. **Parameter Tuning**: Should we adjust temperature, max_tokens, topK, etc.?
5. **Alternative Approaches**: Any other strategies we should consider?

## Example of Current Poor Response

**User Question**: "What is this video about?"

**Current Response**:
```
Around [00:05], the speaker mentions explaining edge cases and how different components fit together. However, the provided context is quite limited, and it's not entirely clear what specific topic is being discussed.

At [00:04], it's mentioned that there are "many different things," which could be related to the topic, but without more context, it's difficult to provide a detailed explanation.

You might find more information at [00:01], where someone asks to describe something "exactly," but the specifics of what they're referring to are not provided in the given context.
```

**Desired Response Style**:
```
This video is a comprehensive discussion about [main topic]. The speaker covers several key areas:

At [00:05], they begin by explaining [specific concept], noting that [detailed explanation of what was said]. This sets the foundation for understanding [broader context].

Moving to [12:34], the discussion shifts to [next major point], where the speaker emphasizes [key insight with actual quotes or paraphrasing from the content].

The video also addresses [additional topic] around [45:12], providing [specific details about what was covered].

Overall, the video serves as [summary of purpose/value], making it particularly useful for [target audience/use case].
```

## Additional Context

- We're using **Groq's Llama 3.3 70B** (free tier)
- **Mistral AI** for embeddings (1024 dimensions)
- **Pinecone** for vector storage (cosine similarity)
- Chunks are currently 5 minutes long (300 seconds)
- We retrieve top 10 most relevant chunks per question

Please provide your recommendations for improving our Q&A quality!
