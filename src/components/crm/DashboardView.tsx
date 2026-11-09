import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { ROLES_CONFIG, PLANS_INFO } from '../../data/initialData';
import { 
  Users, 
  PhoneCall, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  AlertCircle,
  Play,
  ArrowRight,
  Layers
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    leads, 
    callRecords, 
    teamMembers, 
    activeRole, 
    plan, 
    setActiveTab, 
    startDialing 
  } = useCRM();

  const roleData = ROLES_CONFIG[activeRole];

  // Key Metrics Calculations
  const totalLeads = leads.length;
  const pipelineValue = leads.reduce((acc, l) => acc + (l.dealValue || 0), 0);
  const totalCalls = callRecords.length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  
  const evaluatedCalls = callRecords.filter(c => c.qaEvaluation);
  const avgQAScore = evaluatedCalls.length > 0 
    ? Math.round(evaluatedCalls.reduce((acc, c) => acc + (c.qaEvaluation?.score || 0), 0) / evaluatedCalls.length) 
    : 88;

  const avgCallDurationSecs = totalCalls > 0 
    ? Math.round(callRecords.reduce((acc, c) => acc + c.durationSeconds, 0) / totalCalls) 
    : 160;
  const avgCallMins = Math.floor(avgCallDurationSecs / 60);
  const avgCallSecs = avgCallDurationSecs % 60;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner: Role Context Greeting */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {roleData.title} Workspace
            </h1>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${roleData.badgeBg} border`}>
              {roleData.category}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {roleData.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('calling');
              startDialing('+91 98201 44521');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Launch Quick Call</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            <span>View All Leads</span>
          </button>
        </div>
      </div>

      {/* Plan Notice for Aura Standard users */}
      {plan === 'aura' && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200">Current Plan: Aura. </span>
              <span className="text-amber-800 dark:text-amber-300">
                You have active access to Administration, Admin, and Agent roles. Upgrade to Aura+ to unlock Manager, Team Lead, and Audit (QA) roles.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('billing')}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shrink-0 cursor-pointer"
          >
            View Aura+ Features
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Total Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
            ${pipelineValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{totalLeads} active leads</span> in pipeline
          </div>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Calls Logged</span>
            <PhoneCall className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {totalCalls}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Avg Handle Time: <span className="font-mono text-neutral-800 dark:text-neutral-200">{avgCallMins}m {avgCallSecs}s</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{convertedLeads} deals</span> converted to contracts
          </div>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Avg QA Call Score</span>
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {plan === 'aura_plus' ? `${avgQAScore}%` : 'Aura+ Req.'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {plan === 'aura_plus' ? (
              <span>{evaluatedCalls.length} audited calls evaluated</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">Requires Aura+ QA license</span>
            )}
          </div>
        </div>

      </div>

      {/* Two Column Layout: Recent Telephony Feed & Lead Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Telephony Calls */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Recent Calling Activity
              </h3>
              <p className="text-xs text-neutral-500">Live agent call records and recorded logs</p>
            </div>
            <button
              onClick={() => setActiveTab('calling')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Calling Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {callRecords.slice(0, 4).map((call) => (
              <div key={call.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {call.leadName}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      {call.leadCompany} · {call.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-xs font-semibold capitalize text-neutral-800 dark:text-neutral-200">
                      {call.disposition.replace(/_/g, ' ')}
                    </span>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      Duration: {call.audioDuration}
                    </p>
                  </div>

                  {call.qaEvaluation ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      QA: {call.qaEvaluation.score}%
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Unreviewed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Distribution & Quick Actions */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-5">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Pipeline Distribution
          </h3>

          <div className="space-y-3">
            {[
              { label: 'New Inquiries', count: leads.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
              { label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-indigo-500' },
              { label: 'Follow Up Scheduled', count: leads.filter(l => l.status === 'follow_up').length, color: 'bg-amber-500' },
              { label: 'High Interest', count: leads.filter(l => l.status === 'interested').length, color: 'bg-purple-500' },
              { label: 'Converted Contracts', count: leads.filter(l => l.status === 'converted').length, color: 'bg-emerald-500' },
            ].map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <span>{stage.label}</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">{stage.count}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div 
                    className={`h-full ${stage.color} rounded-full`}
                    style={{ width: `${Math.max((stage.count / totalLeads) * 100, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Quick Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('leads')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                + Add New Lead
              </button>
              <button
                onClick={() => setActiveTab('calling')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                Open Dial Pad
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                Team Roles
              </button>
              <button
                onClick={() => setActiveTab('deployment')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
              >
                GitHub Guide
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
