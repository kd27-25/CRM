import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { 
  Settings, 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertTriangle,
  Phone,
  FileJson,
  Sliders
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    toggleKRKContactPrivacy, 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    resetToDefaultData 
  } = useCRM();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDownloadBackup = () => {
    const json = exportDatabaseJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURA_CRM_BACKUP_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = importDatabaseJSON(importText);
    if (success) {
      setImportStatus('Database successfully restored from JSON backup!');
      setImportText('');
    } else {
      setImportStatus('Error: Invalid JSON payload format.');
    }
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-neutral-500" />
            <span>Platform Configuration & Privacy Controls</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure privacy visibility, telephony parameters, and automated database backups.
          </p>
        </div>
      </div>

      {/* 1. Core Privacy Configuration: Team KRK Personal Contact Details */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Team KRK Personal Contact Visibility
              </h3>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-lg">
              Controls whether personal mobile numbers of core developers (KT, RDX, KD) are exposed on the public landing page or restricted to authenticated administrators.
            </p>
          </div>

          <button
            onClick={toggleKRKContactPrivacy}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              settings.showTeamKRKContactsPublicly
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {settings.showTeamKRKContactsPublicly ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Publicly Visible</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Admin-Only Private</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Active Behavior: </span>
          {settings.showTeamKRKContactsPublicly ? (
            <span className="text-neutral-600 dark:text-neutral-400">
              Personal contact phone numbers (6265151482, +91 89825 68249, 9307390086) are displayed with direct tel: and mailto: links on the About Us section.
            </span>
          ) : (
            <span className="text-neutral-600 dark:text-neutral-400">
              Only the official team email (<code className="font-mono">00teamkrk@gmail.com</code>) is shown publicly. Direct developer mobile numbers are securely masked.
            </span>
          )}
        </div>
      </div>

      {/* 2. Telephony Settings */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-500" />
          <span>Telephony & Calling Gateway Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white">Auto-Record Outbound Calls</span>
              <p className="text-[11px] text-neutral-500">Record audio for QA evaluation auditing</p>
            </div>
            <button
              onClick={() => updateSettings({ autoRecordCalls: !settings.autoRecordCalls })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                settings.autoRecordCalls ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.autoRecordCalls ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
            <div>
              <span className="font-bold text-neutral-900 dark:text-white">QA Passing Grade Threshold</span>
              <p className="text-[11px] text-neutral-500">Minimum score to pass call audit: {settings.qaPassThreshold}%</p>
            </div>
            <input
              type="number"
              min={50}
              max={95}
              value={settings.qaPassThreshold}
              onChange={(e) => updateSettings({ qaPassThreshold: parseInt(e.target.value, 10) || 80 })}
              className="w-16 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-center"
            />
          </div>
        </div>
      </div>

      {/* 3. Database Export, Import & Disaster Recovery */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileJson className="w-4 h-4 text-purple-500" />
          <span>Database Export & Offline JSON Backup</span>
        </h3>

        <p className="text-xs text-neutral-500">
          Download a complete portable snapshot of your CRM pipeline (leads, call records, QA evaluations, and team configurations).
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON Backup</span>
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Restore Database from JSON Snapshot
          </label>
          <textarea
            rows={2}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported JSON string here..."
            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 cursor-pointer"
            >
              Restore from Backup
            </button>
            {importStatus && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {importStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Reset Demo Data */}
      <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
        <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Factory Reset Data</span>
        </h3>
        <p className="text-xs text-rose-800 dark:text-rose-400">
          Restore all seed leads, call recordings, and team members to factory initial defaults.
        </p>

        {showResetConfirm ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetToDefaultData();
                setShowResetConfirm(false);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
            >
              Confirm Reset Now
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl hover:bg-rose-100/50 dark:hover:bg-rose-900/40 cursor-pointer"
          >
            Reset to Factory Default State
          </button>
        )}
      </div>

    </div>
  );
};
