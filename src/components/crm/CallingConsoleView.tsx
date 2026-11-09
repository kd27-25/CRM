import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { playDTMF, playRingtone, playCallEndSound } from '../../utils/audio';
import { CallDisposition, Lead } from '../../types/crm';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Clock, 
  CheckCircle2, 
  User, 
  Building, 
  FileText, 
  Hash, 
  RotateCcw,
  Headphones,
  Search,
  Tag
} from 'lucide-react';

export const CallingConsoleView: React.FC = () => {
  const { 
    activeCall, 
    startDialing, 
    connectCall, 
    toggleMute, 
    toggleHold, 
    endActiveCall, 
    cancelCall,
    callRecords,
    leads 
  } = useCRM();

  const [inputNumber, setInputNumber] = useState('+91 ');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [disposition, setDisposition] = useState<CallDisposition>('interested');
  const [callNotes, setCallNotes] = useState('');
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);

  // Play ringtone while ringing
  useEffect(() => {
    let stopRingtone: (() => void) | null = null;
    if (activeCall.isActive && activeCall.callStatus === 'ringing') {
      stopRingtone = playRingtone();
    }
    return () => {
      if (stopRingtone) stopRingtone();
    };
  }, [activeCall.isActive, activeCall.callStatus]);

  const handleDialDigit = (digit: string) => {
    playDTMF(digit);
    setInputNumber(prev => prev + digit);
  };

  const handleStartCall = (phoneToCall?: string, targetLead?: Lead) => {
    const finalPhone = phoneToCall || inputNumber;
    if (!finalPhone || finalPhone.trim().length < 6) return;
    startDialing(finalPhone, targetLead || selectedLead || undefined);
  };

  const handleHangUp = () => {
    playCallEndSound();
    endActiveCall(disposition, callNotes);
    setCallNotes('');
  };

  // Filter leads for speed dial list
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
    l.company.toLowerCase().includes(searchLeadQuery.toLowerCase()) ||
    l.phone.includes(searchLeadQuery)
  );

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-500" />
            <span>Agent Telephony Console</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Dedicated calling interface for outbound lead engagement, automated call logging, and disposition tagging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telephony Gateway: Online</span>
          </div>
        </div>
      </div>

      {/* Main Calling Layout: Keypad & Active Call Console (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Phone Pad & Active Screen (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-6">
            
            {/* If NO active call: Dialpad Input Screen */}
            {!activeCall.isActive ? (
              <div className="space-y-6">
                
                {/* Phone Number Display */}
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                    <span>Destination Number</span>
                    {selectedLead && (
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        Lead: {selectedLead.name}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputNumber}
                      onChange={(e) => setInputNumber(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full px-4 py-3 text-lg font-mono tracking-wider font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {inputNumber.length > 0 && (
                      <button
                        onClick={() => {
                          setInputNumber('');
                          setSelectedLead(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* DTMF Keypad Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { num: '1', sub: '' },
                    { num: '2', sub: 'ABC' },
                    { num: '3', sub: 'DEF' },
                    { num: '4', sub: 'GHI' },
                    { num: '5', sub: 'JKL' },
                    { num: '6', sub: 'MNO' },
                    { num: '7', sub: 'PQRS' },
                    { num: '8', sub: 'TUV' },
                    { num: '9', sub: 'WXYZ' },
                    { num: '*', sub: '' },
                    { num: '0', sub: '+' },
                    { num: '#', sub: '' },
                  ].map(({ num, sub }) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleDialDigit(num)}
                      className="py-3 px-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/70 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
                    >
                      <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                        {num}
                      </span>
                      {sub ? (
                        <span className="text-[9px] text-neutral-400 font-mono tracking-widest">
                          {sub}
                        </span>
                      ) : (
                        <span className="h-3" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Call Initiation Action */}
                <button
                  type="button"
                  onClick={() => handleStartCall()}
                  disabled={inputNumber.trim().length < 5}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Dial Call Now</span>
                </button>

              </div>
            ) : (
              /* ACTIVE LIVE CALL IN PROGRESS */
              <div className="space-y-6">
                
                {/* Call Status Header */}
                <div className="text-center p-6 rounded-2xl bg-gradient-to-b from-neutral-50 to-neutral-100/50 dark:from-neutral-950 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="capitalize">{activeCall.callStatus}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">
                    {activeCall.leadName}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    {activeCall.leadCompany} · {activeCall.phone}
                  </p>

                  <div className="pt-2">
                    <div className="text-3xl font-extrabold font-mono tracking-wider text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatTimer(activeCall.duration)}
                    </div>
                    <span className="text-[11px] text-neutral-400">Call Duration (AHT)</span>
                  </div>

                  {activeCall.callStatus === 'ringing' && (
                    <div className="pt-2">
                      <button
                        onClick={connectCall}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Client Picked Up? Click to Answer Immediately
                      </button>
                    </div>
                  )}
                </div>

                {/* Call Control Buttons (Mute / Hold / Cancel) */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={toggleMute}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeCall.isMuted
                        ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {activeCall.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{activeCall.isMuted ? 'Muted' : 'Mute Mic'}</span>
                  </button>

                  <button
                    onClick={toggleHold}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeCall.isOnHold
                        ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Pause className="w-4 h-4" />
                    <span>{activeCall.isOnHold ? 'On Hold' : 'Hold Call'}</span>
                  </button>
                </div>

                {/* Disposition & Notes Form */}
                <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Call Disposition Tag
                    </label>
                    <select
                      value={disposition}
                      onChange={(e) => setDisposition(e.target.value as CallDisposition)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="interested">Interested (Lead Warm)</option>
                      <option value="follow_up">Follow-Up Required</option>
                      <option value="converted">Deal Converted to Contract</option>
                      <option value="not_answered">Not Answered / Voicemail</option>
                      <option value="invalid_number">Invalid / Wrong Number</option>
                      <option value="do_not_call">Do Not Call (DNC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Agent Call Notes & Key Insights
                    </label>
                    <textarea
                      rows={3}
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Discussed pricing for Aura+ tier. Client needs 15 agent seats and QA rubric customization..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Hang Up & Log Call */}
                  <button
                    onClick={handleHangUp}
                    className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4 fill-current" />
                    <span>Hang Up & Log Call</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right Column: Speed Dial Queue & Call History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Dial Lead Queue */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Assigned Leads Queue
                </h3>
                <p className="text-xs text-neutral-500">Click any contact to populate the dialer</p>
              </div>

              {/* Search Lead */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLeadQuery}
                  onChange={(e) => setSearchLeadQuery(e.target.value)}
                  placeholder="Search lead or phone..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-56 overflow-y-auto">
              {filteredLeads.map((lead) => (
                <div 
                  key={lead.id}
                  className="py-2.5 px-2 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors"
                >
                  <div className="space-y-0.5 truncate pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {lead.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {lead.company} · <span className="font-mono">{lead.phone}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setInputNumber(lead.phone);
                      setSelectedLead(lead);
                      handleStartCall(lead.phone, lead);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Dial</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Call Records & Simulated Playback History */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Call Recording History & Logs
                </h3>
                <p className="text-xs text-neutral-500">Audio playback, handle time & QA review status</p>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {callRecords.length} records
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {callRecords.map((record) => {
                const isPlaying = activePlaybackId === record.id;
                return (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                          {record.leadName}
                        </h4>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {record.startedAt} · {record.leadCompany}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          record.disposition === 'interested' || record.disposition === 'converted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}>
                          {record.disposition.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 italic">
                      "{record.notes}"
                    </p>

                    {/* Audio Player Strip */}
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setActivePlaybackId(isPlaying ? null : record.id)}
                          className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                        
                        {/* Audio waveform mockup */}
                        <div className="flex items-center gap-0.5">
                          {[40, 70, 30, 90, 60, 45, 80, 50, 75, 35, 95, 65, 40, 85].map((h, i) => (
                            <div 
                              key={i} 
                              className={`w-1 rounded-full transition-all ${
                                isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-700'
                              }`}
                              style={{ height: `${(h / 100) * 16}px` }}
                            />
                          ))}
                        </div>

                        <span className="text-[11px] font-mono text-neutral-500">
                          {record.audioDuration}
                        </span>
                      </div>

                      {record.qaEvaluation ? (
                        <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>QA Audited: {record.qaEvaluation.score}%</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Pending QA Review
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
