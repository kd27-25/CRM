import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { PLANS_INFO, ROLES_CONFIG } from '../../data/initialData';
import { SubscriptionPlan } from '../../types/crm';
import { 
  CreditCard, 
  Check, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Zap,
  ArrowRight
} from 'lucide-react';

export const SubscriptionBillingView: React.FC = () => {
  const { plan, setPlan, leads, callRecords, teamMembers } = useCRM();

  const handleSwitchPlan = (targetPlan: SubscriptionPlan) => {
    setPlan(targetPlan);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            <span>Subscription & Plan Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Transparent two-tier pricing: Aura Standard vs Aura+ Enterprise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Active Tier:</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            plan === 'aura_plus'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}>
            {plan === 'aura_plus' ? 'Aura+ Active' : 'Aura Active'}
          </span>
        </div>
      </div>

      {/* Quotas & Usage Meter */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Active Resource Consumption
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Seat Allocation</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {teamMembers.length} / {plan === 'aura_plus' ? 'Unlimited' : '10'} Seats
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${Math.min((teamMembers.length / 10) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Calling Records Logged</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {callRecords.length} / {plan === 'aura_plus' ? '50,000' : '5,000'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${Math.min((callRecords.length / 50) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">QA Rubric Evaluations</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {callRecords.filter(c => c.qaEvaluation).length} / {plan === 'aura_plus' ? 'Unlimited' : '0 (Aura+)'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div 
                className={`h-full rounded-full ${plan === 'aura_plus' ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} 
                style={{ width: plan === 'aura_plus' ? '25%' : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison of the Two Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* PLAN 1: AURA */}
        <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all ${
          plan === 'aura'
            ? 'border-blue-500 bg-white dark:bg-neutral-900 shadow-xl ring-2 ring-blue-500/20'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
        }`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Plan 1: Aura</h3>
                <p className="text-xs text-neutral-500 mt-1">Foundational sales calling operations</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                $49 / mo
              </span>
            </div>

            {/* Permitted Roles */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Included User Roles:
              </span>
              <ul className="space-y-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                  <span>Administration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                  <span>Admin</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                  <span>Agent (Calling Purpose)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Included Features:
              </span>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {PLANS_INFO.aura.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleSwitchPlan('aura')}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                plan === 'aura'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-extrabold'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {plan === 'aura' ? 'Currently Selected Plan' : 'Switch Organization to Aura'}
            </button>
          </div>
        </div>

        {/* PLAN 2: AURA+ */}
        <div className={`p-8 rounded-3xl border flex flex-col justify-between transition-all relative ${
          plan === 'aura_plus'
            ? 'border-indigo-500 bg-white dark:bg-neutral-900 shadow-xl ring-2 ring-indigo-500/20'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60'
        }`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Plan 2: Aura+</h3>
                <p className="text-xs text-neutral-500 mt-1">Multi-tier hierarchy with QA Audit suite</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                $99 / mo
              </span>
            </div>

            {/* Permitted Roles */}
            <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-neutral-950 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Included User Roles (All 6 Roles):
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Administration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Admin</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300">
                  <Check className="w-3.5 h-3.5 text-amber-500" />
                  <span>Manager</span>
                </div>
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300">
                  <Check className="w-3.5 h-3.5 text-teal-500" />
                  <span>Team Lead</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-300">
                  <Check className="w-3.5 h-3.5 text-rose-500" />
                  <span>Audit (QA)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Agent (Calling)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Exclusive Aura+ Features:
              </span>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {PLANS_INFO.aura_plus.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => handleSwitchPlan('aura_plus')}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                plan === 'aura_plus'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 font-extrabold'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {plan === 'aura_plus' ? 'Currently Selected Plan' : 'Switch Organization to Aura+'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
