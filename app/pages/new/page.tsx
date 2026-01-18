"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Database,
  MessageSquare,
  FileAudio,
  Languages,
  CheckCircle2,
  Loader2,
  Code,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Video,
  Clock,
  User,
  HardDrive,
  Play,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
} from "lucide-react";

type Step = "upload" | "process" | "knowledge" | "configure" | "deploy";

interface VideoInfo {
  id: string;
  videoId?: string;
  title: string;
  duration: number;
  durationFormatted: string;
  thumbnail: string;
  uploader: string;
  description: string;
  estimatedSizeMB: number;
  url: string;
  summary?: string;
}

const translations = {
  en: {
    newVideo: "Create Knowledge Base",
    newVideoDesc: "Turn a video into a searchable, AI-powered knowledge base",
    steps: ["Upload", "Analyze", "Customize", "Ready", "Share"],
  },
  fr: {
    newVideo: "Créer une base de connaissances",
    newVideoDesc: "Transformez une vidéo en base de connaissances IA consultable",
    steps: ["Télécharger", "Analyser", "Personnaliser", "Prêt", "Partager"],
  },
  hi: {
    newVideo: "ज्ञान आधार बनाएं",
    newVideoDesc: "वीडियो को खोजने योग्य AI ज्ञान आधार में बदलें",
    steps: ["अपलोड", "विश्लेषण", "अनुकूलन", "तैयार", "साझा करें"],
  },
};

function NewVideoContent() {
  const searchParams = useSearchParams();
  const editVideoId = searchParams?.get("videoId");

  // Initialize language from localStorage or default to English
  const [language, setLanguage] = useState<"en" | "fr" | "hi">(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('querytube-language');
      const lang = (saved as "en" | "fr" | "hi") || "en";
      return lang;
    }
    return "en";
  });

  // Save language preference whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('querytube-language', language);
    }
  }, [language]);

  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Step 2: Processing state
  const [videoId, setVideoId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("idle");
  const [transcriptData, setTranscriptData] = useState<any>(null);
  const [transcriptSource, setTranscriptSource] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [showSessionBanner, setShowSessionBanner] = useState(false);

  // Ref to prevent duplicate processing
  const isProcessingRef = useRef(false);
  const forceReprocessRef = useRef(false);

  // Step 3: Vector DB state
  const [isUploadingVectors, setIsUploadingVectors] = useState(false);
  const [vectorUploadProgress, setVectorUploadProgress] = useState(0);
  const [vectorUploadStatus, setVectorUploadStatus] = useState<string>("idle");
  const [vectorsUploaded, setVectorsUploaded] = useState(false);
  const [isImprovingTranscript, setIsImprovingTranscript] = useState(false);
  const [transcriptImproved, setTranscriptImproved] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);

  // Step 4: Chat/QA state
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("groq");
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);

  // Chat ref for auto-scroll
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "info" | "error" | "warning" | "success";
    title: string;
    description?: string;
    content?: React.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
  }>({
    isOpen: false,
    type: "info",
    title: "",
  });

  const showModal = (props: Omit<typeof modalState, "isOpen">) => {
    setModalState({ ...props, isOpen: true });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Global loading state
  const [globalLoading, setGlobalLoading] = useState({
    isLoading: false,
    message: "Processing..."
  });

  const showLoading = (message = "Processing...") => {
    setGlobalLoading({ isLoading: true, message });
  };

  const hideLoading = () => {
    setGlobalLoading({ isLoading: false, message: "" });
  };

  // Helper function to render message content with clickable timestamps
  const renderMessageWithTimestamps = (content: string, role: string) => {
    // Regex to match timestamps like 12:34 or 1:23:45
    const timestampRegex = /(\d{1,2}:\d{2}(?::\d{2})?)/g;
    const parts = content.split(timestampRegex);

    return parts.map((part, index) => {
      // Check if this part is a timestamp
      if (part.match(timestampRegex) && videoInfo?.videoId) {
        const timeInSeconds = part.split(':').reverse().reduce((acc, time, i) => acc + parseInt(time) * Math.pow(60, i), 0);
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoInfo.videoId}&t=${timeInSeconds}s`;

        return (
          <a
            key={index}
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium mx-1 ${
              role === 'user'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
            onClick={(e) => {
              e.preventDefault();
              window.open(youtubeUrl, '_blank');
              toast.success(`Opened video at ${part}`);
            }}
          >
            ⏱ {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const t = translations[language];

  // Load existing video if videoId is in URL (edit mode)
  useEffect(() => {
    async function loadExistingVideo() {
      if (!editVideoId) return;

      try {
        const response = await fetch(`/api/videos/${editVideoId}`);
        const data = await response.json();

        if (data.success && data.video) {
          const video = data.video;

          // Set all video data
          setIsEditMode(true);
          setVideoId(video.id);
          setYoutubeUrl(video.youtubeUrl || "");

          // Create videoInfo object
          setVideoInfo({
            id: video.youtubeId || "",
            title: video.title,
            duration: video.duration,
            durationFormatted: video.durationFormatted,
            thumbnail: video.thumbnail || "",
            uploader: video.uploader || "",
            description: video.description || "",
            estimatedSizeMB: 0,
            url: video.youtubeUrl || "",
          });

          // Load transcript data if available
          if (video.chunks && video.chunks.length > 0) {
            const formattedTranscriptData = {
              success: true,
              transcript: video.transcript || "",
              chunks: video.chunks.map((chunk: any) => ({
                text: chunk.text,
                startTime: chunk.startTime,
                endTime: chunk.endTime,
                chunkIndex: chunk.chunkIndex,
              })),
              source: video.transcriptSource,
              language: video.language,
            };

            setTranscriptData(formattedTranscriptData);
            setTranscriptSource(video.transcriptSource);
            setProcessingStatus("completed");

            // Determine starting step based on video processing state
            if (video.chunks.some((chunk: any) => chunk.vectorId)) {
              // Has embeddings - go directly to chat (Step 4)
              setCurrentStep("configure");
            } else {
              // Has transcript but no embeddings - go to Step 3
              setCurrentStep("knowledge");
            }
          } else {
            // No transcript - start from process step
            setCurrentStep("process");
          }

          // Mark this video as the last active video
          localStorage.setItem("youtube-qa-last-video", video.id);
        }
      } catch (error) {
        console.error("[Edit Mode] Failed to load video:", error);
        showModal({
          type: "error",
          title: "Unable to Load Video",
          description: "Failed to load video data. Please try again from the dashboard.",
        });
      } finally {
        setSessionRestored(true);
      }
    }

    if (editVideoId) {
      loadExistingVideo();
    }
  }, [editVideoId]);

  // Restore session from localStorage on mount (per-video sessions)
  useEffect(() => {
    if (editVideoId) return; // Don't restore from localStorage in edit mode

    try {
      // Get the last active video ID
      const lastVideoId = localStorage.getItem("youtube-qa-last-video");

      if (lastVideoId) {
        // Load that video's session
        const sessionKey = `youtube-qa-session-${lastVideoId}`;
        const savedSession = localStorage.getItem(sessionKey);

        if (savedSession) {
          const session = JSON.parse(savedSession);

          // Ask user if they want to continue or start fresh
          showModal({
            type: "info",
            title: "Resume Your Work?",
            description: `You have an incomplete knowledge base for "${session.videoInfo?.title || 'your video'}".`,
            content: (
              <div className="text-sm space-y-2">
                <p>Would you like to continue where you left off, or start a new one?</p>
              </div>
            ),
            actionLabel: "Continue",
            onAction: () => {
              closeModal();
              showLoading("Restoring your session...");

              setTimeout(() => {
                // Restore state
                if (session.currentStep) setCurrentStep(session.currentStep);
                if (session.youtubeUrl) setYoutubeUrl(session.youtubeUrl);
                if (session.videoInfo) setVideoInfo(session.videoInfo);
                if (session.videoId) setVideoId(session.videoId);
                if (session.processingStatus) setProcessingStatus(session.processingStatus);
                if (session.transcriptData) setTranscriptData(session.transcriptData);
                if (session.transcriptSource) setTranscriptSource(session.transcriptSource);

                setShowSessionBanner(true);
                setSessionRestored(true);
                hideLoading();

                // Auto-hide banner after 8 seconds
                setTimeout(() => {
                  setShowSessionBanner(false);
                }, 8000);
              }, 500);
            },
            onCancel: () => {
              closeModal();
              showLoading("Starting fresh...");

              setTimeout(() => {
                localStorage.removeItem("youtube-qa-last-video");
                localStorage.removeItem(sessionKey);
                setSessionRestored(true);
                hideLoading();
              }, 300);
            },
            showCancel: true,
          });

          // Don't set sessionRestored yet - wait for user choice
          return;
        }
      }
    } catch (error) {
      console.error("[Session] Failed to restore session:", error);
    } finally {
      setSessionRestored(true);
    }
  }, [editVideoId]);

  // Save session to localStorage whenever key state changes (per-video)
  useEffect(() => {
    if (!sessionRestored) return; // Don't save until we've restored first
    if (!videoId) return; // Need videoId to save session

    const session = {
      currentStep,
      youtubeUrl,
      videoInfo,
      videoId,
      processingStatus,
      transcriptData,
      transcriptSource,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save this video's session
      const sessionKey = `youtube-qa-session-${videoId}`;
      localStorage.setItem(sessionKey, JSON.stringify(session));

      // Mark this as the last active video
      localStorage.setItem("youtube-qa-last-video", videoId);
    } catch (error) {
      console.error("[Session] Failed to save session:", error);
    }
  }, [currentStep, videoInfo, videoId, processingStatus, transcriptData, transcriptSource, sessionRestored]);

  // Check if transcript already processed when navigating to knowledge step
  useEffect(() => {
    if (currentStep !== "knowledge" || !videoId) return;

    const checkTranscriptStatus = async () => {
      try {
        const response = await fetch(`/api/videos/${videoId}`);
        if (response.ok) {
          const data = await response.json();
          const video = data.video;

          if (video && video.chunks && video.chunks.length > 0) {
            // Check if chunks have vectorId (already processed)
            const hasVectorIds = video.chunks.some((chunk: any) => chunk.vectorId);

            if (hasVectorIds) {
              setVectorsUploaded(true);
              setVectorUploadStatus("completed");
              setVectorUploadProgress(100);
            } else {
              setVectorsUploaded(false);
              setVectorUploadStatus("idle");
            }
          }
        }
      } catch (error) {
        console.error("[Knowledge Step] Failed to check transcript status:", error);
      }
    };

    checkTranscriptStatus();
  }, [currentStep, videoId]);

  // Function to clear session for current video
  const clearSession = () => {
    try {
      if (videoId) {
        const sessionKey = `youtube-qa-session-${videoId}`;
        localStorage.removeItem(sessionKey);
      }
      localStorage.removeItem("youtube-qa-last-video");
    } catch (error) {
      console.error("[Session] Failed to clear session:", error);
    }
  };

  const steps: { id: Step; label: string; number: number }[] = [
    { id: "upload", label: t.steps[0], number: 1 },
    { id: "process", label: t.steps[1], number: 2 },
    { id: "knowledge", label: t.steps[2], number: 3 },
    { id: "configure", label: t.steps[3], number: 4 },
    { id: "deploy", label: t.steps[4], number: 5 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Debounced URL validation with real-time feedback
  useEffect(() => {
    const validateUrl = async () => {
      if (!youtubeUrl.trim()) {
        setVideoInfo(null);
        setValidationError(null);
        return;
      }

      // Basic format check first
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      if (!youtubeRegex.test(youtubeUrl)) {
        setValidationError("Please enter a valid YouTube URL (e.g., youtube.com/watch?v=...)");
        setVideoInfo(null);
        return;
      }

      setIsValidating(true);
      setValidationError(null);

      try {
        const response = await fetch(
          `/api/validate-video?url=${encodeURIComponent(youtubeUrl)}`
        );
        const data = await response.json();

        if (data.valid) {
          setVideoInfo(data.video);
          setValidationError(null);
        } else {
          setVideoInfo(null);
          setValidationError(data.error || "Invalid YouTube URL");
        }
      } catch (error) {
        console.error("Validation error:", error);
        setValidationError("Failed to validate URL. Please check your connection and try again.");
        setVideoInfo(null);
      } finally {
        setIsValidating(false);
      }
    };

    // Debounce: wait 800ms after user stops typing
    const debounceTimer = setTimeout(validateUrl, 800);
    return () => clearTimeout(debounceTimer);
  }, [youtubeUrl]);

  const canProceed = videoInfo !== null && !isValidating && !validationError;

  // Process the video (Step 2)
  const processVideo = async () => {
    if (!videoInfo) return;

    // Prevent duplicate processing
    if (isProcessingRef.current) {
      return;
    }

    try {
      isProcessingRef.current = true;
      setIsProcessing(true);
      setProcessingError(null);

      // Step 1: Save video to database
      setProcessingStatus("saving");
      const createVideoResponse = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl,
          youtubeId: videoInfo.id,
          title: videoInfo.title,
          description: videoInfo.description,
          duration: videoInfo.duration,
          durationFormatted: videoInfo.durationFormatted,
          thumbnail: videoInfo.thumbnail,
          uploader: videoInfo.uploader,
          language: "en", // Default to English, will be updated after transcript is processed
        }),
      });

      const createResult = await createVideoResponse.json();

      if (!createResult.success || !createResult.video) {
        throw new Error(createResult.error || "Failed to save video to database");
      }

      const video = createResult.video;
      setVideoId(video.id);

      // Check if video already exists and ask user
      if (createResult.isExisting) {
        setIsProcessing(false);
        setProcessingStatus("idle");

        // Define function to load existing data
        const loadExistingData = async () => {
          try {
            const videoDetailsResponse = await fetch(`/api/videos/${video.id}`);
            const videoDetailsData = await videoDetailsResponse.json();

            if (videoDetailsData.success && videoDetailsData.video) {
              const existingVideo = videoDetailsData.video;

              if (existingVideo.chunks && existingVideo.chunks.length > 0) {
                // Format chunks data for the UI
                const formattedTranscriptData = {
                  success: true,
                  transcript: existingVideo.transcript || "",
                  chunks: existingVideo.chunks.map((chunk: any) => ({
                    text: chunk.text,
                    startTime: chunk.startTime,
                    endTime: chunk.endTime,
                    chunkIndex: chunk.chunkIndex,
                  })),
                  source: existingVideo.transcriptSource,
                  language: existingVideo.language,
                };

                setTranscriptData(formattedTranscriptData);
                setTranscriptSource(existingVideo.transcriptSource);
                setProcessingStatus("completed");
                // Don't auto-navigate - let user review and use retry if needed
                setIsProcessing(false);
                closeModal();
              } else {
                setIsProcessing(false);
                showModal({
                  type: 'warning',
                  title: 'No Transcript Found',
                  description: 'No transcript chunks found for this video.',
                  content: (
                    <div className="text-sm">
                      <p>The video exists but has no transcript. Would you like to process it now?</p>
                    </div>
                  ),
                  actionLabel: 'Process Now',
                  onAction: reprocessVideo,
                  showCancel: true,
                });
              }
            } else {
              console.error("[LoadExisting] Failed to fetch video details");
              setIsProcessing(false);
              showModal({
                type: 'error',
                title: 'Failed to Load',
                description: 'Could not load video details from database.',
              });
            }
          } catch (error) {
            console.error("[LoadExisting] Error:", error);
            setIsProcessing(false);
            showModal({
              type: 'error',
              title: 'Failed to Load',
              description: 'Failed to load existing transcript data. Please try again.',
            });
          }
        };

        // Define function to re-process
        const reprocessVideo = async () => {
          closeModal();
          setIsProcessing(true);
          setProcessingStatus("fetching-captions");

          // Continue with the normal processing flow
          const transcriptResponse = await fetch(
            `/api/process-transcript?videoId=${encodeURIComponent(videoInfo.id)}&url=${encodeURIComponent(youtubeUrl)}`,
            { method: "POST" }
          );

          // Check if response is JSON
          const contentType = transcriptResponse.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await transcriptResponse.text();
            console.error("[ProcessVideo] API returned non-JSON response:", textResponse.slice(0, 200));
            throw new Error("API returned an error. Please check server logs.");
          }

          const transcriptResult = await transcriptResponse.json();

          if (transcriptResult.success) {
            setTranscriptData(transcriptResult);
            setTranscriptSource(transcriptResult.method);
            setProcessingStatus("completed");

            await fetch(`/api/videos/${video.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                transcript: transcriptResult.transcript,
                transcriptSource: transcriptResult.method,
                status: "completed",
              }),
            });

            setCurrentStep("knowledge");
            setIsProcessing(false);
          } else {
            setProcessingStatus("error");
            setProcessingError(transcriptResult.error || "Failed to process transcript");
            setIsProcessing(false);
            showModal({
              type: 'error',
              title: 'Processing Failed',
              description: transcriptResult.error || "Failed to process transcript",
            });
          }
        };

        // Show modal based on video status
        // Skip existing video check if user clicked Retry
        if (!forceReprocessRef.current && video.status === "completed") {
          // Auto-load existing data instead of asking
          await loadExistingData();
          isProcessingRef.current = false;
          return;
        } else if (!forceReprocessRef.current && (video.status === "pending" || video.status === "processing")) {
          showModal({
            type: 'info',
            title: `Video is ${video.status}`,
            description: `This video is currently in "${video.status}" status.`,
            content: (
              <div className="text-sm">
                <p>You can re-process it to update the transcript, or check back later.</p>
              </div>
            ),
            actionLabel: 'Re-process',
            onAction: reprocessVideo,
            showCancel: true,
          });
        } else if (!forceReprocessRef.current && video.status === "failed") {
          showModal({
            type: 'error',
            title: 'Previous Processing Failed',
            description: 'This video processing failed previously.',
            content: (
              <div className="text-sm">
                <p>Would you like to try processing it again?</p>
              </div>
            ),
            actionLabel: 'Re-process',
            onAction: reprocessVideo,
            showCancel: true,
          });
          isProcessingRef.current = false;
          return;
        }

        // If forceReprocessRef is true, continue with re-processing
        if (forceReprocessRef.current) {
          forceReprocessRef.current = false; // Reset the flag
        } else if (createResult.isExisting) {
          // Video exists but not in completed/pending/failed status, return early
          isProcessingRef.current = false;
          return;
        }
      }

      // Step 2: Process transcript with automatic fallback (captions → Whisper)
      setProcessingStatus("fetching-captions");

      const transcriptResponse = await fetch(
        `/api/process-transcript?videoId=${encodeURIComponent(videoInfo.id)}&url=${encodeURIComponent(youtubeUrl)}`,
        { method: "POST" }
      );

      // Check if response is JSON
      const contentType = transcriptResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await transcriptResponse.text();
        console.error("[ProcessVideo] API returned non-JSON response:", textResponse.slice(0, 200));
        throw new Error("API returned an error. Please check server logs.");
      }

      const transcriptResult = await transcriptResponse.json();

      if (transcriptResult.success) {
        // Success! We got the transcript (either from captions or Whisper)
        setTranscriptData(transcriptResult);
        setTranscriptSource(transcriptResult.method);
        setProcessingStatus("completed");

        // Update video in database with transcript AND save chunks
        await fetch(`/api/videos/${video.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: transcriptResult.transcript,
            transcriptSource: transcriptResult.method,
            language: transcriptResult.language,
            status: "completed",
            processedAt: new Date().toISOString(),
            chunks: transcriptResult.chunks, // Save chunks to DB
          }),
        });
      } else {
        // Both methods failed
        setProcessingStatus("error");
        const errorMsg = transcriptResult.error || "Failed to extract transcript";
        setProcessingError(errorMsg);

        console.error("Transcript processing failed:", errorMsg);

        // Update video status to failed
        await fetch(`/api/videos/${video.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "failed",
            errorMessage: errorMsg,
          }),
        });
      }
    } catch (error: any) {
      console.error("Processing error:", error);
      setProcessingError(error.message || "Failed to process video");
      setProcessingStatus("error");
    } finally {
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  };

  // Improve transcript quality (Step 3 - Optional)
  const improveTranscript = async () => {
    if (!transcriptData || !transcriptData.chunks) {
      showModal({
        type: "error",
        title: "No Transcript Available",
        description: "Please complete Step 2 first to extract the transcript.",
      });
      return;
    }

    const estimatedTime = Math.ceil(transcriptData.chunks.length / 3); // Rough estimate: 3 large chunks per minute

    // Show confirmation modal
    const confirmed = await new Promise<boolean>((resolve) => {
      showModal({
        type: "warning",
        title: "Improve Transcript Quality",
        description: "Fix grammar, spelling, and punctuation errors in the transcript.",
        content: (
          <div className="space-y-2 text-sm">
            <p>• {transcriptData.chunks.length} segments to process</p>
            <p>• Estimated time: ~{estimatedTime} minute{estimatedTime > 1 ? 's' : ''}</p>
            <p className="text-orange-600 mt-3">This will incur additional processing costs.</p>
          </div>
        ),
        actionLabel: "Continue",
        onAction: () => resolve(true),
        showCancel: true,
      });
    });

    if (!confirmed) return;

    try {
      setIsImprovingTranscript(true);

      // Process chunks in batches for better performance
      const batchSize = 10;
      const improvedChunks = [...transcriptData.chunks];

      for (let i = 0; i < improvedChunks.length; i += batchSize) {
        const batch = improvedChunks.slice(i, i + batchSize);
        const batchTexts = batch.map(c => c.text).join("\n\n");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Fix grammar, spelling, and punctuation errors in the transcript. Maintain the original meaning and structure. Return only the corrected text, preserving line breaks."
              },
              {
                role: "user",
                content: batchTexts
              }
            ],
            temperature: 0.3,
          })
        });

        if (!response.ok) {
          throw new Error("Failed to improve transcript batch");
        }

        const data = await response.json();
        const correctedText = data.choices[0]?.message?.content || "";
        const correctedLines = correctedText.split("\n\n");

        // Update chunks with corrected text
        correctedLines.forEach((line: string, idx: number) => {
          if (batch[idx] && line.trim()) {
            improvedChunks[i + idx].text = line.trim();
          }
        });
      }

      // Update transcript data
      setTranscriptData({
        ...transcriptData,
        chunks: improvedChunks,
        transcript: improvedChunks.map(c => c.text).join(" "),
      });

      setTranscriptImproved(true);
      showModal({
        type: "success",
        title: "Transcript Improved",
        description: "Grammar, spelling, and punctuation have been corrected successfully.",
      });
    } catch (error: any) {
      console.error("[Transcript Improvement] Error:", error);
      showModal({
        type: "error",
        title: "Improvement Failed",
        description: "Unable to improve the transcript. Please try again later.",
      });
    } finally {
      setIsImprovingTranscript(false);
    }
  };

  // Upload transcript to vector database (Step 3)
  const uploadToVectorDB = async () => {
    if (!transcriptData || !videoId || !videoInfo) {
      showModal({
        type: "error",
        title: "Missing Data",
        description: "Cannot process transcript without required data.",
        content: (
          <p className="text-sm">
            Please complete Step 2 (transcript extraction) before attempting to vectorize.
          </p>
        ),
      });
      return;
    }

    try {
      setIsUploadingVectors(true);
      setVectorUploadProgress(0);
      setVectorUploadStatus("generating-embeddings");
      const startTime = Date.now();
      setProcessingStartTime(startTime);

      // Calculate estimated total time based on chunks (roughly 1 second per chunk for embeddings + upload)
      const totalChunks = transcriptData.chunks?.length || 0;
      const estimatedTotalSeconds = Math.max(20, totalChunks * 1.2);

      // Simulate progress during embedding generation (takes ~30 seconds)
      const progressInterval = setInterval(() => {
        setVectorUploadProgress((prev) => {
          if (prev >= 45) {
            clearInterval(progressInterval);
            return 45;
          }
          const newProgress = prev + 3;
          const elapsed = (Date.now() - startTime) / 1000;
          const remaining = Math.max(0, estimatedTotalSeconds - elapsed);
          setEstimatedTimeRemaining(remaining);
          return newProgress;
        });
      }, 2000);

      // Step 1: Generate embeddings
      const embedResponse = await fetch("/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chunks: transcriptData.chunks,
          model: "text-embedding-3-small",
        }),
      });

      clearInterval(progressInterval);
      const embedResult = await embedResponse.json();

      if (!embedResult.success) {
        throw new Error(embedResult.error || "Failed to generate embeddings");
      }

      setVectorUploadProgress(50);
      setVectorUploadStatus("uploading-vectors");

      // Simulate progress during Pinecone upload (takes ~8 seconds)
      const uploadProgressInterval = setInterval(() => {
        setVectorUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(uploadProgressInterval);
            return 95;
          }
          const newProgress = prev + 5;
          const elapsed = (Date.now() - startTime) / 1000;
          const remaining = Math.max(0, estimatedTotalSeconds - elapsed);
          setEstimatedTimeRemaining(remaining);
          return newProgress;
        });
      }, 1000);

      // Step 2: Upload to Pinecone
      const uploadResponse = await fetch("/api/upload-vectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          chunks: transcriptData.chunks,
          embeddings: embedResult.embeddings,
          embeddingProvider: embedResult.provider || 'mistral',
          metadata: {
            title: videoInfo.title,
            youtubeUrl: youtubeUrl,
            language: transcriptData.language || "en",
            uploader: videoInfo.uploader,
          },
        }),
      });

      clearInterval(uploadProgressInterval);

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload vectors");
      }

      setVectorUploadProgress(100);
      setVectorUploadStatus("completed");
      setVectorsUploaded(true);
      setEstimatedTimeRemaining(null);

      // Update videoInfo with generated summary
      if (uploadResult.summary && videoInfo) {
        setVideoInfo({
          ...videoInfo,
          summary: uploadResult.summary,
        });
      }

      // Update video status to completed
      await fetch(`/api/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
        }),
      });

    } catch (error: any) {
      console.error("[Vector Upload] Error:", error);
      setVectorUploadStatus("error");

      // Parse error message to provide better UI feedback
      const errorMessage = error.message || "Unknown error occurred";
      const isQuotaError = errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("insufficient_quota");
      const isRateLimitError = errorMessage.includes("rate_limit");
      const isAuthError = errorMessage.includes("401") || errorMessage.includes("authentication") || errorMessage.includes("API key");

      // Show simple error message
      showModal({
        type: "error",
        title: "Processing Failed",
        description: "Unable to process the video.",
        content: (
          <div className="space-y-3 text-sm">
            <p>Please try again later.</p>
          </div>
        ),
      });
    } finally {
      setIsUploadingVectors(false);
    }
  };

  // Handle Q&A question (Step 4)
  const handleAskQuestion = async () => {
    if (!currentQuestion.trim() || !videoId) return;

    const question = currentQuestion.trim();
    setCurrentQuestion("");
    setIsAnswering(true);

    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const response = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          videoId,
          systemPrompt,
          model: selectedModel,
          provider: selectedProvider,
          language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add assistant response
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${data.error || "Failed to get answer"}`,
          },
        ]);
      }
    } catch (error: any) {
      console.error("[Q&A] Error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message || "Failed to process question"}`,
        },
      ]);
    } finally {
      setIsAnswering(false);
    }
  };

  // Start processing when entering Step 2
  useEffect(() => {
    if (currentStep === "process" && videoInfo && !transcriptData && processingStatus === "idle" && !isProcessingRef.current) {
      processVideo();
    }
  }, [currentStep, videoInfo, transcriptData, processingStatus]);

  // Generate summary in Step 4 if missing
  useEffect(() => {
    const generateSummaryIfNeeded = async () => {
      // Only run in configure step with videoId but no summary
      if (currentStep !== "configure" || !videoId || videoInfo?.summary) {
        return;
      }

      try {
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId }),
        });

        const data = await response.json();

        if (data.success && data.summary) {
          // Update videoInfo with generated summary
          setVideoInfo((prev) => prev ? { ...prev, summary: data.summary } : null);
        } else if (data.error?.includes('No embeddings found')) {
          // No embeddings available, redirect to Step 3
          showModal({
            type: 'warning',
            title: 'Embeddings Required',
            description: 'Please complete Step 3 (Vectorize) first to generate embeddings.',
            actionLabel: 'Go to Step 3',
            onAction: () => {
              setCurrentStep('knowledge');
              closeModal();
            },
          });
        } else if (data.error?.includes('No transcript chunks')) {
          // No transcript available, redirect to Step 2
          showModal({
            type: 'warning',
            title: 'Transcript Required',
            description: 'Please complete Step 2 (Process) first to generate transcript.',
            actionLabel: 'Go to Step 2',
            onAction: () => {
              setCurrentStep('process');
              closeModal();
            },
          });
        }
      } catch (error) {
        console.error('[Step 4] Failed to generate summary:', error);
        // Don't block the UI if summary generation fails
      }
    };

    generateSummaryIfNeeded();
  }, [currentStep, videoId, videoInfo?.summary]);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Load chat history from localStorage
  useEffect(() => {
    if (!videoId) return;

    const savedMessages = localStorage.getItem(`chat-history-${videoId}`);
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages);
        setChatMessages(messages);
      } catch (error) {
        console.error("[Chat] Failed to load message history:", error);
      }
    }
  }, [videoId]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (!videoId || chatMessages.length === 0) return;

    localStorage.setItem(`chat-history-${videoId}`, JSON.stringify(chatMessages));
  }, [chatMessages, videoId]);

  // Auto-focus question input when on configure step
  useEffect(() => {
    if (currentStep === "configure" && questionInputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 100);
    }
  }, [currentStep]);

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      {/* Page Header */}
      <PageHeader
        title={t.newVideo}
        description={t.newVideoDesc}
        icon={Upload}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Session Info & Reset */}
        {showSessionBanner && currentStep !== "upload" && videoInfo && (
          <Alert className="mb-6 bg-blue-50 border-blue-200 relative">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <AlertDescription className="pr-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-900">
                  Continuing: <strong>{videoInfo.title}</strong>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSessionBanner(false)}
                  className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-blue-100"
                >
                  <X className="h-4 w-4 text-blue-600" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      index <= currentStepIndex
                        ? "bg-black text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium transition-colors ${
                      index <= currentStepIndex ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                      index < currentStepIndex ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto">
          {/* Step 1: Upload & Validate */}
          {currentStep === "upload" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Source
                </CardTitle>
                <CardDescription>
                  Enter a YouTube URL to validate and preview the video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* YouTube URL Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    YouTube URL <span className="text-red-500">*</span>
                    {isEditMode && (
                      <span className="ml-2 text-xs text-gray-500 font-normal">(Editing Mode - URL locked)</span>
                    )}
                  </label>
                  <div className="relative">
                    <Input
                      type="url"
                      placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      disabled={isEditMode}
                      className={`pr-10 transition-all ${
                        isEditMode
                          ? "bg-gray-100 cursor-not-allowed"
                          : validationError
                          ? "border-red-500 focus:ring-red-500"
                          : videoInfo
                          ? "border-green-500 focus:ring-green-500"
                          : "border-gray-300"
                      }`}
                    />
                    {/* Status Icon */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidating && (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      )}
                      {videoInfo && !isValidating && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                      {validationError && !isValidating && youtubeUrl && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </div>

                  {/* Validation Error */}
                  {validationError && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-900 text-sm">
                        {validationError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Validating State */}
                  {isValidating && (
                    <p className="text-sm text-blue-600 flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Validating video...
                    </p>
                  )}
                </div>

                {/* Video Preview Card */}
                {videoInfo && (
                  <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertDescription>
                      <div className="flex gap-4 mt-2">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title}
                            className="w-48 h-28 object-cover rounded-lg border border-green-300 shadow-sm"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                            </div>
                          </div>
                        </div>

                        {/* Video Metadata */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-semibold text-black text-sm line-clamp-2 leading-snug">
                              {videoInfo.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-3 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-700">
                              <Clock className="w-3.5 h-3.5 text-green-600" />
                              <span className="font-medium">{videoInfo.durationFormatted}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-700">
                              <User className="w-3.5 h-3.5 text-green-600" />
                              <span className="font-medium">{videoInfo.uploader}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-700">
                              <HardDrive className="w-3.5 h-3.5 text-green-600" />
                              <span className="font-medium">~{videoInfo.estimatedSizeMB} MB</span>
                            </div>
                          </div>

                          <Badge className="bg-green-600 text-white hover:bg-green-700">
                            ✓ Valid & Ready to Process
                          </Badge>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Separator />

                {/* File Upload Alternative */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    Or Upload Audio/Video File
                  </label>
                  <Input
                    type="file"
                    accept="audio/*,video/*"
                    className="border-gray-300 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Supports: MP3, MP4, WAV, M4A, WebM (Max 25MB)
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canProceed}
                    onClick={() => {
                      setIsProcessing(true);
                      setCurrentStep("process");
                    }}
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        Make Video Searchable
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  {!canProceed && youtubeUrl && !isValidating && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Please enter a valid YouTube URL to continue
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Process */}
          {currentStep === "process" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <FileAudio className="w-5 h-5" />
                  Extract Transcript
                </CardTitle>
                <CardDescription>
                  Getting video transcript from YouTube
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Video Info Summary */}
                {videoInfo && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-black text-sm line-clamp-1">
                          {videoInfo.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {videoInfo.durationFormatted} • {videoInfo.uploader}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Processing Steps */}
                <div className="space-y-4">
                  {/* Step 1: Saving to database */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Saving video to database
                      </span>
                      <Badge className={
                        processingStatus === "saving" || processingStatus === "idle"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }>
                        {processingStatus === "saving" || processingStatus === "idle" ? (
                          <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Processing</>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3 mr-1" />Done</>
                        )}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Step 2: Getting transcript */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        Extracting YouTube captions
                      </span>
                      <Badge className={
                        processingStatus === "fetching-captions"
                          ? "bg-blue-100 text-blue-700"
                          : processingStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : processingStatus === "captions-unavailable" || processingStatus === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }>
                        {processingStatus === "fetching-captions" ? (
                          <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Extracting</>
                        ) : processingStatus === "completed" ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" />Success</>
                        ) : processingStatus === "captions-unavailable" || processingStatus === "error" ? (
                          <><AlertCircle className="w-3 h-3 mr-1" />Failed</>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {transcriptSource === "youtube-captions"
                        ? `✓ Found ${transcriptData?.stats?.totalChunks || 0} caption segments`
                        : transcriptSource === "whisper-transcription"
                        ? `✓ Transcribed ${transcriptData?.stats?.totalChunks || 0} segments using Whisper`
                        : processingStatus === "fetching-captions"
                        ? "Step 1: Trying YouTube captions first (fast)..."
                        : "Attempting to extract transcript"}
                    </p>
                  </div>
                </div>

                {/* Success Message */}
                {processingStatus === "completed" && transcriptData && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-900 text-sm flex items-center justify-between">
                      <span>
                        ✅ Successfully extracted transcript with {transcriptData?.stats?.totalChunks || transcriptData?.chunks?.length || 0} segments!
                        {transcriptData?.language && ` Language: ${transcriptData.language.toUpperCase()}`}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          forceReprocessRef.current = true;
                          setProcessingStatus("idle");
                          setTranscriptData(null);
                          setTranscriptSource(null);
                          setProcessingError(null);
                        }}
                        disabled={isProcessing}
                        className="ml-4 shrink-0 border-green-300 hover:bg-green-100"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Message */}
                {processingError && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-900 text-sm">
                      {processingError}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("upload")}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    onClick={() => setCurrentStep("knowledge")}
                    disabled={processingStatus !== "completed"}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Remaining steps remain the same... */}
          {currentStep === "knowledge" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Make Your Video Searchable
                </CardTitle>
                <CardDescription>Prepare the transcript so you can ask questions about it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transcript Preview - Expandable */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">Transcript Preview</label>
                    {transcriptData && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                        className="text-xs"
                      >
                        {isTranscriptExpanded ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Expand All
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className={`bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all ${
                    isTranscriptExpanded ? 'max-h-[500px]' : 'max-h-40'
                  } overflow-y-auto`}>
                    {transcriptData && transcriptData.chunks ? (
                      <div className="p-4 space-y-2">
                        {transcriptData.chunks.slice(0, isTranscriptExpanded ? undefined : 10).map((chunk: any, index: number) => {
                          const formatTime = (seconds: number) => {
                            const hrs = Math.floor(seconds / 3600);
                            const mins = Math.floor((seconds % 3600) / 60);
                            const secs = seconds % 60;
                            if (hrs > 0) {
                              return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                            }
                            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                          };

                          return (
                            <div key={index} className="text-sm text-gray-700 font-mono leading-relaxed">
                              <span className="text-blue-600 font-semibold">[{formatTime(chunk.startTime)}]</span>{' '}
                              {chunk.text}
                            </div>
                          );
                        })}
                        {!isTranscriptExpanded && transcriptData.chunks.length > 10 && (
                          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                            Showing first 10 of {transcriptData.chunks.length} segments. Click "Expand All" to see more.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        No transcript available. Complete Step 2 to extract transcript.
                      </div>
                    )}
                  </div>

                  {transcriptData && (
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <Badge variant="outline" className="font-mono">
                        {transcriptData.chunks?.length || 0} segments
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        Source: {transcriptSource || transcriptData.source || 'Unknown'}
                      </Badge>
                      {transcriptData.language && (
                        <Badge variant="outline" className="font-mono">
                          Language: {transcriptData.language}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Optional: Improve Transcript Quality */}
                {transcriptData && !transcriptImproved && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-black mb-1">
                          Optional: Fix Spelling & Grammar
                        </h4>
                        <p className="text-xs text-gray-600 mb-3">
                          Automatically fix any spelling or grammar errors in the transcript.
                          Takes ~{Math.ceil(transcriptData.chunks.length / 3)} minute(s). (More credits will be used)
                        </p>
                        <Button
                          onClick={improveTranscript}
                          disabled={isImprovingTranscript || !transcriptData}
                          variant="outline"
                          size="sm"
                          className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                        >
                          {isImprovingTranscript ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                              Fixing errors...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-2" />
                              Fix Errors Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {transcriptImproved && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-900 text-sm">
                      ✅ Transcript cleaned up! All spelling and grammar errors have been fixed.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Vector Upload Section */}
                {!vectorsUploaded ? (
                  <>
                    <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Database className="w-5 h-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-black mb-1">
                            Ready to Process Your Transcript
                          </h4>
                          <p className="text-xs text-gray-600">
                            Click below to process {transcriptData?.chunks?.length || 0} transcript segments.
                            This lets the AI understand your video content so you can ask questions about it.
                          </p>
                        </div>
                      </div>

                      {isUploadingVectors && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">
                              {vectorUploadStatus === "generating-embeddings" && "Analyzing video content..."}
                              {vectorUploadStatus === "uploading-vectors" && "Processing..."}
                              {vectorUploadStatus === "completed" && "Complete!"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">{vectorUploadProgress}%</span>
                              {estimatedTimeRemaining !== null && estimatedTimeRemaining > 0 && (
                                <span className="text-xs text-gray-500">
                                  · ~{Math.ceil(estimatedTimeRemaining)}s
                                </span>
                              )}
                            </div>
                          </div>
                          <Progress value={vectorUploadProgress} className="h-2" />
                          {estimatedTimeRemaining !== null && estimatedTimeRemaining > 0 && (
                            <p className="text-xs text-gray-500 text-center">
                              Estimated time remaining: {Math.ceil(estimatedTimeRemaining)} seconds
                            </p>
                          )}
                        </div>
                      )}

                      {!isUploadingVectors && vectorUploadStatus !== "completed" && (
                        <Button
                          onClick={uploadToVectorDB}
                          disabled={!transcriptData || isUploadingVectors}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Database className="w-4 h-4 mr-2" />
                          Process Transcript for Q&A
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setCurrentStep("process")} className="flex-1">
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-gray-400 text-white cursor-not-allowed"
                        disabled
                      >
                        Process Transcript First
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-900 text-sm">
                        ✅ Your video is ready! Processed {transcriptData?.chunks?.length || 0} segments.
                        You can now ask questions about your video content.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          showModal({
                            type: "warning",
                            title: "Reprocess Transcript?",
                            description: "This will delete existing vectors and reprocess the transcript. This is useful if you want to use a different embedding model or if search quality is poor.",
                            actionLabel: "Reprocess",
                            onAction: () => {
                              closeModal();
                              showLoading("Reprocessing transcript...");
                              setTimeout(() => {
                                setVectorsUploaded(false);
                                setVectorUploadStatus("idle");
                                setVectorUploadProgress(0);
                                hideLoading();
                                toast.success("Ready to reprocess. Click 'Process Transcript for Q&A' button.");
                              }, 500);
                            },
                            showCancel: true,
                          });
                        }}
                        className="w-full text-xs"
                      >
                        Reprocess Transcript
                      </Button>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setCurrentStep("process")} className="flex-1">
                          Back
                        </Button>
                        <Button
                          className="flex-1 bg-black text-white hover:bg-gray-800"
                          onClick={() => setCurrentStep("configure")}
                        >
                          Try Asking Questions
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === "configure" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Test Q&A Agent
                </CardTitle>
                <CardDescription>Configure and test your AI assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Configuration */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Video</label>
                    <Input
                      value={videoInfo?.title || ""}
                      disabled
                      className="bg-gray-100 text-sm"
                    />
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">Ask Questions About Your Video</label>
                    {chatMessages.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const confirmed = await new Promise<boolean>((resolve) => {
                            showModal({
                              type: "warning",
                              title: "Clear Chat History",
                              description: "Are you sure you want to clear all messages?",
                              actionLabel: "Clear",
                              onAction: () => {
                                closeModal();
                                showLoading("Clearing chat history...");
                                setTimeout(() => {
                                  setChatMessages([]);
                                  if (videoId) {
                                    localStorage.removeItem(`chat-history-${videoId}`);
                                  }
                                  hideLoading();
                                  resolve(true);
                                }, 500);
                              },
                              onCancel: () => {
                                closeModal();
                                resolve(false);
                              },
                              showCancel: true,
                            });
                          });
                        }}
                        className="text-xs text-gray-500 hover:text-black"
                      >
                        Clear Chat
                      </Button>
                    )}
                  </div>

                  {/* Messages */}
                  <div ref={chatContainerRef} className="border border-gray-200 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto bg-gray-50">
                    {chatMessages.length === 0 ? (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
                          <p className="text-sm">
                            👋 Hi! I just watched <strong>"{videoInfo?.title || 'your video'}"</strong>.
                            {videoInfo?.summary && (
                              <>
                                {" "}{videoInfo.summary}
                              </>
                            )}
                            <br /><br />
                            Ask me anything!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === 'user'
                                ? 'bg-black text-white'
                                : 'bg-white border border-gray-200'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">
                                {renderMessageWithTimestamps(msg.content, msg.role)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Typing Indicator */}
                        {isAnswering && (
                          <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-lg p-3 bg-white border border-gray-200">
                              <div className="flex items-center gap-1">
                                <div className="flex gap-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span className="text-xs text-gray-500 ml-2">QueryTube is typing...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Suggested Questions */}
                  {chatMessages.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-600">Try these questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "What is this video about?",
                          "What are the key takeaways?",
                          "Summarize the main points"
                        ].map((question, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentQuestion(question)}
                            className="text-xs hover:bg-gray-100"
                            disabled={isAnswering}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      ref={questionInputRef}
                      placeholder="Ask anything about this video..."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && currentQuestion.trim()) {
                          e.preventDefault();
                          handleAskQuestion();
                        }
                      }}
                      disabled={isAnswering}
                      className="flex-1 text-base"
                      aria-label="Ask a question about the video"
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={!currentQuestion.trim() || isAnswering}
                      className="bg-black text-white hover:bg-gray-800 shrink-0"
                      aria-label={isAnswering ? "Sending question" : "Send question"}
                    >
                      {isAnswering ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </>
                      ) : (
                        "Ask"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep("knowledge")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    onClick={() => setCurrentStep("deploy")}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "deploy" && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Deploy & Integration
                </CardTitle>
                <CardDescription>Get your API endpoint and embed code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <AlertDescription>
                    <p className="text-sm font-medium text-green-900">Video Processing Complete!</p>
                    <p className="text-sm text-green-700 mt-1">
                      Your Q&A agent is ready to use.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep("configure")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                    onClick={() => (window.location.href = "/")}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Error/Info Dialog */}
      <Dialog open={modalState.isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {modalState.type === "error" && "❌"}
                {modalState.type === "warning" && "⚠️"}
                {modalState.type === "success" && "✅"}
                {modalState.type === "info" && "ℹ️"}
              </div>
              <div className="flex-1">
                <DialogTitle>{modalState.title}</DialogTitle>
                {modalState.description && (
                  <DialogDescription className="mt-1">
                    {modalState.description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
          {modalState.content && (
            <div className="text-sm text-gray-700">
              {modalState.content}
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-2">
            {modalState.showCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (modalState.onCancel) {
                    modalState.onCancel();
                  } else {
                    closeModal();
                  }
                }}
                className="flex-1 sm:flex-1"
              >
                Start Fresh
              </Button>
            )}
            <Button
              type="button"
              onClick={() => {
                if (modalState.onAction) {
                  modalState.onAction();
                } else {
                  closeModal();
                }
              }}
              className={`flex-1 sm:flex-1 ${
                modalState.type === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : modalState.type === "warning"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : modalState.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-black hover:bg-gray-800"
              } text-white`}
            >
              {modalState.actionLabel || "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Loading Overlay */}
      <LoadingOverlay isLoading={globalLoading.isLoading} message={globalLoading.message} />
    </DashboardLayout>
  );
}

export default function NewVideoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <NewVideoContent />
    </Suspense>
  );
}
