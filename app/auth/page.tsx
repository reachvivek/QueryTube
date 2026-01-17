"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams?.get("mode");
  const [mode, setMode] = useState<"signup" | "login">(
    modeParam === "login" ? "login" : "signup"
  );

  // Update URL when mode changes
  useEffect(() => {
    const newMode = mode === "login" ? "login" : "signup";
    router.replace(`/auth?mode=${newMode}`, { scroll: false });
  }, [mode, router]);

  const handleModeSwitch = () => {
    setMode((prev) => (prev === "signup" ? "login" : "signup"));
  };

  const isSignup = mode === "signup";

  return (
    <AuthCard
      title={
        isSignup
          ? "Turn videos into searchable knowledge"
          : "Welcome back"
      }
      description={
        isSignup
          ? "Create your free account in seconds"
          : "Sign in to your QueryTube account"
      }
      footer={null}
    >
      <AuthForm mode={mode} onModeSwitch={handleModeSwitch} />
    </AuthCard>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
