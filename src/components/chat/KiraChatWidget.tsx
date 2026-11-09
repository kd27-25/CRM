import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { 
  ChatMessage, 
  KiraAction, 
  QUICK_PROMPTS, 
  KIRA_QUICK_ACTIONS,
  parseActionsFromText, 
  generateKiraFallbackResponse 
} from '../../utils/kiraKnowledge';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Minimize2, 
  ArrowUpRight, 
  PhoneCall, 
  ShieldAlert, 
  Layers, 
  Users, 
  AlertCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const KiraChatWidget: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    plan, 
    activeRole, 
    setActiveTab, 
    startDialing 
  } = useCRM();

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const initialGreeting: ChatMessage = {
    id: 'msg-welcome',
    sender: 'kira',
    text: `Hello! I'm **KIRA (AI Chatbot)**, your official AI Assistant for **AURA CRM**.\n\n` +
      `I can help you with:\n` +
      `* **System & Troubleshooting**: Dialer setup, call dispositioning, and QA rubrics\n` +
      `* **Subscription Plans**: Contrasting **Aura** ($49/mo) and **Aura+** ($99/mo)\n` +
      `* **Developer Leadership**: Full details and contacts for **TEAM KRK** (Kartikey, Raj, KD)\n\n` +
      `What would you like to explore?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actions: [
      { id: 'act-plans', label: 'Compare Aura vs Aura+', type: 'plan_switch', target: 'billing' },
      { id: 'act-about', label: 'Meet TEAM KRK', type: 'navigation', target: 'about_us' },
      { id: 'act-dial', label: 'Open Dialer', type: 'dialer', target: 'calling' },
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  // Handle action clicks from KIRA's responses
  const handleActionClick = (action: KiraAction) => {
    if (action.target === 'about_us') {
      if (currentView !== 'landing') {
        setCurrentView('landing');
      }
      setTimeout(() => {
        const el = document.getElementById('about-us');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    if (action.target === 'calling') {
      if (currentView !== 'crm') setCurrentView('crm');
      setActiveTab('calling');
      startDialing('+91 98201 44521');
      return;
    }

    if (action.target === 'billing' || action.target === 'plans') {
      if (currentView === 'landing') {
        const el = document.getElementById('plans');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      if (currentView !== 'crm') setCurrentView('crm');
      setActiveTab('billing');
      return;
    }

    // Default CRM navigation
    if (currentView !== 'crm') setCurrentView('crm');
    setActiveTab(action.target);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    if (!rawText.trim() || isLoading) return;

    const userText = rawText.trim();
    setInputValue('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build history payload (last 6 messages)
      const historyPayload = messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`API status ${res.status}`);
      }

      const data = await res.json();
      if (data.reply) {
        const { cleanText, actions } = parseActionsFromText(data.reply);
        const kiraReply: ChatMessage = {
          id: `kira-${Date.now()}`,
          sender: 'kira',
          text: cleanText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: actions.length > 0 ? actions : undefined,
        };
        setMessages(prev => [...prev, kiraReply]);
      } else {
        throw new Error('Empty AI response');
      }
    } catch {
      // Graceful fallback to rich built-in knowledge matcher
      const fallback = generateKiraFallbackResponse(userText, plan, activeRole);
      const kiraReply: ChatMessage = {
        id: `kira-${Date.now()}`,
        sender: 'kira',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: fallback.actions.length > 0 ? fallback.actions : undefined,
      };
      setMessages(prev => [...prev, kiraReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
  };

  // Helper to format text with Markdown bold and bullet points
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ') || line.trim().startsWith('• ');
          const lineText = isBullet ? line.trim().replace(/^[*•-]\s*/, '') : line;

          // Render bold segments
          const parts = lineText.split(/(\*\*.*?\*\*)/g);

          const content = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                <span className="text-neutral-700 dark:text-neutral-300">{content}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-neutral-700 dark:text-neutral-300">
              {content}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        {!isOpen && hasUnread && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 dark:bg-neutral-900/95 border border-red-500/30 text-white text-xs shadow-lg backdrop-blur-md animate-bounce duration-1000">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-medium text-[11px] text-neutral-200">
              Ask <span className="font-bold text-red-400">KIRA</span> anything
            </span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open KIRA AI Assistant"
          className="relative group flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-neutral-950 via-neutral-900 to-red-950 border border-red-500/40 text-white shadow-xl shadow-red-950/50 hover:border-red-500 hover:shadow-red-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-neutral-200 group-hover:rotate-90 transition-transform duration-200" />
          ) : (
            <div className="relative">
              <Bot className="w-7 h-7 text-red-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-neutral-900" />
              </span>
            </div>
          )}

          {/* Micro badge below button */}
          <span className="absolute -bottom-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-sm border border-red-400/50">
            KIRA
          </span>
        </button>
      </div>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div 
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-6.5rem)] flex flex-col rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-red-900/30 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-neutral-900 flex items-center justify-center text-white shadow-sm shadow-red-500/20">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-neutral-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 tracking-tight">
                    KIRA
                  </h3>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                    AI Chatbot
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  AURA CRM & TEAM KRK Concierge
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Restart Conversation"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize Window"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader info pill */}
          <div className="px-4 py-1.5 bg-neutral-100/70 dark:bg-neutral-900/40 border-b border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-500" />
              Powered by Gemini 3.8 Flash
            </span>
            <span className="font-medium text-neutral-600 dark:text-neutral-300">
              Active Tier: <strong className="text-red-500">{plan === 'aura_plus' ? 'Aura+' : 'Aura'}</strong>
            </span>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-red-950/60 text-neutral-900 dark:text-neutral-100 rounded-bl-xs shadow-sm'
                  }`}
                >
                  {msg.sender === 'kira' ? (
                    renderFormattedText(msg.text)
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {/* Render interactive action pills if KIRA generated navigation actions */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.actions.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => handleActionClick(act)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors shadow-xs cursor-pointer group"
                      >
                        {act.type === 'dialer' && <PhoneCall className="w-3 h-3 text-red-500" />}
                        {act.type === 'plan_switch' && <Layers className="w-3 h-3 text-red-500" />}
                        {act.type === 'navigation' && <ArrowUpRight className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-neutral-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 text-red-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-red-950/60 rounded-2xl rounded-bl-xs px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-neutral-400 ml-1">KIRA is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Persistent Quick Action Topics Bar */}
          <div className="px-3 pt-2.5 pb-2 bg-neutral-50/95 dark:bg-neutral-900/95 border-t border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-red-500" />
                Quick Actions
              </span>
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500">
                Persistent Topics
              </span>
            </div>

            {/* 3 Core Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage('Compare Aura vs Aura+ plans and pricing')}
                className="flex flex-col items-start p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50/40 dark:hover:bg-red-950/20 text-neutral-800 dark:text-neutral-200 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="flex items-center gap-1.5 mb-0.5 w-full">
                  <Layers className="w-3.5 h-3.5 text-blue-500 group-hover:text-red-500 transition-colors shrink-0" />
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                    Subscription Plans
                  </span>
                </div>
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate w-full">
                  Aura vs Aura+
                </span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage('Tell me about TEAM KRK and the developers')}
                className="flex flex-col items-start p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50/40 dark:hover:bg-red-950/20 text-neutral-800 dark:text-neutral-200 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="flex items-center gap-1.5 mb-0.5 w-full">
                  <Users className="w-3.5 h-3.5 text-indigo-500 group-hover:text-red-500 transition-colors shrink-0" />
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                    Developer Info
                  </span>
                </div>
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate w-full">
                  TEAM KRK Team
                </span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage('I want to report an issue or need troubleshooting help')}
                className="flex flex-col items-start p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50/40 dark:hover:bg-red-950/20 text-neutral-800 dark:text-neutral-200 transition-all shadow-2xs group cursor-pointer text-left"
              >
                <div className="flex items-center gap-1.5 mb-0.5 w-full">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 group-hover:text-red-500 transition-colors shrink-0" />
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                    Report an Issue
                  </span>
                </div>
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate w-full">
                  Help & Contacts
                </span>
              </button>
            </div>

            {/* Secondary Prompt Badges */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage('How do I dial a lead?')}
                className="shrink-0 text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                📞 Dialer Guide
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage('Why is QA Audit locked?')}
                className="shrink-0 text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                ⚖️ QA Rubric
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSendMessage('Where can I export data?')}
                className="shrink-0 text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer whitespace-nowrap"
              >
                💾 JSON Backup
              </button>
            </div>
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask KIRA about plans, issues, TEAM KRK..."
              disabled={isLoading}
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-8 h-8 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
