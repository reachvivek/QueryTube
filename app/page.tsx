"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Youtube,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Always visible */}
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-black">Query</span>
                <span className="text-red-600">Tube</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-black hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Menu Items */}
                  <Link
                    href="/"
                    className="text-lg font-medium text-black hover:text-red-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg font-medium text-black hover:text-red-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-lg font-medium text-black hover:text-red-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/docs"
                    className="text-lg font-medium text-black hover:text-red-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Docs
                  </Link>

                  <div className="h-px bg-gray-200 my-2" />

                  {/* Auth Buttons */}
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-gray-300 text-black">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-100 text-black text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>AI-Powered Video Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight mb-4 sm:mb-6 px-2">
            You Can't <span className="underline decoration-red-600">Ctrl+F</span> Videos.<br className="hidden sm:block" />
            <span className="text-gray-600">Until Now.</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
            Turn long, unsearchable videos into a knowledge base you can talk to.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 px-4">
            <Link href="/auth/signin" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-black text-white hover:bg-gray-800 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                Try Searching a Video
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-black border-gray-300 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Demo Section */}
          <div className="max-w-5xl mx-auto">
            {/* Example Questions Above Demo */}
            <div className="mb-6 text-center">
              <p className="text-sm font-medium text-gray-700 mb-3">Ask anything. Jump to exact moments.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                  "What does Sam Altman say about AI regulation?"
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                  "Where do they discuss AGI timelines?"
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                  "Summarize the key risks mentioned"
                </span>
              </div>
            </div>

            <Card className="border-2 border-gray-200 shadow-2xl">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <Youtube className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400 text-sm">Demo Preview</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Stop Scrubbing. Start Searching.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              QueryTube makes video content as searchable as text documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Natural Language Q&A
                </h3>
                <p className="text-gray-600">
                  Ask questions in plain English. Get accurate answers with exact timestamps from the video.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Timestamp Precision
                </h3>
                <p className="text-gray-600">
                  Every answer includes clickable timestamps. Jump directly to relevant moments.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Instant Processing
                </h3>
                <p className="text-gray-600">
                  Automatic transcription, chunking, and vectorization. Ready to query in minutes.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Semantic Search
                </h3>
                <p className="text-gray-600">
                  Not just keyword matching. AI understands context and meaning across your entire library.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Multi-Language
                </h3>
                <p className="text-gray-600">
                  Full support for English, French, and Hindi. More languages coming soon.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Source Grounding
                </h3>
                <p className="text-gray-600">
                  Every answer shows its sources. See exactly which video segments were used.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Three Steps to Searchable Video
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Upload</h3>
              <p className="text-gray-600">
                Paste a YouTube URL. We handle transcription, chunking, and embedding.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Process</h3>
              <p className="text-gray-600">
                AI analyzes the content and builds a searchable knowledge base.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Ask</h3>
              <p className="text-gray-600">
                Get instant, timestamped answers to any question about your video.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4">
              Built for Learners
            </h2>
            <p className="text-xl text-gray-600">
              Perfect for education, research, and content analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4">🎓 Students</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Review lecture content without rewatching hours of video</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Find specific concepts and definitions instantly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Jump to exact timestamps for exam prep</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4">📚 Educators</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Make your video content more accessible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Answer student questions with precise references</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Share timestamped insights with your class</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4">🔬 Researchers</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Analyze interview and lecture content efficiently</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Extract insights from podcast archives</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Build searchable research libraries</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4">💼 Professionals</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Search through training videos and webinars</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Find specific information in conference talks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <span>Create knowledge bases from video libraries</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
            Stop Scrubbing. Start Asking.
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Turn any video into a knowledge base in minutes
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-6">
              Create Your First Knowledge Base
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                <span className="text-black">Query</span>
                <span className="text-red-600">Tube</span>
              </h1>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">Videos hide knowledge. We unlock it.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-black transition-colors">
                About
              </Link>
              <Link href="/pricing" className="hover:text-black transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="hover:text-black transition-colors">
                Docs
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2026 QueryTube. Built by Vivek Kumar Singh.
          </div>
        </div>
      </footer>
    </div>
  );
}
