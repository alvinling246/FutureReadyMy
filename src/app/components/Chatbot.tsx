import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Settings, X, ChevronDown } from "lucide-react";

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are Rina Ahmad, a friendly and knowledgeable digital transformation consultant at FutureReadyMY. You help Malaysian SME business owners navigate their digital journey.

You specialise in:
- Cloud storage (Google Drive, OneDrive, Dropbox, AWS, Azure)
- Digital payments and e-wallets (Touch 'n Go, GrabPay, Boost, iPay88, SenangPay, Revenue Monster)
- Cybersecurity best practices (MFA, backups, phishing awareness, antivirus)
- Data analytics and business insights
- Digital marketing, social media, and online presence
- Malaysian grants and incentives (MDEC SME Digitalisation Grant, SME Corp, PENJANA)

Your communication style:
- Warm, conversational, and encouraging — like a knowledgeable friend
- Use "we" and "let's" to make it collaborative
- Occasionally use light Malaysian expressions naturally (e.g., "Good lah!", "No worries")
- Keep responses focused and practical — 2–4 short paragraphs max
- Always offer a follow-up question or next step
- Use RM when giving cost examples

Stay on topic — if asked about unrelated things, gently steer back to digital transformation.`;

const API_KEY_STORAGE = "futurereadymy_anthropic_key";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_API_VERSION = "2023-06-01";
const ANTHROPIC_MODEL = "claude-3-5-sonnet-latest";

const SUGGESTIONS = [
  "How do I get started with cloud storage?",
  "Which e-wallet is best for my shop?",
  "What is MFA and why do I need it?",
  "Are there any grants I can apply for?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-2 h-2 rounded-full bg-stone-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function AdvisorAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-12 h-12 text-lg" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white select-none`}
      style={{ background: "linear-gradient(135deg, #3d7a5c 0%, #1b4332 100%)" }}
    >
      RA
    </div>
  );
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm Rina, your digital transformation consultant. I'm here to help your business go digital — from cloud storage to e-wallets and cybersecurity. What's on your mind?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [keyDraft, setKeyDraft] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE) ?? "";
    setApiKey(saved);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveApiKey = () => {
    const trimmed = keyDraft.trim();
    if (!trimmed) return;
    localStorage.setItem(API_KEY_STORAGE, trimmed);
    setApiKey(trimmed);
    setShowSettings(false);
    setKeyDraft("");
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey("");
    setKeyDraft("");
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setShowSuggestions(false);

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsStreaming(true);

    const botId = `b-${Date.now()}`;
    setMessages((prev) => [...prev, { id: botId, text: "", isBot: true, timestamp: new Date() }]);

    try {
      const history = [...messages, userMessage]
        .filter((m) => m.id !== "welcome" && m.text.trim())
        .map((m) => ({
          role: m.isBot ? ("assistant" as const) : ("user" as const),
          content: m.text,
        }));

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": ANTHROPIC_API_VERSION,
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: history.length > 0 ? history : [{ role: "user", content: text.trim() }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`${response.status}:${errorBody}`);
      }

      const data = await response.json() as {
        content?: Array<{ type?: string; text?: string }>;
      };

      const accumulated = (data.content ?? [])
        .filter((block) => block.type === "text")
        .map((block) => block.text ?? "")
        .join("")
        .trim();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, text: accumulated || "I'm sorry, I didn't quite catch that. Could you try again?" }
            : m
        )
      );

      if (!accumulated) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId
              ? { ...m, text: "I'm sorry, I didn't quite catch that. Could you try again?" }
              : m
          )
        );
      }
    } catch (err) {
      const msg = err instanceof Error && err.message.startsWith("401:")
        ? "It looks like the API key isn't valid. Tap the ⚙ settings to update it."
        : err instanceof Error && err.message.startsWith("429:")
        ? "We've hit the rate limit — give it a moment and try again."
        : "Something went wrong on my end. Please try again shortly.";
      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, text: msg } : m))
      );
    } finally {
      setIsStreaming(false);
    }
  }, [apiKey, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden"
          style={{
            width: "380px",
            height: "580px",
            borderRadius: "20px",
            background: "#ffffff",
            boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "#1b4332" }}
          >
            <div className="relative">
              <AdvisorAvatar size="md" />
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: "#4ade80", borderColor: "#1b4332" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-tight">Rina Ahmad</p>
              <p className="text-xs leading-tight" style={{ color: "#86efac" }}>
                Digital Consultant · Online
              </p>
            </div>
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="p-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.7)" }}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* ── Settings Panel ── */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden flex-shrink-0"
                style={{ background: "#f0fdf4", borderBottom: "1px solid #bbf7d0" }}
              >
                <div className="px-4 py-3 space-y-2">
                  <p className="text-xs font-semibold" style={{ color: "#166534" }}>
                    Anthropic API Key
                  </p>
                  <p className="text-xs" style={{ color: "#4b7a5a" }}>
                    Required to enable AI responses.{" "}
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      style={{ color: "#166534" }}
                    >
                      Get your key →
                    </a>
                  </p>
                  {apiKey ? (
                    <div className="flex items-center gap-2">
                      <span
                        className="flex-1 text-xs px-2 py-1 rounded-lg font-mono truncate"
                        style={{ background: "#dcfce7", color: "#166534" }}
                      >
                        {apiKey.slice(0, 12)}••••••••••••
                      </span>
                      <button
                        onClick={clearApiKey}
                        className="text-xs px-2 py-1 rounded-lg"
                        style={{ background: "#fee2e2", color: "#991b1b" }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="sk-ant-..."
                        value={keyDraft}
                        onChange={(e) => setKeyDraft(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveApiKey()}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border outline-none"
                        style={{ borderColor: "#86efac", fontFamily: "monospace" }}
                      />
                      <button
                        onClick={saveApiKey}
                        className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                        style={{ background: "#1b4332" }}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Message Area ── */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ background: "#f9f6f2" }}
          >
            {/* Date label */}
            <div className="flex justify-center">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "#e7e0d8", color: "#78716c" }}
              >
                Today
              </span>
            </div>

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`flex items-end gap-2 ${msg.isBot ? "justify-start" : "justify-end"}`}
              >
                {msg.isBot && <AdvisorAvatar size="sm" />}

                <div className="flex flex-col gap-0.5" style={{ maxWidth: "76%" }}>
                  <div
                    className="px-3.5 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.isBot
                        ? {
                            background: "#ffffff",
                            color: "#1c1917",
                            borderRadius: "4px 18px 18px 18px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                          }
                        : {
                            background: "#1b4332",
                            color: "#ffffff",
                            borderRadius: "18px 18px 4px 18px",
                          }
                    }
                  >
                    {msg.text === "" && msg.isBot ? (
                      <TypingDots />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                  <span
                    className="text-xs px-1"
                    style={{
                      color: "#a8a29e",
                      textAlign: msg.isBot ? "left" : "right",
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex flex-col gap-2 pl-9"
                >
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      disabled={!apiKey}
                      className="text-left text-xs px-3 py-2 rounded-xl border transition-all disabled:opacity-40"
                      style={{
                        background: "#ffffff",
                        borderColor: "#d6cfc6",
                        color: "#1b4332",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#6ee7b7";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#d6cfc6";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div
            className="flex-shrink-0 px-3 py-3"
            style={{ background: "#ffffff", borderTop: "1px solid #e7e0d8" }}
          >
            {!apiKey && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowSettings(true)}
                className="w-full text-xs py-2 rounded-xl mb-2 font-medium transition-colors"
                style={{ background: "#fef3c7", color: "#92400e" }}
              >
                ⚙ Set up your API key to start chatting
              </motion.button>
            )}
            <div
              className="flex items-end gap-2 rounded-2xl px-3 py-2"
              style={{ background: "#f3ede8", border: "1.5px solid #e7e0d8" }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                placeholder={apiKey ? "Message Rina…" : "API key required"}
                value={inputValue}
                disabled={isStreaming || !apiKey}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed disabled:opacity-40"
                style={{ color: "#1c1917", maxHeight: "96px", lineHeight: "1.5" }}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isStreaming || !apiKey}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: "#1b4332", color: "white" }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-center text-xs mt-1.5" style={{ color: "#c4b8ae" }}>
              Powered by Claude · FutureReadyMY
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
