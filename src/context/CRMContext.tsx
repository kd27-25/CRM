import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Lead, 
  CallRecord, 
  TeamMember, 
  SubscriptionPlan, 
  UserRole, 
  AppSettings, 
  QAEvaluation, 
  LeadStatus, 
  CallDisposition 
} from '../types/crm';
import { 
  INITIAL_LEADS, 
  INITIAL_CALL_RECORDS, 
  INITIAL_TEAM_MEMBERS, 
  ROLES_CONFIG 
} from '../data/initialData';

interface ActiveCallState {
  isActive: boolean;
  leadId: string | null;
  leadName: string;
  leadCompany: string;
  phone: string;
  startTime: number | null;
  duration: number;
  isMuted: boolean;
  isOnHold: boolean;
  callStatus: 'dialing' | 'ringing' | 'connected' | 'ended';
}

interface CRMContextType {
  // Plan & Role
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isRolePermittedInPlan: (role: UserRole, plan?: SubscriptionPlan) => boolean;

  // View state
  currentView: 'landing' | 'crm';
  setCurrentView: (view: 'landing' | 'crm') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;

  // Calls
  callRecords: CallRecord[];
  activeCall: ActiveCallState;
  startDialing: (phone: string, lead?: Lead) => void;
  connectCall: () => void;
  toggleMute: () => void;
  toggleHold: () => void;
  endActiveCall: (disposition: CallDisposition, notes: string) => void;
  cancelCall: () => void;

  // QA Audits
  submitQAEvaluation: (evaluation: Omit<QAEvaluation, 'id' | 'evaluatedAt'>) => void;

  // Team
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate' | 'callsToday' | 'dealsClosed' | 'conversionRate' | 'assignedLeadsCount'>) => void;
  updateMemberRole: (id: string, newRole: UserRole) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  toggleKRKContactPrivacy: () => void;

  // Tools & Utils
  resetToDefaultData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLAN: 'aura_crm_plan',
  ROLE: 'aura_crm_role',
  LEADS: 'aura_crm_leads',
  CALLS: 'aura_crm_calls',
  TEAM: 'aura_crm_team',
  SETTINGS: 'aura_crm_settings',
  THEME: 'aura_crm_theme',
};

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & UI state
  const [currentView, setCurrentView] = useState<'landing' | 'crm'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Plan & Role state
  const [plan, setPlanState] = useState<SubscriptionPlan>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
    return (saved === 'aura' || saved === 'aura_plus') ? saved : 'aura_plus';
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole;
    return saved || 'administration';
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      plan: 'aura_plus',
      activeRole: 'administration',
      showTeamKRKContactsPublicly: true,
      companyName: 'AURA Telephony Technologies',
      telephonyEnabled: true,
      autoRecordCalls: true,
      qaPassThreshold: 80,
      theme: 'dark',
    };
  });

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, settings.theme);
  }, [settings.theme]);

  const toggleTheme = () => {
    setSettings(prev => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
  };

  const toggleKRKContactPrivacy = () => {
    setSettings(prev => ({
      ...prev,
      showTeamKRKContactsPublicly: !prev.showTeamKRKContactsPublicly,
    }));
  };

  const setPlan = (newPlan: SubscriptionPlan) => {
    setPlanState(newPlan);
    localStorage.setItem(STORAGE_KEYS.PLAN, newPlan);
    setSettings(prev => ({ ...prev, plan: newPlan }));

    // If active role is not permitted in new plan, gracefully fallback to 'admin'
    if (newPlan === 'aura' && !['administration', 'admin', 'agent'].includes(activeRole)) {
      setActiveRoleState('admin');
      localStorage.setItem(STORAGE_KEYS.ROLE, 'admin');
    }
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    setSettings(prev => ({ ...prev, activeRole: role }));
  };

  const isRolePermittedInPlan = (role: UserRole, targetPlan = plan): boolean => {
    const config = ROLES_CONFIG[role];
    if (!config) return true;
    if (config.planRequired === 'aura') return true;
    return targetPlan === 'aura_plus';
  };

  // Leads state
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_LEADS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  }, [leads]);

  // Call records state
  const [callRecords, setCallRecords] = useState<CallRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALLS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CALL_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(callRecords));
  }, [callRecords]);

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TEAM_MEMBERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Active call state
  const [activeCall, setActiveCall] = useState<ActiveCallState>({
    isActive: false,
    leadId: null,
    leadName: '',
    leadCompany: '',
    phone: '',
    startTime: null,
    duration: 0,
    isMuted: false,
    isOnHold: false,
    callStatus: 'dialing',
  });

  // Call duration timer
  useEffect(() => {
    let timer: number | null = null;
    if (activeCall.isActive && activeCall.callStatus === 'connected') {
      timer = window.setInterval(() => {
        setActiveCall(prev => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCall.isActive, activeCall.callStatus]);

  const startDialing = (phone: string, lead?: Lead) => {
    setActiveCall({
      isActive: true,
      leadId: lead ? lead.id : null,
      leadName: lead ? lead.name : 'Unknown Contact',
      leadCompany: lead ? lead.company : 'Direct Dial',
      phone: phone || (lead ? lead.phone : ''),
      startTime: Date.now(),
      duration: 0,
      isMuted: false,
      isOnHold: false,
      callStatus: 'ringing',
    });

    // Auto-connect after 3.5 seconds to simulate ringing and answer
    setTimeout(() => {
      setActiveCall(prev => {
        if (prev.isActive && prev.callStatus === 'ringing') {
          return {
            ...prev,
            callStatus: 'connected',
            startTime: Date.now(),
          };
        }
        return prev;
      });
    }, 3500);
  };

  const connectCall = () => {
    setActiveCall(prev => ({
      ...prev,
      callStatus: 'connected',
      startTime: Date.now(),
    }));
  };

  const toggleMute = () => {
    setActiveCall(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleHold = () => {
    setActiveCall(prev => ({ ...prev, isOnHold: !prev.isOnHold }));
  };

  const cancelCall = () => {
    setActiveCall({
      isActive: false,
      leadId: null,
      leadName: '',
      leadCompany: '',
      phone: '',
      startTime: null,
      duration: 0,
      isMuted: false,
      isOnHold: false,
      callStatus: 'ended',
    });
  };

  const endActiveCall = (disposition: CallDisposition, notes: string) => {
    const duration = activeCall.duration || 12;
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    const audioDuration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const newRecord: CallRecord = {
      id: `call-${Date.now()}`,
      leadId: activeCall.leadId || `lead-temp-${Date.now()}`,
      leadName: activeCall.leadName,
      leadCompany: activeCall.leadCompany,
      phone: activeCall.phone,
      agentId: 'tm-1',
      agentName: 'Active User (' + ROLES_CONFIG[activeRole].title + ')',
      startedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      durationSeconds: duration,
      disposition,
      notes: notes || 'Call logged via AURA Telephony Console',
      audioDuration,
    };

    setCallRecords(prev => [newRecord, ...prev]);

    // Update lead last call and notes if matched
    if (activeCall.leadId) {
      setLeads(prev => prev.map(l => {
        if (l.id === activeCall.leadId) {
          const updatedNotes = notes ? [notes, ...l.notes] : l.notes;
          let nextStatus = l.status;
          if (disposition === 'interested') nextStatus = 'interested';
          else if (disposition === 'follow_up') nextStatus = 'follow_up';
          else if (disposition === 'converted') nextStatus = 'converted';
          return {
            ...l,
            status: nextStatus,
            lastCallAt: newRecord.startedAt,
            notes: updatedNotes,
            updatedAt: new Date().toISOString().substring(0, 10),
          };
        }
        return l;
      }));
    }

    // Reset active call
    cancelCall();
  };

  // Lead actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const today = new Date().toISOString().substring(0, 10);
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: today,
      updatedAt: today,
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => {
      if (l.id === id) {
        return {
          ...l,
          ...updates,
          updatedAt: new Date().toISOString().substring(0, 10),
        };
      }
      return l;
    }));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    updateLead(id, { status });
  };

  // QA Evaluation
  const submitQAEvaluation = (evaluation: Omit<QAEvaluation, 'id' | 'evaluatedAt'>) => {
    const fullEvaluation: QAEvaluation = {
      ...evaluation,
      id: `qa-${Date.now()}`,
      evaluatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setCallRecords(prev => prev.map(c => {
      if (c.id === fullEvaluation.callRecordId) {
        return {
          ...c,
          qaEvaluation: fullEvaluation,
        };
      }
      return c;
    }));
  };

  // Team management
  const addTeamMember = (member: Omit<TeamMember, 'id' | 'joinedDate' | 'callsToday' | 'dealsClosed' | 'conversionRate' | 'assignedLeadsCount'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `tm-${Date.now()}`,
      joinedDate: new Date().toISOString().substring(0, 10),
      callsToday: 0,
      dealsClosed: 0,
      conversionRate: 0,
      assignedLeadsCount: 0,
    };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const updateMemberRole = (id: string, newRole: UserRole) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
  };

  const resetToDefaultData = () => {
    setLeads(INITIAL_LEADS);
    setCallRecords(INITIAL_CALL_RECORDS);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setPlan('aura_plus');
    setActiveRole('administration');
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.CALLS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
  };

  const exportDatabaseJSON = () => {
    const payload = {
      app: 'AURA CRM',
      team: 'TEAM KRK (KT, RDX & KD)',
      exportedAt: new Date().toISOString(),
      plan,
      settings,
      leads,
      callRecords,
      teamMembers,
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.leads && Array.isArray(data.leads)) setLeads(data.leads);
      if (data.callRecords && Array.isArray(data.callRecords)) setCallRecords(data.callRecords);
      if (data.teamMembers && Array.isArray(data.teamMembers)) setTeamMembers(data.teamMembers);
      if (data.plan) setPlan(data.plan);
      return true;
    } catch {
      return false;
    }
  };

  const value = useMemo(() => ({
    plan,
    setPlan,
    activeRole,
    setActiveRole,
    isRolePermittedInPlan,
    currentView,
    setCurrentView,
    activeTab,
    setActiveTab,
    leads,
    addLead,
    updateLead,
    deleteLead,
    updateLeadStatus,
    callRecords,
    activeCall,
    startDialing,
    connectCall,
    toggleMute,
    toggleHold,
    endActiveCall,
    cancelCall,
    submitQAEvaluation,
    teamMembers,
    addTeamMember,
    updateMemberRole,
    settings,
    updateSettings,
    toggleTheme,
    toggleKRKContactPrivacy,
    resetToDefaultData,
    exportDatabaseJSON,
    importDatabaseJSON,
  }), [
    plan,
    activeRole,
    currentView,
    activeTab,
    leads,
    callRecords,
    activeCall,
    teamMembers,
    settings,
  ]);

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
