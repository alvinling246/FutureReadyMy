import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, CheckCircle, CheckCircle2 } from "lucide-react";

interface AssessmentProps {
  onComplete: (results: AssessmentResults) => void;
}

export interface AssessmentResults {
  answers: Record<string, number>;
  totalScore: number;
  maxScore: number;
  category: string;
  categoryColor: string;
  recommendations: string[];
}

export function Assessment({ onComplete }: AssessmentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { watch, setValue } = useForm();
  const answers = watch();

  const handleAnswer = (questionId: string, value: number) => {
    setValue(questionId, value);
  };

  const handleNext = () => {
    if (currentStep < assessmentSections.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const calculateResults = () => {
    let totalScore = 0;
    let maxScore = 0;

    assessmentSections.forEach(section => {
      section.questions.forEach(question => {
        const answer = answers[question.id] || 0;
        totalScore += answer;
        maxScore += 3;
      });
    });

    const percentage = (totalScore / maxScore) * 100;
    let category = "";
    let categoryColor = "";
    let recommendations: string[] = [];

    if (percentage >= 75) {
      category = "Digital Leader";
      categoryColor = "#059669";
      recommendations = [
        "Continue innovating — explore AI-powered tools for business automation",
        "Share your best practices with other SMEs in your industry network",
        "Investigate advanced analytics platforms like Google Looker or Power BI",
        "Explore IoT solutions to optimise operations and reduce costs",
        "Consider applying for MDEC Digital Export programme",
      ];
    } else if (percentage >= 50) {
      category = "Digitally Progressing";
      categoryColor = "#2563eb";
      recommendations = [
        "Strengthen data security: enable MFA on all business accounts today",
        "Implement advanced analytics to gain deeper customer insights",
        "Expand cloud adoption — migrate remaining on-premise data to cloud",
        "Automate repetitive processes using tools like Zapier or Make.com",
        "Look into SME Corp's Digital Economy Grant for funding",
      ];
    } else if (percentage >= 25) {
      category = "Getting Started";
      categoryColor = "#d97706";
      recommendations = [
        "Start with Google Drive or Dropbox for cloud storage (free tiers available)",
        "Implement daily automated backups — use Google Backup or Acronis",
        "Accept Touch 'n Go eWallet or DuitNow for digital payments",
        "Set up Multi-Factor Authentication on email and banking accounts",
        "Create a business Facebook/Instagram page and list on Google Business",
      ];
    } else {
      category = "Needs Attention";
      categoryColor = "#ef4444";
      recommendations = [
        "Urgently back up all business data to an external drive or Google Drive",
        "Transition to digital payments — register for DuitNow QR (free via your bank)",
        "Invest in basic cybersecurity: install antivirus and enable MFA",
        "Enrol staff in free digital literacy training via MDEC's eRezeki programme",
        "Consult a digital transformation expert — MDEC offers subsidised advisory",
      ];
    }

    onComplete({ answers, totalScore, maxScore, category, categoryColor, recommendations });
  };

  const currentSection = assessmentSections[currentStep];
  const progress = ((currentStep + 1) / assessmentSections.length) * 100;
  const isStepComplete = currentSection.questions.every(q => answers[q.id] !== undefined);
  const answeredCount = currentSection.questions.filter(q => answers[q.id] !== undefined).length;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #f5f3ff 100%)" }}>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 max-w-4xl py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: currentSection.color }}>
                {currentStep + 1}
              </div>
              <div>
                <p className="text-xs text-gray-500">Section {currentStep + 1} of {assessmentSections.length}</p>
                <p className="text-sm font-semibold text-gray-900">{currentSection.title}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Progress</p>
              <p className="text-sm font-bold" style={{ color: currentSection.color }}>{Math.round(progress)}%</p>
            </div>
          </div>
          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {assessmentSections.map((s, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: i < currentStep ? s.color : i === currentStep ? `linear-gradient(90deg, ${s.color}, ${s.color}88)` : "#e5e7eb",
                  opacity: i > currentStep ? 0.4 : 1
                }} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {assessmentSections.map((s, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: `${100 / assessmentSections.length}%` }}>
                {i <= currentStep && (
                  <span className="text-xs text-gray-500 hidden md:block truncate px-1 text-center"
                    style={{ color: i === currentStep ? s.color : "#9ca3af", fontSize: "10px" }}>
                    {s.shortTitle}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8">
        {/* Section header card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`header-${currentStep}`}
          className="rounded-2xl p-6 mb-6 flex items-center gap-5"
          style={{ background: `linear-gradient(135deg, ${currentSection.color}18, ${currentSection.color}08)`, border: `1px solid ${currentSection.color}25` }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md"
            style={{ background: `linear-gradient(135deg, ${currentSection.color}, ${currentSection.colorDark})` }}>
            <currentSection.icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentSection.title}</h2>
            <p className="text-sm text-gray-600 mt-0.5">{currentSection.description}</p>
          </div>
          <div className="ml-auto text-right flex-shrink-0">
            <p className="text-2xl font-extrabold" style={{ color: currentSection.color }}>{answeredCount}/{currentSection.questions.length}</p>
            <p className="text-xs text-gray-400">answered</p>
          </div>
        </motion.div>

        {/* Questions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentSection.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: answers[question.id] !== undefined ? currentSection.color : "#d1d5db" }}>
                      {answers[question.id] !== undefined
                        ? <CheckCircle2 className="w-4 h-4" />
                        : qIndex + 1}
                    </span>
                    <p className="font-semibold text-gray-900">{question.text}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option.value;
                    return (
                      <motion.button
                        key={option.value}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(question.id, option.value)}
                        className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all border"
                        style={{
                          background: isSelected ? `${currentSection.color}12` : "#f9fafb",
                          borderColor: isSelected ? currentSection.color : "#e5e7eb",
                          boxShadow: isSelected ? `0 0 0 2px ${currentSection.color}30` : "none",
                        }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{
                            borderColor: isSelected ? currentSection.color : "#d1d5db",
                            background: isSelected ? currentSection.color : "white",
                          }}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm leading-snug" style={{ color: isSelected ? "#111827" : "#4b5563", fontWeight: isSelected ? 600 : 400 }}>
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
            style={{ borderColor: "#d1d5db", color: "#374151" }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {assessmentSections.map((s, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === currentStep ? currentSection.color : i < currentStep ? "#d1fae5" : "#e5e7eb", transform: i === currentStep ? "scale(1.4)" : "scale(1)" }} />
            ))}
          </div>

          <motion.button
            whileHover={isStepComplete ? { scale: 1.02 } : {}}
            whileTap={isStepComplete ? { scale: 0.97 } : {}}
            onClick={handleNext}
            disabled={!isStepComplete}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: isStepComplete ? `linear-gradient(90deg, ${currentSection.color}, ${currentSection.colorDark})` : "#9ca3af" }}
          >
            {currentStep === assessmentSections.length - 1 ? (
              <><CheckCircle className="w-4 h-4" />Complete Assessment</>
            ) : (
              <>Next Section<ChevronRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>

        {!isStepComplete && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Please answer all {currentSection.questions.length} questions to continue ({currentSection.questions.length - answeredCount} remaining)
          </p>
        )}
      </div>
    </div>
  );
}

const assessmentSections = [
  {
    title: "Cloud & Data Storage",
    shortTitle: "Cloud",
    color: "#2563eb",
    colorDark: "#1d4ed8",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    description: "Evaluate your cloud adoption, data backup, and remote access practices",
    questions: [
      {
        id: "cloud_storage",
        text: "Does your business use cloud storage solutions?",
        options: [
          { label: "No, only physical storage", value: 0 },
          { label: "Considering but not yet implemented", value: 1 },
          { label: "Yes, for some data", value: 2 },
          { label: "Yes, extensively for all data", value: 3 }
        ]
      },
      {
        id: "data_backup",
        text: "How often do you back up your business data?",
        options: [
          { label: "Never or rarely", value: 0 },
          { label: "Manually when we remember", value: 1 },
          { label: "Weekly scheduled backups", value: 2 },
          { label: "Daily automated backups", value: 3 }
        ]
      },
      {
        id: "data_access",
        text: "Can your team access business data remotely?",
        options: [
          { label: "No remote access available", value: 0 },
          { label: "Limited remote access only", value: 1 },
          { label: "Most data accessible remotely", value: 2 },
          { label: "Full secure remote access to all systems", value: 3 }
        ]
      }
    ]
  },
  {
    title: "Digital Payments",
    shortTitle: "Payments",
    color: "#7c3aed",
    colorDark: "#6d28d9",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    description: "Assess your digital payment acceptance, online transactions, and reconciliation",
    questions: [
      {
        id: "digital_payments",
        text: "Do you accept digital payments (e-Wallets, DuitNow, online banking)?",
        options: [
          { label: "Cash only", value: 0 },
          { label: "Planning to implement", value: 1 },
          { label: "Some digital payment methods", value: 2 },
          { label: "Multiple digital payment options", value: 3 }
        ]
      },
      {
        id: "online_transactions",
        text: "Do you have an online ordering or booking system?",
        options: [
          { label: "No online system at all", value: 0 },
          { label: "Basic contact form only", value: 1 },
          { label: "Simple online ordering system", value: 2 },
          { label: "Fully integrated e-commerce platform", value: 3 }
        ]
      },
      {
        id: "payment_tracking",
        text: "How do you track and reconcile payments?",
        options: [
          { label: "Manual paper records", value: 0 },
          { label: "Spreadsheets", value: 1 },
          { label: "Basic accounting software", value: 2 },
          { label: "Automated system with real-time tracking", value: 3 }
        ]
      }
    ]
  },
  {
    title: "Data Analytics",
    shortTitle: "Analytics",
    color: "#d97706",
    colorDark: "#b45309",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    description: "Measure how effectively you collect, analyse, and act on business data",
    questions: [
      {
        id: "business_analytics",
        text: "Do you use analytics to understand your business performance?",
        options: [
          { label: "No analytics or tracking", value: 0 },
          { label: "Basic sales tracking only", value: 1 },
          { label: "Some analytics on key metrics", value: 2 },
          { label: "Comprehensive analytics dashboard with KPIs", value: 3 }
        ]
      },
      {
        id: "customer_insights",
        text: "Do you collect and analyse customer data?",
        options: [
          { label: "No customer data collection", value: 0 },
          { label: "Basic contact information only", value: 1 },
          { label: "Track purchase history and preferences", value: 2 },
          { label: "Advanced customer analytics and segmentation", value: 3 }
        ]
      },
      {
        id: "data_decisions",
        text: "How often do you use data to make business decisions?",
        options: [
          { label: "Decisions based on intuition only", value: 0 },
          { label: "Occasionally review data", value: 1 },
          { label: "Regularly consult data for major decisions", value: 2 },
          { label: "Data-driven decision making throughout", value: 3 }
        ]
      }
    ]
  },
  {
    title: "Cybersecurity",
    shortTitle: "Security",
    color: "#ef4444",
    colorDark: "#dc2626",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    description: "Evaluate your security measures, access controls, and staff awareness",
    questions: [
      {
        id: "mfa",
        text: "Do you use Multi-Factor Authentication (MFA)?",
        options: [
          { label: "No MFA implemented", value: 0 },
          { label: "Aware but not yet implemented", value: 1 },
          { label: "MFA for some critical systems", value: 2 },
          { label: "MFA required for all business accounts", value: 3 }
        ]
      },
      {
        id: "password_policy",
        text: "What are your password security practices?",
        options: [
          { label: "No password policy", value: 0 },
          { label: "Basic password requirements", value: 1 },
          { label: "Strong password policy enforced", value: 2 },
          { label: "Password manager + strict policies", value: 3 }
        ]
      },
      {
        id: "security_training",
        text: "Do employees receive cybersecurity training?",
        options: [
          { label: "No training provided", value: 0 },
          { label: "Informal awareness only", value: 1 },
          { label: "Annual security training", value: 2 },
          { label: "Regular ongoing training and updates", value: 3 }
        ]
      }
    ]
  },
  {
    title: "Digital Marketing",
    shortTitle: "Marketing",
    color: "#059669",
    colorDark: "#047857",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    description: "Review your online presence, digital campaigns, and customer engagement",
    questions: [
      {
        id: "online_presence",
        text: "Do you have an active online presence?",
        options: [
          { label: "No website or social media", value: 0 },
          { label: "Basic website or one social platform", value: 1 },
          { label: "Website and multiple social channels", value: 2 },
          { label: "Comprehensive digital presence, regularly updated", value: 3 }
        ]
      },
      {
        id: "digital_marketing",
        text: "Do you run digital marketing campaigns?",
        options: [
          { label: "No digital marketing", value: 0 },
          { label: "Occasional social media posts", value: 1 },
          { label: "Regular content + some paid ads", value: 2 },
          { label: "Strategic multi-channel campaigns", value: 3 }
        ]
      },
      {
        id: "customer_engagement",
        text: "How do you engage with customers online?",
        options: [
          { label: "No online customer engagement", value: 0 },
          { label: "Respond to messages when received", value: 1 },
          { label: "Active service on social media", value: 2 },
          { label: "Multi-channel engagement with CRM", value: 3 }
        ]
      }
    ]
  }
];
