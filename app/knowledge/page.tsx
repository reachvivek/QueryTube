"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
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
} from "lucide-react";

// Mock knowledge base data
const mockKnowledgeChunks = [
  {
    id: "chunk_1",
    videoId: "abc123",
    videoTitle: "Introduction aux mathématiques",
    text: "Bonjour à tous, aujourd'hui nous allons parler de mathématiques. Les fonctions linéaires sont des concepts fondamentaux...",
    timestamp: "00:00:00 - 00:01:30",
    chunkIndex: 0,
    vectorId: "abc123_chunk_0",
    language: "fr",
    uploadedAt: "2026-01-15",
  },
  {
    id: "chunk_2",
    videoId: "abc123",
    videoTitle: "Introduction aux mathématiques",
    text: "La pente d'une fonction linéaire représente le taux de variation. Pour calculer la pente, nous utilisons la formule...",
    timestamp: "00:01:30 - 00:03:00",
    chunkIndex: 1,
    vectorId: "abc123_chunk_1",
    language: "fr",
    uploadedAt: "2026-01-15",
  },
  {
    id: "chunk_3",
    videoId: "xyz789",
    videoTitle: "Physique quantique - Partie 1",
    text: "La mécanique quantique est une branche de la physique qui étudie le comportement des particules à l'échelle atomique...",
    timestamp: "00:00:00 - 00:01:30",
    chunkIndex: 0,
    vectorId: "xyz789_chunk_0",
    language: "fr",
    uploadedAt: "2026-01-17",
  },
  {
    id: "chunk_4",
    videoId: "xyz789",
    videoTitle: "Physique quantique - Partie 1",
    text: "Le principe d'incertitude de Heisenberg stipule qu'il est impossible de connaître simultanément la position et la vitesse...",
    timestamp: "00:01:30 - 00:03:00",
    chunkIndex: 1,
    vectorId: "xyz789_chunk_1",
    language: "fr",
    uploadedAt: "2026-01-17",
  },
];

const mockStats = {
  totalChunks: 287,
  totalVideos: 12,
  totalVectors: 287,
  storageUsed: "145 MB",
  lastSync: "2026-01-17 14:35:42",
};

export default function KnowledgeBasePage() {
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string>("all");

  const translations = {
    en: {
      title: "Knowledge Base",
      subtitle: "Manage your vector database and content chunks",
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
      title: "Base de connaissances",
      subtitle: "Gérer votre base de données vectorielle et vos fragments de contenu",
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
  };

  const t = translations[language];

  const uniqueVideos = Array.from(
    new Set(mockKnowledgeChunks.map((chunk) => chunk.videoTitle))
  );

  const filteredChunks = mockKnowledgeChunks.filter((chunk) => {
    const matchesSearch =
      chunk.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chunk.videoTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVideo =
      selectedVideo === "all" || chunk.videoTitle === selectedVideo;
    return matchesSearch && matchesVideo;
  });

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black">{t.title}</h1>
          <p className="text-gray-600 mt-1">{t.subtitle}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.totalChunks}</p>
                  <p className="text-2xl font-semibold text-black mt-1">
                    {mockStats.totalChunks}
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
                    {mockStats.totalVectors}
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
                  {mockStats.storageUsed}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600">{t.lastSync}</p>
                <p className="text-sm font-medium text-black mt-1">
                  {mockStats.lastSync}
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

          <Button variant="outline">
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
      </div>
    </DashboardLayout>
  );
}
