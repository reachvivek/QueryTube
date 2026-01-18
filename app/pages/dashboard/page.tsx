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

      <div className="p-4 sm:p-6 lg:p-8 pb-20 sm:pb-8">
        {/* Quick Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{t.totalVideos}</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">
                    {loading ? "..." : stats.totalVideos}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center self-end sm:self-auto">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.totalChunks}</p>
                  <p className="text-2xl font-semibold text-black mt-1">
                    {loading ? "..." : stats.totalChunks}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.storage}</p>
                  <p className="text-2xl font-semibold text-black mt-1">
                    {loading ? "..." : stats.storageUsed}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.questions}</p>
                  <p className="text-2xl font-semibold text-black mt-1">
                    {loading ? "..." : stats.questionsAnswered}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Videos Table */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
            <div className="space-y-1.5">
              <CardTitle className="text-black">{t.recentVideos}</CardTitle>
              <CardDescription>
                Monitor your video processing status and progress
              </CardDescription>
            </div>
            <Link href="/pages/new?clear=1">
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                {t.newVideo}
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">{t.title}</TableHead>
                    <TableHead className="min-w-[100px]">{t.status}</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[120px]">{t.progress}</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead className="hidden lg:table-cell">{t.chunks}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t.uploaded}</TableHead>
                    <TableHead className="text-right min-w-[80px]">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading videos...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-red-500">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                      {error}
                    </TableCell>
                  </TableRow>
                ) : videos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No videos yet. Click "New Video" to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-black">
                              {video.title}
                            </p>
                            <p className="text-xs text-gray-500">{video.url}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(video.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={video.progress} className="w-16 h-2" />
                          <span className="text-xs text-gray-600">
                            {video.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{video.chunks}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {video.uploadedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>

            {videos.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Link href="/pages/videos">
                  <Button variant="outline">{t.allVideos} →</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
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
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting === deleteConfirm?.videoId}
            >
              {deleting === deleteConfirm?.videoId ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
