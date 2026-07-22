"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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

      {/* Floating Chatbot Button */}
      {!isChatbotOpen && appState !== "landing" && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 24 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleOpenChatbot}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full text-white"
          style={{
            background: "#1b4332",
            boxShadow: "0 4px 20px rgba(27,67,50,0.35), 0 1px 4px rgba(0,0,0,0.12)",
          }}
        >
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            RA
          </span>
          <div className="text-left leading-tight">
            <p className="text-sm font-semibold">Chat with Rina</p>
            <p className="text-xs" style={{ color: "#86efac" }}>Digital Consultant · Online</p>
          </div>
        </motion.button>
      )}

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatbotOpen} onClose={handleCloseChatbot} />
    </div>
  );
}