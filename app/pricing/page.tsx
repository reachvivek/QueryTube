"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PricingPage() {
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
            <Link href="/auth/signin">
              <Button className="bg-black text-white hover:bg-gray-800">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Start free. Upgrade when you need more.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Early access pricing—lock in now before rates increase
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Free</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                Perfect for trying out QueryTube
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl sm:text-5xl font-bold text-black">$0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">3 videos per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Unlimited questions per video</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Timestamp-grounded answers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Multi-language support (EN, FR, HI)</span>
                </li>
              </ul>
              <Link href="/auth/signin" className="block">
                <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500">No credit card required</p>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-black relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-black text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Pro</CardTitle>
              <CardDescription className="text-base sm:text-lg">
                For power users and professionals
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl sm:text-5xl font-bold text-black">$19</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base font-medium">Unlimited videos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Unlimited questions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Faster processing (2x speed)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm sm:text-base">Export transcripts & Q&A history</span>
                </li>
              </ul>
              <Link href="/auth/signin" className="block">
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500">7-day free trial</p>
            </CardContent>
          </Card>
        </div>

        {/* Teams (Coming Soon) */}
        <div className="max-w-6xl mx-auto mt-8">
          <Card className="border-2 border-gray-200 bg-gray-50">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">Teams</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Shared knowledge bases, team collaboration, and advanced admin controls
              </p>
              <Button variant="outline" disabled className="text-gray-500">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-black mb-2 text-base sm:text-lg">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Yes. Cancel anytime with one click. No questions asked.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-2 text-base sm:text-lg">What counts as a video?</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Each unique YouTube URL counts as one video. You can ask unlimited questions per video.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-2 text-base sm:text-lg">Is there a limit on video length?</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Free plan supports videos up to 2 hours. Pro plan supports up to 10 hours per video.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-2 text-base sm:text-lg">Do you offer refunds?</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Yes. If you're not satisfied within the first 14 days, we'll refund you—no questions asked.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-black mb-2 text-base sm:text-lg">Will prices increase?</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                This is early access pricing. Lock in now and your rate stays the same—even if we raise prices later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            Start Searching Videos Today
          </h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            No credit card required for free plan
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Get Started Free
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
