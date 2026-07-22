import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, MessageCircle, Home, TrendingUp, Award, AlertCircle,
  CheckCircle2, ExternalLink, Zap, Share2, ChevronRight, Star,
  Shield, Users, Target, Clock, DollarSign, BarChart3, Lightbulb,
  ArrowUpRight, ArrowDownRight, Minus, BookOpen, Wrench
} from "lucide-react";
import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine, Legend
} from "recharts";
import type { AssessmentResults } from "./Assessment";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PrioritizedRec {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  timeline: "immediate" | "one-month" | "three-months";
  effort: string;
  effortTime: string;
  cost: string;
  costEst: string;
  tools: string[];
  description: string;
  whyItMatters: string;
  impact: "critical" | "high" | "medium";
  bfc: "better" | "faster" | "cheaper";
  changeChallenge: string;
  changeAction: string;
  resources: { name: string; url: string }[];
}

interface CategoryDatum {
  name: string;
  percentage: number;
  score: number;
  max: number;
  benchmark: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIER_META: Record<string, { color: string; bg: string; gradient: string; icon: React.ElementType; badge: string; readiness: string }> = {
  "Digital Leader":        { color: "#059669", bg: "#ecfdf5", gradient: "linear-gradient(135deg,#059669,#10b981)", icon: Award,        badge: "🏆", readiness: "Advanced" },
  "Digitally Progressing": { color: "#2563eb", bg: "#eff6ff", gradient: "linear-gradient(135deg,#2563eb,#3b82f6)", icon: TrendingUp,   badge: "📈", readiness: "Developing" },
  "Getting Started":       { color: "#d97706", bg: "#fffbeb", gradient: "linear-gradient(135deg,#d97706,#f59e0b)", icon: Zap,          badge: "⚡", readiness: "Beginner" },
  "Needs Attention":       { color: "#ef4444", bg: "#fef2f2", gradient: "linear-gradient(135deg,#ef4444,#f87171)", icon: AlertCircle,  badge: "🔔", readiness: "At Risk" },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Cloud & Data": "#2563eb", "Digital Payments": "#7c3aed",
  "Analytics": "#d97706", "Security": "#ef4444", "Marketing": "#059669",
};

const BENCHMARKS: Record<string, number> = {
  "Cloud & Data": 48, "Digital Payments": 65, "Analytics": 38, "Security": 45, "Marketing": 60,
};
const OVERALL_BENCHMARK = 52;

const TAB_LABELS = [
  { id: "overview",  label: "Overview",          icon: BarChart3 },
  { id: "roadmap",   label: "Action Roadmap",     icon: Target },
  { id: "change",    label: "Change Management",  icon: Users },
  { id: "report",    label: "Full Report",        icon: BookOpen },
] as const;
type TabId = typeof TAB_LABELS[number]["id"];

// ─── Recommendation Engine ────────────────────────────────────────────────────

function generateDetailedRecs(answers: Record<string, number>): PrioritizedRec[] {
  const recs: PrioritizedRec[] = [];
  const a = (id: string) => answers[id] ?? 0;

  if (a("cloud_storage") <= 1) recs.push({
    id: "cloud-setup", title: "Set Up Cloud Storage", category: "Cloud & Data", categoryColor: "#2563eb",
    timeline: "immediate", effort: "Easy", effortTime: "2–4 hours", cost: "Free", costEst: "Free–RM50/mo",
    description: "Migrate business files to Google Drive (free 15 GB) or Microsoft OneDrive. Enable auto-sync on all company devices.",
    whyItMatters: "Physical-only storage means a single hardware failure can result in permanent, unrecoverable data loss.",
    tools: ["Google Drive (Free 15 GB)", "Microsoft OneDrive (Free 5 GB)", "Dropbox Basic (Free 2 GB)"],
    impact: "critical", bfc: "faster",
    changeChallenge: "Staff may resist moving away from familiar local folders.",
    changeAction: "Appoint one 'cloud champion' per team to lead migration. Run a 30-min hands-on session, not a manual.",
    resources: [{ name: "Google Workspace SME Guide", url: "https://workspace.google.com/intl/en/products/docs/" }],
  });

  if (a("data_backup") <= 1) recs.push({
    id: "auto-backup", title: "Enable Automated Daily Backups", category: "Cloud & Data", categoryColor: "#2563eb",
    timeline: "immediate", effort: "Easy", effortTime: "1–2 hours", cost: "Free", costEst: "Free",
    description: "Enable Google Drive or OneDrive auto-sync on all devices. For databases, schedule nightly exports. Test restoration monthly.",
    whyItMatters: "Ransomware and accidental deletion are top SME threats. Without daily backups, one incident = months of lost work.",
    tools: ["Google Backup & Sync (Free)", "Windows Backup (Built-in)", "Backblaze Personal (RM30/mo)"],
    impact: "critical", bfc: "better",
    changeChallenge: "Manual backups get skipped under pressure.",
    changeAction: "Use auto-sync tools that run silently in the background. No user action required once configured.",
    resources: [],
  });

  if (a("data_access") <= 1) recs.push({
    id: "remote-access", title: "Enable Secure Remote Access", category: "Cloud & Data", categoryColor: "#2563eb",
    timeline: "one-month", effort: "Moderate", effortTime: "1–2 days", cost: "RM30–RM50/user/mo", costEst: "RM180–RM300/mo (team of 6)",
    description: "Use Microsoft 365 Business Basic or Google Workspace — both include cloud file access, video calls, and collaboration tools.",
    whyItMatters: "Without remote access, productivity halts during emergencies, travel, or flexible work arrangements.",
    tools: ["Microsoft 365 Business Basic (RM20/user)", "Google Workspace (RM30/user)", "NordLayer VPN (RM50/mo)"],
    impact: "high", bfc: "faster",
    changeChallenge: "Staff unfamiliar with VPN or cloud login procedures.",
    changeAction: "Create a 1-page 'Remote Login Guide' with screenshots. Run a 15-min practice session before go-live.",
    resources: [],
  });

  if (a("digital_payments") <= 1) recs.push({
    id: "duitnow-qr", title: "Register for DuitNow QR", category: "Digital Payments", categoryColor: "#7c3aed",
    timeline: "immediate", effort: "Easy", effortTime: "30 minutes", cost: "Free", costEst: "Free (bank waives fees)",
    description: "Register via your bank's business portal. Print and display your QR code at checkout. All Malaysian e-wallets and banking apps can pay.",
    whyItMatters: "78% of Malaysians now prefer digital payments. Cash-only businesses lose customers at the point of purchase.",
    tools: ["DuitNow QR (Free via any bank)", "Touch 'n Go eWallet", "Boost", "GrabPay", "MAE"],
    impact: "critical", bfc: "faster",
    changeChallenge: "Staff may not know how to verify digital payment screenshots.",
    changeAction: "Train counter staff on verifying DuitNow notifications. Put up a laminated 'How to Pay' guide for customers.",
    resources: [{ name: "PayNet DuitNow Business", url: "https://www.paynet.my/duitnow" }],
  });

  if (a("online_transactions") <= 1) recs.push({
    id: "online-ordering", title: "Add WhatsApp Business Ordering", category: "Digital Payments", categoryColor: "#7c3aed",
    timeline: "immediate", effort: "Easy", effortTime: "2–4 hours", cost: "Free", costEst: "Free",
    description: "Set up WhatsApp Business with a product catalogue and use order form links. Enable quick-reply templates for common queries.",
    whyItMatters: "WhatsApp has 85%+ penetration in Malaysia. An ordering system there meets customers exactly where they are.",
    tools: ["WhatsApp Business (Free)", "Facebook/Instagram Shop (Free)", "Linktree + Google Form (Free)"],
    impact: "high", bfc: "faster",
    changeChallenge: "Managing incoming orders manually can become chaotic.",
    changeAction: "Assign one staff member to own WhatsApp orders. Set auto-replies for business hours and off-hours expectations.",
    resources: [],
  });

  if (a("payment_tracking") <= 1) recs.push({
    id: "accounting-software", title: "Switch to Digital Accounting", category: "Digital Payments", categoryColor: "#7c3aed",
    timeline: "one-month", effort: "Moderate", effortTime: "1–2 days", cost: "Free", costEst: "Free–RM150/mo",
    description: "Replace paper or spreadsheet records with Wave Accounting (free) or QuickBooks. Link your bank account for auto-reconciliation.",
    whyItMatters: "Manual bookkeeping wastes 5–10 hours per week and introduces costly errors at tax time.",
    tools: ["Wave Accounting (Free)", "QuickBooks Simple Start (RM75/mo)", "Xero Starter (RM100/mo)"],
    impact: "high", bfc: "cheaper",
    changeChallenge: "Accounts staff may resist changing a 'system that works'.",
    changeAction: "Run both systems in parallel for 1 month during transition. HRDC grants may fund formal bookkeeping training.",
    resources: [{ name: "Wave Accounting", url: "https://www.waveapps.com" }],
  });

  if (a("business_analytics") <= 1) recs.push({
    id: "google-analytics", title: "Install Google Analytics 4", category: "Analytics", categoryColor: "#d97706",
    timeline: "immediate", effort: "Easy", effortTime: "1–2 hours", cost: "Free", costEst: "Free",
    description: "Add GA4 to your website to track visitors, traffic sources, and goal conversions. Review reports weekly or monthly.",
    whyItMatters: "Without analytics, marketing spend is guesswork. GA4 shows exactly which channels drive sales.",
    tools: ["Google Analytics 4 (Free)", "Google Search Console (Free)", "Meta Business Insights (Free)"],
    impact: "high", bfc: "better",
    changeChallenge: "GA4's interface can feel complex for beginners.",
    changeAction: "Assign analytics ownership to one person. Start with a weekly 'top 3 insights' review — no dashboards required initially.",
    resources: [{ name: "Google Analytics Academy", url: "https://analytics.google.com/analytics/academy" }],
  });

  if (a("customer_insights") <= 1) recs.push({
    id: "crm-setup", title: "Set Up a Basic CRM", category: "Analytics", categoryColor: "#d97706",
    timeline: "three-months", effort: "Medium", effortTime: "1–2 weeks", cost: "Free", costEst: "Free–RM200/mo",
    description: "Start with HubSpot CRM (free for up to 1M contacts) to track customer interactions, purchase history, and follow-ups.",
    whyItMatters: "Without a CRM, repeat customers are invisible. A CRM turns customer relationships into measurable business assets.",
    tools: ["HubSpot CRM (Free)", "Zoho CRM Free Plan", "Salesforce Essentials (RM250/mo)"],
    impact: "medium", bfc: "better",
    changeChallenge: "CRM adoption requires consistent daily data-entry habits from all staff.",
    changeAction: "Start with just 3 fields: name, contact, last purchase date. Add complexity only after staff are comfortable.",
    resources: [{ name: "HubSpot Free CRM", url: "https://www.hubspot.com/products/crm" }],
  });

  if (a("mfa") <= 1) recs.push({
    id: "enable-mfa", title: "Enable Multi-Factor Authentication (MFA)", category: "Security", categoryColor: "#ef4444",
    timeline: "immediate", effort: "Easy", effortTime: "1–2 hours", cost: "Free", costEst: "Free",
    description: "Enable MFA on all business accounts: email, banking, cloud, and social media. Use Microsoft Authenticator or Google Authenticator.",
    whyItMatters: "MFA blocks 99.9% of account-compromise attacks. One stolen password without MFA = full business account access.",
    tools: ["Microsoft Authenticator (Free)", "Google Authenticator (Free)", "Authy (Free)"],
    impact: "critical", bfc: "better",
    changeChallenge: "Staff find MFA inconvenient or worry about phone loss.",
    changeAction: "Explain the personal benefit (protects personal accounts too). Setup takes under 5 minutes per person — do it in a team session.",
    resources: [
      { name: "CyberSAFE Malaysia", url: "https://www.cybersecurity.my/cybersafe" },
      { name: "Microsoft MFA Guide", url: "https://aka.ms/MFASetup" },
    ],
  });

  if (a("password_policy") <= 1) recs.push({
    id: "password-manager", title: "Deploy a Password Manager", category: "Security", categoryColor: "#ef4444",
    timeline: "immediate", effort: "Easy", effortTime: "2–4 hours", cost: "Free", costEst: "Free–RM50/mo (team)",
    description: "Roll out Bitwarden (free, open-source) across all staff. Set minimum 12-character passwords and prohibit reuse across accounts.",
    whyItMatters: "Weak or reused passwords are the #1 cause of SME data breaches in Malaysia. A password manager makes strong passwords effortless.",
    tools: ["Bitwarden Free (Open Source)", "Bitwarden Teams (RM30/mo)", "1Password Teams (RM50/mo)"],
    impact: "critical", bfc: "better",
    changeChallenge: "Staff worry about forgetting the master password or losing access.",
    changeAction: "Create a written emergency recovery sheet stored in a physical safe. Hold a 30-minute setup session for all staff.",
    resources: [{ name: "Bitwarden Free", url: "https://bitwarden.com" }],
  });

  if (a("security_training") <= 1) recs.push({
    id: "security-training", title: "Enrol Staff in Cybersecurity Training", category: "Security", categoryColor: "#ef4444",
    timeline: "one-month", effort: "Easy", effortTime: "4–8 hours (training)", cost: "Free", costEst: "Free–RM500",
    description: "Use CyberSAFE Malaysia's free modules covering phishing, safe browsing, and incident response. Complete as a team activity.",
    whyItMatters: "90% of cyberattacks begin with human error. Trained staff are your most effective — and cheapest — security control.",
    tools: ["CyberSAFE Malaysia (Free)", "MDEC eRezeki Training (Free)", "Google Digital Garage (Free)"],
    impact: "high", bfc: "better",
    changeChallenge: "Training feels like extra work on top of daily tasks.",
    changeAction: "Make it mandatory but fun — add a quiz and celebrate the team completing it. Schedule during a slower business period.",
    resources: [
      { name: "CyberSAFE Malaysia", url: "https://www.cybersecurity.my" },
      { name: "MDEC eRezeki", url: "https://mdec.my/erezeki" },
    ],
  });

  if (a("online_presence") <= 1) recs.push({
    id: "google-business", title: "Create Google Business Profile", category: "Marketing", categoryColor: "#059669",
    timeline: "immediate", effort: "Easy", effortTime: "1–2 hours", cost: "Free", costEst: "Free",
    description: "Claim or create your Google Business Profile to appear on Google Maps and local search. Add photos, hours, services, and collect reviews.",
    whyItMatters: "87% of customers search online before visiting a business. Without a profile, you don't exist in local search.",
    tools: ["Google Business Profile (Free)", "Facebook Business Page (Free)", "Instagram Business Account (Free)"],
    impact: "high", bfc: "cheaper",
    changeChallenge: "Profile can become stale without regular updates.",
    changeAction: "Assign one person to update photos and promotions quarterly. Ask satisfied customers to leave reviews — it's free advertising.",
    resources: [{ name: "Google Business Profile", url: "https://business.google.com" }],
  });

  if (a("digital_marketing") <= 1) recs.push({
    id: "social-media-plan", title: "Launch Regular Social Media Marketing", category: "Marketing", categoryColor: "#059669",
    timeline: "one-month", effort: "Moderate", effortTime: "2–4 hours/week ongoing", cost: "Free–RM500/mo", costEst: "RM0–RM500/mo",
    description: "Post 3–5 times/week on Facebook/Instagram using Canva templates. Run small RM50–100 Facebook ads targeting local customers.",
    whyItMatters: "Digital ads cost 5–10× less than print or outdoor advertising with far better measurable ROI.",
    tools: ["Canva Free (Design)", "Meta Business Suite (Free)", "Google Ads (RM100+ budget)"],
    impact: "high", bfc: "cheaper",
    changeChallenge: "Consistent content creation is time-consuming and often falls behind.",
    changeAction: "Use a monthly content calendar with 4 repeating post types: product highlight, customer story, tip, promotion. Batch-create on one day per month.",
    resources: [{ name: "Meta Blueprint Free Training", url: "https://www.facebook.com/business/learn" }],
  });

  if (a("customer_engagement") <= 1) recs.push({
    id: "digital-customer-service", title: "Set Up Digital Customer Service", category: "Marketing", categoryColor: "#059669",
    timeline: "one-month", effort: "Easy", effortTime: "1 day", cost: "Free", costEst: "Free",
    description: "Enable WhatsApp Business quick-reply templates and set up Meta Business Suite auto-responses. Aim for a 2-hour response time SLA.",
    whyItMatters: "Customers who receive fast responses are 3× more likely to purchase. Slow response is the top reason Malaysian customers switch brands.",
    tools: ["WhatsApp Business (Free)", "Meta Business Suite (Free)", "Tidio Live Chat (Free tier)"],
    impact: "medium", bfc: "faster",
    changeChallenge: "Without defined ownership, messages get missed across multiple channels.",
    changeAction: "Create a simple roster: who handles which platform on which days. Use Meta Business Suite to manage Facebook + Instagram in one inbox.",
    resources: [],
  });

  if (a("cloud_storage") >= 3 && a("data_backup") >= 2) recs.push({
    id: "disaster-recovery", title: "Formalise a Disaster Recovery Plan", category: "Cloud & Data", categoryColor: "#2563eb",
    timeline: "three-months", effort: "High", effortTime: "2–4 weeks", cost: "RM500–RM2,000", costEst: "RM500–RM2,000 (one-time)",
    description: "Document RTO/RPO targets, define staff roles in a crisis, test restoration from backups quarterly. Store the plan offline and in the cloud.",
    whyItMatters: "Good backups are not enough — you need to know exactly how fast you can recover and who does what.",
    tools: ["Veeam Free (SME)", "Azure Backup", "Offsite encrypted HDD + cloud"],
    impact: "medium", bfc: "better",
    changeChallenge: "DR planning requires cross-department buy-in and exec sponsorship.",
    changeAction: "Hold a 2-hour DR workshop. Simulate a 'file loss' scenario. Document the recovery steps and share with all stakeholders.",
    resources: [],
  });

  if (a("digital_marketing") >= 2 && a("customer_insights") >= 1) recs.push({
    id: "email-automation", title: "Implement Email Marketing Automation", category: "Marketing", categoryColor: "#059669",
    timeline: "three-months", effort: "High", effortTime: "2–4 weeks", cost: "Free–RM100/mo", costEst: "Free–RM100/mo",
    description: "Use Mailchimp (free up to 500 contacts) for welcome sequences, post-purchase follow-ups, and promotional campaigns.",
    whyItMatters: "Email marketing delivers RM42 return for every RM1 spent — the highest ROI of any digital channel.",
    tools: ["Mailchimp (Free–RM100/mo)", "Brevo/Sendinblue (Free–RM80/mo)", "Klaviyo"],
    impact: "medium", bfc: "cheaper",
    changeChallenge: "Building an email list requires customer opt-in, which takes time.",
    changeAction: "Start with a simple discount offer for email sign-up. Build the list before building the automation.",
    resources: [{ name: "Mailchimp Free Plan", url: "https://mailchimp.com" }],
  });

  return recs.sort((a, b) => {
    const t = { immediate: 0, "one-month": 1, "three-months": 2 };
    const i = { critical: 0, high: 1, medium: 2 };
    return t[a.timeline] !== t[b.timeline] ? t[a.timeline] - t[b.timeline] : i[a.impact] - i[b.impact];
  });
}

// ─── Category Breakdown ───────────────────────────────────────────────────────

function getCategoryBreakdown(answers: Record<string, number>): CategoryDatum[] {
  const cats: Record<string, string[]> = {
    "Cloud & Data":      ["cloud_storage","data_backup","data_access"],
    "Digital Payments":  ["digital_payments","online_transactions","payment_tracking"],
    "Analytics":         ["business_analytics","customer_insights","data_decisions"],
    "Security":          ["mfa","password_policy","security_training"],
    "Marketing":         ["online_presence","digital_marketing","customer_engagement"],
  };
  return Object.entries(cats).map(([name, ids]) => {
    const score = ids.reduce((s, id) => s + (answers[id] ?? 0), 0);
    const max = ids.length * 3;
    return { name, percentage: Math.round((score / max) * 100), score, max, benchmark: BENCHMARKS[name] ?? 50 };
  });
}

// ─── BFC Computation ─────────────────────────────────────────────────────────

function computeBFC(cats: CategoryDatum[]) {
  const s = (n: string) => cats.find(c => c.name === n)?.percentage ?? 0;
  const betterScore  = Math.round((s("Security") + s("Analytics")) / 2);
  const fasterScore  = Math.round((s("Cloud & Data") + s("Digital Payments")) / 2);
  const cheaperScore = s("Marketing");

  return [
    {
      key: "better", label: "Better", emoji: "🎯", color: "#2563eb",
      score: betterScore, benchmark: 47,
      subtitle: "Quality & Reliability",
      description: "Improve decision quality and protect business integrity through data and security.",
      wins: betterScore < 50
        ? ["MFA blocks 99.9% of account compromises", "Analytics turns guesswork into precision"]
        : betterScore < 75
        ? ["Advanced analytics can raise conversion 15–30%", "Security audits reduce breach risk by 70%"]
        : ["AI-powered insights for competitive edge", "ISO 27001 for enterprise client trust"],
      benefit: betterScore < 50 ? "Reduce security risk by ~80%" : betterScore < 75 ? "Improve decision accuracy by 30–50%" : "Maintain competitive leadership",
    },
    {
      key: "faster", label: "Faster", emoji: "⚡", color: "#7c3aed",
      score: fasterScore, benchmark: 57,
      subtitle: "Speed & Efficiency",
      description: "Cut operational friction through cloud tools, digital payments, and automation.",
      wins: fasterScore < 50
        ? ["Digital payments: cash-to-bank in seconds vs days", "Cloud access: work from anywhere instantly"]
        : fasterScore < 75
        ? ["Automate 40% of manual operations", "WhatsApp ordering cuts quote time by 80%"]
        : ["Full workflow automation with no-code tools", "API integrations between all business systems"],
      benefit: fasterScore < 50 ? "Save 5–10 hrs/week in manual work" : fasterScore < 75 ? "Automate 3–5 manual processes" : "Optimise end-to-end customer journey",
    },
    {
      key: "cheaper", label: "Cheaper", emoji: "💰", color: "#059669",
      score: cheaperScore, benchmark: 60,
      subtitle: "Cost Reduction",
      description: "Replace expensive traditional methods with high-ROI digital alternatives.",
      wins: cheaperScore < 50
        ? ["Digital ads cost 5–10× less than print", "Free tools replace RM500–2,000/mo in software spend"]
        : cheaperScore < 75
        ? ["Email marketing: RM42 return per RM1 spent", "SEO reduces paid ad dependency over time"]
        : ["A/B testing reduces cost-per-customer by 30%", "Marketing automation runs 24/7 at zero marginal cost"],
      benefit: cheaperScore < 50 ? "Save RM1,000–3,000/mo in marketing costs" : cheaperScore < 75 ? "Reduce cost-per-customer by 30–50%" : "Scale reach without scaling spend",
    },
  ];
}

// ─── Category Explanations ────────────────────────────────────────────────────

function getCategoryExplanation(name: string, pct: number): { text: string; strength: string; gap: string } {
  const levels: Record<string, Array<{ max: number; text: string; strength: string; gap: string }>> = {
    "Cloud & Data": [
      { max: 34, text: "Minimal cloud adoption. Your business relies on physical storage, creating high risk of data loss from hardware failure, theft, or disaster.", strength: "You're aware of the need to improve.", gap: "No cloud storage, infrequent or manual backups, no remote access capability." },
      { max: 67, text: "Partial cloud adoption in place. Some data is accessible remotely but backup consistency and team-wide access have gaps.", strength: "Foundation exists — cloud tools are in use.", gap: "Backups may not be daily or automated; remote access isn't seamless for the whole team." },
      { max: 101, text: "Strong cloud infrastructure. Data is well-protected, accessible remotely, and backed up reliably.", strength: "Excellent data resilience and remote-work readiness.", gap: "Consider formalising a Disaster Recovery Plan with defined RTO/RPO targets." },
    ],
    "Digital Payments": [
      { max: 34, text: "Cash-only or very limited digital payment capability. This directly limits your customer base and transaction volume.", strength: "Opportunity to gain significant competitive edge quickly.", gap: "No digital payment acceptance, no online ordering, manual paper-based reconciliation." },
      { max: 67, text: "Some digital payments adopted but gaps in online sales channels or tracking automation.", strength: "Customer-facing payments have improved.", gap: "Online ordering and automated reconciliation are likely missing — these are high-ROI quick wins." },
      { max: 101, text: "Comprehensive digital payment ecosystem. Multiple payment channels, online ordering, and automated accounting.", strength: "Best-in-class payment infrastructure for SMEs.", gap: "Explore integrating payments with inventory and CRM for full operational visibility." },
    ],
    "Analytics": [
      { max: 34, text: "Decisions are largely intuition-based without data support. You're flying without instruments.", strength: "Any analytics implemented from here will deliver immediate ROI.", gap: "No website analytics, no customer data collection, no data-driven decision framework." },
      { max: 67, text: "Basic analytics in use, but customer insights and data-driven decision-making are inconsistent.", strength: "Some analytical thinking is embedded in the business.", gap: "Customer behaviour data and a regular analytics review process are the next steps." },
      { max: 101, text: "Data-driven culture in place. Customer segmentation, KPI tracking, and analytics-informed decisions are standard.", strength: "Your analytics capability is a genuine competitive advantage.", gap: "Explore predictive analytics and AI-assisted forecasting to extend the lead." },
    ],
    "Security": [
      { max: 34, text: "Significant cybersecurity vulnerabilities. A single phishing email or compromised password could expose your entire business.", strength: "All improvements from this baseline deliver outsized protection.", gap: "No MFA, no formal password policy, no staff training — all three are critical and low-cost to fix." },
      { max: 67, text: "Basic security foundations present but gaps in employee training or consistent policy enforcement.", strength: "Core security tools (passwords, some MFA) are in place.", gap: "Security awareness training is typically missing at this level — it closes the human-error gap." },
      { max: 101, text: "Strong cybersecurity posture. MFA, password policies, and regular staff training are standard practice.", strength: "Your business is significantly more resilient than the average Malaysian SME.", gap: "Consider a formal penetration test or security audit to identify hidden vulnerabilities." },
    ],
    "Marketing": [
      { max: 34, text: "Very limited digital presence. You are invisible to the majority of customers who search online before buying.", strength: "Free platforms (Google Business, Facebook) can deliver immediate visibility uplift.", gap: "No website, no social media presence, no digital marketing activity." },
      { max: 67, text: "Basic digital presence established but marketing is inconsistent or primarily organic without paid amplification.", strength: "Customers can find you online.", gap: "Regular content strategy and small paid ads can dramatically increase reach at low cost." },
      { max: 101, text: "Comprehensive digital marketing operation with active campaigns and multi-channel customer engagement.", strength: "Strong brand presence and customer engagement capability.", gap: "Implement marketing automation and A/B testing to reduce cost-per-acquisition further." },
    ],
  };
  const level = (levels[name] ?? levels["Analytics"]).find((l) => pct < l.max);
  return level ? { text: level.text, strength: level.strength, gap: level.gap } : { text: "", strength: "", gap: "" };
}

// ─── Report Generator ────────────────────────────────────────────────────────

function generateReportText(results: AssessmentResults, percentage: number, cats: CategoryDatum[], recs: PrioritizedRec[]): string {
  const tier = TIER_META[results.category];
  const immediate = recs.filter(r => r.timeline === "immediate");
  const oneMonth  = recs.filter(r => r.timeline === "one-month");
  const threeMonths = recs.filter(r => r.timeline === "three-months");

  return `═══════════════════════════════════════════════════════
FUTUREREADYMY — DIGITAL READINESS ASSESSMENT REPORT
═══════════════════════════════════════════════════════
Generated: ${new Date().toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" })}
Campaign: "Is Your Business Digitally Ready?" 2026

─── OVERALL RESULTS ────────────────────────────────────
Readiness Score:  ${percentage}%
Readiness Level:  ${tier?.readiness ?? results.category} (${results.category})
Points Earned:    ${results.totalScore} / ${results.maxScore}
vs. SME Average:  ${OVERALL_BENCHMARK}% (Malaysia SME Digital Index 2026)
Comparison:       ${percentage > OVERALL_BENCHMARK ? `+${percentage - OVERALL_BENCHMARK}% above average` : `${percentage - OVERALL_BENCHMARK}% below average`}

─── CATEGORY BREAKDOWN ─────────────────────────────────
${"Category".padEnd(22)} Your Score  Benchmark  vs. Avg
${"─".repeat(56)}
${cats.map(c => `${c.name.padEnd(22)} ${String(c.percentage + "%").padEnd(11)} ${String(c.benchmark + "%").padEnd(10)} ${c.percentage >= c.benchmark ? "▲ Above" : "▼ Below"}`).join("\n")}

─── STRENGTHS ──────────────────────────────────────────
${cats.filter(c => c.percentage >= 67).length > 0
  ? cats.filter(c => c.percentage >= 67).map(c => `• ${c.name}: ${c.percentage}% — ${getCategoryExplanation(c.name, c.percentage).strength}`).join("\n")
  : "• Focus on building foundational digital capabilities first."}

─── KEY GAPS ───────────────────────────────────────────
${cats.filter(c => c.percentage < 50).map(c => `• ${c.name}: ${c.percentage}% — ${getCategoryExplanation(c.name, c.percentage).gap}`).join("\n") || "• Good coverage across all areas — focus on optimisation."}

─── BETTER · FASTER · CHEAPER FRAMEWORK ───────────────
• Better (Quality):  Target analytics & security improvements
• Faster (Speed):    Digitise payments & enable cloud access
• Cheaper (Cost):    Shift to digital marketing channels

─── PRIORITISED ACTION ROADMAP ─────────────────────────

⚡ IMMEDIATE (This Week):
${immediate.map(r => `  [${r.impact.toUpperCase()}] ${r.title}
   Why: ${r.whyItMatters}
   Cost: ${r.costEst} | Effort: ${r.effortTime}
   Tools: ${r.tools.slice(0,2).join(", ")}
   Staff Note: ${r.changeAction}`).join("\n\n") || "  None required at this stage."}

📅 WITHIN 1 MONTH:
${oneMonth.map(r => `  [${r.impact.toUpperCase()}] ${r.title}
   Why: ${r.whyItMatters}
   Cost: ${r.costEst} | Effort: ${r.effortTime}
   Tools: ${r.tools.slice(0,2).join(", ")}
   Staff Note: ${r.changeAction}`).join("\n\n") || "  None required at this stage."}

🗓️ WITHIN 3 MONTHS:
${threeMonths.map(r => `  [${r.impact.toUpperCase()}] ${r.title}
   Why: ${r.whyItMatters}
   Cost: ${r.costEst} | Effort: ${r.effortTime}
   Tools: ${r.tools.slice(0,2).join(", ")}
   Staff Note: ${r.changeAction}`).join("\n\n") || "  None required at this stage."}

─── CHANGE MANAGEMENT SUMMARY ──────────────────────────
PEOPLE:
  • Appoint a 'Digital Champion' per department
  • Use HRDC training grants for staff upskilling
  • Celebrate quick wins to build digital momentum

PROCESS:
  • Map current workflows before introducing new tools
  • Run 4-week pilots before full rollout
  • Document new SOPs and share with all staff

TECHNOLOGY:
  • Phase 1 (Month 1): Cloud storage + digital payments
  • Phase 2 (Month 2–3): Analytics + security
  • Phase 3 (Month 4–6): Marketing automation + CRM

─── RECOMMENDED RESOURCES ──────────────────────────────
• MDEC SME Digitalisation Grant:  https://mdec.my
• SME Corp Business Support:      https://www.smecorp.gov.my
• MyDIGITAL Blueprint:            https://mydigital.gov.my
• CyberSAFE Malaysia (Free):      https://www.cybersecurity.my
• Google Digital Garage (Free):   https://learndigital.withgoogle.com
• DuitNow QR Registration:        https://www.paynet.my/duitnow
• HubSpot Free CRM:               https://www.hubspot.com/products/crm

═══════════════════════════════════════════════════════
© 2026 FutureReadyMY · Free for Malaysian SMEs
Powered by AI · Aligned with MyDIGITAL Blueprint
═══════════════════════════════════════════════════════
`;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ResultsProps {
  results: AssessmentResults;
  onStartOver: () => void;
  onOpenChatbot: () => void;
}

export function Results({ results, onStartOver, onOpenChatbot }: ResultsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const percentage = Math.round((results.totalScore / results.maxScore) * 100);
  const tier = TIER_META[results.category] ?? TIER_META["Getting Started"];
  const TierIcon = tier.icon;
  const categoryData = getCategoryBreakdown(results.answers);
  const detailedRecs = generateDetailedRecs(results.answers);
  const bfcData = computeBFC(categoryData);
  const vsAvg = percentage - OVERALL_BENCHMARK;

  const handleDownload = () => {
    const blob = new Blob([generateReportText(results, percentage, categoryData, detailedRecs)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `futurereadymy-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #f5f3ff 100%)" }}>

      {/* ── Dark Hero ── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 55%, #1e1b4b 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          {Array(35).fill(0).map((_, i) => (
            <div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-white opacity-40"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
          ))}
        </div>
        <div className="container mx-auto px-4 max-w-6xl py-14 relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-blue-300 text-sm mb-3">
            🇲🇾 FutureReadyMY · {new Date().toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" })}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center text-4xl md:text-5xl font-extrabold text-white mb-10">
            Your Digital Readiness Report
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Radial Score */}
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="58%" outerRadius="88%" barSize={20}
                    data={[{ value: percentage }]} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: "rgba(255,255,255,0.08)" }} dataKey="value" cornerRadius={10} fill={tier.color} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-extrabold text-white">{percentage}%</span>
                  <span className="text-xs text-blue-300 mt-0.5">Readiness Score</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full" style={{ background: vsAvg >= 0 ? "#4ade80" : "#f87171" }} />
                <span className="text-sm" style={{ color: vsAvg >= 0 ? "#4ade80" : "#f87171" }}>
                  {vsAvg >= 0 ? "+" : ""}{vsAvg}% vs. SME avg ({OVERALL_BENCHMARK}%)
                </span>
              </div>
              <p className="text-blue-400 text-xs mt-1">{results.totalScore} / {results.maxScore} points · Malaysia SME Digital Index 2026</p>
            </motion.div>

            {/* Tier */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-col items-center text-center">
              <div className="text-6xl mb-3">{tier.badge}</div>
              <div className="inline-block px-5 py-2 rounded-full text-white font-bold text-lg mb-1" style={{ background: tier.gradient }}>
                {results.category}
              </div>
              <p className="text-blue-200 text-sm mb-4">Readiness Level: <span className="font-semibold text-white">{tier.readiness}</span></p>
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
                {bfcData.map(p => (
                  <div key={p.key} className="rounded-xl p-2.5 text-center" style={{ background: `${p.color}22` }}>
                    <div className="text-lg">{p.emoji}</div>
                    <div className="font-bold text-white text-sm">{p.score}%</div>
                    <div className="text-xs" style={{ color: p.color }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Category Bars */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="space-y-3">
              {categoryData.map(cat => {
                const diff = cat.percentage - cat.benchmark;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-200">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{cat.percentage}%</span>
                        <span className="text-xs" style={{ color: diff >= 0 ? "#4ade80" : "#f87171" }}>
                          {diff >= 0 ? "▲" : "▼"}{Math.abs(diff)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${cat.percentage}%` }} transition={{ delay: 0.5, duration: 0.7 }}
                        className="h-full rounded-full" style={{ background: CATEGORY_COLORS[cat.name] }} />
                      <div className="absolute top-0 h-full w-0.5 bg-white/30" style={{ left: `${cat.benchmark}%` }} />
                    </div>
                    <div className="text-right text-xs mt-0.5" style={{ color: "rgba(147,197,253,0.5)" }}>
                      Avg: {cat.benchmark}%
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              { label: "Chat with Rina", icon: MessageCircle, onClick: onOpenChatbot, style: { background: "linear-gradient(90deg,#059669,#10b981)", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" } as React.CSSProperties },
              { label: "Download Report", icon: Download, onClick: handleDownload, style: { border: "1px solid rgba(255,255,255,0.2)", color: "white" } as React.CSSProperties },
              { label: "Share", icon: Share2, onClick: () => navigator.clipboard?.writeText(`I scored ${percentage}% on FutureReadyMY! Take your assessment free: https://futurereadymy.my`).catch(()=>{}), style: { border: "1px solid rgba(255,255,255,0.2)", color: "white" } as React.CSSProperties },
              { label: "Start Over", icon: Home, onClick: onStartOver, style: { color: "#93c5fd" } as React.CSSProperties },
            ].map(({ label, icon: Icon, onClick, style }) => (
              <button key={label} onClick={onClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:opacity-90"
                style={style}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Tab Bar ── */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex overflow-x-auto hide-scrollbar">
            {TAB_LABELS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0"
                style={{
                  borderBottomColor: activeTab === id ? tier.color : "transparent",
                  color: activeTab === id ? tier.color : "#6b7280",
                  background: activeTab === id ? `${tier.color}08` : "transparent",
                }}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* ══ OVERVIEW TAB ══ */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Category Score Cards with explanations */}
                <div>
                  <h2 className="font-bold text-gray-900 text-xl mb-1">Category Breakdown & Score Explanations</h2>
                  <p className="text-sm text-gray-500 mb-5">What your scores mean and where the gaps lie</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryData.map(cat => {
                      const exp = getCategoryExplanation(cat.name, cat.percentage);
                      const diff = cat.percentage - cat.benchmark;
                      return (
                        <div key={cat.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `3px solid ${CATEGORY_COLORS[cat.name]}` }}>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ background: CATEGORY_COLORS[cat.name] }} />
                              <span className="font-bold text-gray-900">{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="text-2xl font-extrabold" style={{ color: CATEGORY_COLORS[cat.name] }}>{cat.percentage}%</div>
                                <div className="text-xs flex items-center gap-1 justify-end" style={{ color: diff >= 0 ? "#059669" : "#ef4444" }}>
                                  {diff >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                  {Math.abs(diff)}% vs avg ({cat.benchmark}%)
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="px-5 py-4 space-y-3">
                            <p className="text-sm text-gray-600 leading-relaxed">{exp.text}</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="rounded-xl p-3" style={{ background: "#f0fdf4" }}>
                                <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Strength</p>
                                <p className="text-xs text-green-800 leading-snug">{exp.strength}</p>
                              </div>
                              <div className="rounded-xl p-3" style={{ background: "#fef2f2" }}>
                                <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Gap</p>
                                <p className="text-xs text-red-800 leading-snug">{exp.gap}</p>
                              </div>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, background: CATEGORY_COLORS[cat.name] }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Benchmark Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-1">Benchmark: You vs. Malaysian SME Average</h3>
                  <p className="text-sm text-gray-500 mb-5">Malaysia SME Digital Index 2026 — sample of 2,400+ businesses</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={categoryData} barSize={28} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} formatter={(v: number, name: string) => [`${v}%`, name === "percentage" ? "Your Score" : "SME Average"]} />
                      <Legend formatter={v => v === "percentage" ? "Your Score" : "SME Average"} />
                      <Bar dataKey="percentage" name="percentage" radius={[6, 6, 0, 0]}>
                        {categoryData.map(cat => <Cell key={cat.name} fill={CATEGORY_COLORS[cat.name]} />)}
                      </Bar>
                      <Bar dataKey="benchmark" name="benchmark" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* BFC Dashboard */}
                <div>
                  <h2 className="font-bold text-gray-900 text-xl mb-1">Better · Faster · Cheaper Dashboard</h2>
                  <p className="text-sm text-gray-500 mb-5">How digital transformation improves your business across three dimensions</p>
                  <div className="grid md:grid-cols-3 gap-5">
                    {bfcData.map(pillar => {
                      const diff = pillar.score - pillar.benchmark;
                      return (
                        <div key={pillar.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          <div className="px-5 py-4" style={{ background: `${pillar.color}10`, borderBottom: `2px solid ${pillar.color}30` }}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{pillar.emoji}</span>
                                <div>
                                  <p className="font-extrabold text-gray-900">{pillar.label}</p>
                                  <p className="text-xs text-gray-500">{pillar.subtitle}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-extrabold" style={{ color: pillar.color }}>{pillar.score}%</p>
                                <p className="text-xs" style={{ color: diff >= 0 ? "#059669" : "#ef4444" }}>
                                  {diff >= 0 ? `+${diff}` : diff}% vs avg
                                </p>
                              </div>
                            </div>
                            <div className="h-2 rounded-full bg-white/60 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${pillar.score}%`, background: pillar.color }} />
                            </div>
                          </div>
                          <div className="px-5 py-4 space-y-3">
                            <p className="text-xs text-gray-600 leading-relaxed">{pillar.description}</p>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1.5">Top Wins for You:</p>
                              <ul className="space-y-1.5">
                                {pillar.wins.map((w, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: pillar.color }} />
                                    {w}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-xl p-2.5 text-xs" style={{ background: `${pillar.color}10` }}>
                              <span className="font-semibold" style={{ color: pillar.color }}>Estimated Benefit: </span>
                              <span className="text-gray-700">{pillar.benefit}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ══ ROADMAP TAB ══ */}
            {activeTab === "roadmap" && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-bold text-gray-900 text-xl mb-1">Prioritised Action Roadmap</h2>
                  <p className="text-sm text-gray-500 mb-1">Actions personalised to your assessment answers, sorted by urgency and impact</p>
                  <div className="flex flex-wrap gap-3 mb-6 text-xs">
                    {[{ label: "Critical", color: "#ef4444" }, { label: "High", color: "#f59e0b" }, { label: "Medium", color: "#3b82f6" }].map(b => (
                      <span key={b.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium border" style={{ color: b.color, borderColor: `${b.color}40`, background: `${b.color}0f` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: b.color }} />{b.label} Priority
                      </span>
                    ))}
                  </div>
                </div>

                {[
                  { key: "immediate", label: "⚡ Immediate — This Week", sublabel: "Do these first. Low cost, high impact, quick wins.", color: "#ef4444" },
                  { key: "one-month", label: "📅 Within 1 Month", sublabel: "Schedule these after quick wins are in place.", color: "#d97706" },
                  { key: "three-months", label: "🗓️ Within 3 Months", sublabel: "Strategic improvements once foundations are set.", color: "#2563eb" },
                ].map(({ key, label, sublabel, color }) => {
                  const group = detailedRecs.filter(r => r.timeline === key);
                  if (group.length === 0) return null;
                  return (
                    <div key={key}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-0.5 w-5 rounded-full" style={{ background: color }} />
                        <div>
                          <h3 className="font-bold text-gray-900">{label}</h3>
                          <p className="text-xs text-gray-500">{sublabel}</p>
                        </div>
                        <div className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: color }}>
                          {group.length} action{group.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div className="space-y-4">
                        {group.map(rec => (
                          <RecCard key={rec.id} rec={rec} onChatClick={onOpenChatbot} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ══ CHANGE MANAGEMENT TAB ══ */}
            {activeTab === "change" && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-bold text-gray-900 text-xl mb-1">Change Management Guidance</h2>
                  <p className="text-sm text-gray-500">Digital transformation is 20% technology and 80% people. Here's how to manage the human side.</p>
                </div>

                {/* 3 Pillars */}
                <div className="grid md:grid-cols-3 gap-5">
                  {changePillars.map(pillar => (
                    <div key={pillar.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-5 py-4 flex items-center gap-3" style={{ background: `${pillar.color}10`, borderBottom: `2px solid ${pillar.color}25` }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${pillar.color}20` }}>
                          <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{pillar.title}</p>
                          <p className="text-xs text-gray-500">{pillar.subtitle}</p>
                        </div>
                      </div>
                      <div className="px-5 py-4 space-y-3">
                        {pillar.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: pillar.color }} />
                            <p className="text-sm text-gray-700 leading-snug">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Implementation Phases */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-1">Phased Implementation Timeline</h3>
                  <p className="text-sm text-gray-500 mb-5">Avoid change fatigue by rolling out digital tools in structured phases</p>
                  <div className="space-y-4">
                    {implementationPhases.map((phase, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: phase.color }}>
                          {i + 1}
                        </div>
                        <div className="flex-1 border border-gray-100 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900">{phase.title}</p>
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${phase.color}15`, color: phase.color }}>
                              {phase.timeline}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{phase.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.tools.map(t => (
                              <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change-related rec cards from roadmap */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Staff Adaptation Notes</h3>
                  <p className="text-sm text-gray-500 mb-4">How to bring your team along for each recommendation</p>
                  <div className="space-y-3">
                    {detailedRecs.filter(r => r.timeline === "immediate" || r.timeline === "one-month").slice(0, 6).map(rec => (
                      <div key={rec.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${rec.categoryColor}15` }}>
                          <Users className="w-4 h-4" style={{ color: rec.categoryColor }} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{rec.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-snug"><span className="font-medium text-amber-700">Challenge:</span> {rec.changeChallenge}</p>
                          <p className="text-xs text-gray-600 mt-1 leading-snug"><span className="font-medium text-green-700">Action:</span> {rec.changeAction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training resources */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Staff Training Resources (Free)</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {trainingResources.map(r => (
                      <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group">
                        <span className="text-xl flex-shrink-0">{r.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{r.title}</p>
                          <p className="text-xs text-gray-500 truncate">{r.desc}</p>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ FULL REPORT TAB ══ */}
            {activeTab === "report" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900 text-xl mb-1">Full Digital Readiness Report</h2>
                    <p className="text-sm text-gray-500">Complete report with scores, benchmarks, roadmap, and change guidance</p>
                  </div>
                  <button onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(90deg,#2563eb,#4f46e5)" }}>
                    <Download className="w-4 h-4" />Download .txt
                  </button>
                </div>

                {/* Report Preview */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="px-8 py-6 text-center" style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)" }}>
                    <p className="text-blue-300 text-xs mb-1">🇲🇾 FutureReadyMY</p>
                    <h3 className="text-xl font-extrabold text-white mb-1">Digital Readiness Assessment Report</h3>
                    <p className="text-blue-200 text-sm">{new Date().toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Overall */}
                    <section>
                      <SectionTitle icon={Award} label="Overall Results" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        {[
                          { label: "Readiness Score", value: `${percentage}%` },
                          { label: "Readiness Level", value: tier.readiness },
                          { label: "Tier", value: results.category },
                          { label: "vs. SME Average", value: `${vsAvg >= 0 ? "+" : ""}${vsAvg}%` },
                        ].map(({ label, value }) => (
                          <div key={label} className="rounded-xl p-4 text-center border border-gray-100" style={{ background: `${tier.color}08` }}>
                            <p className="text-lg font-extrabold" style={{ color: tier.color }}>{value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Category Breakdown */}
                    <section>
                      <SectionTitle icon={BarChart3} label="Category-by-Category Breakdown" />
                      <div className="mt-4 space-y-3">
                        {categoryData.map(cat => {
                          const exp = getCategoryExplanation(cat.name, cat.percentage);
                          return (
                            <div key={cat.name} className="rounded-xl border border-gray-100 overflow-hidden">
                              <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: `${CATEGORY_COLORS[cat.name]}0a` }}>
                                <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat.name] }} />
                                <span className="font-semibold text-gray-900 text-sm flex-1">{cat.name}</span>
                                <span className="font-bold text-sm" style={{ color: CATEGORY_COLORS[cat.name] }}>{cat.percentage}%</span>
                                <span className="text-xs text-gray-400">Avg: {cat.benchmark}%</span>
                              </div>
                              <div className="px-4 py-3 grid sm:grid-cols-3 gap-3 text-xs text-gray-600">
                                <div><span className="font-medium text-gray-700">Analysis: </span>{exp.text.slice(0, 80)}…</div>
                                <div><span className="font-medium text-green-700">✓ Strength: </span>{exp.strength}</div>
                                <div><span className="font-medium text-red-700">⚠ Gap: </span>{exp.gap.slice(0, 70)}…</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* BFC */}
                    <section>
                      <SectionTitle icon={Target} label="Better · Faster · Cheaper Framework" />
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        {bfcData.map(p => (
                          <div key={p.key} className="rounded-xl border border-gray-100 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{p.emoji}</span>
                              <div>
                                <p className="font-bold text-gray-900">{p.label}: {p.score}%</p>
                                <p className="text-xs text-gray-500">{p.subtitle}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{p.description}</p>
                            <p className="text-xs font-semibold" style={{ color: p.color }}>{p.benefit}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Prioritised Actions */}
                    <section>
                      <SectionTitle icon={Target} label="Prioritised Action Roadmap" />
                      {[
                        { key: "immediate", label: "⚡ Immediate (This Week)" },
                        { key: "one-month", label: "📅 Within 1 Month" },
                        { key: "three-months", label: "🗓️ Within 3 Months" },
                      ].map(({ key, label }) => {
                        const group = detailedRecs.filter(r => r.timeline === key);
                        if (!group.length) return null;
                        return (
                          <div key={key} className="mt-4">
                            <p className="font-semibold text-gray-800 mb-2 text-sm">{label}</p>
                            <div className="space-y-2">
                              {group.map(r => (
                                <div key={r.id} className="flex items-start gap-3 text-sm p-3 rounded-xl bg-gray-50 border border-gray-100">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: CATEGORY_COLORS[r.category] }}>✓</div>
                                  <div className="flex-1">
                                    <span className="font-medium text-gray-900">{r.title}</span>
                                    <span className="text-gray-500 text-xs ml-2">· {r.costEst} · {r.effortTime}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </section>

                    {/* Change Management Summary */}
                    <section>
                      <SectionTitle icon={Users} label="Change Management Summary" />
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        {changePillars.map(p => (
                          <div key={p.title} className="rounded-xl border border-gray-100 p-4">
                            <p className="font-semibold text-gray-900 mb-2 text-sm">{p.title}</p>
                            <ul className="space-y-1">
                              {p.items.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                  <span className="text-gray-400 flex-shrink-0">•</span>{item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Resources */}
                    <section>
                      <SectionTitle icon={BookOpen} label="Malaysian Digital Resources" />
                      <div className="grid sm:grid-cols-2 gap-3 mt-4">
                        {reportResources.map(r => (
                          <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 transition-all group text-sm">
                            <span className="text-lg">{r.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 group-hover:text-blue-600">{r.title}</p>
                              <p className="text-xs text-gray-500 truncate">{r.desc}</p>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400" />
                          </a>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="px-8 py-5 text-center text-xs text-gray-400 border-t border-gray-100" style={{ background: "#fafafa" }}>
                    © 2026 FutureReadyMY · Free for Malaysian SMEs · Powered by AI · Aligned with MyDIGITAL Blueprint
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Chat CTA ── */}
      <div className="container mx-auto px-4 max-w-6xl pb-8">
        <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6"
          style={{ background: "linear-gradient(135deg,#1b4332,#2d6a4f)" }}>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">RA</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-white text-lg mb-1">Got questions? Chat with Rina Ahmad</h3>
            <p className="text-green-200 text-sm">Ask me about any recommendation, Malaysian grants, tool choices, or how to convince your team to go digital.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={onOpenChatbot}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-lg"
              style={{ color: "#1b4332" }}>
              <MessageCircle className="w-4 h-4" />Chat with Rina
            </button>
            <button onClick={onStartOver}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-green-200 hover:text-white border border-white/20 transition-all">
              <Home className="w-4 h-4" />Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RecCard Sub-Component ────────────────────────────────────────────────────

function RecCard({ rec, onChatClick }: { rec: PrioritizedRec; onChatClick: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const impactColors: Record<string, string> = { critical: "#ef4444", high: "#d97706", medium: "#3b82f6" };

  return (
    <motion.div layout className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${rec.categoryColor}15` }}>
            <Wrench className="w-5 h-5" style={{ color: rec.categoryColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <h4 className="font-bold text-gray-900">{rec.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white flex-shrink-0"
                style={{ background: impactColors[rec.impact] ?? "#6b7280" }}>
                {rec.impact}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{rec.description}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 mt-3 pl-14">
          <MetaPill icon={DollarSign} label={rec.costEst} color={rec.categoryColor} />
          <MetaPill icon={Clock} label={rec.effortTime} color={rec.categoryColor} />
          <MetaPill icon={Target} label={rec.bfc.charAt(0).toUpperCase() + rec.bfc.slice(1)} color={rec.categoryColor} />
          <MetaPill icon={BarChart3} label={rec.category} color={rec.categoryColor} />
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5 mt-3 pl-14">
          {rec.tools.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: `${rec.categoryColor}10`, color: rec.categoryColor }}>{t}</span>
          ))}
        </div>

        <button onClick={() => setExpanded(v => !v)}
          className="mt-3 ml-14 text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-70"
          style={{ color: rec.categoryColor }}>
          {expanded ? "Show less" : "View full details"}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 pt-0 space-y-4 border-t border-gray-50">
              <div className="grid sm:grid-cols-2 gap-3 pt-4">
                <div className="rounded-xl p-3.5" style={{ background: "#fef2f2" }}>
                  <p className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" />Why It Matters</p>
                  <p className="text-xs text-red-800 leading-relaxed">{rec.whyItMatters}</p>
                </div>
                <div className="rounded-xl p-3.5" style={{ background: "#fefce8" }}>
                  <p className="text-xs font-semibold text-amber-700 mb-1.5 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Staff Adaptation</p>
                  <p className="text-xs text-amber-800 leading-relaxed"><strong>Challenge:</strong> {rec.changeChallenge}</p>
                  <p className="text-xs text-amber-800 leading-relaxed mt-1"><strong>Action:</strong> {rec.changeAction}</p>
                </div>
              </div>
              {rec.resources.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Helpful Resources:</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.resources.map(r => (
                      <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors hover:bg-blue-50"
                        style={{ borderColor: "#e5e7eb", color: "#2563eb" }}>
                        {r.name}<ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={onChatClick}
                className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ background: "#f0fdf4", color: "#1b4332" }}>
                <MessageCircle className="w-3.5 h-3.5" />Ask Rina about this recommendation →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MetaPill({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}10`, color }}>
      <Icon className="w-3 h-3" />{label}
    </span>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
      <Icon className="w-4 h-4 text-blue-600" />
      <h4 className="font-bold text-gray-900">{label}</h4>
    </div>
  );
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const changePillars = [
  {
    title: "People",
    subtitle: "Managing staff through change",
    color: "#7c3aed",
    icon: Users,
    items: [
      "Appoint a 'Digital Champion' per department to lead adoption",
      "Explain the personal benefits of each new tool, not just business benefits",
      "Celebrate small wins publicly (e.g., first DuitNow QR sale)",
      "Use HRDC grants to fund formal digital skills training",
      "Allow a 2–4 week adjustment period before enforcing new workflows",
      "Gather staff feedback 30 days after each tool launch",
    ],
  },
  {
    title: "Process",
    subtitle: "Redesigning workflows for digital",
    color: "#d97706",
    icon: Wrench,
    items: [
      "Map all current manual workflows before introducing any new tool",
      "Identify the 3 most time-consuming manual processes — digitalise those first",
      "Run a 4-week pilot with one team before company-wide rollout",
      "Update SOPs (standard operating procedures) in writing after each change",
      "Set clear KPIs for each digital tool (e.g., 'DuitNow handles 60% of payments by Month 2')",
      "Review and refine processes quarterly",
    ],
  },
  {
    title: "Technology",
    subtitle: "Phased tool implementation",
    color: "#2563eb",
    icon: Zap,
    items: [
      "Never introduce more than 2 new tools simultaneously",
      "Phase 1: Foundational (cloud storage + digital payments)",
      "Phase 2: Operational (accounting software + analytics)",
      "Phase 3: Strategic (CRM + marketing automation)",
      "Prefer free tiers to validate a tool before committing to paid plans",
      "Document all tool credentials in a password manager from day one",
    ],
  },
];

const implementationPhases = [
  {
    title: "Phase 1: Digital Foundations",
    timeline: "Month 1",
    color: "#ef4444",
    description: "Secure your data and enable basic digital transactions. These are non-negotiable foundations.",
    tools: ["Google Drive / OneDrive", "DuitNow QR", "Microsoft Authenticator", "Bitwarden"],
  },
  {
    title: "Phase 2: Operational Efficiency",
    timeline: "Month 2–3",
    color: "#d97706",
    description: "Streamline daily operations with accounting, analytics, and customer service tools.",
    tools: ["Wave Accounting / QuickBooks", "Google Analytics 4", "WhatsApp Business", "CyberSAFE Training"],
  },
  {
    title: "Phase 3: Growth & Automation",
    timeline: "Month 4–6",
    color: "#2563eb",
    description: "Scale with CRM, email automation, and advanced marketing to accelerate growth.",
    tools: ["HubSpot CRM Free", "Mailchimp", "Meta Ads", "Google Business Profile"],
  },
  {
    title: "Phase 4: Optimisation",
    timeline: "Month 7–12",
    color: "#059669",
    description: "Refine and optimise based on data. Explore AI tools and apply for MDEC grants.",
    tools: ["Power BI / Looker Studio", "Marketing A/B Testing", "MDEC Digitalisation Grant", "ISO 27001 Readiness"],
  },
];

const trainingResources = [
  { title: "CyberSAFE Malaysia", desc: "Free cybersecurity awareness modules", url: "https://www.cybersecurity.my/cybersafe", emoji: "🔒" },
  { title: "Google Digital Garage", desc: "Free digital marketing & analytics courses", url: "https://learndigital.withgoogle.com", emoji: "🎓" },
  { title: "MDEC eRezeki", desc: "Digital skills & income programmes for Malaysians", url: "https://mdec.my/erezeki", emoji: "💡" },
  { title: "Meta Blueprint", desc: "Free Facebook & Instagram advertising training", url: "https://www.facebook.com/business/learn", emoji: "📱" },
  { title: "Google Analytics Academy", desc: "Free GA4 certification course", url: "https://analytics.google.com/analytics/academy", emoji: "📊" },
  { title: "HubSpot Academy", desc: "Free CRM, sales & marketing certifications", url: "https://academy.hubspot.com", emoji: "🏆" },
];

const reportResources = [
  { title: "MDEC Malaysia", desc: "SME Digitalisation Grants & programmes", url: "https://mdec.my", emoji: "🏛️" },
  { title: "SME Corp Malaysia", desc: "Business support and digitalisation grants", url: "https://www.smecorp.gov.my", emoji: "💼" },
  { title: "MyDIGITAL Blueprint", desc: "Malaysia's national digital economy plan", url: "https://mydigital.gov.my", emoji: "🇲🇾" },
  { title: "Cybersecurity Malaysia", desc: "Security resources for Malaysian businesses", url: "https://www.cybersecurity.my", emoji: "🔒" },
  { title: "DuitNow QR (PayNet)", desc: "Register for free merchant digital payments", url: "https://www.paynet.my/duitnow", emoji: "📱" },
  { title: "HRDC Training Grants", desc: "Subsidised training grants for staff upskilling", url: "https://www.hrdc.com.my", emoji: "🎓" },
];
