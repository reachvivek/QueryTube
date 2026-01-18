import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { Mistral } from "@mistralai/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import prisma from "@/lib/db";
import {
  validateString,
  validateArray,
  validateTopK,
  validateLanguage,
  validateProvider,
  validateUUID,
} from "@/lib/validation";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "",
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

// Detect conversational mode based on question and history
function detectConversationalMode(question: string, history?: any[]): string {
  const q = question.toLowerCase();

  // Evidence Inspection Mode
  if (/what (is|are|happens?) (in|at|there in|during) (th(ese|ose|at))? ?(timestamp|moment|time|section|part)/i.test(q)) {
    return "evidence";
  }

  // Expansion Mode
  if (/^(give|tell|show).*(more|detail|explain|elaborate)|^(more|detail|explain|elaborate)/i.test(q)) {
    return "expansion";
  }

  // Background Knowledge Mode
  if (/^(who|what) is |^who are |^what are /i.test(q) && !/this video/i.test(q)) {
    return "background";
  }

  // Comparative Reasoning Mode
  if (/what makes .* (rare|special|different|unique)|how (is|does) .* (compare|differ)|why is .* (better|different)/i.test(q)) {
    return "comparison";
  }

  // Summary Mode (default for first question or broad questions)
  if (!history || history.length === 0 || /what is this (video|about)|summary|summarize|main topic|overview|key points/i.test(q)) {
    return "summary";
  }

  return "general";
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();

    // Validate question
    const questionValidation = validateString(body.question, 1000, true);
    if (!questionValidation.valid) {
      return NextResponse.json(
        { error: questionValidation.error || "Invalid question" },
        { status: 400 }
      );
    }
    const question = questionValidation.value!;

    // Validate videoId if provided
    if (body.videoId && !validateUUID(body.videoId)) {
      return NextResponse.json(
        { error: "Invalid video ID format" },
        { status: 400 }
      );
    }
    const videoId = body.videoId;

    // Validate system prompt if provided
    let systemPrompt: string | undefined;
    if (body.systemPrompt) {
      const promptValidation = validateString(body.systemPrompt, 5000, false);
      if (!promptValidation.valid) {
        return NextResponse.json(
          { error: "System prompt is too long" },
          { status: 400 }
        );
      }
      systemPrompt = promptValidation.value;
    }

    // Validate conversation history
    const historyValidation = validateArray(body.conversationHistory || [], 50);
    if (!historyValidation.valid) {
      return NextResponse.json(
        { error: "Conversation history exceeds maximum length of 50 messages" },
        { status: 400 }
      );
    }
    const conversationHistory = historyValidation.array || [];

    // Validate and sanitize parameters
    const validatedTopK = validateTopK(body.topK);
    const validatedLanguage = validateLanguage(body.language);
    const aiProvider = validateProvider(body.provider, ["openai", "groq", "claude"]);

    // Determine model based on provider
    const aiModel = body.model || process.env.DEFAULT_MODEL ||
      (aiProvider === "groq" ? "llama-3.3-70b-versatile" :
       aiProvider === "claude" ? "claude-3-5-sonnet-20241022" :
       "gpt-4o-mini");

    // Detect conversational mode
    const mode = detectConversationalMode(question, conversationHistory);
    console.log(`[QA] Question: "${question}" | Mode: ${mode} | Video: ${videoId || "all"} | Provider: ${aiProvider} | Model: ${aiModel} | Language: ${validatedLanguage}`);

    // Check if this is a broad summary question and if video summary exists
    const isBroadQuestion = mode === "summary";

    if (isBroadQuestion && videoId) {
      console.log("[QA] Detected broad summary question - checking for video summary");

      const video = await prisma.video.findUnique({
        where: { id: videoId },
        select: { summary: true, title: true },
      });

      if (video?.summary) {
        console.log(`[QA] Using cached video summary: "${video.summary}"`);

        // Return summary directly for broad questions
        const answer = video.summary;
        const responseTime = (Date.now() - startTime) / 1000;

        return NextResponse.json({
          success: true,
          answer,
          chunks: [],
          responseTime,
          model: "cached-summary",
          provider: "database",
          usedSummary: true,
        });
      } else {
        console.log("[QA] No video summary found - will use semantic search");
      }
    }

    // Step 1: Generate embedding for the question (use same provider as video embeddings)
    const embeddingProvider = process.env.DEFAULT_EMBEDDING_PROVIDER || "mistral";
    console.log(`[QA] Generating question embedding with ${embeddingProvider}...`);

    let questionEmbedding: number[];

    if (embeddingProvider === "mistral") {
      // Mistral AI (FREE - matches video embeddings)
      const embeddingResponse = await mistral.embeddings.create({
        model: "mistral-embed",
        inputs: [question],
      });
      questionEmbedding = embeddingResponse.data[0].embedding || [];
    } else {
      // OpenAI (Paid - fallback)
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
      });
      questionEmbedding = embeddingResponse.data[0].embedding || [];
    }

    // Step 2: Query Pinecone for relevant chunks
    const indexName = process.env.PINECONE_INDEX || "youtube-qa";
    const index = pinecone.index(indexName);

    const queryOptions: any = {
      vector: questionEmbedding,
      topK: validatedTopK,
      includeMetadata: true,
    };

    // Filter by videoId if provided
    if (videoId) {
      queryOptions.filter = { videoId: { $eq: videoId } };
    }

    const queryResponse = await index.query(queryOptions);

    console.log(`[QA] Found ${queryResponse.matches?.length || 0} matching chunks from Pinecone`);
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      const textPreview = String(queryResponse.matches[0].metadata?.text || "").substring(0, 100);
      console.log(`[QA] Top match score: ${queryResponse.matches[0].score}, text preview: "${textPreview}..."`);
    }

    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      console.log("[QA] No matches found in Pinecone for this question");
      return NextResponse.json({
        success: true,
        answer: "I couldn't find any relevant information to answer this question.",
        chunks: [],
        responseTime: (Date.now() - startTime) / 1000,
        model: aiModel,
        provider: aiProvider,
      });
    }

    // Step 3: Format context from retrieved chunks
    const chunks = queryResponse.matches.map((match: any) => {
      const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hrs > 0) {
          return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      return {
        text: match.metadata?.text || "",
        score: match.score || 0,
        timestamp: formatTime(match.metadata?.startTime || 0),
        title: match.metadata?.title || "",
        videoId: match.metadata?.videoId || "",
      };
    });

    // Format context WITHOUT relevance scores (ChatGPT recommendation)
    // Use time ranges and clean formatting
    const context = chunks
      .map((chunk, i) => {
        const start = chunk.timestamp;
        // Estimate end time (we'll improve this when we fix chunking)
        const endMinutes = parseInt(start.split(':')[0]);
        const endSeconds = parseInt(start.split(':')[1]) + 45; // Assume 45s chunks
        const end = endSeconds >= 60
          ? `${String(endMinutes + 1).padStart(2, '0')}:${String(endSeconds - 60).padStart(2, '0')}`
          : `${String(endMinutes).padStart(2, '0')}:${String(endSeconds).padStart(2, '0')}`;

        return `SOURCE ${i + 1} | [${start}–${end}] | video="${chunk.title || "Untitled"}"\n${chunk.text.trim()}`;
      })
      .join("\n\n-----\n\n");

    // Step 4: Generate answer using selected AI provider
    const languageInstructions = {
      en: "Respond in English.",
      fr: "Répondez en français.",
      hi: "हिंदी में जवाब दें।"
    };

    // Mode-aware system prompt with structured conversational flow
    const modeInstructions = {
      summary: `
You are in SUMMARY MODE. The user wants a high-level overview of the video.

Response structure:
1. Opening statement (1-2 sentences summarizing what the video is about)
2. Key ideas covered (3-6 bullet points)
3. Representative moments (2-4 timestamp ranges that best represent the video)

Then end with guided next steps:
"Want to:
→ Explore one of these moments
→ Ask about [key person/topic mentioned]
→ Get more details on a specific idea"`,

      expansion: `
You are in EXPANSION MODE. The user wants more details on what was already discussed.

CRITICAL: Do NOT re-summarize the entire video. Build on the previous answer.

Response structure:
1. Reference the previous context: "Building on [what was discussed]..."
2. Expand each key idea with numbered points
3. Connect each point to specific timestamp ranges

Then end with:
"Want to:
→ Break down one timestamp line by line
→ See how this applies beyond [topic]
→ Compare with [related concept]"`,

      evidence: `
You are in EVIDENCE INSPECTION MODE. The user wants to know what happens in specific timestamps.

CRITICAL: Do NOT summarize the video again. Focus ONLY on the requested timestamps.

Response structure:
For each timestamp mentioned:
[MM:SS–MM:SS]
[Explain what happens in this specific moment]

Then end with:
"Want to:
→ Jump deeper into one of these moments
→ Ask why [key point] matters
→ See how these moments connect"`,

      background: `
You are in BACKGROUND KNOWLEDGE MODE. The user is asking about a person/concept mentioned in the video.

Response structure:
1. Brief factual background (if it's general knowledge)
2. "Context relevant to this video:" section
3. Reference where in the video this appears

CRITICAL: Acknowledge what's video content vs. external knowledge.

Then end with:
"Want to:
→ Focus only on what the video says about [topic]
→ Compare [topic] with [related topic]
→ Explore specific moments about [topic]"`,

      comparison: `
You are in COMPARATIVE REASONING MODE. The user wants to understand what makes something rare/special/different.

Response structure:
1. Clear thesis statement answering "what makes X rare"
2. Numbered points explaining each distinguishing factor
3. Connect each point to specific timestamp evidence

CRITICAL: Don't just list features. Explain WHY they're rare/different.

Then end with:
"Want to compare with [related example] or explore one of these factors?"`,

      general: `
You are answering a follow-up question.

CRITICAL: Do NOT re-summarize. Build on the conversation so far.

Response structure:
1. Answer the question directly
2. Support with specific timestamp evidence
3. Connect to what was discussed earlier if relevant

Then end with relevant next step suggestions.`
    };

    const baseRules = `
Core rules for ALL modes:
- NEVER talk about "segments," "relevance scores," or "context being limited"
- NEVER re-summarize the video in follow-up questions
- Use timestamp citations: [MM:SS–MM:SS] for every factual claim
- Combine information across sources when they refer to the same idea
- If info is missing: say "I don't have that in the provided transcript" + suggest better questions
- Write like a smart human explaining, not a search engine
- Avoid filler phrases like "you might find more information"

${languageInstructions[validatedLanguage as keyof typeof languageInstructions] || languageInstructions.en}
`;

    const defaultSystemPrompt =
      `You are QueryTube, an expert video Q&A assistant.\n\n${modeInstructions[mode as keyof typeof modeInstructions] || modeInstructions.general}\n\n${baseRules}`;


    // Build conversation context (include last 3 messages for continuity)
    const recentHistory = conversationHistory.slice(-3);
    const historyContext = recentHistory.length > 0
      ? `\n\nPREVIOUS CONVERSATION:\n${recentHistory.map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n\n')}\n\n`
      : '';

    // Task-oriented user message with conversation context
    const userMessage = `You are given transcript sources from a video. Use them to answer the question.${historyContext}\nTRANSCRIPT SOURCES:\n${context}\n\nQUESTION:\n${question}`;

    let answer = "";

    if (aiProvider === "groq") {
      // Groq API (FREE & FAST)
      const completion = await groq.chat.completions.create({
        model: aiModel,
        messages: [
          {
            role: "system",
            content: systemPrompt || defaultSystemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      answer = completion.choices[0]?.message?.content || "";
    } else if (aiProvider === "claude") {
      // Anthropic API
      const completion = await anthropic.messages.create({
        model: aiModel,
        max_tokens: 1000,
        system: systemPrompt || defaultSystemPrompt,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.3,
      });

      answer = completion.content[0].type === "text" ? completion.content[0].text : "";
    } else {
      // OpenAI API (default)
      const completion = await openai.chat.completions.create({
        model: aiModel,
        messages: [
          {
            role: "system",
            content: systemPrompt || defaultSystemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      answer = completion.choices[0]?.message?.content || "";
    }

    // Step 5: Store analytics
    if (videoId) {
      await prisma.analytics.create({
        data: {
          videoId,
          question,
          answer,
          responseTime: (Date.now() - startTime) / 1000,
          provider: aiProvider,
          model: aiModel,
          chunksUsed: chunks.length,
        },
      });
    }

    const responseTime = (Date.now() - startTime) / 1000;
    console.log(`[QA] Answer generated in ${responseTime.toFixed(2)}s using ${aiProvider}:${aiModel}`);

    return NextResponse.json({
      success: true,
      answer,
      chunks,
      responseTime,
      model: aiModel,
      provider: aiProvider,
    });
  } catch (error: any) {
    console.error("[QA] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process question"
      },
      { status: 500 }
    );
  }
}
