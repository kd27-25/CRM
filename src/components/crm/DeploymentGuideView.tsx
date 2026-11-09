import React, { useState } from 'react';
import { 
  CLIENT_DOMAIN, 
  CLIENT_GITHUB, 
  TEAM_KRK_MEMBERS, 
  TEAM_KRK_OFFICIAL_EMAIL 
} from '../../data/initialData';
import { 
  Terminal, 
  GitBranch, 
  Globe, 
  Database, 
  Copy, 
  Check, 
  Server, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Code2
} from 'lucide-react';

export const DeploymentGuideView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const GIT_COMMANDS = `
# 1. Initialize Git in the project directory
git init

# 2. Stage all source code files
git add .

# 3. Commit the modern AURA CRM release
git commit -m "feat(crm): launch AURA CRM v2.4 by TEAM KRK (KT, RDX & KD)"

# 4. Create your remote repository on GitHub (kd27-25/aura-crm)
# Then link your repository:
git remote add origin https://github.com/${CLIENT_GITHUB}/aura-crm.git

# 5. Push to GitHub main branch
git branch -M main
git push -u origin main
`.trim();

  const ENV_CONFIG = `
# ==========================================
# AURA CRM PRODUCTION ENVIRONMENT
# Domain: ${CLIENT_DOMAIN} | Author: TEAM KRK
# ==========================================

# Application URL
APP_URL="https://${CLIENT_DOMAIN}"
NODE_ENV="production"
PORT=3000

# Recommended: Firebase Production Configuration
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="aura-crm-krk.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="aura-crm-krk"
VITE_FIREBASE_STORAGE_BUCKET="aura-crm-krk.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="370107370353"
VITE_FIREBASE_APP_ID="1:370107370353:web:abcdef..."

# Optional: MongoDB Atlas Cluster Connection String (if opting for MongoDB)
# MONGODB_URI="mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/aura_crm?retryWrites=true&w=majority"
# JWT_SECRET="your-super-secure-production-jwt-key"
`.trim();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-500" />
            <span>GitHub Repository & Production Deployment Blueprint</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configured specifically for <strong className="text-neutral-800 dark:text-neutral-200">{CLIENT_GITHUB}</strong> and target domain <strong className="font-mono text-neutral-800 dark:text-neutral-200">{CLIENT_DOMAIN}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            Target: https://{CLIENT_DOMAIN}
          </span>
        </div>
      </div>

      {/* Part 1: Database Evaluation Recommendation */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            1. Free Database Evaluation & Architectural Recommendation
          </h3>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The user requested an evaluation between <strong>Firebase</strong> and <strong>MongoDB Atlas</strong> for initial commercial deployment with zero initial infrastructure costs:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Firebase Firestore & Auth (Recommended)
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                Top Pick
              </span>
            </div>
            <ul className="text-xs space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>100% Free Spark Plan:</strong> 1 GB storage, 50k reads & 20k writes per day.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Built-In Authentication:</strong> Email/Password, Google OAuth, and phone OTP out of the box without maintaining a server.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Native Real-Time Telephony Listeners:</strong> Instantly updates active agent calls across screens via Firestore snapshot subscriptions.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Free Custom Domain SSL:</strong> One-click SSL provisioning for <code className="font-mono">{CLIENT_DOMAIN}</code>.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                MongoDB Atlas (M0 Free Cluster)
              </h4>
              <span className="text-[10px] font-mono text-neutral-400">
                Alternative
              </span>
            </div>
            <ul className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span><strong>M0 Free Tier:</strong> 512 MB shared RAM and storage on AWS/GCP.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span><strong>Document Modeling:</strong> Well-suited for developers already using Mongoose ORM.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold shrink-0">!</span>
                <span><strong>Server Requirement:</strong> Requires deploying an Express/Node.js API layer on Render or Railway to protect database credentials and issue JWT tokens.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Part 2: Step-by-Step GitHub Setup for kd27-25 */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              2. Upload to GitHub Profile: {CLIENT_GITHUB}
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(GIT_COMMANDS, 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 1 ? 'Copied Commands!' : 'Copy Git Commands'}</span>
          </button>
        </div>

        <p className="text-xs text-neutral-500">
          Run these terminal commands in your local project root to publish directly to your GitHub repository:
        </p>

        <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
          {GIT_COMMANDS}
        </pre>
      </div>

      {/* Part 3: Environment Variables Configuration */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              3. Production Environment Variables (.env.production)
            </h3>
          </div>
          <button
            onClick={() => copyToClipboard(ENV_CONFIG, 2)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
          >
            {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedIndex === 2 ? 'Copied Config!' : 'Copy Config'}</span>
          </button>
        </div>

        <p className="text-xs text-neutral-500">
          Paste this template into your Vercel / Render / Firebase project settings:
        </p>

        <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800">
          {ENV_CONFIG}
        </pre>
      </div>

      {/* Part 4: Domain Connection: kd.pvt.ltd */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            4. Custom Domain DNS Configuration for {CLIENT_DOMAIN}
          </h3>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          In your DNS manager (Cloudflare, GoDaddy, or Namecheap), configure these standard DNS records to point <strong className="font-mono text-neutral-900 dark:text-white">{CLIENT_DOMAIN}</strong> to your deployed AURA CRM instance:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Host / Name</th>
                <th className="px-4 py-2.5">Target Value</th>
                <th className="px-4 py-2.5">TTL</th>
                <th className="px-4 py-2.5">Proxy Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-[11px]">
              <tr>
                <td className="px-4 py-2.5 font-bold text-blue-600">A</td>
                <td className="px-4 py-2.5">@</td>
                <td className="px-4 py-2.5">76.76.21.21 (or Firebase IP)</td>
                <td className="px-4 py-2.5">Auto</td>
                <td className="px-4 py-2.5 text-emerald-600 font-sans">Proxied / DNS Only</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-bold text-blue-600">CNAME</td>
                <td className="px-4 py-2.5">www</td>
                <td className="px-4 py-2.5">cname.vercel-dns.com</td>
                <td className="px-4 py-2.5">Auto</td>
                <td className="px-4 py-2.5 text-emerald-600 font-sans">Proxied / DNS Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
