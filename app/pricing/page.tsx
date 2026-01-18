import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PricingPage() {
  return (
    <div className="h-screen bg-white flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Start free, upgrade when you need more, lock in early access pricing now.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-3 gap-4 lg:gap-6">
          {/* Free Plan */}
          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl">Free</CardTitle>
              <CardDescription className="text-sm">
                Try QueryTube
              </CardDescription>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-bold text-black">$0</span>
                <span className="text-gray-500 text-sm ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 mb-4 flex-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">3 videos/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Unlimited questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Timestamp answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Multi-language support</span>
                </li>
              </ul>
              <Link href="/auth/signin" className="block mt-auto">
                <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 text-sm">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">No credit card required</p>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-black relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 bg-black text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl">Pro</CardTitle>
              <CardDescription className="text-sm">
                For power users
              </CardDescription>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-bold text-black">$9</span>
                <span className="text-gray-500 text-sm ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 mb-4 flex-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Unlimited videos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Unlimited questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">2x faster processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Priority support</span>
                </li>
              </ul>
              <Link href="/auth/signin" className="block mt-auto">
                <Button className="w-full bg-black text-white hover:bg-gray-800 text-sm">
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">7-day free trial</p>
            </CardContent>
          </Card>

          {/* Teams Plan */}
          <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl sm:text-2xl">Teams</CardTitle>
              <CardDescription className="text-sm">
                For organizations
              </CardDescription>
              <div className="mt-3">
                <span className="text-3xl sm:text-4xl font-bold text-black">$29</span>
                <span className="text-gray-500 text-sm ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-2 mb-4 flex-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Shared knowledge bases</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Team collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">Admin controls</span>
                </li>
              </ul>
              <Button variant="outline" disabled className="w-full text-gray-500 text-sm mt-auto">
                Coming Soon
              </Button>
              <p className="text-xs text-center text-gray-500 mt-3">Available Q2 2026</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
