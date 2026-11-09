import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { ROLES_CONFIG, PLANS_INFO } from '../../data/initialData';
import { 
  LayoutDashboard, 
  Users, 
  PhoneCall, 
  CheckCircle2, 
  UserCheck, 
  CreditCard, 
  Terminal, 
  Settings, 
  Lock, 
  Sparkles,
  ChevronRight,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    plan, 
    activeRole, 
    setCurrentView,
    callRecords,
    leads
  } = useCRM();

  const roleData = ROLES_CONFIG[activeRole];

  const pendingQACount = callRecords.filter(c => !c.qaEvaluation).length;
  const newLeadsCount = leads.filter(l => l.status === 'new').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['administration', 'admin', 'manager', 'team_lead', 'audit_qa', 'agent'],
    },
    {
      id: 'leads',
      label: 'Leads & Pipeline',
      icon: Users,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : undefined,
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      roles: ['administration', 'admin', 'manager', 'team_lead', 'agent'],
    },
    {
      id: 'calling',
      label: 'Calling Console',
      icon: PhoneCall,
      highlight: true,
      roles: ['administration', 'admin', 'manager', 'team_lead', 'agent'],
    },
    {
      id: 'qa_audit',
      label: 'Quality Audit (QA)',
      icon: CheckCircle2,
      badge: pendingQACount > 0 ? `${pendingQACount} pending` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
      requiresAuraPlus: true,
      roles: ['administration', 'admin', 'manager', 'team_lead', 'audit_qa'],
    },
    {
      id: 'team',
      label: 'Team & Roles',
      icon: UserCheck,
      roles: ['administration', 'admin', 'manager', 'team_lead'],
    },
    {
      id: 'billing',
      label: 'Plans & Subscription',
      icon: CreditCard,
      roles: ['administration', 'admin'],
    },
    {
      id: 'deployment',
      label: 'GitHub & Deploy Docs',
      icon: Terminal,
      roles: ['administration', 'admin', 'manager', 'team_lead', 'audit_qa', 'agent'],
    },
    {
      id: 'settings',
      label: 'Settings & Privacy',
      icon: Settings,
      roles: ['administration', 'admin'],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none transition-colors">
      <div className="p-4 space-y-6 overflow-y-auto">
        
        {/* Active Profile Card */}
        <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {roleData.title.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                Logged in as
              </h4>
              <p className={`text-xs font-bold truncate ${roleData.color}`}>
                {roleData.title}
              </p>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                {plan === 'aura_plus' ? 'Aura+ Tier' : 'Aura Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 px-3 pb-1">
            CRM Modules
          </p>
          {navItems.map((item) => {
            const isAccessible = item.roles.includes(activeRole);
            const isAuraRestricted = item.requiresAuraPlus && plan === 'aura';
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : isAuraRestricted
                      ? 'text-neutral-400 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      : !isAccessible
                        ? 'opacity-40 text-neutral-400 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : item.highlight ? 'text-emerald-500' : 'text-neutral-400 dark:text-neutral-500'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isAuraRestricted && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Aura+
                    </span>
                  )}
                  {item.badge && !isAuraRestricted && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {!isAccessible && !isAuraRestricted && (
                    <Lock className="w-3 h-3 text-neutral-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info Box: Team KRK */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>Engineered by</span>
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">TEAM KRK</span>
        </div>
        
        <div className="text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between">
          <span>Target Domain</span>
          <span className="font-mono text-neutral-600 dark:text-neutral-300">kd.pvt.ltd</span>
        </div>

        <button
          onClick={() => setCurrentView('landing')}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </button>
      </div>
    </aside>
  );
};
