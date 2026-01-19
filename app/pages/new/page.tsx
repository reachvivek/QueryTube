"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * /pages/new - Creates a new draft and redirects to session page
 *
 * Flow:
 * 1. User visits /pages/new
 * 2. Create new draft in database
 * 3. Redirect to /pages/new/[draftId]
 * 4. Draft auto-saves every 2 seconds
 */
export default function NewKnowledgeBasePage() {
  const router = useRouter();

  useEffect(() => {
    async function createNewDraft() {
      try {
        const response = await fetch("/api/drafts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Untitled Knowledge Base",
            currentStep: "upload",
            status: "draft",
            processingStatus: "idle",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create draft");
        }

        const data = await response.json();

        if (data.success && data.draft) {
          // Redirect to session page
          router.push(`/pages/new/${data.draft.id}`);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("[New Draft] Error:", error);
        // Fallback: redirect to dashboard
        router.push("/pages/dashboard");
      }
    }

    createNewDraft();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-black" />
        <p className="text-sm text-gray-600">Creating new knowledge base...</p>
      </div>
    </div>
  );
}
