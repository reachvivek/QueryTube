"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Documentation
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Everything you need to know about using QueryTube
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Getting Started */}
          <div id="getting-started">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              Getting Started
            </h2>
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-4 text-sm sm:text-base">
                <div>
                  <h3 className="font-bold text-black mb-2">1. Sign in with email</h3>
                  <p className="text-gray-700">
                    Click "Get Started" and enter your email. We'll send you a magic link, no password needed.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">2. Add a YouTube video</h3>
                  <p className="text-gray-700">
                    Paste any YouTube URL. We'll automatically extract the transcript, chunk it, and create searchable embeddings.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">3. Ask questions</h3>
                  <p className="text-gray-700">
                    Type any question about the video. Get instant answers with exact timestamps.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How Q&A Works */}
          <div id="how-it-works">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              How Q&A Works
            </h2>
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-4 text-sm sm:text-base">
                <p className="text-gray-700">
                  QueryTube uses semantic search to find relevant sections of your video and answer questions accurately.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-black">Transcript extraction:</strong>
                      <p className="text-gray-700">
                        We extract the YouTube caption file or use Whisper AI if captions aren't available.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-black">Chunking:</strong>
                      <p className="text-gray-700">
                        The transcript is split into 60-90 second chunks with overlap for context continuity.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-black">Semantic embeddings:</strong>
                      <p className="text-gray-700">
                        Each chunk is converted into a 1024-dimension vector using Mistral AI embeddings.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-black">Vector search:</strong>
                      <p className="text-gray-700">
                        When you ask a question, we find the top 20 most relevant chunks using cosine similarity in Pinecone.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-black">Answer generation:</strong>
                      <p className="text-gray-700">
                        Groq's Llama 3.3 70B model synthesizes the answer using only the retrieved chunks, no hallucinations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timestamps */}
          <div id="timestamps">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              How Timestamps Work
            </h2>
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-4 text-sm sm:text-base">
                <p className="text-gray-700">
                  Every answer includes timestamp citations showing exactly where the information comes from.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 mb-2">
                    Example answer:
                  </p>
                  <p className="text-gray-800">
                    At <span className="font-mono text-sm bg-white px-2 py-1 rounded border border-gray-300">[00:04–00:49]</span>, Phelps explains his training philosophy...
                  </p>
                </div>
                <p className="text-gray-700">
                  Timestamps are formatted as time ranges (start–end) to show the full context, not just a single moment.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Limitations */}
          <div id="limitations">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              Current Limitations
            </h2>
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6 sm:p-8 space-y-4 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black">Video length:</strong>
                    <p className="text-gray-700">
                      Free plan: up to 2 hours. Pro plan: up to 10 hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black">YouTube-only:</strong>
                    <p className="text-gray-700">
                      Currently supports YouTube videos only. Other platforms coming soon.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black">Language support:</strong>
                    <p className="text-gray-700">
                      English, French, and Hindi fully supported. Other languages in beta.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black">Processing time:</strong>
                    <p className="text-gray-700">
                      First-time processing takes 2-5 minutes depending on video length. Subsequent queries are instant.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black">Accuracy:</strong>
                    <p className="text-gray-700">
                      Answers are grounded in the transcript but depend on transcription quality. Poor audio = less accurate answers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Practices */}
          <div id="best-practices">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
              Best Practices
            </h2>
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-4 text-sm sm:text-base">
                <div>
                  <h3 className="font-bold text-black mb-2">Ask specific questions</h3>
                  <p className="text-gray-700">
                    ✅ "What does Sam Altman say about AGI timelines?"
                  </p>
                  <p className="text-gray-500">
                    ❌ "Tell me about AI"
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Use keywords from the video</h3>
                  <p className="text-gray-700">
                    If you remember specific terms or phrases, use them in your question for better results.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2">Follow up for deeper insights</h3>
                  <p className="text-gray-700">
                    QueryTube remembers your conversation. Ask follow-up questions to dig deeper.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-black mb-4">
              Ready to Start?
            </h3>
            <Link href="/auth/signin">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Try QueryTube Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
