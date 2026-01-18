"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Search,
  Zap,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  Globe,
  Sparkles,
  GraduationCap,
  BookOpen,
  Microscope,
  Briefcase,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnimatedDemo } from "@/components/animated-demo";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <SiteHeader />

      {/* Interactive Demo Section - Full Viewport */}
      <section className="flex items-center relative">
        <AnimatedDemo />
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-black text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Video Knowledge Base</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight mb-6 sm:mb-8 leading-tight">
            You Can't <span className="underline decoration-red-600 decoration-4">Ctrl+F</span> Videos.
            <br />
            <span className="text-gray-600">Until Now.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Turn long, unsearchable videos into a knowledge base you can talk to.
          </p>

          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 sm:mb-12">
            Get exact answers from hour-long videos in seconds — with timestamps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2">
            <Link href="/auth/signin" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 text-lg px-8 py-6 h-14 shadow-lg active:scale-95 transition-transform">
                Try Searching a Video
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-black border-gray-300 text-lg px-8 py-6 h-14 hover:bg-gray-50 active:scale-95 transition-transform">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-16 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
              Stop Scrubbing.{" "}
              <br className="sm:hidden" />
              Start Searching.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              QueryTube makes video content<br className="sm:hidden" /> as searchable as text documents
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <Card className="border-gray-200 hover:border-black hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                  Natural Language Q&A
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Ask questions in plain English. Get accurate answers with exact timestamps from the video.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-gray-200 hover:border-black hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                  Timestamp Precision
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Every answer includes clickable timestamps. Jump directly to relevant moments.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-gray-200 hover:border-black hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                  Instant Processing
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Automatic transcription, chunking, and vectorization. Ready to query in minutes.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-gray-200 hover:border-black hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                  Semantic Search
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Not just keyword matching. AI understands context and meaning across your entire library.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-gray-200 hover:border-black hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                  Multi-Language
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Full support for English, French, and Hindi. More languages coming soon.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-gray-200 hover:border-black hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-3">
                  Source Grounding
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Every answer shows its sources. See exactly which video segments were used.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
              Three Steps to Searchable Video
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">Upload</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Paste a YouTube URL. We handle transcription, chunking, and embedding.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">Process</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                AI analyzes the content and builds a searchable knowledge base.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">Ask</h3>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Get instant, timestamped answers to any question about your video.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
              Built for Learners
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Perfect for education, research, and content analysis
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <Card className="border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black">Students</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Find exam answers in 10 seconds instead of rewatching 2 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Jump to exact concept explanations with timestamps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Turn lecture recordings into searchable study guides</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-green-200 hover:shadow-lg transition-all">
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black">Educators</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Answer student questions with exact timestamps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-base leading-relaxed">Turn recorded lectures into searchable resources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Create study guides automatically from video content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Microscope className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-black">Researchers</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Search 50 interviews like one document</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Extract themes and patterns across video archives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Find exact quotes with citations in seconds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-black">Professionals</h3>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Turn training videos into searchable knowledge bases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Find answers in webinars without watching them again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Search conference talks like text documents</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
            Stop Scrubbing. Start Asking.
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Turn any video into a knowledge base in minutes
          </p>
          <p className="text-sm text-gray-500 mb-12">
            Free to try • No credit card required • Start searching in under a minute
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-6">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
