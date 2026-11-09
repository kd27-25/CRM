# KIRA (AI Chatbot) - AURA CRM Intelligent Assistant

Integrate **KIRA (AI Chatbot)** into AURA CRM as the dedicated AI assistant to help users with operational troubleshooting, plan comparisons (Aura vs. Aura+), role permissions, and full background information on TEAM KRK (Kartikey, Raj & KD).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> - **Official Name**: The assistant is named **KIRA (AI Chatbot)**.
> - **Dual Engine Architecture**: KIRA operates with **Gemini 3.8 Flash** via a secure server-side proxy route (`/api/ai/chat`), paired with a robust client-side domain knowledge engine to guarantee 100% availability for questions regarding plans, roles, issues, and TEAM KRK even when external API keys or offline modes occur.
> - **Interactive Action Pills**: KIRA can actively guide and navigate users with one-click actions (e.g. *[Open Calling Console]*, *[Upgrade to Aura+]*, *[View Team KRK Portrait]*).

---

### 1. Overview & Core Concept

- **What KIRA Does**: Acts as an interactive concierge and technical support assistant embedded directly in AURA CRM across four primary pillars:
  1. **Issue Troubleshooting**: Resolving telephony setup, audio permissions, unassigned leads, and explaining role limitations (e.g., why Manager and QA Audits require the Aura+ plan).
  2. **Subscription Plans**: Clearly explaining the differences between **Plan 1: Aura** ($49/mo; Administration, Admin, Calling Agent) and **Plan 2: Aura+** ($99/mo; adds Manager, Team Lead, and Audit QA), plus feature matrices and billing cycles.
  3. **TEAM KRK Background**: Introducing founders **Kartikey**, **Raj**, and **KD**, their engineering roles, the official contact channels (`00teamkrk@gmail.com`), target domain `kd.pvt.ltd`, GitHub `kd27-25`, and privacy controls.
  4. **System Navigation**: Directly taking users to specific CRM modules (Leads Kanban, Telephony Dialer, QA Evaluator, Settings).
- **Target Audience**: Calling agents, team supervisors, QA auditors, organization admins, and prospective clients on the landing page.

---

### 2. User Experience & Visual Design

- **Floating Widget & Trigger**:
  - Persistent bottom-right floating trigger button labeled **KIRA** with an animated AI sparkle icon, dark slate styling, and a subtle red glowing border (`border-red-600/40 shadow-red-950/40`).
  - Welcome notification badge with a subtle pulsing red dot to invite user engagement.
- **KIRA Chat Drawer Interface**:
  - **Header**: Features "KIRA (AI Chatbot)" title, live online indicator, active CRM plan badge (*Aura* or *Aura+*), and minimize/close controls.
  - **Quick-Prompt Action Chips**: Suggested starter prompts on initial launch:
    - *"Compare Aura vs Aura+ plans"*
    - *"Tell me about TEAM KRK"*
    - *"Why can't I access QA Audits?"*
    - *"How do I start a call?"*
  - **Message Stream**: Clean Markdown rendering for bullet points, code snippets, and highlighted keywords, paired with interactive navigation buttons.
  - **Input Bar**: Auto-expanding input field, send button, and keyboard shortcuts (`Enter` to submit, `Shift+Enter` for line breaks).
- **Theme & Branding Harmony**:
  - Premium dark theme with subtle crimson/red accents matching AURA CRM and the TEAM KRK visual identity.

---

### 3. Key Product Decisions & Trade-Offs

- **Persona & Identity**:
  - *Chosen Approach*: KIRA speaks as a knowledgeable, efficient, and friendly system specialist for AURA CRM and TEAM KRK.
  - *Why*: Keeps user interactions crisp, accurate, and aligned with enterprise B2B SaaS standards.
- **Server-Side Proxy vs. Direct Client SDK**:
  - *Chosen Approach*: Server-side route mounted in Express (`server.ts` with Vite dev middleware) using `@google/genai`.
  - *Why*: Enforces secure API key containment, complies with AI Studio security rules, and allows server-side injection of rich system context without client bundle bloat.
- **Resilient Fallback Mode**:
  - *Chosen Approach*: Built-in local domain matcher provides immediate answers if network connections or API limits are reached.
  - *Why*: Ensures KIRA never fails or presents broken error dialogs to prospective clients.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       AURA CRM Client                       │
├──────────────────────────────┬──────────────────────────────┤
│ Landing Page / CRM Workspace │ Floating KiraChatWidget.tsx  │
│  - Navigation State          │  - Conversation History      │
│  - Active Plan & Role        │  - Quick-Prompt Actions      │
│  - Action Callbacks          │  - Markdown Message Bubbles  │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               │ Fetch POST /api/ai/chat      │ (Fallback matcher
               │                              │  if offline)
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend (server.ts)              │
├─────────────────────────────────────────────────────────────┤
│  POST /api/ai/chat                                          │
│   ├── User Prompt & Conversation Context                    │
│   ├── Injects KIRA System Instruction (Knowledge Base)      │
│   └── Calls @google/genai SDK (gemini-3.8-flash)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Google Gemini API                        │
│                 (Model: gemini-3.8-flash)                   │
└─────────────────────────────────────────────────────────────┘
```

#### KIRA's Knowledge Base
The system prompt explicitly grounds KIRA with:
1. **Team KRK Details**:
   - **Kartikey (KT)**: Lead System Architect & Core Telephony Engineer (`kartikepand98@gmail.com`).
   - **Raj (RDX)**: Product Strategy & Security Infrastructure Lead (`00rajkushwaha@gmail.com`).
   - **KD (KD)**: Full-Stack Lead & Platform Engineer (`kushaldange270@gmail.com`).
   - Official Team Email: `00teamkrk@gmail.com` | Target Domain: `kd.pvt.ltd` | GitHub: `kd27-25`.
2. **Plans & Subscriptions**:
   - **Aura Plan** ($49/mo): Roles: Administration, Admin, Agent (Calling Purpose).
   - **Aura+ Plan** ($99/mo): Roles: Administration, Admin, Manager, Team Lead, Audit (QA), Agent.
   - Core differentiators: Managerial oversight and the 5-point QA Auditing rubric are strictly Aura+ features.
3. **Common Issues & Resolutions**:
   - How to dial leads, audio playback in call logs, CSV/JSON backups, and privacy toggle settings.
