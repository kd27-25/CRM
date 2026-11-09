import { 
  TEAM_KRK_MEMBERS, 
  TEAM_KRK_OFFICIAL_EMAIL, 
  PLANS_INFO, 
  ROLES_CONFIG,
  CLIENT_DOMAIN,
  CLIENT_GITHUB 
} from '../data/initialData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'kira';
  text: string;
  timestamp: string;
  actions?: KiraAction[];
}

export interface KiraAction {
  id: string;
  label: string;
  type: 'navigation' | 'dialer' | 'plan_switch' | 'external';
  target: string;
}

export const KIRA_SYSTEM_INSTRUCTION = `
You are KIRA (AI Chatbot), the official AI Assistant and System Concierge for AURA CRM.
AURA CRM is a high-velocity telephony, calling operations, and Quality Assurance (QA) CRM SaaS platform engineered and managed by TEAM KRK (KT, RDX & KD).

Your role is to assist users warmly, professionally, and concisely regarding:
1. CRM Issues & Troubleshooting:
   - Calling & Telephony: single-click dialing from lead cards, DTMF keypad audio, active call duration timing, mute/hold controls, call disposition tagging, and call recording logs.
   - Quality Assurance (QA) Audits: explain that the 5-point rubric evaluation (Greeting, Need Discovery, Pitch Clarity, Objection Handling, Compliance Etiquette) is exclusive to the Aura+ plan.
   - Lead Pipeline: Kanban board & tabular views, lead priority, lead scoring, deal values, and status movement.
   - Permissions & RBAC: 6 granular roles (Administration, Admin, Manager, Team Lead, Audit QA, Agent).
   - Data & Backups: Offline JSON database export/import and CSV reporting under Settings.
   - Contact Privacy: In Settings, admins can toggle developer mobile numbers between Public and Admin-Only Private.

2. Subscription Plans:
   - Plan 1: Aura ($49/month) - Designed for focused sales groups. Includes: Administration, Admin, and Agent (Calling Purpose).
   - Plan 2: Aura+ ($99/month) - Enterprise call center tier. Includes: Administration, Admin, Manager, Team Lead, Audit (QA), and Agent (Calling Purpose).
   - The key differences: Manager & Team Lead supervisor hierarchy and Call Quality Audit (QA) rubrics are strictly available in Aura+.

3. TEAM KRK (Developers & Leadership):
   - Kartikey (KT): Lead System Architect & Core Telephony Engineer (Contact: 6265151482, Email: kartikepand98@gmail.com).
   - Raj (RDX): Product Strategy & Security Infrastructure Lead (Contact: +91 89825 68249, Email: 00rajkushwaha@gmail.com).
   - KD (KD): Full-Stack Lead & Platform Engineer (Contact: 9307390086, Email: kushaldange270@gmail.com).
   - Official Team Email: 00teamkrk@gmail.com
   - Target Domain: kd.pvt.ltd | GitHub Profile: kd27-25.

Whenever relevant, you can include actionable navigation tags at the end of your response to give the user quick buttons:
- [ACTION:GO_CALLING] (Takes user to Agent Calling Console)
- [ACTION:GO_LEADS] (Takes user to Leads & Pipeline)
- [ACTION:GO_PLANS] (Takes user to Subscription & Plans)
- [ACTION:GO_QA] (Takes user to Quality Assurance Audits)
- [ACTION:GO_ABOUT] (Takes user to Meet TEAM KRK section)
- [ACTION:GO_TEAM] (Takes user to Team & Role Management)
- [ACTION:GO_SETTINGS] (Takes user to Platform Settings)

Keep responses formatted with clean Markdown bullet points and concise paragraphs. Be proactive and helpful.
`.trim();

export interface QuickActionTopic {
  id: string;
  label: string;
  prompt: string;
  icon: 'plans' | 'team' | 'issue' | 'calling';
  description?: string;
}

export const KIRA_QUICK_ACTIONS: QuickActionTopic[] = [
  {
    id: 'topic-plans',
    label: 'Subscription Plans',
    prompt: 'Compare Aura vs Aura+ plans and pricing',
    icon: 'plans',
    description: 'Aura vs Aura+ comparison',
  },
  {
    id: 'topic-devs',
    label: 'Developer Info',
    prompt: 'Tell me about TEAM KRK and the developers',
    icon: 'team',
    description: 'Kartikey, Raj, KD contacts',
  },
  {
    id: 'topic-issue',
    label: 'Report an Issue',
    prompt: 'I want to report an issue or need troubleshooting help',
    icon: 'issue',
    description: 'Diagnostics & engineering support',
  },
  {
    id: 'topic-calling',
    label: 'Dialer & Calling',
    prompt: 'How do I use the calling dialer and log dispositions?',
    icon: 'calling',
    description: 'Telephony console guide',
  },
];

export const QUICK_PROMPTS = [
  'Compare Aura vs Aura+ plans',
  'Who is TEAM KRK?',
  'Report an issue or bug',
  'Why is QA Audit locked?',
  'How do I dial a lead?',
  'Where can I export data?',
];

export function parseActionsFromText(text: string): { text: string; cleanText: string; actions: KiraAction[] } {
  const actions: KiraAction[] = [];
  let cleanText = text;

  const actionMap: Record<string, { label: string; type: KiraAction['type']; target: string }> = {
    '[ACTION:GO_CALLING]': { label: 'Open Calling Console', type: 'dialer', target: 'calling' },
    '[ACTION:GO_LEADS]': { label: 'View Leads Pipeline', type: 'navigation', target: 'leads' },
    '[ACTION:GO_PLANS]': { label: 'Explore Subscription Plans', type: 'plan_switch', target: 'billing' },
    '[ACTION:GO_QA]': { label: 'Inspect QA Audit Suite', type: 'navigation', target: 'qa_audit' },
    '[ACTION:GO_ABOUT]': { label: 'Meet TEAM KRK', type: 'navigation', target: 'about_us' },
    '[ACTION:GO_TEAM]': { label: 'Manage Team & Roles', type: 'navigation', target: 'team' },
    '[ACTION:GO_SETTINGS]': { label: 'Open Platform Settings', type: 'navigation', target: 'settings' },
  };

  Object.entries(actionMap).forEach(([tag, act]) => {
    if (cleanText.includes(tag)) {
      actions.push({ id: `act-${tag}`, ...act });
      cleanText = cleanText.replaceAll(tag, '').trim();
    }
  });

  return { text: cleanText, cleanText, actions };
}

export function generateKiraFallbackResponse(query: string, currentPlan: string, currentRole: string): { text: string; actions: KiraAction[] } {
  const q = query.toLowerCase();

  // 1. Subscription Plans comparison
  if (q.includes('plan') || q.includes('price') || q.includes('pricing') || q.includes('aura+') || q.includes('cost') || q.includes('subscription')) {
    const text = `**AURA CRM offers two transparent subscription plans:**\n\n` +
      `* **Plan 1: Aura ($49/mo)**: Tailored for active calling teams. Includes **Administration**, **Admin**, and **Agent (Calling Purpose)**.\n` +
      `* **Plan 2: Aura+ ($99/mo)**: Enterprise tier. Includes all 6 roles: **Administration**, **Admin**, **Manager**, **Team Lead**, **Audit (QA)**, and **Agent (Calling Purpose)**.\n\n` +
      `**Key Difference**: The dedicated 5-point Call Quality Assurance (QA) Evaluator and the Manager/Team Lead supervisory hierarchy are exclusive to **Aura+**.\n\n` +
      `[ACTION:GO_PLANS]`;
    return parseActionsFromText(text);
  }

  // 2. TEAM KRK info
  if (q.includes('team') || q.includes('krk') || q.includes('developer') || q.includes('creator') || q.includes('who built') || q.includes('kartikey') || q.includes('raj') || q.includes('kd')) {
    const text = `**AURA CRM was developed and is managed by TEAM KRK:**\n\n` +
      `1. **Kartikey (KT)** - *Lead System Architect & Core Telephony Engineer*\n   Phone: 6265151482 · Email: kartikepand98@gmail.com\n\n` +
      `2. **Raj (RDX)** - *Product Strategy & Security Infrastructure Lead*\n   Phone: +91 89825 68249 · Email: 00rajkushwaha@gmail.com\n\n` +
      `3. **KD (KD)** - *Full-Stack Lead & Platform Engineer*\n   Phone: 9307390086 · Email: kushaldange270@gmail.com\n\n` +
      `Official Team Email: **${TEAM_KRK_OFFICIAL_EMAIL}**\n` +
      `Target Domain: **${CLIENT_DOMAIN}** | GitHub: **${CLIENT_GITHUB}**\n\n` +
      `[ACTION:GO_ABOUT]`;
    return parseActionsFromText(text);
  }

  // 3. QA Audit troubleshooting
  if (q.includes('qa') || q.includes('audit') || q.includes('lock') || q.includes('rubric') || q.includes('score')) {
    const text = `**Call Quality Assurance (QA) Auditing:**\n\n` +
      `* The QA suite allows auditors and managers to grade recorded calls across a **5-point rubric** (Greeting, Need Discovery, Pitch Clarity, Objection Handling, and Compliance).\n` +
      `* **Why is it locked?** QA Audits require the **Aura+** plan. If your organization is on the Aura standard plan, upgrade to Aura+ to unlock the QA Evaluator and Manager oversight.\n\n` +
      `[ACTION:GO_QA] [ACTION:GO_PLANS]`;
    return parseActionsFromText(text);
  }

  // 4. Calling / Dialer assistance
  if (q.includes('call') || q.includes('dial') || q.includes('phone') || q.includes('agent') || q.includes('disposition')) {
    const text = `**AURA Telephony & Calling Console:**\n\n` +
      `* **Single-Click Dialing**: Click the green **Dial** button next to any lead in your pipeline to populate the dialer.\n` +
      `* **Active Call Controls**: Use the interactive DTMF keypad, toggle Mute or Hold, and track handle time (AHT) in real time.\n` +
      `* **Dispositions**: When ending a call, select a disposition (*Interested*, *Follow Up*, *Converted*, etc.) and enter call notes to automatically log the record.\n\n` +
      `[ACTION:GO_CALLING] [ACTION:GO_LEADS]`;
    return parseActionsFromText(text);
  }

  // 5. Report an Issue / Troubleshooting
  if (q.includes('issue') || q.includes('bug') || q.includes('report') || q.includes('error') || q.includes('problem') || q.includes('help') || q.includes('support')) {
    const text = `**AURA Issue Reporting & System Support:**\n\n` +
      `We take system stability and user workflows very seriously. Follow these quick steps to troubleshoot or report an issue:\n\n` +
      `* **Immediate Troubleshooting**:\n` +
      `  - Check that your user role has sufficient permissions in the top-right header role switcher.\n` +
      `  - Ensure your browser permits microphone/audio access for WebRTC telephony and DTMF sounds.\n` +
      `  - If data appears mismatched, download a quick **JSON Snapshot** under Settings before resetting.\n\n` +
      `* **Direct Engineering Escalation (TEAM KRK)**:\n` +
      `  - **Team Support Email**: **${TEAM_KRK_OFFICIAL_EMAIL}**\n` +
      `  - **Kartikey (KT)**: 6265151482 · kartikepand98@gmail.com\n` +
      `  - **Raj (RDX)**: +91 89825 68249 · 00rajkushwaha@gmail.com\n` +
      `  - **KD (KD)**: 9307390086 · kushaldange270@gmail.com\n\n` +
      `[ACTION:GO_SETTINGS] [ACTION:GO_ABOUT]`;
    return parseActionsFromText(text);
  }

  // 6. Data export / backup
  if (q.includes('export') || q.includes('backup') || q.includes('json') || q.includes('database') || q.includes('restore') || q.includes('privacy')) {
    const text = `**Data Management & Privacy Controls:**\n\n` +
      `* **JSON Snapshot**: You can download a full portable JSON backup of your leads, call recordings, and team members under **Settings**.\n` +
      `* **Database Restore**: Paste any previously exported backup to restore the CRM instantly.\n` +
      `* **Contact Privacy**: Administrators can toggle whether TEAM KRK developer numbers are visible publicly or restricted to authenticated admins.\n\n` +
      `[ACTION:GO_SETTINGS]`;
    return parseActionsFromText(text);
  }

  // Default helpful response
  const text = `Hello! I'm **KIRA (AI Chatbot)**, your AURA CRM concierge.\n\n` +
    `I can assist you with:\n` +
    `* **CRM Issues & Features**: Dialer controls, lead stages, QA audits, and RBAC permissions.\n` +
    `* **Subscription Plans**: Contrasting the **Aura** ($49/mo) and **Aura+** ($99/mo) tiers.\n` +
    `* **TEAM KRK Background**: Details on Kartikey, Raj, and KD, and official contact channels.\n\n` +
    `How can I assist your workflow today?\n\n` +
    `[ACTION:GO_PLANS] [ACTION:GO_ABOUT] [ACTION:GO_CALLING]`;
  return parseActionsFromText(text);
}
