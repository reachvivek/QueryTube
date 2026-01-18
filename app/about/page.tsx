"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-black">Query</span>
                <span className="text-red-600">Tube</span>
              </h1>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium text-black">
                About
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Pricing
              </Link>
              <Link href="/docs" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                Docs
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/auth/signin">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6">
            Videos Hide Knowledge.
            <br className="hidden sm:block" />
            <span className="text-gray-600">We Built This to Unlock It.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            QueryTube turns unsearchable video content into a knowledge base you can talk to—with timestamps.
          </p>
        </div>
      </section>

      {/* Why It Exists */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 text-center">
            Why QueryTube Exists
          </h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-base sm:text-lg">
              Long videos are frustrating. You know the information is in there somewhere, but finding it
              means scrubbing through hours of content or relying on vague chapter markers.
            </p>
            <p className="text-base sm:text-lg">
              Students waste time rewatching entire lectures for a single concept. Researchers can't search
              across interview archives. Professionals forget where that crucial detail was mentioned in a
              3-hour training session.
            </p>
            <p className="text-base sm:text-lg font-medium text-black">
              We built QueryTube to solve this problem: make video content as searchable as text.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8 text-center">
            What Makes QueryTube Different
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-black">Timestamp-Grounded Answers</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Every answer includes exact time ranges. No vague "this is mentioned somewhere in the video."
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-black">No Hallucinations</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Answers come directly from the transcript. If it's not in the video, we tell you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-black">Built for Long-Form Content</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Optimized for 1+ hour videos. Lectures, interviews, podcasts, webinars—we handle it all.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-black">Privacy-Focused</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Your videos and questions stay private. We don't train on your data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8 text-center">
            Who It's For
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-2xl">🎓</span>
              <div>
                <h3 className="font-bold text-black mb-1">Students</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Find exam answers in 10 seconds instead of rewatching 2-hour lectures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="font-bold text-black mb-1">Educators</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Answer student questions with exact timestamps from your lectures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl">🔬</span>
              <div>
                <h3 className="font-bold text-black mb-1">Researchers</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Search 50 interviews like one document. Extract themes and quotes instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-2xl">💼</span>
              <div>
                <h3 className="font-bold text-black mb-1">Professionals</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Turn training videos and conference talks into searchable knowledge bases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Builder Note */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-gray-200 bg-gray-50">
            <CardContent className="p-6 sm:p-8">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                "I built QueryTube because I was frustrated with rewatching the same videos over and over,
                trying to find one specific moment. I knew the information was there, but video scrubbing
                felt like searching through a book by flipping random pages."
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                "QueryTube is what I wished existed: a way to ask a video a question and get an exact answer
                with a timestamp—no summaries, no vague pointers, just the truth."
              </p>
              <p className="text-sm text-gray-500 mt-6">
                — Vivek Kumar Singh, Founder
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Ready to Search Your First Video?
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Free to try. No credit card required.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
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
          <div className="mt-6 text-sm text-gray-500">
            © 2026 QueryTube. Built by Vivek Kumar Singh.
          </div>
        </div>
      </footer>
    </div>
  );
}
