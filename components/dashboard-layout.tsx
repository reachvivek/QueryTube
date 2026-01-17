"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Upload,
  Database,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  language?: "en" | "fr";
  onLanguageChange?: (lang: "en" | "fr") => void;
}

const translations = {
  en: {
    title: "QueryTube",
    dashboard: "Dashboard",
    newVideo: "New Video",
    knowledge: "Knowledge Base",
    analytics: "Analytics",
    logs: "Logs",
    settings: "Settings",
  },
  fr: {
    title: "QueryTube",
    dashboard: "Tableau de bord",
    newVideo: "Nouvelle Vidéo",
    knowledge: "Base de connaissances",
    analytics: "Analytique",
    logs: "Journaux",
    settings: "Paramètres",
  },
};

export function LanguageSwitcher({
  language,
  onLanguageChange,
}: {
  language: "en" | "fr";
  onLanguageChange: (lang: "en" | "fr") => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={language === "en" ? "default" : "outline"}
        onClick={() => onLanguageChange("en")}
        className={
          language === "en"
            ? "bg-black text-white hover:bg-gray-800"
            : ""
        }
      >
        EN
      </Button>
      <Button
        size="sm"
        variant={language === "fr" ? "default" : "outline"}
        onClick={() => onLanguageChange("fr")}
        className={
          language === "fr"
            ? "bg-black text-white hover:bg-gray-800"
            : ""
        }
      >
        FR
      </Button>
    </div>
  );
}

export default function DashboardLayout({
  children,
  language = "en",
  onLanguageChange,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const t = translations[language];

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: t.dashboard },
    { href: "/new", icon: Upload, label: t.newVideo },
    { href: "/knowledge", icon: Database, label: t.knowledge },
    { href: "/analytics", icon: BarChart3, label: t.analytics },
    { href: "/logs", icon: FileText, label: t.logs },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Collapsible Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-semibold text-black">{t.title}</h1>
              <p className="text-xs text-gray-500 mt-1">AI Assistant</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-gray-100"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/settings">
            <button
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? t.settings : undefined}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{t.settings}</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Fixed Language Switcher - Top Right */}
        {onLanguageChange && (
          <div className="fixed top-4 right-6 z-50">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
