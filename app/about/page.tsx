import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-12 sm:pt-24 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black mb-4 sm:mb-6">
            Videos Hide Knowledge.
            <br className="hidden sm:block" />
            <span className="text-gray-600">We Unlock It.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            QueryTube turns long videos into searchable, timestamped answers.
          </p>
        </div>
      </section>

      {/* Why It Exists */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 sm:mb-6 text-center">
            Why QueryTube Exists
          </h2>
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              Long videos are packed with knowledge—but impossible to search.{" "}
              Scrubbing timelines, guessing keywords, and rewatching hours shouldn't be the cost of learning.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-8 text-center">
            What Makes QueryTube Different
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-base sm:text-lg font-bold text-black">Timestamp-Grounded Answers</h3>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base pl-8">
                  Exact moments, not vague summaries.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-base sm:text-lg font-bold text-black">No Hallucinations</h3>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base pl-8">
                  If it's not in the video, we don't invent it.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-base sm:text-lg font-bold text-black">Built for Long-Form Video</h3>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base pl-8">
                  Lectures, podcasts, interviews.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <h3 className="text-base sm:text-lg font-bold text-black">Privacy-First</h3>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base pl-8">
                  Your content stays yours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-6 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Mobile: One-liner */}
          <div className="md:hidden text-center py-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Built for <span className="font-semibold text-black">students</span>, <span className="font-semibold text-black">educators</span>, <span className="font-semibold text-black">researchers</span>, and <span className="font-semibold text-black">professionals</span> who rely on video.
            </p>
          </div>

          {/* Desktop: Full version */}
          <div className="hidden md:block">
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">
            Ready to Search Your First Video?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Free to try. No credit card required.
          </p>

          {/* Founder Quote - Compact */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="https://media.licdn.com/dms/image/v2/D5603AQEmLRuRqk5Kzw/profile-displayphoto-scale_400_400/B56Zpq5t.NKAAg-/0/1762730110840?e=1770249600&v=beta&t=xpccqln0QKusWYB9K1WiQ1V-hmIS8A9HqVv9lwTVfes"
                alt="Vivek Kumar Singh"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 italic leading-relaxed">
              "I built QueryTube because I was tired of knowing the answer was in the video—but not where."
            </p>
            <p className="text-xs text-gray-500 mt-2">
              — Vivek Kumar Singh, Founder
            </p>
          </div>

          <Link href="/auth/signin">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-12 sm:h-auto">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
