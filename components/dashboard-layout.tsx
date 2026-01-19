"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  User,
  LogOut,
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
    videos: "Videos",
    overview: "Overview",
    insights: "Insights",
    activity: "Activity",
    settings: "Settings",
    signOut: "Sign Out",
  },
  fr: {
    title: "QueryTube",
    videos: "Vidéos",
    overview: "Aperçu",
    insights: "Statistiques",
    activity: "Activité",
    settings: "Paramètres",
    signOut: "Se déconnecter",
  },
  hi: {
    title: "QueryTube",
    videos: "वीडियो",
    overview: "सारांश",
    insights: "अंतर्दृष्टि",
    activity: "गतिविधि",
    settings: "सेटिंग्स",
    signOut: "साइन आउट",
  },
};

export function SidebarProfile({
  isCollapsed,
  language
}: {
  isCollapsed: boolean;
  language: "en" | "fr" | "hi";
}) {
  const { data: session, isPending } = useSession();
  const t = translations[language];

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (isPending) return <div className="text-xs text-gray-400 px-3 py-2">Loading...</div>;
  if (!session?.user) return null;

  const userEmail = session.user.email || session.user.name || "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={userEmail}
        >
          <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {userInitial}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name || userEmail.split("@")[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          )}
          {!isCollapsed && (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-gray-900">{session.user.name || userEmail.split("@")[0]}</p>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/pages/logs" className="cursor-pointer">
            <FileText className="w-4 h-4 mr-2" />
            {t.activity}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pages/settings" className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            {t.settings}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          {t.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserProfile() {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (isPending) return <div className="text-sm text-gray-500">Loading...</div>;
  if (!session?.user) return null;

  const userEmail = session.user.email || session.user.name || "User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 min-w-[40px] h-9"
          aria-label="User menu"
        >
          <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium">
            {userInitial}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium text-gray-900">{session.user.name || "User"}</p>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/pages/settings" className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

  // Consolidated navigation structure - Overview is home
  const NAV = {
    main: [
      { href: "/pages/dashboard", icon: LayoutDashboard, label: t.overview },
      { href: "/pages/knowledge", icon: Database, label: t.videos },
      { href: "/pages/analytics", icon: BarChart3, label: t.insights },
    ],
  } as const;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
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
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <h1 className="text-xl font-bold tracking-tight leading-none">
                  <span className="text-gray-900">Query</span>
                  <span className="text-red-600">Tube</span>
                </h1>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">
                  AI-Powered Video Q&A
                </p>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-lg font-bold">
                  <span className="text-gray-900">Q</span>
                  <span className="text-red-600">T</span>
                </span>
              </div>
            )}
          </div>
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden hover:bg-gray-100 shrink-0 w-8 h-8"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </Button>
          {/* Collapse button for desktop */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex hover:bg-gray-100 shrink-0 w-8 h-8"
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {NAV.main.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="w-5 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile-only: Theme & Language Controls */}
          {!isCollapsed && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 lg:hidden">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 w-full transition-colors"
              >
                <div className="w-5 flex items-center justify-center shrink-0">
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </div>
                <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>

              {/* Language Selector */}
              {onLanguageChange && (
                <div className="px-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Language</p>
                  <div className="space-y-1">
                    {[
                      { code: "en", label: "English", flag: "us" },
                      { code: "fr", label: "Français", flag: "fr" },
                      { code: "hi", label: "हिन्दी", flag: "in" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code as "en" | "fr" | "hi");
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors ${
                          language === lang.code
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="w-5 h-5 flex-shrink-0 overflow-hidden rounded-full">
                          <CircleFlag countryCode={lang.flag} height="20" />
                        </div>
                        <span className="flex-1 text-left">{lang.label}</span>
                        {language === lang.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Footer - User Profile Only */}
        <div className="px-3 py-3 border-t border-gray-200 shrink-0">
          <SidebarProfile isCollapsed={isCollapsed} language={language} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto bg-gray-50">
        {/* Sticky Mobile Header - Clean & Minimal */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Left: Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Center: App Name */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-base font-semibold tracking-tight">
                <span className="text-gray-900">Query</span>
                <span className="text-red-600">Tube</span>
              </h1>
            </div>

            {/* Right: User Profile Only */}
            <UserProfile />
          </div>
        </div>

        {/* Desktop Controls - Top Right (unchanged for desktop) */}
        <div className="hidden lg:flex fixed top-4 right-4 sm:right-6 z-50 items-center gap-3">
          {/* User Profile */}
          <UserProfile />

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
    </div>
  );
}
