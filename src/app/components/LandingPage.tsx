import { useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  BarChart3, Shield, Cloud, TrendingUp, ArrowRight, CreditCard,
  Globe, Lock, Zap, CheckCircle2, ChevronRight, Star, Users,
  Building2, Award, Play, Menu, X
} from "lucide-react";

interface LandingPageProps {
  onStartAssessment: () => void;
}

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function LandingPage({ onStartAssessment }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">FutureReady<span className="text-blue-600">MY</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#areas" className="hover:text-blue-600 transition-colors">Assessment Areas</a>
              <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                100% Free
              </span>
              <button
                onClick={onStartAssessment}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(90deg, #2563eb, #4f46e5)" }}
              >
                Start Assessment
              </button>
            </div>
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            {["How It Works", "Assessment Areas", "Testimonials"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="block text-sm text-gray-600 hover:text-blue-600 py-1"
                onClick={() => setMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
            <button onClick={onStartAssessment}
              className="w-full mt-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "linear-gradient(90deg, #2563eb, #4f46e5)" }}>
              Start Free Assessment
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative pt-24 pb-20 overflow-hidden" style={{ background: "linear-gradient(160deg, #f0f7ff 0%, #f5f3ff 50%, #fdf4ff 100%)" }}>
        {/* Background blobs */}
        <div className="absolute top-10 left-[-100px] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute bottom-0 right-[-50px] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
                  style={{ background: "rgba(37,99,235,0.07)", borderColor: "rgba(37,99,235,0.2)", color: "#2563eb" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  🇲🇾 FutureReadyMY Initiative 2026
                </div>

                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-6 tracking-tight">
                  Is Your Business<br />
                  <span style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Digitally Ready?
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Free 5-minute self-assessment for Malaysian SMEs. Discover your digital readiness score and get a personalised transformation roadmap.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onStartAssessment}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-white text-lg font-semibold shadow-2xl transition-shadow"
                    style={{
                      background: "linear-gradient(90deg, #2563eb, #4f46e5)",
                      boxShadow: "0 10px 40px rgba(37,99,235,0.35)"
                    }}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Start Free Assessment
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex -space-x-2">
                      {["#2563eb","#7c3aed","#059669","#d97706"].map((c,i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                          {["AR","BK","CN","DS"][i]}
                        </div>
                      ))}
                    </div>
                    <span><strong className="text-gray-800">2,400+</strong> SMEs assessed</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 justify-center lg:justify-start text-sm text-gray-500">
                  {["No registration required", "100% Free forever", "Instant results"].map(t => (
                    <div key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {t}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-shrink-0 w-full lg:w-[420px]"
            >
              <div className="relative">
                {/* Score preview card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                    style={{ background: "radial-gradient(circle, #4f46e5, transparent)" }} />
                  <div className="text-center mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-1">Sample Result Preview</p>
                    <div className="relative w-36 h-36 mx-auto">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad)" strokeWidth="10"
                          strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-extrabold text-gray-900">75%</span>
                        <span className="text-xs text-gray-500">Score</span>
                      </div>
                    </div>
                    <div className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(90deg, #059669, #10b981)" }}>
                      Digital Leader
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Cloud & Data", pct: 90, color: "#3b82f6" },
                      { label: "Digital Payments", pct: 80, color: "#8b5cf6" },
                      { label: "Cybersecurity", pct: 65, color: "#10b981" },
                      { label: "Analytics", pct: 70, color: "#f59e0b" },
                      { label: "Digital Marketing", pct: 75, color: "#ef4444" },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{label}</span><span className="font-semibold">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Floating badges */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium border border-gray-100">
                  <Shield className="w-4 h-4 text-green-500" /><span>MFA Enabled</span>
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium border border-gray-100">
                  <TrendingUp className="w-4 h-4 text-blue-500" /><span>3× Revenue Potential</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-10 border-y border-gray-100" style={{ background: "#f8faff" }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 70, suffix: "%", label: "Malaysian SMEs not fully digital" },
              { value: 2400, suffix: "+", label: "Businesses assessed so far" },
              { value: 5, suffix: " min", label: "Average completion time" },
              { value: 3, suffix: "×", label: "Revenue growth potential" },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <p className="text-4xl font-extrabold mb-1" style={{ background: "linear-gradient(90deg, #2563eb, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <AnimatedCounter end={value} suffix={suffix} />
                </p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three easy steps to understand your digital transformation status and get actionable guidance.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" />
            {[
              { step: "01", icon: Building2, title: "Take the Assessment", desc: "Answer 15 questions across 5 digital areas in under 5 minutes. No sign-up needed.", color: "#2563eb" },
              { step: "02", icon: BarChart3, title: "Get Your Score", desc: "Instantly receive your Digital Readiness Score with detailed breakdown by category.", color: "#7c3aed" },
              { step: "03", icon: TrendingUp, title: "Follow Your Roadmap", desc: "Access personalised recommendations and connect with our digital consultant Rina for guidance.", color: "#059669" },
            ].map(({ step, icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md" style={{ background: `${color}18` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div className="text-xs font-bold text-gray-300 mb-2 tracking-widest">STEP {step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-16 -right-4 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Assessment Areas ── */}
      <section id="areas" className="py-20" style={{ background: "linear-gradient(160deg, #f0f7ff, #f5f3ff)" }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">What We Evaluate</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">5 Critical Digital Areas</h2>
            <p className="text-gray-500 max-w-xl mx-auto">A holistic view of your business's digital readiness across the domains that matter most.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${area.color}15` }}>
                  <area.icon className="w-6 h-6" style={{ color: area.color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{area.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{area.description}</p>
                <div className="mt-4 flex items-center text-xs font-medium" style={{ color: area.color }}>
                  3 questions <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </motion.div>
            ))}
            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 5 * 0.08, duration: 0.4 }}
              onClick={onStartAssessment}
              className="rounded-2xl p-6 cursor-pointer hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Ready to Begin?</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-4">Take the full assessment now — it's free and takes under 5 minutes.</p>
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                Start Assessment <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Success Stories</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Malaysian SMEs Say</h2>
            <p className="text-gray-500">Real feedback from business owners who completed the assessment.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.business}</p>
                  </div>
                  <div className="ml-auto px-2 py-1 rounded-lg text-xs font-medium" style={{ background: `${t.color}15`, color: t.color }}>
                    {t.tier}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners & Trust ── */}
      <section className="py-14 border-y border-gray-100" style={{ background: "#fafafa" }}>
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="text-sm text-gray-400 mb-8 uppercase tracking-widest">Aligned with Malaysia's Digital Economy Agenda</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {partners.map(p => (
              <div key={p.name} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors">
                <p.icon className="w-5 h-5" />
                <span className="text-sm font-semibold">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #7c3aed 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full bg-white"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${3 + Math.random() * 4}s` }} />
          ))}
        </div>
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Your Digital Future<br />Starts Today
            </h2>
            <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of Malaysian SMEs who've discovered their digital gaps and unlocked their growth potential.
            </p>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStartAssessment}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white font-bold text-lg shadow-2xl transition-shadow hover:shadow-white/20"
              style={{ color: "#2563eb" }}
            >
              <Play className="w-5 h-5 fill-blue-600" />
              Begin Your Free Assessment
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <p className="text-blue-300 text-sm mt-5 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />No email required</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Results in 5 minutes</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Free forever</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">FutureReady<span className="text-blue-400">MY</span></span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering Malaysian SMEs to embrace digital transformation with confidence and clarity.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold mb-3 text-sm">Assessment</p>
              <ul className="space-y-2 text-sm">
                {["Cloud & Data", "Digital Payments", "Cybersecurity", "Analytics", "Digital Marketing"].map(l => (
                  <li key={l}><button onClick={onStartAssessment} className="hover:text-white transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3 text-sm">Resources</p>
              <ul className="space-y-2 text-sm">
                {[["MDEC Malaysia", "https://mdec.my"], ["SME Corp", "https://www.smecorp.gov.my"], ["MyDigital", "https://mydigital.gov.my"], ["Cybersecurity MY", "https://www.cybersecurity.my"]].map(([n, u]) => (
                  <li key={n}><a href={u} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{n}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
            <p>© 2026 FutureReadyMY. Free for Malaysian SMEs.</p>
            <p>Powered by AI · Aligned with MyDIGITAL Blueprint</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const assessmentAreas = [
  { icon: Cloud, title: "Cloud & Data Storage", description: "Assess your cloud adoption, data backup practices, and remote access capabilities for resilient operations.", color: "#2563eb" },
  { icon: CreditCard, title: "Digital Payments", description: "Evaluate e-wallet acceptance, online transaction systems, and automated payment reconciliation.", color: "#7c3aed" },
  { icon: BarChart3, title: "Data Analytics", description: "Measure how well you use data to understand performance, customer behaviour, and drive decisions.", color: "#f59e0b" },
  { icon: Lock, title: "Cybersecurity", description: "Review your MFA setup, password policies, and employee security awareness training.", color: "#ef4444" },
  { icon: Globe, title: "Digital Marketing", description: "Check your online presence, digital marketing campaigns, and multi-channel customer engagement.", color: "#059669" },
];

const testimonials = [
  { name: "Ahmad Razif", business: "Kedai Kasut Razif, Johor Bahru", quote: "I had no idea my business was missing so many digital basics until this assessment. The roadmap was eye-opening and helped me prioritise what to fix first.", initials: "AR", tier: "Getting Started", color: "#f59e0b" },
  { name: "Priya Krishnan", business: "PK Catering & Events, Penang", quote: "Rina the digital consultant is amazing! She explained MFA in such simple terms and suggested Touch 'n Go eWallet for my catering business. Sales have grown 40% since.", initials: "PK", tier: "Digitally Progressing", color: "#3b82f6" },
  { name: "Tan Wei Ming", business: "MW Tech Solutions, KL", quote: "As a tech company, I expected a high score — and we got Digital Leader. But the gaps identified in customer analytics were things we genuinely overlooked.", initials: "TW", tier: "Digital Leader", color: "#059669" },
];

const partners = [
  { name: "MDEC Malaysia", icon: Building2 },
  { name: "SME Corp", icon: Users },
  { name: "MyDIGITAL", icon: Globe },
  { name: "Cybersecurity Malaysia", icon: Shield },
  { name: "MITI", icon: Award },
];
