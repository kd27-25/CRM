import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { CallRecord, QAEvaluation } from '../../types/crm';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Play, 
  Pause, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Filter,
  FileCheck,
  Award
} from 'lucide-react';

export const QualityAuditView: React.FC = () => {
  const { 
    plan, 
    setPlan, 
    activeRole, 
    callRecords, 
    submitQAEvaluation 
  } = useCRM();

  const [selectedCallId, setSelectedCallId] = useState<string>(callRecords[0]?.id || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // 5-Point QA Rubric State
  const [rubric, setRubric] = useState({
    greeting: 18,
    needDiscovery: 17,
    pitchClarity: 19,
    objectionHandling: 16,
    complianceEtiquette: 18,
  });

  const [feedback, setFeedback] = useState('Agent maintained a professional cadence and established good rapport.');
  const [actionItems, setActionItems] = useState('Emphasize the trial period terms and offer self-serve scheduling.');

  // Check if Aura Plan restricts QA Audits
  if (plan === 'aura') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <Layers className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Quality Assurance (QA) Suite is Exclusive to Aura+
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto">
            Your organization is currently on the <strong className="text-neutral-900 dark:text-neutral-100">Aura</strong> plan (which supports Administration, Admin, and Calling Agents).
          </p>
        </div>

        {/* Plan Comparison Summary */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left space-y-4 max-w-md mx-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Aura vs Aura+ Capabilities:
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-600 dark:text-neutral-400">Audit (QA) Evaluator</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">Aura+ Only</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-600 dark:text-neutral-400">Manager & Team Lead Roles</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">Aura+ Only</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-600 dark:text-neutral-400">Standard Calling Agent Console</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Included in Both</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPlan('aura_plus')}
          className="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
        >
          Upgrade to Aura+ (Unlock Full QA & All 6 Roles)
        </button>
      </div>
    );
  }

  const selectedCall = callRecords.find(c => c.id === selectedCallId) || callRecords[0];

  const totalScore = rubric.greeting + rubric.needDiscovery + rubric.pitchClarity + rubric.objectionHandling + rubric.complianceEtiquette;
  
  let auditStatus: 'passed' | 'needs_coaching' | 'critical_fail' = 'passed';
  if (totalScore < 60) auditStatus = 'critical_fail';
  else if (totalScore < 80) auditStatus = 'needs_coaching';

  const handleScoreChange = (metric: keyof typeof rubric, val: number) => {
    setRubric(prev => ({ ...prev, [metric]: val }));
  };

  const handleSaveAudit = () => {
    if (!selectedCall) return;
    submitQAEvaluation({
      callRecordId: selectedCall.id,
      auditorId: 'tm-5',
      auditorName: 'Pooja Sharma (Lead QA)',
      score: totalScore,
      status: auditStatus,
      rubric,
      feedback,
      actionItems,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Call Quality Assurance & Audit Suite
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              Aura+ Enterprise
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            5-point rubric grading, compliance verification, and agent coaching calibration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono">
            Audited Calls: <strong className="text-neutral-900 dark:text-white">{callRecords.filter(c => c.qaEvaluation).length} / {callRecords.length}</strong>
          </div>
        </div>
      </div>

      {/* Main 2-Column Interface: Call Selection & Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Call Recordings Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Recorded Calls for Audit
          </h3>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {callRecords.map((call) => {
              const isSelected = call.id === selectedCallId;
              const hasEvaluation = !!call.qaEvaluation;

              return (
                <button
                  key={call.id}
                  onClick={() => {
                    setSelectedCallId(call.id);
                    if (call.qaEvaluation) {
                      setRubric(call.qaEvaluation.rubric);
                      setFeedback(call.qaEvaluation.feedback);
                      setActionItems(call.qaEvaluation.actionItems);
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {call.leadName}
                    </span>
                    {hasEvaluation ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {call.qaEvaluation?.score}%
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Needs QA
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-500 truncate">
                    {call.leadCompany} · {call.agentName}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>{call.audioDuration} duration</span>
                    <span className="capitalize">{call.disposition.replace(/_/g, ' ')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5-Point Rubric Evaluation Sheet (8 cols) */}
        {selectedCall && (
          <div className="lg:col-span-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-6">
            
            {/* Call Header & Player */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Auditing: {selectedCall.leadName}
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  Agent: {selectedCall.agentName} · Time: {selectedCall.startedAt}
                </p>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingAudio ? 'Pause Audio' : 'Play Recording'}</span>
                </button>
                <span className="text-xs font-mono text-neutral-500">{selectedCall.audioDuration}</span>
              </div>
            </div>

            {/* Overall Score Meter */}
            <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Calibrated QA Score
                </span>
                <div className="text-3xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums mt-0.5">
                  {totalScore} <span className="text-sm font-normal text-neutral-500">/ 100</span>
                </div>
              </div>

              <div>
                {auditStatus === 'passed' && (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Quality Passed</span>
                  </div>
                )}
                {auditStatus === 'needs_coaching' && (
                  <div className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Needs Coaching</span>
                  </div>
                )}
                {auditStatus === 'critical_fail' && (
                  <div className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Critical Fail</span>
                  </div>
                )}
              </div>
            </div>

            {/* 5 Rubric Criteria Sliders */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                5-Point Quality Rubric (Max 20 pts each)
              </h4>

              {[
                { key: 'greeting', label: '1. Greeting & Customer Verification', desc: 'Identified company, confirmed contact identity, professional tone' },
                { key: 'needDiscovery', label: '2. Need Discovery & Active Listening', desc: 'Uncovered sales requirements, did not interrupt client' },
                { key: 'pitchClarity', label: '3. Pitch Clarity & Product Knowledge', desc: 'Accurate pricing explanations, articulate value delivery' },
                { key: 'objectionHandling', label: '4. Objection Handling & Rebuttals', desc: 'Addressed hesitation without pushiness or defensiveness' },
                { key: 'complianceEtiquette', label: '5. Compliance, Disclosures & Etiquette', desc: 'Adhered to call recording disclaimer and privacy standard' },
              ].map(({ key, label, desc }) => {
                const metricKey = key as keyof typeof rubric;
                const val = rubric[metricKey];
                return (
                  <div key={key} className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                      <span>{label}</span>
                      <span className="font-mono text-blue-600 dark:text-blue-400">{val} / 20</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">{desc}</p>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={val}
                      onChange={(e) => handleScoreChange(metricKey, parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* QA Feedback & Action Items */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Auditor Feedback & Observations
                </label>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Coaching & Action Items for Agent
                </label>
                <textarea
                  rows={2}
                  value={actionItems}
                  onChange={(e) => setActionItems(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSaveAudit}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Publish QA Audit Scorecard</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
