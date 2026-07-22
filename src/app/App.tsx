"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle } from "lucide-react";
import { LandingPage } from "./components/LandingPage";
import { Assessment, type AssessmentResults } from "./components/Assessment";
import { Results } from "./components/Results";
import { Chatbot } from "./components/Chatbot";

type AppState = "landing" | "assessment" | "results";

export default function App() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleStartAssessment = () => {
    scrollToTop();
    setIsChatbotOpen(false);
    setAppState("assessment");
  };

  const handleAssessmentComplete = (results: AssessmentResults) => {
    scrollToTop();
    setAssessmentResults(results);
    setAppState("results");
  };

  const handleStartOver = () => {
    scrollToTop();
    setAppState("landing");
    setAssessmentResults(null);
  };

  const handleOpenChatbot = () => {
    setIsChatbotOpen(true);
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  return (
    <div ref={containerRef} className="size-full overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
      <AnimatePresence mode="wait">
        {appState === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onStartAssessment={handleStartAssessment} />
          </motion.div>
        )}

        {appState === "assessment" && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Assessment onComplete={handleAssessmentComplete} />
          </motion.div>
        )}

        {appState === "results" && assessmentResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Results
              results={assessmentResults}
              onStartOver={handleStartOver}
              onOpenChatbot={handleOpenChatbot}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chatbot Button — results page only to avoid blocking assessment navigation on mobile */}
      {!isChatbotOpen && appState === "results" && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 24 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleOpenChatbot}
          aria-label="Chat with Rina"
          title="Chat with Rina"
          className="fixed z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]"
          style={{
            background: "linear-gradient(135deg, #3d7a5c 0%, #1b4332 100%)",
            boxShadow: "0 4px 20px rgba(27,67,50,0.35), 0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
          <span
            className="absolute top-2.5 right-2.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-[#1b4332]"
            style={{ background: "#86efac" }}
          />
        </motion.button>
      )}

      <Chatbot isOpen={isChatbotOpen} onClose={handleCloseChatbot} />
    </div>
  );
}