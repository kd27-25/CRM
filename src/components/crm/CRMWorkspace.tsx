import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Sidebar } from '../layout/Sidebar';
import { DashboardView } from './DashboardView';
import { LeadsPipelineView } from './LeadsPipelineView';
import { CallingConsoleView } from './CallingConsoleView';
import { QualityAuditView } from './QualityAuditView';
import { TeamManagementView } from './TeamManagementView';
import { SubscriptionBillingView } from './SubscriptionBillingView';
import { DeploymentGuideView } from './DeploymentGuideView';
import { SettingsView } from './SettingsView';
import { AboutUsSection } from '../about/AboutUsSection';
import { PhoneCall, ArrowUpRight } from 'lucide-react';

export const CRMWorkspace: React.FC = () => {
  const { activeTab, setActiveTab, activeCall } = useCRM();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'leads':
        return <LeadsPipelineView />;
      case 'calling':
        return <CallingConsoleView />;
      case 'qa_audit':
        return <QualityAuditView />;
      case 'team':
        return <TeamManagementView />;
      case 'billing':
        return <SubscriptionBillingView />;
      case 'about_us':
        return <AboutUsSection standalone={true} />;
      case 'deployment':
        return <DeploymentGuideView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-neutral-100/50 dark:bg-neutral-950/80 transition-colors">
      
      {/* Workspace Sidebar */}
      <Sidebar />

      {/* Main Content Canvas */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {renderActiveTabContent()}
      </main>

      {/* Floating Call Widget if Call Active and not on calling tab */}
      {activeCall.isActive && activeTab !== 'calling' && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-neutral-900 text-white shadow-2xl flex items-center gap-4 ring-2 ring-emerald-500/20">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold">{activeCall.leadName}</span>
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                Duration: {Math.floor(activeCall.duration / 60)}:{String(activeCall.duration % 60).padStart(2, '0')}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('calling')}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Return to Call</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
