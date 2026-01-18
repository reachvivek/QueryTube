"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, Clock, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const videos = [
  {
    id: 0,
    videoId: "ke3Pb9_oMrg",
    title: "Michael Phelps' Champion Mindset",
    duration: "58:24",
    welcome: "Hi! I've analyzed this 58-minute video about Michael Phelps' Champion Mindset. How can I help you understand his approach to greatness?",
    question1: "What makes Michael Phelps different from other swimmers?",
    answer1: "Michael Phelps stands out because of his discipline and obsession with preparation. At [00:04–00:49], he explains how he measures every practice session by time, not motivation—treating training like a system rather than a feeling.",
    question2: "How did he handle pressure before big competitions?",
    answer2: "Around [00:06–00:51], he describes competing against his own standards rather than other swimmers, emphasizing consistency and willingness to do the work every day, which helped him manage pressure.",
  },
  {
    id: 1,
    videoId: "3qHkcs3kG44",
    title: "Joe Rogan Experience #1309 - Naval Ravikant",
    duration: "2:18:45",
    welcome: "Hi! I've analyzed this 2-hour video featuring Naval Ravikant on Joe Rogan. How can I help you understand his insights on wealth, happiness, and life?",
    question1: "What does Naval mean by leverage?",
    answer1: "At [00:15–00:42], Naval explains leverage as the ability to multiply your efforts through capital, people, or code. He emphasizes that modern leverage (like code and media) has zero marginal cost of replication.",
    question2: "When does he talk about happiness vs money?",
    answer2: "Around [01:12–01:38], Naval discusses how happiness is a skill you can learn, while money is simply a tool. He argues that peace of mind and internal calm are more valuable than external wealth.",
  },
  {
    id: 2,
    videoId: "jvqFAi7vkBc",
    title: "Sam Altman: OpenAI, GPT-5, Sora & AGI | Lex Fridman",
    duration: "2:06:14",
    welcome: "Hi! I've analyzed this 2-hour conversation between Lex Fridman and Sam Altman. How can I help you explore their discussion on AI, AGI, and the future of OpenAI?",
    question1: "What does Sam Altman say about AGI timelines?",
    answer1: "At [00:23–00:58], Sam discusses how AGI development is accelerating faster than expected. He emphasizes that while exact timelines are uncertain, the progress in capabilities suggests we're closer than most people think.",
    question2: "When does he talk about AI risks?",
    answer2: "Around [01:15–01:42], Sam addresses AI safety concerns, explaining how OpenAI balances innovation with responsible development. He discusses the importance of alignment research and iterative deployment to understand real-world risks.",
  },
  {
    id: 3,
    videoId: "LfaMVlDaQ24",
    title: "Harvard CS50 (2023) – Full University Course",
    duration: "25:06:45",
    welcome: "Hi! I've analyzed this complete Harvard CS50 course taught by Dr. David Malan. How can I help you understand computer science fundamentals and his teaching philosophy?",
    question1: "What does David Malan say about starting CS50 with no experience?",
    answer1: "At [04:19–05:38], he emphasizes that 2/3 of students have never taken a CS class before. He explains that what matters is not where you end up relative to classmates, but where you end up relative to yourself when you began—it's all about that personal growth delta.",
    question2: "How does he explain the 'drinking from a fire hose' metaphor?",
    answer2: "Around [04:43–05:12], he references an MIT hack showing a fire hose connected to a water fountain with a sign saying 'getting an education from MIT is like drinking from a fire hose.' He acknowledges CS50 will feel overwhelming at times, but emphasizes that so much will ultimately be absorbed and within your grasp by term's end.",
  },
  {
    id: 4,
    videoId: "G-jPoROGHGE",
    title: "How to Make Perfect Pizza Dough - Vito Iacopelli",
    duration: "16:42",
    welcome: "Hi! I've analyzed this 16-minute pizza dough tutorial by Vito Iacopelli. How can I help you understand the Poolish method and Neapolitan pizza techniques?",
    question1: "पूर्व-मिश्रण बनाने के लिए क्या सामग्री चाहिए?",
    answer1: "इस पूर्व-मिश्रण को बनाने के लिए ३०० मिली पानी, ३०० ग्राम आटा, ५ ग्राम सूखा खमीर और ५ ग्राम शहद लिया जाता है। वीटो ने बताया कि यह मिश्रण आटे को अधिक स्वादिष्ट बनाता है और पचाने में आसान करता है क्योंकि इसमें धीरे-धीरे किण्वन होता है। यह विधि वीडियो में [०२:१५–०३:३०] के बीच समझाई गई है।",
    question2: "मुख्य आटे में कौन-कौन सी सामग्री डालनी है?",
    answer2: "मुख्य आटे के लिए पूरा तैयार मिश्रण, ७०० मिली पानी, १२५० ग्राम आटा और ४० ग्राम नमक की आवश्यकता होती है। वीटो ने बताया कि यह सभी चीजें आपकी स्थानीय दुकान से आसानी से मिल सकती हैं और यह नुस्खा घर पर बनाने के लिए बहुत सरल है। यह जानकारी वीडियो में [०८:४५–१०:२०] के बीच दी गई है।",
  },
  {
    id: 5,
    videoId: "I3GWzXRectE",
    title: "Introductory Calculus - Oxford Mathematics 1st Year",
    duration: "56:52",
    welcome: "Hi! I've analyzed this Oxford University calculus lecture covering differential equations, integration techniques, and problem-solving methods. How can I help you master these concepts?",
    question1: "Help me solve this integral using integration by parts: ∫x²sin(x)dx",
    answer1: "At [24:18–27:20], the lecturer solves this exact problem step-by-step. Set f = x² and g' = sin(x), so g = -cos(x). Applying integration by parts: ∫x²sin(x)dx = -x²cos(x) + ∫2x·cos(x)dx. Apply parts again with f = 2x and g' = cos(x): = -x²cos(x) + 2x·sin(x) - ∫2·sin(x)dx = -x²cos(x) + 2x·sin(x) + 2cos(x) + C. The key insight is recognizing when to apply the technique twice.",
    question2: "How do I solve separable differential equations like x(y²-1) + y(x²-1)dy/dx = 0?",
    answer2: "At [47:54–56:52], this problem is solved completely. First, isolate dy/dx: y(x²-1)dy/dx = -x(y²-1). Then separate variables: y/(y²-1)dy = -x/(x²-1)dx. Integrate both sides: ½ln|y²-1| = -½ln|1-x²| + C. Simplifying gives the solution: (1-y²)(1-x²) = C. The lecturer emphasizes watching for division by zero - when y²-1=0, the constant solutions y=±1 correspond to C=0.",
  },
];

export function AnimatedDemo() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuestion1, setShowQuestion1] = useState(false);
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showQuestion2, setShowQuestion2] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);

  const [welcomeText, setWelcomeText] = useState("");
  const [question1Text, setQuestion1Text] = useState("");
  const [answer1Text, setAnswer1Text] = useState("");
  const [question2Text, setQuestion2Text] = useState("");
  const [answer2Text, setAnswer2Text] = useState("");

  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [voiceMode, setVoiceMode] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const currentVideo = videos[currentVideoIndex];
  const fullWelcome = currentVideo.welcome;
  const fullQuestion1 = currentVideo.question1;
  const fullAnswer1 = currentVideo.answer1;
  const fullQuestion2 = currentVideo.question2;
  const fullAnswer2 = currentVideo.answer2;

  // Reset animation when video changes
  const resetAnimation = () => {
    setShowWelcome(false);
    setShowQuestion1(false);
    setShowAnswer1(false);
    setShowQuestion2(false);
    setShowAnswer2(false);
    setWelcomeText("");
    setQuestion1Text("");
    setAnswer1Text("");
    setQuestion2Text("");
    setAnswer2Text("");
    setCurrentLanguage("English");
  };

  // Auto-switch language to Hindi when first question appears on pizza video
  useEffect(() => {
    if (currentVideoIndex === 4 && showQuestion1) {
      setCurrentLanguage("हिन्दी");
    }
  }, [currentVideoIndex, showQuestion1]);

  // Rotate to next video after animation completes
  useEffect(() => {
    if (showAnswer2 && answer2Text.length === fullAnswer2.length) {
      const timer = setTimeout(() => {
        resetAnimation();
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAnswer2, answer2Text, fullAnswer2]);

  // Start welcome message after video change
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 2000);
    return () => clearTimeout(timer);
  }, [currentVideoIndex]);

  // Type welcome message
  useEffect(() => {
    if (showWelcome && welcomeText.length < fullWelcome.length) {
      const timer = setTimeout(() => {
        setWelcomeText(fullWelcome.slice(0, welcomeText.length + 1));
      }, 20);
      return () => clearTimeout(timer);
    } else if (showWelcome && welcomeText.length === fullWelcome.length) {
      setTimeout(() => setShowQuestion1(true), 1000);
    }
  }, [showWelcome, welcomeText, fullWelcome]);

  // Type first question
  useEffect(() => {
    if (showQuestion1 && question1Text.length < fullQuestion1.length) {
      const timer = setTimeout(() => {
        setQuestion1Text(fullQuestion1.slice(0, question1Text.length + 1));
      }, 30);
      return () => clearTimeout(timer);
    } else if (showQuestion1 && question1Text.length === fullQuestion1.length) {
      setTimeout(() => setShowAnswer1(true), 500);
    }
  }, [showQuestion1, question1Text, fullQuestion1]);

  // Type first answer
  useEffect(() => {
    if (showAnswer1 && answer1Text.length < fullAnswer1.length) {
      const timer = setTimeout(() => {
        setAnswer1Text(fullAnswer1.slice(0, answer1Text.length + 1));
      }, 15);
      return () => clearTimeout(timer);
    } else if (showAnswer1 && answer1Text.length === fullAnswer1.length) {
      setTimeout(() => setShowQuestion2(true), 1500);
    }
  }, [showAnswer1, answer1Text, fullAnswer1]);

  // Type second question
  useEffect(() => {
    if (showQuestion2 && question2Text.length < fullQuestion2.length) {
      const timer = setTimeout(() => {
        setQuestion2Text(fullQuestion2.slice(0, question2Text.length + 1));
      }, 30);
      return () => clearTimeout(timer);
    } else if (showQuestion2 && question2Text.length === fullQuestion2.length) {
      setTimeout(() => setShowAnswer2(true), 500);
    }
  }, [showQuestion2, question2Text, fullQuestion2]);

  // Type second answer
  useEffect(() => {
    if (showAnswer2 && answer2Text.length < fullAnswer2.length) {
      const timer = setTimeout(() => {
        setAnswer2Text(fullAnswer2.slice(0, answer2Text.length + 1));
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [showAnswer2, answer2Text, fullAnswer2]);

  // Auto-scroll to bottom as messages appear
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [welcomeText, question1Text, answer1Text, question2Text, answer2Text]);

  return (
    <div className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-0 max-w-[1600px] mx-auto">
        {/* Video on left - optimized for mobile 16:9 */}
        <div className="bg-black flex items-center justify-center h-[240px] sm:h-[320px] md:h-[600px] relative p-3 sm:p-4 md:p-8 lg:pl-16 lg:pr-8 lg:py-12">
          <iframe
            key={currentVideo.videoId}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1&loop=1&playlist=${currentVideo.videoId}`}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-xl sm:rounded-2xl"
          />
          {/* Video duration overlay */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/80 backdrop-blur-sm text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-lg">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{currentVideo.duration}</span>
          </div>
        </div>

        {/* Chat interface on right - more space on mobile */}
        <div className="flex flex-col h-[460px] sm:h-[520px] md:h-[600px] bg-gray-50">
          {/* Chat messages area */}
          <div ref={chatMessagesRef} className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-2.5 sm:space-y-3 scroll-smooth">
            {/* Demo label */}
            <div className="text-center mb-1 sm:mb-2">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                {currentVideo.title}
              </p>
            </div>

            {/* Welcome message from AI */}
            {showWelcome && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-white border border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 rounded-3xl rounded-tl-lg shadow-sm">
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                    {welcomeText}
                    {welcomeText.length < fullWelcome.length && (
                      <span className="inline-block w-0.5 h-3.5 sm:h-4 bg-gray-800 ml-1 animate-pulse" />
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Question 1 */}
            {showQuestion1 && (
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-black text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-3xl rounded-tr-lg shadow-md">
                  <div className="flex items-center gap-2">
                    {question1Text.length > 0 && question1Text.length < fullQuestion1.length && (
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                    )}
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {question1Text}
                      {question1Text.length < fullQuestion1.length && (
                        <span className="inline-block w-0.5 h-3 sm:h-4 bg-white ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Answer 1 */}
            {showAnswer1 && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-white border border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 rounded-3xl rounded-tl-lg shadow-sm">
                  <div className="flex items-start gap-2">
                    {answer1Text.length > 0 && answer1Text.length < fullAnswer1.length && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mt-1.5" />
                    )}
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed flex-1">
                      {answer1Text.split(/(\[\d{2}:\d{2}(?:–|-)?\d{2}:\d{2}\])/g).map((part, i) => {
                        if (part.match(/\[\d{2}:\d{2}/)) {
                          return (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] sm:text-xs font-medium hover:bg-blue-100 cursor-pointer transition-colors mx-0.5"
                            >
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {part.replace(/[\[\]]/g, '')}
                            </span>
                          );
                        }
                        return part;
                      })}
                      {answer1Text.length < fullAnswer1.length && (
                        <span className="inline-block w-0.5 h-3 sm:h-4 bg-gray-800 ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Question 2 */}
            {showQuestion2 && (
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-black text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-3xl rounded-tr-lg shadow-md">
                  <div className="flex items-center gap-2">
                    {question2Text.length > 0 && question2Text.length < fullQuestion2.length && (
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                    )}
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {question2Text}
                      {question2Text.length < fullQuestion2.length && (
                        <span className="inline-block w-0.5 h-3 sm:h-4 bg-white ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Answer 2 */}
            {showAnswer2 && (
              <div className="flex justify-start">
                <div className="max-w-[90%] bg-white border border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3 rounded-3xl rounded-tl-lg shadow-sm">
                  <div className="flex items-start gap-2">
                    {answer2Text.length > 0 && answer2Text.length < fullAnswer2.length && (
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mt-1.5" />
                    )}
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed flex-1">
                      {answer2Text.split(/(\[\d{2}:\d{2}(?:–|-)?\d{2}:\d{2}\])/g).map((part, i) => {
                        if (part.match(/\[\d{2}:\d{2}/)) {
                          return (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] sm:text-xs font-medium hover:bg-blue-100 cursor-pointer transition-colors mx-0.5"
                            >
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {part.replace(/[\[\]]/g, '')}
                            </span>
                          );
                        }
                        return part;
                      })}
                      {answer2Text.length < fullAnswer2.length && (
                        <span className="inline-block w-0.5 h-3 sm:h-4 bg-gray-800 ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area at bottom - with gradient glow */}
          <div className="border-t border-gray-200 p-2.5 sm:p-4 bg-gradient-to-t from-blue-50/30 via-white to-white relative">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-100/20 to-transparent pointer-events-none" />
            {/* Language and Voice Mode */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-2 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600">
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Audio output: 50+ languages</span>
                  <span className="sm:hidden">50+ languages</span>
                </div>
                <div className="h-3 w-px bg-gray-300" />
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-500">Language:</span>
                  <span className="px-1.5 py-0.5 sm:px-2 bg-blue-100 text-blue-700 rounded text-[10px] sm:text-xs font-medium transition-all duration-300">
                    {currentLanguage}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-medium text-gray-700">Voice Mode</span>
                <Switch
                  checked={voiceMode}
                  onCheckedChange={setVoiceMode}
                />
              </div>
            </div>

            {voiceMode && (
              <div className="flex flex-col items-center gap-2 mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
                  <div className="flex gap-0.5 sm:gap-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-blue-700">Listening... Speak now</span>
                </div>
              </div>
            )}

            <div className="flex gap-1.5 sm:gap-2 relative z-10">
              <input
                type="text"
                placeholder={voiceMode ? "Voice mode active - or type here..." : currentVideo.question1}
                className={`flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all shadow-sm hover:shadow-md ${
                  voiceMode ? 'border-gray-200 bg-gray-50 text-gray-500' : 'border-gray-300 bg-white'
                }`}
                readOnly
                onClick={() => window.location.href = '/auth/signin'}
              />
              <button
                onClick={() => window.location.href = '/auth/signin'}
                className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer shadow-sm hover:shadow-md ${
                  voiceMode ? 'bg-gray-300 text-gray-600' : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Ask
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 text-center relative z-10">
              {voiceMode ? 'Voice mode active • Sign in to use voice features' : 'Sign in to ask your own questions'}
            </p>
          </div>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 pb-8">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gray-400" />
          <span>Timestamp-grounded</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gray-400" />
          <span>No hallucinations</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-gray-400" />
          <span>Built for long-form videos</span>
        </div>
      </div>
    </div>
  );
}
