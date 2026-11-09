import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCRM } from '../../context/CRMContext';
import { 
  TEAM_KRK_MEMBERS, 
  TEAM_KRK_OFFICIAL_EMAIL, 
  PLANS_INFO, 
  ROLES_CONFIG,
  CLIENT_DOMAIN,
  CLIENT_GITHUB,
  TEAM_KRK_PHOTO_URL
} from '../../data/initialData';
import { SubscriptionPlan, UserRole } from '../../types/crm';
import { AboutUsSection } from '../about/AboutUsSection';
import { 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Users, 
  Zap, 
  ArrowRight, 
  Phone, 
  Mail, 
  Database, 
  Server, 
  Check, 
  Lock, 
  Sparkles, 
  BarChart3, 
  Headphones, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Shield,
  FileText
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentView, 
    setPlan, 
    plan, 
    setActiveRole, 
    setActiveTab, 
    settings,
    startDialing 
  } = useCRM();

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('agent');

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors selection:bg-red-600 selection:text-white">
      
      {/* 1. Hero Section with Framer Motion Entrance Animations */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-neutral-200 dark:border-neutral-800/80">
        {/* Ambient subtle red aura glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 dark:bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline / Subtitle with motion */}
            <motion.div 
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Next-Gen Calling & Sales Ops Platform</span>
              <span aria-hidden="true">·</span>
              <span>Engineered by TEAM KRK</span>
            </motion.div>

            {/* Headline with motion */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white [text-wrap:balance]"
            >
              The High-Velocity Telephony & Quality Audit CRM.
            </motion.h1>

            {/* Subtext with motion */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal max-w-2xl mx-auto"
            >
              Built from the ground up for high-volume call centers and scaling sales teams. Seamlessly integrates agent dialers, 5-point QA audits, and granular role hierarchies into a unified SaaS engine.
            </motion.p>

            {/* CTAs with motion */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={() => {
                  setCurrentView('crm');
                  setActiveTab('dashboard');
                }}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Launch CRM Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('crm');
                  setActiveTab('calling');
                  startDialing('+91 98201 44521');
                }}
                className="px-6 py-3.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-red-800/40 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                <span>Test Live Dialer Console</span>
              </button>
            </motion.div>

            {/* Trust specs row with motion */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Enterprise RBAC (6 Dedicated Roles)</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <span>Dual Tiers: Aura & Aura+</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-500" />
                <span>Firebase & MongoDB Atlas Ready</span>
              </div>
            </motion.div>

          </div>

          {/* Interactive Workspace Mockup Preview */}
          <div className="mt-12 max-w-5xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-neutral-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono ml-2">
                  auracrm.workspace // preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  Active Tier: {plan === 'aura_plus' ? 'Aura+ (All 6 Roles)' : 'Aura (3 Roles)'}
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50/50 dark:bg-neutral-900/50">
              
              {/* Teaser 1: Live Call Simulation */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Agent Telephony</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Call Console
                  </span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Singhania Logistics Ltd
                </h4>
                <p className="text-xs font-mono text-neutral-500">+91 98201 44521</p>
                <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-[11px] text-neutral-600 dark:text-neutral-400">
                  Disposition: Interested · Callback in 24h
                </div>
                <button
                  onClick={() => {
                    setCurrentView('crm');
                    setActiveTab('calling');
                    startDialing('+91 98201 44521');
                  }}
                  className="w-full py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
                >
                  Open Live Dialer
                </button>
              </div>

              {/* Teaser 2: QA Scorecard */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Aura+ QA Audit</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">92 / 100 Score</span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Call #201 · Passed
                </h4>
                <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex justify-between text-[11px]">
                    <span>Pitch Clarity</span>
                    <span className="font-mono font-bold">19 / 20</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Script Adherence</span>
                    <span className="font-mono font-bold">18 / 20</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>Compliance Disclaimer</span>
                    <span className="font-mono font-bold">19 / 20</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setPlan('aura_plus');
                    setCurrentView('crm');
                    setActiveRole('audit_qa');
                    setActiveTab('qa_audit');
                  }}
                  className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  Inspect QA Evaluator
                </button>
              </div>

              {/* Teaser 3: Role Management */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">RBAC Hierarchy</span>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">6 Granular Roles</span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Administration Control
                </h4>
                <p className="text-xs text-neutral-500 leading-normal">
                  Toggle permissions, reassign agent queues, and audit call recordings with zero leakage.
                </p>
                <button
                  onClick={() => {
                    setCurrentView('crm');
                    setActiveTab('team');
                  }}
                  className="w-full py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  Explore Team Permissions
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Key CRM Features */}
      <section id="features" className="py-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Purpose-Built Architecture
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white [text-wrap:balance]">
              Everything Your Telephony & Sales Organization Requires
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Eliminate disjointed dialers, spreadsheets, and manual quality auditing. AURA CRM centralizes the complete lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Agent Calling Console
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Single-click outbound calling, simulated DTMF keypad audio, active call duration counter, mute/hold toggles, and instant disposition logging.
              </p>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                Available in Aura & Aura+
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Quality Assurance (QA) Audits
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Comprehensive 5-point rubric grading (Greeting, Need Discovery, Pitch Clarity, Objection Handling, Compliance Etiquette) with actionable agent coaching feedback.
              </p>
              <div className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">
                Exclusive to Aura+
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Dynamic Pipeline & Kanban
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Visual Kanban board and high-density tabular view with real-time lead score calculations, priority filters, and one-click lead assignments.
              </p>
              <div className="text-xs font-mono text-blue-600 dark:text-blue-400">
                Available in Aura & Aura+
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Rigorous RBAC Governance
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Dedicated permission silos: Administration, Admin, Manager, Team Lead, Audit (QA), and Calling Agent. Role escalation prevention built-in.
              </p>
              <div className="text-xs font-mono text-purple-600 dark:text-purple-400">
                Plan-tiered role activation
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Telephony & Conversion Analytics
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Track dials per agent, average handle duration (AHT), connected rate, conversion funnel velocity, and top performer deal closure statistics.
              </p>
              <div className="text-xs font-mono text-amber-600 dark:text-amber-400">
                Deep analytics in Aura+
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Portable JSON & Cloud Sync
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Full database backup export/import in one click. Fully ready for zero-cost deployment using Firebase Firestore or MongoDB Atlas free clusters.
              </p>
              <div className="text-xs font-mono text-teal-600 dark:text-teal-400">
                Automated backup included
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Subscription Plans: Aura & Aura+ (Clear, Attractive Pricing Cards) */}
      <section id="plans" className="py-20 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Subscription Plans
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Two Transparent Plans. Tailored for Telephony Scale.
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Choose between standard operational calling in <span className="font-semibold text-neutral-900 dark:text-neutral-100">Aura</span> or managerial oversight and quality audit in <span className="font-semibold text-neutral-900 dark:text-neutral-100">Aura+</span>.
            </p>

            {/* Billing Toggle (clean segmented button) */}
            <div className="pt-4 flex items-center justify-center">
              <div className="inline-flex items-center p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    billingPeriod === 'monthly'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingPeriod === 'annual'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Save 20%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* PLAN 1: AURA */}
            <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between ${
              plan === 'aura'
                ? 'border-blue-500 bg-white dark:bg-neutral-900 shadow-xl ring-2 ring-blue-500/20'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
            }`}>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-neutral-900 dark:text-white">Aura</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Standard
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    Designed for focused sales groups requiring high-velocity calling, pipeline tracking, and admin controls.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono tabular-nums">
                    ${billingPeriod === 'monthly' ? PLANS_INFO.aura.priceMonthly : PLANS_INFO.aura.priceAnnual}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">/ month per organization</span>
                </div>

                {/* Specific Roles Included Section */}
                <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Permitted Roles in Aura (3 Roles):
                  </span>
                  <ul className="space-y-1.5 text-xs font-medium">
                    <li className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                      <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Administration</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                      <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Admin</span>
                    </li>
                    <li className="flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
                      <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Agent (Calling Purpose)</span>
                    </li>
                  </ul>
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Included Features:
                  </span>
                  <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                    {PLANS_INFO.aura.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    setPlan('aura');
                    setCurrentView('crm');
                    setActiveTab('dashboard');
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    plan === 'aura'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {plan === 'aura' ? 'Currently Active Plan · Enter CRM' : 'Switch to Aura & Test'}
                </button>
              </div>
            </div>

            {/* PLAN 2: AURA+ */}
            <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between relative ${
              plan === 'aura_plus'
                ? 'border-indigo-500 bg-white dark:bg-neutral-900 shadow-xl ring-2 ring-indigo-500/20'
                : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
            }`}>
              {/* Highlight ribbon */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular for Call Centers
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-neutral-900 dark:text-white">Aura+</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Enterprise Tier
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                    Full organizational hierarchy with QA scoring rubrics, team supervisor dashboards, and multi-tier governance.
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono tabular-nums">
                    ${billingPeriod === 'monthly' ? PLANS_INFO.aura_plus.priceMonthly : PLANS_INFO.aura_plus.priceAnnual}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">/ month per organization</span>
                </div>

                {/* Specific Roles Included Section */}
                <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/50 dark:bg-neutral-950 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Permitted Roles in Aura+ (All 6 Roles):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
                      <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>Administration</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
                      <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>Admin</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Manager</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold">
                      <Check className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>Team Lead</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-bold">
                      <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>Audit (QA)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Agent (Calling)</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Advanced Aura+ Capabilities:
                  </span>
                  <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                    {PLANS_INFO.aura_plus.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    setPlan('aura_plus');
                    setCurrentView('crm');
                    setActiveTab('dashboard');
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    plan === 'aura_plus'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {plan === 'aura_plus' ? 'Currently Active Plan · Enter CRM' : 'Activate Aura+ & Unlock All 6 Roles'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Role-Based Functionality Overview */}
      <section id="roles" className="py-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Role-Based Access Control (RBAC)
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Tailored Experiences For Every Team Member
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Select a role below to explore its exact responsibilities and permitted actions within AURA CRM.
            </p>
          </div>

          {/* Interactive Role Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {(Object.keys(ROLES_CONFIG) as UserRole[]).map((rKey) => {
              const r = ROLES_CONFIG[rKey];
              const isSelected = selectedRoleTab === rKey;
              return (
                <button
                  key={rKey}
                  onClick={() => setSelectedRoleTab(rKey)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span>{r.title}</span>
                  {r.planRequired === 'aura_plus' && (
                    <span className="ml-1.5 text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      Aura+
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Role Card Showcase */}
          {(() => {
            const role = ROLES_CONFIG[selectedRoleTab];
            return (
              <div className="max-w-4xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  
                  <div className="space-y-4 md:col-span-1 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 pb-6 md:pb-0 md:pr-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                      {role.title.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{role.title}</h4>
                      <p className="text-xs text-neutral-500 font-medium">{role.category}</p>
                    </div>
                    <div className="text-xs">
                      <span className="text-neutral-500">Subscription Requirement: </span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">
                        {role.planRequired === 'aura_plus' ? 'Aura+ Plan' : 'Aura or Aura+'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (role.planRequired === 'aura_plus') setPlan('aura_plus');
                        setActiveRole(role.id);
                        setCurrentView('crm');
                        setActiveTab('dashboard');
                      }}
                      className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Simulate this Role</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="md:col-span-2 space-y-5">
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Operational Mandate
                      </h5>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                        Enforced Access Permissions
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {role.permissions.map((perm, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="capitalize">{perm.replace(/_/g, ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* 5. MEET THE MINDS BEHIND AURA - TEAM KRK */}
      <AboutUsSection />

      {/* 6. Database & Architecture Evaluation (MongoDB Atlas vs Firebase) */}
      <section id="deployment" className="py-20 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Backend & Cloud Architecture
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Database Evaluation: Firebase vs MongoDB Atlas
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              We evaluated the best free database solutions for commercial launch and recommend the ideal stack for your target domain <span className="font-mono text-neutral-900 dark:text-neutral-100">kd.pvt.ltd</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
            
            {/* Firebase Evaluation */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                    FB
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    Firebase Firestore & Auth
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Recommended for Launch
                </span>
              </div>
              
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Google Cloud serverless ecosystem with built-in instant JWT Authentication, declarative RBAC security rules (<code className="font-mono text-[11px]">firestore.rules</code>), and live document listener websockets.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Free Spark Tier: 1GB storage, 50k reads/day, 20k writes/day.</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Instant real-time sync for active agent call updates without custom socket servers.</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Zero-config free hosting on <code className="font-mono">firebase.app</code> with custom domain SSL for <code className="font-mono">kd.pvt.ltd</code>.</span>
                </div>
              </div>
            </div>

            {/* MongoDB Atlas Evaluation */}
            <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    MG
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    MongoDB Atlas (M0 Free Cluster)
                  </h4>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  Alternative
                </span>
              </div>
              
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Standard document database suited for traditional Express / Node.js backend architectures using Mongoose schemas and REST API microservices.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Free Shared M0 cluster with 512MB storage and automated backups.</span>
                </div>
                <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-300">
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Full JSON indexing, aggregation pipelines, and flexible document queries.</span>
                </div>
                <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400">
                  <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Requires hosting an Express server (Render/Railway) to manage JWT tokens and bcrypt.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick link to detailed GitHub & Deployment Blueprint */}
          <div className="max-w-xl mx-auto text-center">
            <button
              onClick={() => {
                setCurrentView('crm');
                setActiveTab('deployment');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-blue-500" />
              <span>View GitHub & Domain Deployment Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 7. Professional Footer */}
      <footer className="py-12 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-900/40">
                  A
                </div>
                <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white">
                  AURA CRM
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-normal">
                Modern telephony & quality assurance platform for high-velocity sales and call center operations.
              </p>

              {/* TEAM KRK Branding Element with Image Preview */}
              <a 
                href="#about-us"
                className="block p-2.5 rounded-xl border border-red-900/40 bg-neutral-950/80 hover:border-red-600/60 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/images/team-krk.jpeg"
                    alt="TEAM KRK Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-red-800/40 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                        TEAM KRK
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate">
                      Kartikey · Raj · KD
                    </p>
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5 mt-0.5">
                      <span>View Team & Story</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </a>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Plans & Tiers
              </p>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <li><button onClick={() => { setPlan('aura'); setCurrentView('crm'); }} className="hover:text-blue-600 cursor-pointer">Aura Standard</button></li>
                <li><button onClick={() => { setPlan('aura_plus'); setCurrentView('crm'); }} className="hover:text-blue-600 cursor-pointer">Aura+ Enterprise</button></li>
                <li><a href="#plans" className="hover:text-blue-600">Feature Comparison</a></li>
                <li><a href="#roles" className="hover:text-blue-600">Role Matrix</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Core Modules
              </p>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <li><button onClick={() => { setCurrentView('crm'); setActiveTab('calling'); }} className="hover:text-blue-600 cursor-pointer">Agent Calling Console</button></li>
                <li><button onClick={() => { setCurrentView('crm'); setActiveTab('qa_audit'); }} className="hover:text-blue-600 cursor-pointer">Quality Audit (QA) Rubrics</button></li>
                <li><button onClick={() => { setCurrentView('crm'); setActiveTab('leads'); }} className="hover:text-blue-600 cursor-pointer">Pipeline Kanban & Leads</button></li>
                <li><button onClick={() => { setCurrentView('crm'); setActiveTab('team'); }} className="hover:text-blue-600 cursor-pointer">Team & Permission Controls</button></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Engineering & Contact
              </p>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <li><a href="#about-us" className="font-bold text-neutral-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1.5"><span>TEAM KRK (Kartikey, Raj, KD)</span></a></li>
                <li><a href={`mailto:${TEAM_KRK_OFFICIAL_EMAIL}`} className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors"><Mail className="w-3 h-3 text-red-500" /> {TEAM_KRK_OFFICIAL_EMAIL}</a></li>
                <li><span className="font-mono text-[11px] text-neutral-500">GitHub: {CLIENT_GITHUB}</span></li>
                <li><span className="font-mono text-[11px] text-neutral-500">Domain: {CLIENT_DOMAIN}</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <p>© 2026 AURA CRM. Developed & Maintained by TEAM KRK (KT, RDX & KD). All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <span className="font-mono text-[11px] text-neutral-400">v2.4.0 Production Ready</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
