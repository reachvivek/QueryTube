"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col overflow-hidden">
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <Card className="border-gray-200 shadow-lg sm:shadow-xl shadow-gray-200/30 mx-1 sm:mx-0">
            <CardHeader className="space-y-3 pb-5 pt-6 px-5 sm:px-6">
              {/* Back Button */}
              <Link
                href="/landing"
                className="inline-flex items-center gap-1.5 text-sm sm:text-xs text-gray-600 hover:text-black transition-colors mb-1 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 sm:w-3 sm:h-3" />
                Back
              </Link>

              {/* Logo */}
              <div className="text-center mb-3">
                <Link href="/landing">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight inline-block">
                    <span className="text-black">Query</span>
                    <span className="text-red-600">Tube</span>
                  </h1>
                </Link>
              </div>

              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-black text-center leading-tight px-2">
                {title}
              </CardTitle>
              <CardDescription className="text-center text-sm sm:text-base text-gray-600 px-2">
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-5 sm:pb-6 px-5 sm:px-6">
              {children}

              {/* Footer */}
              {footer}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
