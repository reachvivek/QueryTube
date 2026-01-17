import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
}

export function LoadingOverlay({
  isLoading,
  message = "Processing...",
  size = "md",
  variant = "default"
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className={`bg-white rounded-lg shadow-2xl flex flex-col items-center gap-4 ${
        variant === "minimal" ? "p-4 min-w-[150px]" : "p-6 min-w-[200px]"
      }`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-700`} />
        {message && (
          <p className={`font-medium text-gray-700 text-center ${
            variant === "minimal" ? "text-xs" : "text-sm"
          }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
