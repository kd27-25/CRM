import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ROLES_CONFIG, PLANS_INFO } from '../../data/initialData';
import { UserRole, TeamMember } from '../../types/crm';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Check, 
  AlertCircle, 
  Phone, 
  Mail, 
  CheckCircle2,
  X
} from 'lucide-react';

export const TeamManagementView: React.FC = () => {
  const { 
    teamMembers, 
    addTeamMember, 
    updateMemberRole, 
    plan, 
    setPlan,
    isRolePermittedInPlan 
  } = useCRM();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('+91 ');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('agent');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    addTeamMember({
      name: newMemberName,
      email: newMemberEmail,
      phone: newMemberPhone,
      role: newMemberRole,
      status: 'active',
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('+91 ');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Team Management & RBAC Hierarchy
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage organization members, assign roles, and audit operational access permissions.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Plan-Role Alignment Notice */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Active Plan Role Allocation:
          </span>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium mt-0.5">
            {plan === 'aura_plus' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Aura+ Active: All 6 roles permitted (Administration, Admin, Manager, Team Lead, Audit QA, Agent)
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Aura Active: Administration, Admin, and Agent roles available. Manager, Team Lead & QA roles require Aura+.
              </span>
            )}
          </p>
        </div>

        {plan === 'aura' && (
          <button
            onClick={() => setPlan('aura_plus')}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 cursor-pointer"
          >
            Upgrade to Aura+
          </button>
        )}
      </div>

      {/* Team Members Table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            Active Organization Members ({teamMembers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="px-6 py-3">Member Name</th>
                <th className="px-6 py-3">Assigned Role</th>
                <th className="px-6 py-3">Telephony Status</th>
                <th className="px-6 py-3 text-right">Calls Today</th>
                <th className="px-6 py-3 text-right">Deals Won</th>
                <th className="px-6 py-3">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-normal">
              {teamMembers.map((member) => {
                const roleInfo = ROLES_CONFIG[member.role];
                return (
                  <tr key={member.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>{member.name}</span>
                        {member.id.startsWith('tm-1') && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        {member.email} · {member.phone}
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${roleInfo.badgeBg}`}>
                        {roleInfo.title}
                      </span>
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          member.status === 'on_call' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                        }`} />
                        <span className="text-[11px] capitalize text-neutral-700 dark:text-neutral-300">
                          {member.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono tabular-nums">
                      {member.callsToday}
                    </td>

                    <td className="px-6 py-3.5 text-right font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {member.dealsClosed}
                    </td>

                    <td className="px-6 py-3.5">
                      <select
                        value={member.role}
                        onChange={(e) => updateMemberRole(member.id, e.target.value as UserRole)}
                        className="px-2 py-1 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
                      >
                        {(Object.keys(ROLES_CONFIG) as UserRole[]).map((rKey) => {
                          const permitted = isRolePermittedInPlan(rKey);
                          return (
                            <option key={rKey} value={rKey} disabled={!permitted}>
                              {ROLES_CONFIG[rKey].title} {!permitted ? '(Aura+ Only)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          Role Permissions Matrix Reference
        </h3>
        <p className="text-xs text-neutral-500">
          Enforced granular security policies across all CRM endpoints.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {(Object.keys(ROLES_CONFIG) as UserRole[]).map((rKey) => {
            const role = ROLES_CONFIG[rKey];
            const isPermitted = isRolePermittedInPlan(rKey);
            return (
              <div 
                key={rKey}
                className={`p-4 rounded-xl border space-y-3 ${
                  isPermitted
                    ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40'
                    : 'border-neutral-200 dark:border-neutral-800 opacity-50 bg-neutral-100/50 dark:bg-neutral-900/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{role.title}</h4>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {role.planRequired === 'aura_plus' ? 'Aura+' : 'Aura'}
                  </span>
                </div>
                <ul className="space-y-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                  {role.permissions.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="capitalize">{p.replace(/_/g, ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Invite New Team Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="rahul@auracrm.internal"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Calling Phone Number
                </label>
                <input
                  type="text"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Initial Assigned Role
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white"
                >
                  {(Object.keys(ROLES_CONFIG) as UserRole[]).map((rKey) => {
                    const permitted = isRolePermittedInPlan(rKey);
                    return (
                      <option key={rKey} value={rKey} disabled={!permitted}>
                        {ROLES_CONFIG[rKey].title} {!permitted ? '(Aura+ Only)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
