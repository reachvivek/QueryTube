"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Home, Info, DollarSign, FileText, HelpCircle, Sparkles } from "lucide-react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-black">Query</span>
              <span className="text-red-600">Tube</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-black" : "text-gray-700 hover:text-black"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about") ? "text-black" : "text-gray-700 hover:text-black"
              }`}
            >
              About
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive("/pricing") ? "text-black" : "text-gray-700 hover:text-black"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className={`text-sm font-medium transition-colors ${
                isActive("/docs") ? "text-black" : "text-gray-700 hover:text-black"
              }`}
            >
              Docs
            </Link>
            <Link
              href="/faq"
              className={`text-sm font-medium transition-colors ${
                isActive("/faq") ? "text-black" : "text-gray-700 hover:text-black"
              }`}
            >
              FAQ
            </Link>
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
            <SheetContent side="right" className="w-[320px] bg-white p-0 flex flex-col">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              {/* Brand Header */}
              <div className="px-6 pt-8 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold tracking-tight mb-1">
                  <span className="text-black">Query</span>
                  <span className="text-red-600">Tube</span>
                </h2>
                <p className="text-sm text-gray-600 leading-snug">
                  Ask questions. Get timestamped answers.
                </p>
              </div>

              {/* Scrollable Menu Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {/* MAIN Section */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    Main
                  </p>
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border-l-3 ${
                        isActive("/")
                          ? "text-black bg-gray-100 border-l-4 border-black font-medium"
                          : "text-gray-700 hover:text-black hover:bg-gray-50 active:bg-gray-100 border-l-4 border-transparent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base">Home</span>
                    </Link>
                  </nav>
                </div>

                {/* PRODUCT Section */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    Product
                  </p>
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/about"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive("/about")
                          ? "text-black bg-gray-100 border-l-4 border-black font-medium"
                          : "text-gray-700 hover:text-black hover:bg-gray-50 active:bg-gray-100 border-l-4 border-transparent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Info className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base">About</span>
                    </Link>
                    <Link
                      href="/pricing"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive("/pricing")
                          ? "text-black bg-gray-100 border-l-4 border-black font-medium"
                          : "text-gray-700 hover:text-black hover:bg-gray-50 active:bg-gray-100 border-l-4 border-transparent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <DollarSign className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base">Pricing</span>
                    </Link>
                  </nav>
                </div>

                {/* RESOURCES Section */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                    Resources
                  </p>
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/docs"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive("/docs")
                          ? "text-black bg-gray-100 border-l-4 border-black font-medium"
                          : "text-gray-700 hover:text-black hover:bg-gray-50 active:bg-gray-100 border-l-4 border-transparent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base">Docs</span>
                    </Link>
                    <Link
                      href="/faq"
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive("/faq")
                          ? "text-black bg-gray-100 border-l-4 border-black font-medium"
                          : "text-gray-700 hover:text-black hover:bg-gray-50 active:bg-gray-100 border-l-4 border-transparent"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <HelpCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-base">FAQ</span>
                    </Link>
                  </nav>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center gap-2 px-3 py-3 bg-blue-50 rounded-lg mb-4">
                  <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-900 font-medium leading-snug">
                    Trusted for long-form video understanding
                  </p>
                </div>
              </div>

              {/* Sticky CTA Footer */}
              <div className="border-t border-gray-100 p-4 bg-white">
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-xl font-semibold text-base shadow-md mb-3">
                    Get Started Free
                  </Button>
                </Link>
                <div className="text-center">
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Already have an account? <span className="font-medium underline">Sign in</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
