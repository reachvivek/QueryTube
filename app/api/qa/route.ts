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
      topK = 10,
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

    console.log(`[QA] Question: "${question}" | Video: ${videoId || "all"} | Provider: ${aiProvider} | Model: ${aiModel} | Language: ${language}`);

    // Check if this is a broad summary question and if video summary exists
    const isBroadQuestion = /what is this (video|about)|summary|summarize|main topic|overview|key points/i.test(question);

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
      topK,
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

    const context = chunks
      .map((chunk, i) => `
Segment ${i + 1} [Timestamp: ${chunk.timestamp}] (Relevance: ${(chunk.score * 100).toFixed(1)}%)
Content: ${chunk.text}
`)
      .join("\n---\n");

    // Step 4: Generate answer using selected AI provider
    const languageInstructions = {
      en: "Respond in English.",
      fr: "Répondez en français.",
      hi: "हिंदी में जवाब दें।"
    };

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
      `\n8. ${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en} ` +
      "Only use a different language if the user explicitly asks." +
      "\n\nGOOD Example: 'This video discusses AI's impact on education. At [12:34], the speaker explains that AI will enable personalized learning paths for each student, adapting to their pace and style. They elaborate on this at [45:12], describing how AI tutors can provide instant feedback and identify knowledge gaps. The key benefits mentioned include...'" +
      "\n\nBAD Example: 'Around [00:05], the speaker mentions something about this topic. You might find more information at [00:01].'" +
      "\n\nRemember: Each segment provided is highly relevant to the question. Use ALL relevant segments to build a complete, detailed answer.";


    const userMessage = `Below are the most relevant segments from the video transcript for answering this question. Each segment includes a timestamp and relevance score.\n\n${context}\n\n---\n\nUser Question: ${question}\n\nProvide a detailed, comprehensive answer using the information from these segments. Cite timestamps for all claims.`;

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
        max_tokens: 1000,
      });

      answer = completion.choices[0]?.message?.content || "";
    } else if (aiProvider === "claude") {
      // Anthropic Claude API
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
