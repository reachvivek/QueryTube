"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import PageHeader from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings as SettingsIcon,
  Key,
  Database,
  MessageSquare,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [language, setLanguage] = useState<"en" | "fr" | "hi">("en");
  const [saved, setSaved] = useState(false);

  const translations = {
    en: {
      title: "Settings",
      subtitle: "Configure your API keys and preferences",
      apiKeys: "API Keys",
      vectorDB: "Vector Database",
      aiModel: "AI Model",
      general: "General",
      save: "Save Changes",
      saved: "Settings saved successfully!",
      openaiKey: "OpenAI API Key",
      pineconeKey: "Pinecone API Key",
      pineconeIndex: "Pinecone Index Name",
      pineconeEnv: "Pinecone Environment",
      defaultModel: "Default Model",
      systemPrompt: "Default System Prompt",
      chunkSize: "Default Chunk Size (seconds)",
      overlap: "Default Overlap (seconds)",
    },
    fr: {
      title: "Paramètres",
      subtitle: "Configurez vos clés API et préférences",
      apiKeys: "Clés API",
      vectorDB: "Base de données vectorielle",
      aiModel: "Modèle IA",
      general: "Général",
      save: "Enregistrer les modifications",
      saved: "Paramètres enregistrés avec succès!",
      openaiKey: "Clé API OpenAI",
      pineconeKey: "Clé API Pinecone",
      pineconeIndex: "Nom de l'index Pinecone",
      pineconeEnv: "Environnement Pinecone",
      defaultModel: "Modèle par défaut",
      systemPrompt: "Prompt système par défaut",
      chunkSize: "Taille de fragment par défaut (secondes)",
      overlap: "Chevauchement par défaut (secondes)",
    },
    hi: {
      title: "सेटिंग्स",
      subtitle: "अपनी API कुंजी और प्राथमिकताएं कॉन्फ़िगर करें",
      apiKeys: "API कुंजियाँ",
      vectorDB: "वेक्टर डेटाबेस",
      aiModel: "AI मॉडल",
      general: "सामान्य",
      save: "परिवर्तन सहेजें",
      saved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
      openaiKey: "OpenAI API कुंजी",
      pineconeKey: "Pinecone API कुंजी",
      pineconeIndex: "Pinecone इंडेक्स नाम",
      pineconeEnv: "Pinecone वातावरण",
      defaultModel: "डिफ़ॉल्ट मॉडल",
      systemPrompt: "डिफ़ॉल्ट सिस्टम प्रॉम्प्ट",
      chunkSize: "डिफ़ॉल्ट खंड आकार (सेकंड)",
      overlap: "डिफ़ॉल्ट ओवरलैप (सेकंड)",
    },
  };

  const t = translations[language];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout language={language} onLanguageChange={setLanguage}>
      <PageHeader
        title={t.title}
        description={t.subtitle}
        icon={SettingsIcon}
      />

      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">

        {/* Success Alert */}
        {saved && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-900">
              {t.saved}
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api">{t.apiKeys}</TabsTrigger>
            <TabsTrigger value="vectordb">{t.vectorDB}</TabsTrigger>
            <TabsTrigger value="ai">{t.aiModel}</TabsTrigger>
            <TabsTrigger value="general">{t.general}</TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  {t.apiKeys}
                </CardTitle>
                <CardDescription>
                  Configure your OpenAI and Pinecone API credentials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black flex items-center gap-2">
                    {t.openaiKey}
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    defaultValue="sk-••••••••••••••••"
                    className="border-gray-300 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Get your API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      platform.openai.com
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black flex items-center gap-2">
                    {t.pineconeKey}
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </label>
                  <Input
                    type="password"
                    placeholder="pcsk_..."
                    defaultValue="pcsk_••••••••••••••••"
                    className="border-gray-300 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Get your API key from{" "}
                    <a
                      href="https://app.pinecone.io"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      app.pinecone.io
                    </a>
                  </p>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vector Database Tab */}
          <TabsContent value="vectordb">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  {t.vectorDB}
                </CardTitle>
                <CardDescription>Configure Pinecone vector database settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    {t.pineconeIndex}
                  </label>
                  <Input
                    type="text"
                    placeholder="youtube-qa"
                    defaultValue="youtube-qa"
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-500">
                    The name of your Pinecone index
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    {t.pineconeEnv}
                  </label>
                  <Input
                    type="text"
                    placeholder="us-east-1-aws"
                    defaultValue="us-east-1-aws"
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-500">
                    Your Pinecone environment (found in dashboard)
                  </p>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-blue-900 text-sm">
                    Make sure your Pinecone index is configured with 1536 dimensions to match
                    OpenAI's text-embedding-3-small model.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleSave}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Model Tab */}
          <TabsContent value="ai">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t.aiModel}
                </CardTitle>
                <CardDescription>Configure AI model and prompt settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    {t.defaultModel}
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="gpt-4o">GPT-4o (Recommended)</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (Faster, Cheaper)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy)</option>
                  </select>
                  <p className="text-xs text-gray-500">
                    Model used for generating answers
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">
                    {t.systemPrompt}
                  </label>
                  <Textarea
                    className="border-gray-300 min-h-[150px]"
                    defaultValue="Tu es un assistant éducatif qui répond aux questions sur le contenu vidéo en français. Réponds de manière claire, concise et pédagogique. Utilise le contexte fourni pour répondre aux questions. Cite les timestamps pertinents quand c'est possible."
                  />
                  <p className="text-xs text-gray-500">
                    Default system prompt for Q&A responses
                  </p>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-black flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  {t.general}
                </CardTitle>
                <CardDescription>General application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      {t.chunkSize}
                    </label>
                    <Input
                      type="number"
                      defaultValue="90"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">
                      {t.overlap}
                    </label>
                    <Input
                      type="number"
                      defaultValue="10"
                      className="border-gray-300"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Default settings for transcript chunking
                </p>

                <Button
                  onClick={handleSave}
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t.save}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
