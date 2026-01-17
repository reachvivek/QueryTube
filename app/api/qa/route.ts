import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";
import { Mistral } from "@mistralai/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import prisma from "@/lib/db";

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

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const {
      question,
      videoId,
      systemPrompt,
      model,
      provider,
      topK = 5,
      language = "en"
    } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Determine provider and model
    const aiProvider = provider || process.env.DEFAULT_AI_PROVIDER || "groq";
    const aiModel = model || process.env.DEFAULT_MODEL ||
      (aiProvider === "groq" ? "llama-3.3-70b-versatile" :
       aiProvider === "claude" ? "claude-3-5-sonnet-20241022" :
       "gpt-4o-mini");

    console.log(`[QA] Question: "${question}" | Video: ${videoId || "all"} | Provider: ${aiProvider} | Model: ${aiModel}`);

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
      topK,
      includeMetadata: true,
    };

    // Filter by videoId if provided
    if (videoId) {
      queryOptions.filter = { videoId: { $eq: videoId } };
    }

    const queryResponse = await index.query(queryOptions);

    if (!queryResponse.matches || queryResponse.matches.length === 0) {
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

    const context = chunks
      .map((chunk, i) => `[${i + 1}] [${chunk.timestamp}] ${chunk.text}`)
      .join("\n\n");

    // Step 4: Generate answer using selected AI provider
    const languageInstructions = {
      en: "Respond in English.",
      fr: "Répondez en français.",
      hi: "हिंदी में जवाब दें।"
    };

    const defaultSystemPrompt =
      "You are a helpful, friendly AI assistant that answers questions about video content. " +
      "Use the provided transcript context to give accurate, conversational answers. " +
      "\n\nIMPORTANT INSTRUCTIONS:" +
      "\n1. Be conversational and natural - respond like a friendly human would" +
      "\n2. ALWAYS reference specific timestamps when mentioning video content (format: [MM:SS])" +
      "\n3. If multiple relevant moments exist, mention all of them with timestamps" +
      "\n4. If you cannot find the answer in the context, politely say so" +
      "\n5. Use phrases like 'At [MM:SS], they discuss...' or 'Around [MM:SS], you'll find...'" +
      `\n6. ${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en} ` +
      "Only use a different language if the user explicitly asks." +
      "\n\nExample: 'At [12:34], Sam explains that AI will transform education. He also mentions this topic again at [45:12] when discussing...'";


    const userMessage = `Context from video transcript:\n\n${context}\n\nQuestion: ${question}`;

    let answer = "";

    if (aiProvider === "groq") {
      // Groq API (FREE & FAST - 18x faster than GPT)
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
        temperature: 0.7,
        max_tokens: 500,
      });

      answer = completion.choices[0]?.message?.content || "";
    } else if (aiProvider === "claude") {
      // Anthropic Claude API
      const completion = await anthropic.messages.create({
        model: aiModel,
        max_tokens: 500,
        system: systemPrompt || defaultSystemPrompt,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
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
        temperature: 0.7,
        max_tokens: 500,
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
