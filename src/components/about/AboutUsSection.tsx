import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TEAM_KRK_MEMBERS, 
  TEAM_KRK_OFFICIAL_EMAIL, 
  TEAM_KRK_PHOTO_URL,
  CLIENT_DOMAIN,
  CLIENT_GITHUB
} from '../../data/initialData';
import { useCRM } from '../../context/CRMContext';
import { 
  Phone, 
  Mail, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  ChevronRight,
  Code2,
  Cpu,
  Layers
} from 'lucide-react';

interface AboutUsSectionProps {
  standalone?: boolean;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ standalone = false }) => {
  const { settings, startDialing, setActiveTab, setCurrentView } = useCRM();
  const [activeMemberIndex, setActiveMemberIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section 
      id="about-us" 
      className={`relative overflow-hidden transition-colors ${
        standalone 
          ? 'py-8' 
          : 'py-24 border-b border-neutral-200 dark:border-neutral-800/80 bg-neutral-900/5 dark:bg-black/95'
      }`}
    >
      {/* Background ambient red aura & grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-600/10 dark:bg-red-600/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-red-950/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          {/* Section Kicker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-red-950/60 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-800/50 shadow-sm shadow-red-950/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>MEET THE MINDS BEHIND AURA</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white [text-wrap:balance]">
            Built by <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-amber-500">TEAM KRK</span>. Designed for Businesses.
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-2xl mx-auto">
            AURA CRM is developed by a passionate team focused on building smarter, simpler and more powerful business management solutions.
          </p>
        </motion.div>

        {/* Hero Photo Card: High-Impact Team Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-5xl mx-auto group"
        >
          <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-red-900/30 via-neutral-900 to-neutral-950 border border-red-900/40 dark:border-red-800/30 shadow-2xl shadow-red-950/40">
            
            {/* Top decorative glass bar */}
            <div className="px-4 py-2.5 mb-2 flex items-center justify-between text-xs text-neutral-400 border-b border-red-900/30">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                <span className="font-mono text-[11px] text-neutral-300 ml-2 tracking-wider">
                  TEAM KRK // OFFICIAL CORE PORTRAIT
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                <span>KARTIKEY · RAJ · KD</span>
                <span className="text-red-500">●</span>
                <span>AURA CRM ARCHITECTS</span>
              </div>
            </div>

            {/* The Actual Team Photograph */}
            <div className="relative rounded-2xl overflow-hidden bg-neutral-950">
              <img
                src={TEAM_KRK_PHOTO_URL}
                alt="TEAM KRK - Kartikey, Raj and KD, Creators of AURA CRM"
                className="w-full h-auto max-h-[640px] object-contain sm:object-cover mx-auto transition-transform duration-700 group-hover:scale-[1.01]"
                loading="eager"
              />
              
              {/* Subtle ambient bottom scrim */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent pointer-events-none" />

              {/* Bottom badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-neutral-950/80 backdrop-blur-md p-3.5 rounded-xl border border-red-900/40 text-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    KRK
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      TEAM KRK Core Leadership
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Kartikey (KT) · Raj (RDX) · Kushal Dange (KD)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${TEAM_KRK_OFFICIAL_EMAIL}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Team</span>
                  </a>
                  <span className="text-[11px] font-mono text-neutral-400 hidden md:inline">
                    kd.pvt.ltd
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Member Cards Grid: 3 Interactive Cards with Red Accent Styling */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {TEAM_KRK_MEMBERS.map((member, index) => {
            const isHighlighted = activeMemberIndex === index;

            return (
              <motion.div
                key={member.name}
                variants={itemVariants}
                onMouseEnter={() => setActiveMemberIndex(index)}
                onMouseLeave={() => setActiveMemberIndex(null)}
                className={`relative rounded-2xl border transition-all duration-300 flex flex-col justify-between p-6 ${
                  isHighlighted 
                    ? 'border-red-600/70 bg-neutral-900/90 shadow-xl shadow-red-950/40 -translate-y-1' 
                    : 'border-neutral-200 dark:border-neutral-800/90 bg-white dark:bg-neutral-900/60 hover:border-red-900/50'
                }`}
              >
                {/* Red accent glow indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-neutral-900 text-white flex items-center justify-center font-black text-sm shadow-md shadow-red-900/30">
                      {member.handle}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        {member.name}
                      </h4>
                      <span className="text-[10px] font-mono text-red-600 dark:text-red-400 uppercase tracking-wider font-semibold">
                        Core Co-Founder
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 font-bold">
                    0{index + 1}
                  </span>
                </div>

                {/* Role and Bio */}
                <div className="space-y-3 mb-6">
                  <div className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-red-950/30 text-red-700 dark:text-red-300 border border-red-900/30">
                    {member.role}
                  </div>
                  
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                    {member.bio}
                  </p>
                </div>

                {/* Direct Action & Contact Section */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2.5">
                  {settings.showTeamKRKContactsPublicly ? (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={`tel:${member.contact}`}
                          className="flex items-center gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 truncate"
                        >
                          <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="truncate">{member.contact}</span>
                        </a>

                        <button
                          onClick={() => {
                            if (setCurrentView) setCurrentView('crm');
                            if (setActiveTab) setActiveTab('calling');
                            if (startDialing) startDialing(member.contact);
                          }}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 transition-colors shrink-0 cursor-pointer"
                        >
                          Quick Dial
                        </button>
                      </div>

                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-colors py-1 truncate"
                      >
                        <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </a>
                    </>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-950 text-[11px] text-neutral-500 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>Direct phone number available in Admin Console.</span>
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </motion.div>

        {/* Official Channel & Mission Footer Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 max-w-4xl mx-auto p-6 rounded-2xl border border-red-900/30 bg-neutral-950/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span>Official Business & Enterprise Inquiries</span>
            </h4>
            <p className="text-xs text-neutral-400">
              Direct communication line with TEAM KRK for partnerships, custom CRM deployments, and SLA licensing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${TEAM_KRK_OFFICIAL_EMAIL}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold transition-all shadow-md shadow-red-900/40"
            >
              <Mail className="w-4 h-4" />
              <span>{TEAM_KRK_OFFICIAL_EMAIL}</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
