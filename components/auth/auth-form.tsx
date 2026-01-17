"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AuthFormProps {
  mode: "signup" | "login";
  onModeSwitch: () => void;
}

export function AuthForm({ mode, onModeSwitch }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      toast.success(
        isSignup
          ? "Account created! Redirecting to dashboard..."
          : "Welcome back! Redirecting to dashboard..."
      );
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  const handleMagicLink = () => {
    setIsMagicLinkLoading(true);
    setTimeout(() => {
      toast.success("Check your email for the magic link!");
      setIsMagicLinkLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Primary CTA: Magic Link */}
      <Button
        type="button"
        className="w-full h-10 bg-black text-white hover:bg-gray-800 text-sm font-medium"
        onClick={handleMagicLink}
        disabled={isMagicLinkLoading}
      >
        {isMagicLinkLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending magic link...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Continue with Magic Link
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">
            Or {isSignup ? "sign up" : "sign in"} with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email Field */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-medium text-black">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-9 h-9 text-sm border-gray-300 focus:border-black focus:ring-black"
              aria-label="Email address"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-black">
              Password
            </Label>
            {!isSignup && (
              <Link href="/forgot-password" className="text-[10px] text-gray-600 hover:text-black">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="pl-9 h-9 text-sm border-gray-300 focus:border-black focus:ring-black"
              aria-label="Password"
            />
          </div>
          {isSignup && (
            <p className="text-[10px] text-gray-500 mt-0.5">
              Must be at least 8 characters
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-black text-white hover:bg-gray-800 text-sm font-medium mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isSignup ? "Creating account..." : "Signing in..."}
            </>
          ) : isSignup ? (
            "Get Started Free"
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Reassurance (Signup only) */}
        {isSignup && (
          <p className="text-[10px] text-gray-500 text-center mt-1.5">
            No credit card required • Cancel anytime
          </p>
        )}
      </form>

      {/* Terms (Signup only) */}
      {isSignup && (
        <p className="text-[10px] text-center text-gray-500 mt-4">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-black underline hover:text-gray-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-black underline hover:text-gray-700">
            Privacy Policy
          </Link>
        </p>
      )}

      {/* Mode Switch Link */}
      <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mt-4">
        <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
        <button
          type="button"
          onClick={onModeSwitch}
          className="text-black font-medium hover:underline"
        >
          {isSignup ? "Sign in" : "Sign up for free"}
        </button>
      </div>

      {/* Trust Badge */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-500">
          {isSignup
            ? "Used for lectures, podcasts, and long-form interviews"
            : "🔒 Secure authentication • No credit card required"}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-2 text-center">
        <p className="text-[10px] text-gray-400">
          © 2026 QueryTube. Built by Vivek Kumar Singh.
        </p>
      </div>
    </>
  );
}
