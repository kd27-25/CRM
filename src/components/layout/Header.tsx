import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ROLES_CONFIG, PLANS_INFO } from '../../data/initialData';
import { UserRole } from '../../types/crm';
import { 
  PhoneCall, 
  Sun, 
  Moon, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    plan, 
    activeRole, 
    setActiveRole, 
    isRolePermittedInPlan, 
    settings, 
    toggleTheme,
    setActiveTab,
    startDialing
  } = useCRM();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const activeRoleData = ROLES_CONFIG[activeRole];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm tracking-wider">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                  AURA CRM
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  plan === 'aura_plus' 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}>
                  {plan === 'aura_plus' ? 'Aura+' : 'Aura'}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium whitespace-nowrap">
                by TEAM KRK
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {currentView === 'landing' ? (
            <>
              <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Features</a>
              <a href="#plans" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Subscription Plans</a>
              <a href="#roles" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Role Hierarchy</a>
              <a href="#about-us" className="hover:text-red-600 dark:hover:text-red-400 transition-colors whitespace-nowrap shrink-0">About Team KRK</a>
              <a href="#deployment" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">Architecture & Deploy</a>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('landing')}
                className="text-xs px-2.5 py-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
              >
                ← Back to Landing
              </button>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                Workspace Active
              </span>
            </div>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Dial Action */}
          <button
            onClick={() => {
              if (currentView !== 'crm') setCurrentView('crm');
              setActiveTab('calling');
              startDialing('+91 98201 44521');
            }}
            title="Launch Phone Console"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Dialer</span>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400">Role:</span>
              <span className="font-semibold">{activeRoleData.title}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Switch Active User Role
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Current Plan: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{PLANS_INFO[plan].name}</span>
                  </p>
                </div>

                <div className="max-h-72 overflow-y-auto px-1 space-y-0.5">
                  {(Object.keys(ROLES_CONFIG) as UserRole[]).map((rKey) => {
                    const rData = ROLES_CONFIG[rKey];
                    const isPermitted = isRolePermittedInPlan(rKey);
                    const isSelected = activeRole === rKey;

                    return (
                      <button
                        key={rKey}
                        disabled={!isPermitted}
                        onClick={() => {
                          if (isPermitted) {
                            setActiveRole(rKey);
                            setRoleDropdownOpen(false);
                            if (currentView !== 'crm') setCurrentView('crm');
                          }
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold' 
                            : isPermitted 
                              ? 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer' 
                              : 'opacity-40 cursor-not-allowed bg-neutral-50/50 dark:bg-neutral-900/50'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium flex items-center gap-1.5">
                            {rData.title}
                            {!isPermitted && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold">
                                Aura+ Only
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-neutral-400 truncate max-w-[180px]">
                            {rData.category}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 px-3">
                  <p className="text-[10px] text-neutral-400 leading-tight">
                    * Roles adjust available CRM tools, dialer permissions, and QA scorecards.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </button>

          {/* Primary Action Button */}
          {currentView === 'landing' ? (
            <button
              onClick={() => setCurrentView('crm')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Open CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveTab('billing');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Plan:</span>
              <span className="font-bold">{plan === 'aura_plus' ? 'Aura+' : 'Aura'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
