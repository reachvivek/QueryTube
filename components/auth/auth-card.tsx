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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <main className="flex-1 flex items-center justify-center px-4 py-6 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <Card className="border-gray-200 shadow-xl shadow-gray-200/50">
            <CardHeader className="space-y-2 pb-4 pt-5 px-4 sm:px-6">
              {/* Back Button */}
              <Link
                href="/landing"
                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors mb-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back
              </Link>

              {/* Logo */}
              <div className="text-center mb-2">
                <Link href="/landing">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight inline-block">
                    <span className="text-black">Query</span>
                    <span className="text-red-600">Tube</span>
                  </h1>
                </Link>
              </div>

              <CardTitle className="text-base sm:text-xl md:text-2xl font-bold text-black text-center leading-tight">
                {title}
              </CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                {description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
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
