"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
                <Link
                  href="/"
                  className={`text-lg font-medium transition-colors ${
                    isActive("/") ? "text-black" : "text-gray-700 hover:text-red-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`text-lg font-medium transition-colors ${
                    isActive("/about") ? "text-black" : "text-gray-700 hover:text-red-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/pricing"
                  className={`text-lg font-medium transition-colors ${
                    isActive("/pricing") ? "text-black" : "text-gray-700 hover:text-red-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/docs"
                  className={`text-lg font-medium transition-colors ${
                    isActive("/docs") ? "text-black" : "text-gray-700 hover:text-red-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Docs
                </Link>

                <div className="h-px bg-gray-200 my-2" />

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
  );
}
