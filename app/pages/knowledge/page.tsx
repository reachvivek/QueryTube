"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Database,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface MacroChunk {
  id: string;
  videoId: string;
  videoTitle: string;
  text: string;
  timestamp: string;
  chunkIndex: number;
  vectorId: string;
  language: string;
  uploadedAt: string;
}

interface Stats {
  totalChunks: number;
  totalVideos: number;
  totalVectors: number;
  storageUsed: string;
  lastSync: string | null;
}

interface VideoData {
  stats: Stats;
  macroChunks: MacroChunk[];
  videos: { id: string; title: string; status: string }[];
}

export default function KnowledgeBasePage() {
  const [language, setLanguage] = useState<"en" | "fr" | "hi">("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    en: {
      title: "Videos",
      subtitle: "Your video library and knowledge base",
      search: "Search knowledge base...",
      filter: "Filter",
      refresh: "Refresh",
      export: "Export",
      totalChunks: "Total Chunks",
      totalVectors: "Vectors in DB",
      storageUsed: "Storage Used",
      lastSync: "Last Sync",
      allVideos: "All Videos",
      videoTitle: "Video",
      chunkText: "Content",
      timestamp: "Timestamp",
      actions: "Actions",
      viewDetails: "View Details",
      delete: "Delete",
      reindex: "Re-index",
    },
    fr: {
      title: "Vidéos",
      subtitle: "Votre bibliothèque vidéo et base de connaissances",
      search: "Rechercher dans la base de connaissances...",
      filter: "Filtrer",
      refresh: "Actualiser",
      export: "Exporter",
      totalChunks: "Fragments totaux",
      totalVectors: "Vecteurs en BD",
      storageUsed: "Stockage utilisé",
      lastSync: "Dernière synchro",
      allVideos: "Toutes les vidéos",
      videoTitle: "Vidéo",
      chunkText: "Contenu",
      timestamp: "Horodatage",
      actions: "Actions",
      viewDetails: "Voir détails",
      delete: "Supprimer",
      reindex: "Ré-indexer",
    },
    hi: {
      title: "वीडियो",
      subtitle: "आपकी वीडियो लाइब्रेरी और ज्ञान आधार",
      search: "ज्ञान आधार खोजें...",
      filter: "फ़िल्टर",
      refresh: "रीफ्रेश",
      export: "निर्यात",
      totalChunks: "कुल खंड",
      totalVectors: "DB में वेक्टर",
      storageUsed: "उपयोग किया गया भंडारण",
      lastSync: "अंतिम सिंक",
      allVideos: "सभी वीडियो",
      videoTitle: "वीडियो",
      chunkText: "सामग्री",
      timestamp: "समय चिह्न",
      actions: "क्रियाएँ",
      viewDetails: "विवरण देखें",
      delete: "हटाएं",
      reindex: "पुनः अनुक्रमित करें",
    },
  };

  const t = translations[language];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/videos/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch video data");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching video data:", err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueVideos = Array.from(
    new Set((data?.macroChunks || []).map((chunk) => chunk.videoTitle))
  );

  const filteredChunks = (data?.macroChunks || []).filter((chunk) => {
    const matchesSearch =
      chunk.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.videoTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVideo =
      selectedVideo === "all" || chunk.videoTitle === selectedVideo;
    return matchesSearch && matchesVideo;
  });

  const stats = data?.stats || {
    totalChunks: 0,
    totalVideos: 0,
    totalVectors: 0,
    storageUsed: "0 MB",
    lastSync: null,
  };

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <PageHeader
        title={t.title}
        description={t.subtitle}
        icon={Database}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={fetchData} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t.totalChunks}</p>
                      <p className="text-2xl font-semibold text-black mt-1">
                        {stats.totalChunks}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t.totalVectors}</p>
                      <p className="text-2xl font-semibold text-black mt-1">
                        {stats.totalVectors}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">{t.storageUsed}</p>
                    <p className="text-2xl font-semibold text-black mt-1">
                      {stats.storageUsed}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div>
                    <p className="text-sm text-gray-600">{t.lastSync}</p>
                    <p className="text-sm font-medium text-black mt-1">
                      {stats.lastSync
                        ? new Date(stats.lastSync).toLocaleString()
                        : "Never"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                value={selectedVideo}
                onChange={(e) => setSelectedVideo(e.target.value)}
              >
                <option value="all">{t.allVideos}</option>
                {uniqueVideos.map((video) => (
                  <option key={video} value={video}>
                    {video}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={fetchData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.refresh}
              </Button>

              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                {t.export}
              </Button>
            </div>

            {/* Knowledge Chunks Table */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Content Chunks ({filteredChunks.length})
                </CardTitle>
                <CardDescription>
                  Vector embeddings stored in Pinecone database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.videoTitle}</TableHead>
                      <TableHead>{t.chunkText}</TableHead>
                      <TableHead>{t.timestamp}</TableHead>
                      <TableHead>Vector ID</TableHead>
                      <TableHead className="text-right">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChunks.map((chunk) => (
                      <TableRow key={chunk.id}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="text-sm font-semibold text-black">
                              {chunk.videoTitle}
                            </p>
                            <p className="text-xs text-gray-500">
                              Chunk {chunk.chunkIndex + 1}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                            {chunk.text}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {chunk.timestamp}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs text-gray-600">
                            {chunk.vectorId}
                          </code>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                {t.viewDetails}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                {t.reindex}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t.delete}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredChunks.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No chunks found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
