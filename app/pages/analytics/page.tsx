"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Loader2,
  RefreshCw,
} from "lucide-react";

interface AnalyticsData {
  totalQuestions: number;
  avgResponseTime: string;
  successRate: number;
  popularVideos: {
    id: string;
    title: string;
    questions: number;
    avgRating: number;
    views: number;
  }[];
  popularQuestions: {
    question: string;
    count: number;
    avgRating: number;
  }[];
  weeklyStats: {
    day: string;
    questions: number;
  }[];
}

export default function AnalyticsPage() {
  const [language, setLanguage] = useState<"en" | "fr" | "hi">("en");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/analytics/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const analytics = data || {
    totalQuestions: 0,
    avgResponseTime: "0s",
    successRate: 0,
    popularVideos: [],
    popularQuestions: [],
    weeklyStats: Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      questions: 0,
    })),
  };

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <PageHeader
        title={t.title}
        description={t.subtitle}
        icon={BarChart3}
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
            <Button onClick={fetchAnalytics} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t.totalQuestions}</p>
                      <p className="text-3xl font-semibold text-black mt-1">
                        {analytics.totalQuestions}
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
                        {analytics.avgResponseTime}
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
                        {analytics.successRate}%
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
                  {analytics.weeklyStats.map((stat, index) => {
                    const maxQuestions = Math.max(...analytics.weeklyStats.map((s) => s.questions), 1);
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex-1 w-full flex items-end">
                          <div
                            className="w-full bg-black rounded-t transition-all hover:bg-gray-700"
                            style={{
                              height: `${(stat.questions / maxQuestions) * 100}%`,
                            }}
                            title={`${stat.questions} questions`}
                          />
                        </div>
                        <p className="text-xs text-gray-600 font-medium">{stat.day}</p>
                        <p className="text-xs text-gray-500">{stat.questions}</p>
                      </div>
                    );
                  })}
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
                  {analytics.popularVideos.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.video}</TableHead>
                          <TableHead>{t.questions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.popularVideos.map((video) => (
                          <TableRow key={video.id}>
                            <TableCell className="font-medium text-sm text-black">
                              {video.title}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{video.questions}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No questions asked yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Popular Questions */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">{t.popularQuestions}</CardTitle>
                  <CardDescription>Most commonly asked questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.popularQuestions.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.popularQuestions.map((item, index) => (
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
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No questions asked yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
