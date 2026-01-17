"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Upload,
  Database,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Check,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { CircleFlag } from "react-circle-flags";

interface DashboardLayoutProps {
  children: React.ReactNode;
  language?: "en" | "fr" | "hi";
  onLanguageChange?: (lang: "en" | "fr" | "hi") => void;
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
  hi: {
    title: "QueryTube",
    dashboard: "डैशबोर्ड",
    newVideo: "नया वीडियो",
    knowledge: "ज्ञान आधार",
    analytics: "विश्लेषण",
    logs: "लॉग्स",
    settings: "सेटिंग्स",
  },
};

export function LanguageSwitcher({
  language,
  onLanguageChange,
}: {
  language: "en" | "fr" | "hi";
  onLanguageChange: (lang: "en" | "fr" | "hi") => void;
}) {
  const languages = [
    { code: "en", label: "English", countryCode: "us" },
    { code: "fr", label: "Français", countryCode: "fr" },
    { code: "hi", label: "हिन्दी", countryCode: "in" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 min-w-[140px] justify-between"
          aria-label={`Change language. Current language: ${currentLanguage?.label}`}
        >
          <div className="flex items-center gap-2">
            {currentLanguage?.countryCode && (
              <div className="w-4 h-4 flex-shrink-0">
                <CircleFlag countryCode={currentLanguage.countryCode} height="16" />
              </div>
            )}
            <span className="font-medium text-sm">{currentLanguage?.label}</span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code as "en" | "fr" | "hi")}
            className="flex items-center gap-3 cursor-pointer py-2.5"
          >
            <div className="w-5 h-5 flex-shrink-0 overflow-hidden rounded-full">
              <CircleFlag countryCode={lang.countryCode} height="20" />
            </div>
            <span className="flex-1">{lang.label}</span>
            {language === lang.code && <Check className="w-4 h-4 text-black" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DashboardLayout({
  children,
  language = "en",
  onLanguageChange,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = translations[language];

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: t.dashboard },
    { href: "/knowledge", icon: Database, label: t.knowledge },
    { href: "/analytics", icon: BarChart3, label: t.analytics },
    { href: "/logs", icon: FileText, label: t.logs },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Collapsible Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50`}
      >
        {/* Logo/Header */}
        <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between h-[84px]">
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight leading-none">
                <span className="text-gray-900">Query</span>
                <span className="text-red-600">Tube</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1.5 font-medium">
                AI-Powered Video Q&A
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
            {/* Collapse button for desktop */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex hover:bg-gray-100"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
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
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
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
      <main className="flex-1 overflow-auto relative lg:ml-0">
        {/* Mobile Hamburger - Top Left */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 lg:hidden w-9 h-9 p-0"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" aria-hidden="true" />
        </Button>

        {/* Fixed Controls - Top Right */}
        <div className="fixed top-4 right-4 sm:right-6 z-50 flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-9 p-0"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </Button>

          {/* Language Switcher */}
          {onLanguageChange && (
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
