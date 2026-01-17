"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  BarChart3,
  TrendingUp,
  Clock,
  MessageSquare,
  ThumbsUp,
  Eye,
} from "lucide-react";

// Mock analytics data
const mockAnalytics = {
  totalQuestions: 342,
  avgResponseTime: "1.2s",
  successRate: 94,
  popularVideos: [
    {
      id: "abc123",
      title: "Introduction aux mathématiques",
      questions: 127,
      avgRating: 4.6,
      views: 523,
    },
    {
      id: "xyz789",
      title: "Physique quantique - Partie 1",
      questions: 89,
      avgRating: 4.8,
      views: 412,
    },
    {
      id: "pqr456",
      title: "Histoire de France",
      questions: 64,
      avgRating: 4.3,
      views: 298,
    },
  ],
  popularQuestions: [
    {
      question: "Qu'est-ce qu'une fonction linéaire?",
      count: 23,
      avgRating: 4.7,
    },
    {
      question: "Comment calculer la pente?",
      count: 18,
      avgRating: 4.5,
    },
    {
      question: "Quelle est la différence entre vitesse et accélération?",
      count: 15,
      avgRating: 4.9,
    },
  ],
  weeklyStats: [
    { day: "Mon", questions: 45 },
    { day: "Tue", questions: 52 },
    { day: "Wed", questions: 48 },
    { day: "Thu", questions: 61 },
    { day: "Fri", questions: 58 },
    { day: "Sat", questions: 42 },
    { day: "Sun", questions: 36 },
  ],
};

export default function AnalyticsPage() {
  const [language, setLanguage] = useState<"en" | "fr" | "hi">("en");

  const translations = {
    en: {
      title: "Analytics",
      subtitle: "Track usage and performance metrics",
      totalQuestions: "Total Questions",
      avgResponse: "Avg Response Time",
      successRate: "Success Rate",
      popularVideos: "Most Popular Videos",
      popularQuestions: "Frequently Asked Questions",
      weeklyActivity: "Weekly Activity",
      video: "Video",
      questions: "Questions",
      rating: "Rating",
      views: "Views",
      question: "Question",
      asked: "Times Asked",
    },
    fr: {
      title: "Analytique",
      subtitle: "Suivre l'utilisation et les métriques de performance",
      totalQuestions: "Questions totales",
      avgResponse: "Temps de réponse moyen",
      successRate: "Taux de réussite",
      popularVideos: "Vidéos les plus populaires",
      popularQuestions: "Questions fréquentes",
      weeklyActivity: "Activité hebdomadaire",
      video: "Vidéo",
      questions: "Questions",
      rating: "Note",
      views: "Vues",
      question: "Question",
      asked: "Fois demandée",
    },
    hi: {
      title: "विश्लेषण",
      subtitle: "उपयोग और प्रदर्शन मेट्रिक्स ट्रैक करें",
      totalQuestions: "कुल प्रश्न",
      avgResponse: "औसत प्रतिक्रिया समय",
      successRate: "सफलता दर",
      popularVideos: "सबसे लोकप्रिय वीडियो",
      popularQuestions: "अक्सर पूछे जाने वाले प्रश्न",
      weeklyActivity: "साप्ताहिक गतिविधि",
      video: "वीडियो",
      questions: "प्रश्न",
      rating: "रेटिंग",
      views: "दृश्य",
      question: "प्रश्न",
      asked: "बार पूछा गया",
    },
  };

  const t = translations[language];

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <PageHeader
        title={t.title}
        description={t.subtitle}
        icon={BarChart3}
      />

      <div className="p-4 sm:p-6 lg:p-8">

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.totalQuestions}</p>
                  <p className="text-3xl font-semibold text-black mt-1">
                    {mockAnalytics.totalQuestions}
                  </p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12% this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.avgResponse}</p>
                  <p className="text-3xl font-semibold text-black mt-1">
                    {mockAnalytics.avgResponseTime}
                  </p>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    15% faster
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.successRate}</p>
                  <p className="text-3xl font-semibold text-black mt-1">
                    {mockAnalytics.successRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Based on user ratings</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity Chart */}
        <Card className="border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {t.weeklyActivity}
            </CardTitle>
            <CardDescription>Questions asked per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {mockAnalytics.weeklyStats.map((stat, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full bg-black rounded-t transition-all hover:bg-gray-700"
                      style={{
                        height: `${(stat.questions / 70) * 100}%`,
                      }}
                      title={`${stat.questions} questions`}
                    />
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{stat.day}</p>
                  <p className="text-xs text-gray-500">{stat.questions}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Videos */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">{t.popularVideos}</CardTitle>
              <CardDescription>Videos with the most questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.video}</TableHead>
                    <TableHead>{t.questions}</TableHead>
                    <TableHead>{t.rating}</TableHead>
                    <TableHead>{t.views}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAnalytics.popularVideos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium text-sm text-black">
                        {video.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{video.questions}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm">{video.avgRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-3 h-3" />
                          <span className="text-sm">{video.views}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Popular Questions */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">{t.popularQuestions}</CardTitle>
              <CardDescription>Most commonly asked questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.popularQuestions.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black mb-1">
                        {item.question}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {item.count}x
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-yellow-500" />
                          {item.avgRating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
