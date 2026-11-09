export type SubscriptionPlan = 'aura' | 'aura_plus';

export type UserRole = 
  | 'administration' 
  | 'admin' 
  | 'manager' 
  | 'team_lead' 
  | 'audit_qa' 
  | 'agent';

export interface RoleDefinition {
  id: UserRole;
  title: string;
  category: string;
  description: string;
  planRequired: SubscriptionPlan;
  color: string;
  badgeBg: string;
  permissions: string[];
}

export type LeadStatus = 'new' | 'contacted' | 'follow_up' | 'interested' | 'converted' | 'lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  priority: LeadPriority;
  score: number;
  dealValue: number;
  assignedToId: string;
  assignedToName: string;
  source: string;
  lastCallAt?: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export type CallDisposition = 
  | 'interested'
  | 'follow_up'
  | 'not_answered'
  | 'invalid_number'
  | 'converted'
  | 'do_not_call';

export interface QAEvaluation {
  id: string;
  callRecordId: string;
  auditorId: string;
  auditorName: string;
  evaluatedAt: string;
  score: number; // 0 - 100
  status: 'passed' | 'needs_coaching' | 'critical_fail';
  rubric: {
    greeting: number; // 0-20
    needDiscovery: number; // 0-20
    pitchClarity: number; // 0-20
    objectionHandling: number; // 0-20
    complianceEtiquette: number; // 0-20
  };
  feedback: string;
  actionItems: string;
}

export interface CallRecord {
  id: string;
  leadId: string;
  leadName: string;
  leadCompany: string;
  phone: string;
  agentId: string;
  agentName: string;
  startedAt: string;
  durationSeconds: number;
  disposition: CallDisposition;
  notes: string;
  audioDuration: string;
  qaEvaluation?: QAEvaluation;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'on_call' | 'offline';
  callsToday: number;
  dealsClosed: number;
  conversionRate: number;
  assignedLeadsCount: number;
  joinedDate: string;
}

export interface TeamKRKMember {
  name: string;
  handle: string;
  role: string;
  contact: string;
  email: string;
  bio: string;
}

export interface AppSettings {
  plan: SubscriptionPlan;
  activeRole: UserRole;
  showTeamKRKContactsPublicly: boolean;
  companyName: string;
  telephonyEnabled: boolean;
  autoRecordCalls: boolean;
  qaPassThreshold: number;
  theme: 'light' | 'dark';
}
