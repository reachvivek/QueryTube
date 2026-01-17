import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QueryTube - Transform Videos into AI Q&A Agents",
  description: "Transform any video into an intelligent Q&A chatbot. Upload videos, extract transcripts, and ask questions using AI-powered semantic search. Perfect for education, training, and content analysis.",
  keywords: ["AI", "video analysis", "Q&A", "chatbot", "OpenAI", "semantic search", "educational technology"],
  authors: [{ name: "Vivek Kumar Singh", url: "https://github.com/reachvivek" }],
  creator: "Vivek Kumar Singh (reachvivek)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
