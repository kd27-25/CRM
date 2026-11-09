import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with required aistudio-build header
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

const KIRA_SYSTEM_INSTRUCTION = `
You are KIRA (AI Chatbot), the dedicated AI Assistant and System Concierge for AURA CRM.
AURA CRM is an enterprise-grade calling operations, telephony, and Quality Assurance (QA) CRM SaaS platform engineered and managed by TEAM KRK (KT, RDX & KD).

Your mandate:
1. Provide instant, accurate, friendly, and structured guidance regarding CRM operations, troubleshooting, subscription plans, and team information.
2. Structure your replies with clean Markdown bullet points, bold headers, and concise explanations.
3. Subscription Plans Knowledge:
   - Plan 1: Aura ($49/month) - Designed for focused sales calling teams. Includes roles: Administration, Admin, and Agent (Calling Purpose).
   - Plan 2: Aura+ ($99/month) - Enterprise call center tier. Includes all 6 roles: Administration, Admin, Manager, Team Lead, Audit (QA), and Agent (Calling Purpose).
   - Major Difference: The 5-point Call Quality Assurance (QA) Evaluator and the Manager/Team Lead supervisory hierarchy are exclusive to Aura+.
4. TEAM KRK Leadership & Developers:
   - Kartikey (KT): Lead System Architect & Core Telephony Engineer (Contact: 6265151482, Email: kartikepand98@gmail.com).
   - Raj (RDX): Product Strategy & Security Infrastructure Lead (Contact: +91 89825 68249, Email: 00rajkushwaha@gmail.com).
   - KD (KD): Full-Stack Lead & Platform Engineer (Contact: 9307390086, Email: kushaldange270@gmail.com).
   - Official Team Email: 00teamkrk@gmail.com
   - Target Domain: kd.pvt.ltd | GitHub Profile: kd27-25.
5. Troubleshooting & Features:
   - Dialer: single-click dialing, active duration timer, mute/hold, disposition capture, and call recording logs.
   - QA Audit: 5-point rubric grading (Greeting, Need Discovery, Pitch Clarity, Objection Handling, Compliance) for quality scoring.
   - Lead Pipeline: Kanban & Tabular views, deal values, lead scores, priority filters.
   - Privacy Settings: Under Settings, admins can toggle developer mobile numbers between Public and Admin-Only Private.
   - Backups: JSON export/import under Settings.

Action Navigation Tags:
When relevant, append one or more of these action tags at the very end of your response so the user interface can render clickable buttons:
[ACTION:GO_CALLING] (Takes user to Agent Calling Console)
[ACTION:GO_LEADS] (Takes user to Leads & Pipeline)
[ACTION:GO_PLANS] (Takes user to Subscription & Plans)
[ACTION:GO_QA] (Takes user to Quality Assurance Audits)
[ACTION:GO_ABOUT] (Takes user to Meet TEAM KRK section)
[ACTION:GO_TEAM] (Takes user to Team & Role Management)
[ACTION:GO_SETTINGS] (Takes user to Platform Settings)
`.trim();

// API endpoint for KIRA (AI Chatbot)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!aiClient) {
      res.status(503).json({ 
        error: 'Gemini client not initialized. Using built-in knowledge engine.',
        needsFallback: true 
      });
      return;
    }

    // Format prompt with optional history
    let contextPrompt = '';
    if (Array.isArray(history) && history.length > 0) {
      contextPrompt = history.slice(-4).map((h: { sender: string; text: string }) => 
        `${h.sender === 'user' ? 'User' : 'KIRA'}: ${h.text}`
      ).join('\n') + '\n';
    }
    contextPrompt += `User: ${message}\nKIRA:`;

    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('AI response timed out')), 4000)
    );

    const response = await Promise.race([
      aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: contextPrompt,
        config: {
          systemInstruction: KIRA_SYSTEM_INSTRUCTION,
        },
      }),
      timeoutPromise,
    ]);

    const replyText = response.text || "I'm KIRA (AI Chatbot). How can I assist you with AURA CRM or TEAM KRK?";
    res.json({ reply: replyText });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.warn('Gemini API notice:', err.message);

    const q = (req.body.message || '').toLowerCase();
    let fallbackReply = `Hello! I'm **KIRA (AI Chatbot)**, your official AI Assistant for **AURA CRM**.\n\n` +
      `I can assist you with:\n` +
      `* **Subscription Plans**: Contrasting the **Aura ($49/mo)** and **Aura+ ($99/mo)** tiers\n` +
      `* **TEAM KRK Developers**: Details on Kartikey, Raj, and KD, plus official contact channels\n` +
      `* **System Troubleshooting**: Calling dialer, lead management, and QA audit suite\n\n` +
      `How can I assist you today?\n\n` +
      `[ACTION:GO_PLANS] [ACTION:GO_ABOUT] [ACTION:GO_CALLING]`;

    if (q.includes('team') || q.includes('krk') || q.includes('developer') || q.includes('kartikey') || q.includes('raj') || q.includes('kd')) {
      fallbackReply = `**AURA CRM was engineered and is managed by TEAM KRK:**\n\n` +
        `1. **Kartikey (KT)** - *Lead System Architect & Core Telephony Engineer*\n   Phone: 6265151482 · Email: kartikepand98@gmail.com\n\n` +
        `2. **Raj (RDX)** - *Product Strategy & Security Infrastructure Lead*\n   Phone: +91 89825 68249 · Email: 00rajkushwaha@gmail.com\n\n` +
        `3. **KD (KD)** - *Full-Stack Lead & Platform Engineer*\n   Phone: 9307390086 · Email: kushaldange270@gmail.com\n\n` +
        `Official Team Email: **00teamkrk@gmail.com**\n` +
        `Target Domain: **kd.pvt.ltd** | GitHub: **kd27-25**\n\n` +
        `[ACTION:GO_ABOUT]`;
    } else if (q.includes('plan') || q.includes('pricing') || q.includes('price') || q.includes('aura+') || q.includes('cost')) {
      fallbackReply = `**AURA CRM Subscription Plans:**\n\n` +
        `* **Plan 1: Aura ($49/mo)** - Focused calling operations. Roles: **Administration**, **Admin**, **Agent (Calling Purpose)**.\n` +
        `* **Plan 2: Aura+ ($99/mo)** - Enterprise tier. Includes all 6 roles: **Administration**, **Admin**, **Manager**, **Team Lead**, **Audit (QA)**, and **Agent (Calling Purpose)**.\n\n` +
        `**Key Difference**: The 5-point Call Quality Assurance (QA) Evaluator and the Manager/Team Lead hierarchy are strictly exclusive to **Aura+**.\n\n` +
        `[ACTION:GO_PLANS]`;
    } else if (q.includes('qa') || q.includes('audit') || q.includes('rubric') || q.includes('lock')) {
      fallbackReply = `**Quality Assurance (QA) Auditing:**\n\n` +
        `* The QA suite allows supervisors to score calls across 5 key rubrics: Greeting, Need Discovery, Pitch Clarity, Objection Handling, and Compliance.\n` +
        `* **Why is it locked?** QA Audits require the **Aura+** tier. Upgrade your subscription to unlock the QA Evaluator.\n\n` +
        `[ACTION:GO_QA] [ACTION:GO_PLANS]`;
    } else if (q.includes('issue') || q.includes('bug') || q.includes('report') || q.includes('error') || q.includes('problem') || q.includes('help') || q.includes('support')) {
      fallbackReply = `**AURA Issue Reporting & System Support:**\n\n` +
        `We take system stability and user workflows very seriously. Follow these quick steps to troubleshoot or report an issue:\n\n` +
        `* **Immediate Troubleshooting**:\n` +
        `  - Check that your user role has sufficient permissions in the top-right header role switcher.\n` +
        `  - Ensure your browser permits microphone/audio access for WebRTC telephony and DTMF sounds.\n` +
        `  - If data appears mismatched, download a quick **JSON Snapshot** under Settings before resetting.\n\n` +
        `* **Direct Engineering Escalation (TEAM KRK)**:\n` +
        `  - **Team Support Email**: **00teamkrk@gmail.com**\n` +
        `  - **Kartikey (KT)**: 6265151482 · kartikepand98@gmail.com\n` +
        `  - **Raj (RDX)**: +91 89825 68249 · 00rajkushwaha@gmail.com\n` +
        `  - **KD (KD)**: 9307390086 · kushaldange270@gmail.com\n\n` +
        `[ACTION:GO_SETTINGS] [ACTION:GO_ABOUT]`;
    } else if (q.includes('call') || q.includes('dial') || q.includes('phone')) {
      fallbackReply = `**AURA Telephony & Calling Console:**\n\n` +
        `* Click the green **Dial** button on any lead to load the active dialer.\n` +
        `* Controls include live DTMF keypad audio, Mute/Hold, active duration timer, and disposition tagging.\n\n` +
        `[ACTION:GO_CALLING] [ACTION:GO_LEADS]`;
    }

    res.json({ reply: fallbackReply });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', assistant: 'KIRA (AI Chatbot)', platform: 'AURA CRM' });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA CRM with KIRA (AI Chatbot) running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
