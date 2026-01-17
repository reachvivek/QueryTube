"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Search, Download, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock log data
const mockLogs = [
  {
    id: "1",
    timestamp: "2026-01-17 14:32:15",
    level: "info",
    action: "Video Processing Started",
    videoId: "abc123",
    message: "Starting download for 'Introduction aux mathématiques'",
    details: { url: "https://youtube.com/watch?v=abc123", size: "27.8 MB" },
  },
  {
    id: "2",
    timestamp: "2026-01-17 14:32:45",
    level: "success",
    action: "Download Complete",
    videoId: "abc123",
    message: "Audio downloaded successfully",
    details: { duration: "45:30", format: "m4a" },
  },
  {
    id: "3",
    timestamp: "2026-01-17 14:33:12",
    level: "info",
    action: "Transcription Started",
    videoId: "abc123",
    message: "Sending to OpenAI Whisper API",
    details: { language: "fr", model: "whisper-1" },
  },
  {
    id: "4",
    timestamp: "2026-01-17 14:35:28",
    level: "success",
    action: "Transcription Complete",
    videoId: "abc123",
    message: "Transcript generated successfully",
    details: { words: 5420, confidence: 0.94 },
  },
  {
    id: "5",
    timestamp: "2026-01-17 14:35:30",
    level: "info",
    action: "Chunking Started",
    videoId: "abc123",
    message: "Splitting transcript into chunks",
    details: { chunkSize: 90, overlap: 10 },
  },
  {
    id: "6",
    timestamp: "2026-01-17 14:35:35",
    level: "success",
    action: "Embedding Created",
    videoId: "abc123",
    message: "Generated embeddings for 23 chunks",
    details: { model: "text-embedding-3-small", chunks: 23 },
  },
  {
    id: "7",
    timestamp: "2026-01-17 14:35:42",
    level: "success",
    action: "Upload to Pinecone",
    videoId: "abc123",
    message: "All chunks uploaded to vector database",
    details: { namespace: "videos", index: "youtube-qa" },
  },
  {
    id: "8",
    timestamp: "2026-01-17 14:12:03",
    level: "error",
    action: "Download Failed",
    videoId: "def456",
    message: "Failed to download video: Age-restricted content",
    details: { url: "https://youtube.com/watch?v=def456", error: "Age restriction" },
  },
];

const mockQuestionLogs = [
  {
    id: "1",
    timestamp: "2026-01-17 15:23:12",
    videoId: "abc123",
    question: "Qu'est-ce qu'une fonction linéaire?",
    answer: "Une fonction linéaire est une fonction...",
    responseTime: "1.2s",
    chunksUsed: 3,
  },
  {
    id: "2",
    timestamp: "2026-01-17 15:25:45",
    videoId: "abc123",
    question: "Comment calculer la pente?",
    answer: "La pente se calcule en divisant...",
    responseTime: "0.9s",
    chunksUsed: 2,
  },
];

export default function LogsPage() {
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [searchTerm, setSearchTerm] = useState("");

  const translations = {
    en: {
      title: "Activity Logs",
      subtitle: "Monitor system activity and troubleshoot issues",
      searchPlaceholder: "Search logs...",
      export: "Export",
      systemLogs: "System Logs",
      questionLogs: "Question Logs",
      timestamp: "Timestamp",
      level: "Level",
      action: "Action",
      message: "Message",
      question: "Question",
      answer: "Answer",
      responseTime: "Response Time",
      chunks: "Chunks",
    },
    fr: {
      title: "Journaux d'activité",
      subtitle: "Surveiller l'activité du système et résoudre les problèmes",
      searchPlaceholder: "Rechercher dans les journaux...",
      export: "Exporter",
      systemLogs: "Journaux système",
      questionLogs: "Journaux de questions",
      timestamp: "Horodatage",
      level: "Niveau",
      action: "Action",
      message: "Message",
      question: "Question",
      answer: "Réponse",
      responseTime: "Temps de réponse",
      chunks: "Fragments",
    },
  };

  const t = translations[language];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Success
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Info className="w-3 h-3 mr-1" />
            Info
          </Badge>
        );
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-black">{t.title}</h1>
          <p className="text-gray-600 mt-1">{t.subtitle}</p>
        </div>

        {/* Search and Export */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t.export}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="system" className="w-full">
          <TabsList>
            <TabsTrigger value="system">{t.systemLogs}</TabsTrigger>
            <TabsTrigger value="questions">{t.questionLogs}</TabsTrigger>
          </TabsList>

          {/* System Logs Tab */}
          <TabsContent value="system">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t.systemLogs}
                </CardTitle>
                <CardDescription>Video processing and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.timestamp}</TableHead>
                      <TableHead>{t.level}</TableHead>
                      <TableHead>{t.action}</TableHead>
                      <TableHead>{t.message}</TableHead>
                      <TableHead>Video ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs text-gray-600">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>{getLevelBadge(log.level)}</TableCell>
                        <TableCell className="font-medium text-sm text-black">
                          {log.action}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">{log.message}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.videoId}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Logs Tab */}
          <TabsContent value="questions">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">{t.questionLogs}</CardTitle>
                <CardDescription>User questions and AI responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockQuestionLogs.map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-mono text-gray-500 mb-2">
                            {log.timestamp}
                          </p>
                          <p className="text-sm font-semibold text-black mb-1">
                            Q: {log.question}
                          </p>
                          <p className="text-sm text-gray-700">A: {log.answer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Video: {log.videoId}</span>
                        <span>•</span>
                        <span>{log.responseTime}</span>
                        <span>•</span>
                        <span>{log.chunksUsed} chunks used</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
