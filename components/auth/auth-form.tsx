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
        className="w-full h-12 sm:h-11 bg-black text-white hover:bg-gray-800 active:scale-[0.98] text-base sm:text-sm font-medium shadow-sm transition-transform"
        onClick={handleMagicLink}
        disabled={isMagicLinkLoading}
      >
        {isMagicLinkLoading ? (
          <>
            <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 mr-2 animate-spin" />
            Sending magic link...
          </>
        ) : (
          <>
            <Mail className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
            Continue with Email
          </>
        )}
      </Button>

      {/* What happens next */}
      <div className="mt-3 px-1">
        <p className="text-xs text-center text-gray-500 leading-relaxed">
          We'll send you a magic link to sign in.
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          No password required.
        </p>
      </div>

      {/* Divider */}
      <div className="relative my-5 sm:my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-500">
            Or {isSignup ? "sign up" : "sign in"} with password
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-3">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm sm:text-xs font-medium text-black">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 h-11 sm:h-10 text-base sm:text-sm border-gray-300 focus:border-black focus:ring-black rounded-lg"
              aria-label="Email address"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm sm:text-xs font-medium text-black">
              Password
            </Label>
            {!isSignup && (
              <Link href="/forgot-password" className="text-xs text-gray-600 hover:text-black active:text-black touch-manipulation">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="pl-10 h-11 sm:h-10 text-base sm:text-sm border-gray-300 focus:border-black focus:ring-black rounded-lg"
              aria-label="Password"
            />
          </div>
          {isSignup && (
            <p className="text-xs sm:text-[10px] text-gray-500 mt-1">
              Must be at least 8 characters
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 sm:h-11 bg-black text-white hover:bg-gray-800 active:scale-[0.98] text-base sm:text-sm font-medium mt-5 sm:mt-4 shadow-sm transition-transform"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 mr-2 animate-spin" />
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
          <p className="text-xs sm:text-[10px] text-gray-500 text-center mt-2 sm:mt-1.5">
            Free to try • No credit card required
          </p>
        )}
      </form>

      {/* Terms (Signup only) */}
      {isSignup && (
        <p className="text-xs sm:text-[10px] text-center text-gray-500 mt-5 sm:mt-4 leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-black underline hover:text-gray-700 active:text-black touch-manipulation">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-black underline hover:text-gray-700 active:text-black touch-manipulation">
            Privacy Policy
          </Link>
        </p>
      )}

      {/* Mode Switch Link */}
      <div className="flex items-center justify-center gap-1.5 text-sm sm:text-xs text-gray-600 mt-5 sm:mt-4">
        <span>{isSignup ? "Already have an account?" : "Don't have an account?"}</span>
        <button
          type="button"
          onClick={onModeSwitch}
          className="text-black font-medium hover:underline active:text-gray-700 touch-manipulation min-h-[44px] sm:min-h-0 flex items-center"
        >
          {isSignup ? "Sign in" : "Sign up for free"}
        </button>
      </div>

      {/* Trust Badge */}
      <div className="mt-5 sm:mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs sm:text-[10px] text-gray-500 leading-relaxed">
          {isSignup
            ? "Used for lectures, podcasts, and long-form interviews"
            : "🔒 Secure authentication • No credit card required"}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-3 sm:mt-2 text-center">
        <p className="text-xs sm:text-[10px] text-gray-400">
          © 2026 QueryTube
        </p>
      </div>
    </>
  );
}
