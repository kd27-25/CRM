import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Lead, LeadPriority, LeadStatus } from '../../types/crm';
import { LeadModal } from './LeadModal';
import { 
  Plus, 
  Search, 
  Filter, 
  PhoneCall, 
  LayoutGrid, 
  List, 
  Trash2, 
  Edit2, 
  MoreVertical, 
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  User
} from 'lucide-react';

export const LeadsPipelineView: React.FC = () => {
  const { 
    leads, 
    updateLeadStatus, 
    deleteLead, 
    startDialing, 
    setActiveTab, 
    activeRole 
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const PIPELINE_COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
    { id: 'new', title: 'New Inquiries', color: 'border-blue-500' },
    { id: 'contacted', title: 'Contacted', color: 'border-indigo-500' },
    { id: 'follow_up', title: 'Follow Up', color: 'border-amber-500' },
    { id: 'interested', title: 'Interested', color: 'border-purple-500' },
    { id: 'converted', title: 'Converted Won', color: 'border-emerald-500' },
    { id: 'lost', title: 'Lost / Closed', color: 'border-neutral-500' },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleQuickDial = (lead: Lead) => {
    startDialing(lead.phone, lead);
    setActiveTab('calling');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Leads & Pipeline Management
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Real-time visual deal flow, single-click calling, and stage progression.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Toggle View Mode: Kanban vs Table */}
          <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Add Lead Button */}
          <button
            onClick={() => {
              setLeadToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, company, phone, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <span className="text-xs font-mono text-neutral-400 ml-2">
            {filteredLeads.length} leads
          </span>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-6">
          {PIPELINE_COLUMNS.map((col) => {
            const colLeads = filteredLeads.filter(l => l.status === col.id);
            return (
              <div 
                key={col.id}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-3 space-y-3 min-w-[200px]"
              >
                <div className={`flex items-center justify-between border-t-2 ${col.color} pt-2`}>
                  <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {col.title}
                  </h3>
                  <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[300px]">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs hover:shadow-sm transition-all cursor-pointer space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {lead.name}
                          </h4>
                          <p className="text-[10px] text-neutral-500 truncate">
                            {lead.company}
                          </p>
                        </div>

                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          lead.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : lead.priority === 'high'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}>
                          {lead.priority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          ${lead.dealValue.toLocaleString()}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          {lead.score} pts
                        </span>
                      </div>

                      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between gap-1">
                        <span className="text-[10px] text-neutral-400 truncate max-w-[90px]">
                          {lead.assignedToName}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickDial(lead);
                          }}
                          title="Call Lead"
                          className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 cursor-pointer"
                        >
                          <PhoneCall className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {colLeads.length === 0 && (
                    <div className="h-24 flex items-center justify-center text-[11px] text-neutral-400 font-normal border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABULAR LIST VIEW */
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="px-4 py-3">Lead & Company</th>
                  <th className="px-4 py-3">Phone & Email</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3 text-right">Deal Value</th>
                  <th className="px-4 py-3">Assigned Agent</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-normal">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-neutral-900 dark:text-white">{lead.name}</div>
                      <div className="text-[11px] text-neutral-500">{lead.company}</div>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <div>{lead.phone}</div>
                      <div className="text-[10px] text-neutral-400">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        lead.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : lead.priority === 'high'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                      ${lead.dealValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                      {lead.assignedToName}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleQuickDial(lead)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 cursor-pointer"
                          title="Call"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setLeadToEdit(lead);
                            setIsAddModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer / Inspector */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Lead Inspector
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {selectedLead.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-xs px-2.5 py-1 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-neutral-400">Company:</span>
                <p className="font-semibold text-neutral-900 dark:text-white text-sm">{selectedLead.company}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-neutral-400">Phone:</span>
                  <p className="font-mono font-semibold">{selectedLead.phone}</p>
                </div>
                <div>
                  <span className="text-neutral-400">Email:</span>
                  <p className="truncate font-semibold">{selectedLead.email}</p>
                </div>
              </div>

              <div>
                <span className="text-neutral-400">Move Pipeline Stage:</span>
                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                  {(['new', 'contacted', 'follow_up', 'interested', 'converted', 'lost'] as LeadStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateLeadStatus(selectedLead.id, st)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold capitalize transition-all cursor-pointer ${
                        selectedLead.status === st
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-neutral-400">Assigned Agent:</span>
                <p className="font-semibold text-neutral-900 dark:text-white">{selectedLead.assignedToName}</p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-neutral-400 font-semibold">Activity Notes History:</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedLead.notes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 text-[11px] leading-relaxed">
                      "{note}"
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => handleQuickDial(selectedLead)}
                  className="flex-1 py-3 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {selectedLead.name.split(' ')[0]} Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setLeadToEdit(null);
        }}
        leadToEdit={leadToEdit}
      />

    </div>
  );
};
