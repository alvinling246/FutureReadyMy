import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

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

interface QuickQA {
  question: string;
  answer: string;
}

const QUICK_QA: QuickQA[] = [
  {
    question: "Where should I start with my roadmap?",
    answer:
      "Start with the top recommendation marked as critical or high priority. Focus on one action at a time — complete it fully before moving to the next. Most SMEs see the fastest results by fixing cloud backup or digital payments first.",
  },
  {
    question: "How do I get started with cloud storage?",
    answer:
      "A good first step is Google Drive or OneDrive so your files are not only on one laptop. Set up shared folders by team, then enable daily auto-backup. This usually takes under half a day and gives immediate protection from data loss.",
  },
  {
    question: "Which e-wallet should I accept first?",
    answer:
      "For Malaysian SMEs, start with DuitNow QR because customers can pay using many banking apps and e-wallets. It's simple to deploy at the counter and helps reduce cash handling. After that, you can add Touch 'n Go or GrabPay based on your customer profile.",
  },
  {
    question: "What is MFA and why do I need it?",
    answer:
      "MFA means users need a second verification step, not only a password. It is one of the fastest ways to reduce account takeover risk. Start by enabling MFA on business email, banking, and cloud accounts first.",
  },
  {
    question: "Are there Malaysian grants for SMEs?",
    answer:
      "Yes — you can explore support programmes from MDEC and SME Corp. Prepare simple documentation first: current digital gaps, expected outcomes, and estimated budget. That makes grant applications much easier and clearer.",
  },
  {
    question: "How do I convince my team to go digital?",
    answer:
      "Start small with one tool that saves time immediately — like WhatsApp Business or a shared cloud folder. Show quick wins in the first week, then involve staff in choosing the next step. People adopt change faster when they see personal benefit, not just company goals.",
  },
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

function AdvisorAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white select-none`}
      style={{ background: "linear-gradient(135deg, #3d7a5c 0%, #1b4332 100%)" }}
    >
      RA
    </div>
  );
}

function getBotReply(input: string) {
  const exact = QUICK_QA.find((item) => item.question === input);
  if (exact) return exact.answer;

  return "Pick one of the quick questions below — I'll share practical guidance for Malaysian SMEs. No sign-up needed, just step-by-step tips you can act on today.";
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm Rina, your digital consultant for FutureReadyMY. Tap a question below and I'll share quick, practical guidance for your business.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const reply = getBotReply(text.trim());
    replyTimerRef.current = setTimeout(() => {
      const botMessage: Message = {
        id: `b-${Date.now()}`,
        text: reply,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
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
          className="fixed z-50 flex flex-col overflow-hidden w-[calc(100vw-2rem)] max-w-[380px] h-[min(580px,calc(100vh-6rem))] right-4 bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))]"
          style={{
            borderRadius: "20px",
            background: "#ffffff",
            boxShadow: "0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
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
                Digital Consultant
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full transition-colors hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.7)" }}
              aria-label="Close chat"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: "#f9f6f2" }}>
            <div className="flex justify-center">
              <span
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: "#e7e0d8", color: "#78716c" }}
              >
                Quick guidance
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
                    <p className="whitespace-pre-wrap">{msg.text}</p>
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

            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <AdvisorAvatar size="sm" />
                <div
                  className="px-3.5 py-2.5 text-sm leading-relaxed"
                  style={{
                    background: "#ffffff",
                    color: "#1c1917",
                    borderRadius: "4px 18px 18px 18px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}

            {!isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 pl-9"
              >
                {QUICK_QA.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(item.question)}
                    className="text-left text-xs px-3 py-2 rounded-xl border transition-all hover:border-[#1b4332]/40 hover:shadow-sm"
                    style={{
                      background: "#ffffff",
                      borderColor: "#d6cfc6",
                      color: "#1b4332",
                      fontWeight: 500,
                    }}
                  >
                    {item.question}
                  </button>
                ))}
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            className="flex-shrink-0 px-4 py-3 text-center"
            style={{ background: "#ffffff", borderTop: "1px solid #e7e0d8" }}
          >
            <p className="text-xs" style={{ color: "#a8a29e" }}>
              Preset guidance only — tap a question above
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
