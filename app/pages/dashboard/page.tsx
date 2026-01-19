"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Video,
  Clock,
  Database,
  TrendingUp,
  Plus,
  Play,
  MoreVertical,
  CheckCircle2,
  Loader2,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DashboardStats {
  totalVideos: number;
  totalChunks: number;
  storageUsed: string;
  questionsAnswered: number;
}

interface DashboardVideo {
  id: string;
  title: string;
  url: string | null;
  youtubeId: string | null;
  status: string;
  progress: number;
  duration: string;
  chunks: number;
  uploadedAt: string;
  language: string;
  errorMessage?: string | null;
  transcriptSource?: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "fr" | "hi">("en");
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    totalChunks: 0,
    storageUsed: "0 MB",
    questionsAnswered: 0,
  });
  const [videos, setVideos] = useState<DashboardVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ videoId: string; title: string } | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard");

        // Handle 401 Unauthorized - redirect to sign in
        if (response.status === 401) {
          router.push("/auth/signin?callbackUrl=/pages/dashboard");
          return;
        }

        // Try to parse response as JSON
        let data;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error("[Dashboard] Failed to parse response:", parseError);
          throw new Error("Invalid response from server");
        }

        // Always set stats and videos (API returns fallback data on errors)
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.videos) {
          setVideos(data.videos);
        }

        // Only show error if explicitly provided
        if (!data.success && data.error) {
          setError(data.error);
        } else {
          setError(null);
        }
      } catch (err: any) {
        // Log technical error to console only
        console.error("[Dashboard] Failed to fetch data:", err);

        // Show user-friendly message
        setError("Unable to connect to server. Please check your connection and try again.");

        // Set fallback empty state
        setStats({
          totalVideos: 0,
          totalChunks: 0,
          storageUsed: "0 MB",
          questionsAnswered: 0,
        });
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  // Show delete confirmation modal
  const handleDeleteVideo = (videoId: string, videoTitle: string) => {
    setDeleteConfirm({ videoId, title: videoTitle });
  };

  // Actual delete logic after confirmation
  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const { videoId } = deleteConfirm;
    setDeleting(videoId);
    setDeleteConfirm(null);

    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });

      // Parse response safely
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("Failed to parse delete response:", parseError);
        data = { success: false, error: "Invalid response" };
      }

      if (data.success) {
        // Remove from local state
        setVideos(videos.filter((v) => v.id !== videoId));

        // Clean up localStorage for this video
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`chat-history-${videoId}`);
        }

        // Refresh stats
        const statsResponse = await fetch("/api/dashboard");
        try {
          const statsText = await statsResponse.text();
          const statsData = statsText ? JSON.parse(statsText) : {};
          if (statsData.success) {
            setStats(statsData.stats);
          }
        } catch (parseError) {
          console.error("Failed to parse stats response:", parseError);
        }
      } else {
        console.error("Delete failed:", data.error);
      }
    } catch (err: any) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  };

  const translations = {
    en: {
      overview: "Overview",
      videos: "Videos",
      quickStats: "Quick Stats",
      totalVideos: "Total Videos",
      totalChunks: "Knowledge Chunks",
      storage: "Storage Used",
      questions: "Questions Answered",
      recentVideos: "Recent Videos",
      allVideos: "All Videos",
      title: "Title",
      status: "Status",
      progress: "Progress",
      chunks: "Chunks",
      uploaded: "Uploaded",
      actions: "Actions",
      newVideo: "Create Knowledge Base",
      viewDetails: "View Details",
      delete: "Delete",
      retry: "Retry",
    },
    fr: {
      overview: "Aperçu",
      videos: "Vidéos",
      quickStats: "Statistiques rapides",
      totalVideos: "Total Vidéos",
      totalChunks: "Fragments de connaissance",
      storage: "Stockage utilisé",
      questions: "Questions répondues",
      recentVideos: "Vidéos récentes",
      allVideos: "Toutes les vidéos",
      title: "Titre",
      status: "Statut",
      progress: "Progrès",
      chunks: "Fragments",
      uploaded: "Téléchargé",
      actions: "Actions",
      newVideo: "Créer une base",
      viewDetails: "Voir détails",
      delete: "Supprimer",
      retry: "Réessayer",
    },
    hi: {
      overview: "अवलोकन",
      videos: "वीडियो",
      quickStats: "त्वरित आँकड़े",
      totalVideos: "कुल वीडियो",
      totalChunks: "ज्ञान खंड",
      storage: "उपयोग किया गया भंडारण",
      questions: "उत्तरित प्रश्न",
      recentVideos: "हाल के वीडियो",
      allVideos: "सभी वीडियो",
      title: "शीर्षक",
      status: "स्थिति",
      progress: "प्रगति",
      chunks: "खंड",
      uploaded: "अपलोड किया गया",
      actions: "क्रियाएँ",
      newVideo: "ज्ञान आधार बनाएं",
      viewDetails: "विवरण देखें",
      delete: "हटाएं",
      retry: "पुनः प्रयास करें",
    },
  };

  const t = translations[language];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <PageHeader
        title={t.overview}
        description="Manage your educational video knowledge base"
        icon={LayoutDashboard}
      />

      <div className="p-4 sm:p-6 lg:p-8 pb-8">
        {/* Mobile Page Title - Only on mobile since PageHeader is hidden */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-black">{t.overview}</h1>
          <p className="text-sm text-gray-600 mt-1">Your video knowledge base</p>
        </div>

        {/* Hero Empty State - Only show when no videos */}
        {!loading && videos.length === 0 && (
          <div className="mb-6 sm:mb-8">
            <Card className="border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">
                    Welcome to QueryTube
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Turn any YouTube video into an interactive knowledge base with AI-powered Q&A
                  </p>

                  <Link href="/pages/new?clear=1">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-transform w-full sm:w-auto text-base h-12 sm:h-14 px-8">
                      <Plus className="w-5 h-5 mr-2" />
                      {t.newVideo}
                    </Button>
                  </Link>

                  {/* What Happens Next */}
                  <div className="mt-7 sm:mt-8 pt-6 sm:pt-7 border-t border-gray-200">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                      What Happens Next
                    </p>
                    <div className="grid gap-3 sm:gap-4 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">Add Your Video</p>
                          <p className="text-xs text-gray-600">Paste any YouTube URL</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">AI Processes Content</p>
                          <p className="text-xs text-gray-600">Automatic transcription & analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-medium text-black">Ask Questions</p>
                          <p className="text-xs text-gray-600">Get instant, accurate answers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Signal */}
                  <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Powered by Groq, Mistral AI & Pinecone</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats - Only show when user has videos */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Videos Ready</p>
                    <p className="text-2xl font-bold text-black">
                      {stats.totalVideos}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5">Questions Asked</p>
                    <p className="text-2xl font-bold text-black">
                      {stats.questionsAnswered}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Videos Section */}
        {!loading && videos.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-black">{t.recentVideos}</h2>
                <p className="text-sm text-gray-600">Your knowledge bases</p>
              </div>
              <Link href="/pages/new?clear=1">
                <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">New</span>
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {videos.slice(0, 5).map((video) => (
                <Card key={video.id} className="border-gray-200 hover:border-gray-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {video.youtubeId ? (
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium text-black text-sm line-clamp-2">
                            {video.title}
                          </h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/new?videoId=${video.id}`} className="cursor-pointer">
                                  💬 Chat with Video
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/new?videoId=${video.id}`} className="cursor-pointer">
                                  Edit / Configure
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>{t.viewDetails}</DropdownMenuItem>
                              {video.status === "failed" && (
                                <DropdownMenuItem>{t.retry}</DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteVideo(video.id, video.title)}
                                disabled={deleting === video.id}
                              >
                                {deleting === video.id ? "Deleting..." : t.delete}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {getStatusBadge(video.status)}
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>
                          {video.chunks > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {video.chunks} chunks
                            </Badge>
                          )}
                        </div>

                        {/* Progress Bar (only show if processing) */}
                        {video.status === "processing" && video.progress < 100 && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <Progress value={video.progress} className="flex-1 h-1.5" />
                              <span className="text-xs text-gray-600 font-medium">
                                {video.progress}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Primary Action Button */}
                        {video.status === "completed" && (
                          <Link href={`/new?videoId=${video.id}`}>
                            <Button size="sm" variant="outline" className="mt-2 w-full sm:w-auto text-xs h-8">
                              Start Chat →
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {videos.length > 5 && (
              <div className="mt-4 text-center">
                <Link href="/pages/videos">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View All {videos.length} Videos →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-gray-400" />
            <p className="text-sm text-gray-600">Loading your knowledge bases...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-600" />
              <p className="text-sm text-red-600 font-medium mb-1">Unable to load dashboard</p>
              <p className="text-xs text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>"{deleteConfirm?.title}"</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-gray-600 py-4">
            <p>This will permanently remove:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Video and transcript data</li>
              <li>All vector embeddings from Pinecone</li>
              <li>Q&A analytics history</li>
            </ul>
            <p className="text-red-600 font-medium mt-4">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting === deleteConfirm?.videoId}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting === deleteConfirm?.videoId}
            >
              {deleting === deleteConfirm?.videoId ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full-screen delete loader */}
      {deleting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-red-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2">Deleting Video...</h3>
                <p className="text-sm text-gray-600">Removing video data and vector embeddings from Pinecone.</p>
                <p className="text-xs text-gray-500 mt-2">This may take a few seconds.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
