import { useState, useMemo } from 'react';
import {
  Phone,
  MessageCircle,
  Clock,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  FileText,
  User,
  MapPin,
  Calendar,
  Building2,
  Heart,
  Eye,
  X,
  Copy,
  Check,
  Layers,
} from 'lucide-react';
import { RegistrationDraftRecord, DraftStatus } from '../types';

interface AdminDraftsTabProps {
  drafts: RegistrationDraftRecord[];
  onUpdateStatus: (id: string, newStatus: DraftStatus) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onRefresh: () => void;
  loading: boolean;
}

export default function AdminDraftsTab({
  drafts,
  onUpdateStatus,
  onDelete,
  onRefresh,
  loading,
}: AdminDraftsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stepFilter, setStepFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDraft, setSelectedDraft] = useState<RegistrationDraftRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Clean phone helper
  const cleanPhone = (phone?: string | null) => {
    if (!phone) return '';
    return phone.replace(/[^0-9]/g, '');
  };

  const getWhatsAppLink = (draft: RegistrationDraftRecord) => {
    const digits = cleanPhone(draft.whatsapp_number || draft.mobile_number);
    if (!digits) return '#';
    const formatted = digits.length === 10 ? `91${digits}` : digits;
    const greetingName = draft.name ? ` ${draft.name}` : '';
    const stepName = getStepName(draft.current_step);
    const msg = encodeURIComponent(
      `Vanakkam${greetingName}! We noticed you started your matrimony profile registration on Vivaaha Connect and reached ${stepName}. Would you like any assistance from our team in completing your registration or horoscope details?`
    );
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  function getStepName(step: number): string {
    switch (step) {
      case 1:
        return 'Step 1: Personal Details';
      case 2:
        return 'Step 2: Community & Astrology';
      case 3:
        return 'Step 3: Education & Career';
      case 4:
        return 'Step 4: Family Details';
      case 5:
        return 'Step 5: Document Uploads';
      default:
        return `Step ${step}`;
    }
  }

  // Filtered list
  const filtered = useMemo(() => {
    return drafts.filter((d) => {
      // Step filter
      if (stepFilter !== 'all' && String(d.current_step) !== stepFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && d.status !== statusFilter) {
        return false;
      }

      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = d.name?.toLowerCase().includes(q);
        const matchPhone = d.mobile_number?.includes(q) || d.whatsapp_number?.includes(q);
        const matchEmail = d.email?.toLowerCase().includes(q);
        const matchCity = d.current_location?.toLowerCase().includes(q) || d.native_place?.toLowerCase().includes(q);
        const matchKulam = d.kulam?.toLowerCase().includes(q) || d.community?.toLowerCase().includes(q);
        const matchAstro = d.rasi?.toLowerCase().includes(q) || d.natchatram?.toLowerCase().includes(q) || d.laknam?.toLowerCase().includes(q);
        const matchProf = d.profession?.toLowerCase().includes(q) || d.education_qualification?.toLowerCase().includes(q);
        const matchId = d.id?.toLowerCase().includes(q);

        if (!matchName && !matchPhone && !matchEmail && !matchCity && !matchKulam && !matchAstro && !matchProf && !matchId) {
          return false;
        }
      }

      return true;
    });
  }, [drafts, stepFilter, statusFilter, searchTerm]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = drafts.length;
    const step1Only = drafts.filter((d) => d.current_step === 1).length;
    const step2or3 = drafts.filter((d) => d.current_step === 2 || d.current_step === 3).length;
    const step4or5 = drafts.filter((d) => d.current_step >= 4).length;
    const incomplete = drafts.filter((d) => d.status === 'Incomplete' || d.status === 'Draft').length;
    const followedUp = drafts.filter((d) => d.status === 'Followed Up').length;
    const completed = drafts.filter((d) => d.status === 'Completed').length;

    return { total, step1Only, step2or3, step4or5, incomplete, followedUp, completed };
  }, [drafts]);

  // Export CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const headers = [
      'Draft ID',
      'Created At',
      'Last Updated',
      'Step Reached',
      'Status',
      'Candidate Name',
      'Gender',
      'Mobile Number',
      'WhatsApp Number',
      'Email',
      'DOB',
      'Age',
      'Community',
      'Kulam',
      'Kula Deivam',
      'Rasi',
      'Natchathiram',
      'Laknam',
      'Current Location',
      'Native Place',
      'Qualification',
      'Profession',
      'Company Name',
      'Income',
      'Father Name',
      'Mother Name',
      'Partner Age Range',
      'Partner Education',
    ];

    const rows = filtered.map((d) => [
      `"${d.id}"`,
      `"${d.created_at || ''}"`,
      `"${d.updated_at || ''}"`,
      `"${getStepName(d.current_step)}"`,
      `"${d.status || 'Incomplete'}"`,
      `"${d.name || ''}"`,
      `"${d.gender || ''}"`,
      `"${d.mobile_number || ''}"`,
      `"${d.whatsapp_number || ''}"`,
      `"${d.email || ''}"`,
      `"${d.dob || ''}"`,
      `"${d.age || ''}"`,
      `"${d.community || ''}"`,
      `"${d.kulam || ''}"`,
      `"${d.kuladeivam || ''}"`,
      `"${d.rasi || ''}"`,
      `"${d.natchatram || ''}"`,
      `"${d.laknam || ''}"`,
      `"${d.current_location || ''}"`,
      `"${d.native_place || ''}"`,
      `"${d.education_qualification || ''}"`,
      `"${d.profession || ''}"`,
      `"${d.company_name || ''}"`,
      `"${d.income || ''}"`,
      `"${d.father_name || ''}"`,
      `"${d.mother_name || ''}"`,
      `"${d.partner_age_range || ''}"`,
      `"${d.partner_education || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vivaaha_incomplete_registration_drafts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Explanation */}
      <div className="bg-gradient-to-r from-amber-900/10 via-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#6A1E2C] text-[#FAF3EB] flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">Incomplete Registration Drafts & Abandoned Leads</h3>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              When candidates begin filling out their registration and exit mid-way, their progress is automatically saved to the database. Follow up via WhatsApp or phone to assist them in completing their profile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#6A1E2C] hover:bg-[#531722] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filtered.length})</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Leads */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Total Incomplete</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">{metrics.total}</p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            {metrics.incomplete} requiring follow-up
          </span>
        </div>

        {/* Metric 2: Step 4/5 Near Complete */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">High Intent (Step 3-5)</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-2">{metrics.step4or5 + metrics.step2or3}</p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Astrology/Family filled in
          </span>
        </div>

        {/* Metric 3: Followed Up */}
        <div className="bg-white rounded-2xl p-4 border border-blue-200/80 bg-blue-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Followed Up</span>
            <Phone className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-950 mt-2">{metrics.followedUp}</p>
          <span className="text-[11px] text-blue-700 font-medium mt-1 block">
            Contacted by team
          </span>
        </div>

        {/* Metric 4: Completed Registrations */}
        <div className="bg-white rounded-2xl p-4 border border-purple-200/80 bg-purple-50/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-950 mt-2">{metrics.completed}</p>
          <span className="text-[11px] text-purple-700 font-medium mt-1 block">
            Submitted to final table
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by candidate name, phone number, kulam, rasi, location..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A1E2C]/20 focus:border-[#6A1E2C] transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Step Filter */}
          <select
            value={stepFilter}
            onChange={(e) => setStepFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#6A1E2C]/20"
          >
            <option value="all">All Steps</option>
            <option value="1">Step 1: Personal</option>
            <option value="2">Step 2: Astrology & Kulam</option>
            <option value="3">Step 3: Education & Career</option>
            <option value="4">Step 4: Family Details</option>
            <option value="5">Step 5: Document Uploads</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#6A1E2C]/20"
          >
            <option value="all">All Statuses</option>
            <option value="Incomplete">Incomplete (Active Lead)</option>
            <option value="Followed Up">Followed Up</option>
            <option value="Completed">Completed</option>
            <option value="Abandoned">Abandoned</option>
          </select>
        </div>
      </div>

      {/* Table of Incomplete Drafts */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-800 text-base">No Drafts Found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              {drafts.length === 0
                ? 'No incomplete registration drafts have been recorded yet in Supabase.'
                : 'No drafts match the selected filters or search keywords.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Candidate & Contact</th>
                  <th className="py-3.5 px-4">Step Progress</th>
                  <th className="py-3.5 px-4">Astrology & Kulam</th>
                  <th className="py-3.5 px-4">Career & Location</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filtered.map((draft) => {
                  const phoneNum = draft.mobile_number || draft.whatsapp_number;
                  const hasPhone = Boolean(phoneNum);

                  return (
                    <tr key={draft.id} className="hover:bg-amber-50/30 transition">
                      {/* Candidate & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              draft.gender === 'Female'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {draft.gender === 'Female' ? 'F' : 'M'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-900 text-sm">
                                {draft.name || <span className="italic text-stone-400">Anonymous Lead</span>}
                              </span>
                              {draft.age && (
                                <span className="text-[11px] text-stone-500 font-medium">({draft.age} yrs)</span>
                              )}
                            </div>

                            {/* Contact Details */}
                            <div className="flex items-center gap-2 mt-1">
                              {hasPhone ? (
                                <a
                                  href={`tel:${phoneNum}`}
                                  className="text-[11px] font-semibold text-[#6A1E2C] hover:underline flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{phoneNum}</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-stone-400">No phone provided yet</span>
                              )}

                              {draft.email && (
                                <span className="text-[10px] text-stone-400 truncate max-w-[140px]" title={draft.email}>
                                  • {draft.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Step Progress */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                draft.current_step >= 4
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : draft.current_step >= 2
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-stone-100 text-stone-700 border border-stone-200'
                              }`}
                            >
                              Step {draft.current_step} of 5
                            </span>
                            <span className="text-[11px] font-medium text-stone-600 truncate max-w-[130px]">
                              {getStepName(draft.current_step).replace(/Step \d+: /, '')}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-28 h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
                            <div
                              className="h-full bg-[#6A1E2C] rounded-full transition-all"
                              style={{ width: `${(draft.current_step / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Astrology & Kulam */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block">
                          {draft.kulam ? `Kulam: ${draft.kulam}` : draft.community || '—'}
                        </span>
                        {(draft.rasi || draft.natchatram || draft.laknam) && (
                          <span className="text-[10px] text-[#8B4513] font-semibold block mt-0.5">
                            {draft.rasi || ''} {draft.natchatram ? `• ${draft.natchatram}` : ''}
                          </span>
                        )}
                        {draft.kuladeivam && (
                          <span className="text-[10px] text-stone-400 block">KD: {draft.kuladeivam}</span>
                        )}
                      </td>

                      {/* Career & Location */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-800 block truncate max-w-[150px]">
                          {draft.profession || draft.education_qualification || '—'}
                        </span>
                        <span className="text-[11px] text-stone-500 block truncate max-w-[150px]">
                          {draft.current_location || draft.native_place || '—'}
                          {draft.income ? ` • ${draft.income}` : ''}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-stone-700 block">
                          {formatRelativeTime(draft.updated_at || draft.created_at)}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          ID: {draft.id.slice(0, 14)}...
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={draft.status || 'Incomplete'}
                          onChange={(e) => onUpdateStatus(draft.id, e.target.value as DraftStatus)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                            draft.status === 'Completed'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : draft.status === 'Followed Up'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : draft.status === 'Abandoned'
                              ? 'bg-stone-100 text-stone-600 border-stone-200'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}
                        >
                          <option value="Incomplete">Incomplete</option>
                          <option value="Followed Up">Followed Up</option>
                          <option value="Completed">Completed</option>
                          <option value="Abandoned">Abandoned</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedDraft(draft)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                            title="View Filled In Draft Data"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* WhatsApp Action */}
                          {hasPhone && (
                            <a
                              href={getWhatsAppLink(draft)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-xs"
                              title="Chat on WhatsApp to Follow Up"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Direct Call */}
                          {hasPhone && (
                            <a
                              href={`tel:${phoneNum}`}
                              className="p-1.5 rounded-lg bg-[#6A1E2C] hover:bg-[#531722] text-white transition shadow-xs"
                              title="Call Candidate"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete */}
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete incomplete draft for ${draft.name || draft.id}?`)) {
                                setDeletingId(draft.id);
                                await onDelete(draft.id);
                                setDeletingId(null);
                              }
                            }}
                            disabled={deletingId === draft.id}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View Incomplete Draft Details */}
      {selectedDraft && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#6A1E2C] text-[#FAF3EB] px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
                  {selectedDraft.gender === 'Female' ? 'F' : 'M'}
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    {selectedDraft.name || 'Anonymous Draft Candidate'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#FAF3EB]/80">
                    <span>Progress: {getStepName(selectedDraft.current_step)}</span>
                    <span>•</span>
                    <span>Last active: {formatRelativeTime(selectedDraft.updated_at || selectedDraft.created_at)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDraft(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF3EB] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-stone-800 text-xs sm:text-sm">
              {/* Quick Contact & Followup Card */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Candidate Contact</span>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-base font-bold text-stone-900">
                      {selectedDraft.mobile_number || selectedDraft.whatsapp_number || (selectedDraft.form_data as any)?.mobileNumber || (selectedDraft.form_data as any)?.whatsappNumber || 'No phone entered'}
                    </p>
                    {(selectedDraft.email || (selectedDraft.form_data as any)?.email) && (
                      <span className="text-stone-500">({selectedDraft.email || (selectedDraft.form_data as any)?.email})</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(selectedDraft.mobile_number || selectedDraft.whatsapp_number || (selectedDraft.form_data as any)?.mobileNumber || (selectedDraft.form_data as any)?.whatsappNumber) && (
                    <>
                      <a
                        href={getWhatsAppLink(selectedDraft)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp Candidate</span>
                      </a>
                      <a
                        href={`tel:${selectedDraft.mobile_number || selectedDraft.whatsapp_number || (selectedDraft.form_data as any)?.mobileNumber || (selectedDraft.form_data as any)?.whatsappNumber}`}
                        className="px-3 py-1.5 rounded-xl bg-[#6A1E2C] hover:bg-[#531722] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Step 1: Personal Details */}
              <div className="border border-stone-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-stone-900 flex items-center gap-2 text-sm border-b pb-2">
                  <User className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Step 1: Personal & Basic Details</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-400 text-[10px] block">Gender</span>
                    <strong className="text-stone-800">{selectedDraft.gender || (selectedDraft.form_data as any)?.gender || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Date of Birth</span>
                    <strong className="text-stone-800">{selectedDraft.dob || (selectedDraft.form_data as any)?.dob || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Age</span>
                    <strong className="text-stone-800">
                      {selectedDraft.age || (selectedDraft.form_data as any)?.age ? `${selectedDraft.age || (selectedDraft.form_data as any)?.age} yrs` : '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Height</span>
                    <strong className="text-stone-800">{selectedDraft.height || (selectedDraft.form_data as any)?.height || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Weight</span>
                    <strong className="text-stone-800">{selectedDraft.weight || (selectedDraft.form_data as any)?.weight || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Marital Status</span>
                    <strong className="text-stone-800">{selectedDraft.marital_status || (selectedDraft.form_data as any)?.maritalStatus || (selectedDraft.form_data as any)?.marital_status || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Current Location</span>
                    <strong className="text-stone-800">{selectedDraft.current_location || (selectedDraft.form_data as any)?.currentLocation || (selectedDraft.form_data as any)?.current_location || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Native Place</span>
                    <strong className="text-stone-800">{selectedDraft.native_place || (selectedDraft.form_data as any)?.nativePlace || (selectedDraft.form_data as any)?.native_place || '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Step 2: Community & Astrological Details */}
              <div className="border border-stone-200 rounded-2xl p-4 space-y-3 bg-orange-50/20">
                <h4 className="font-bold text-stone-900 text-sm border-b pb-2">
                  <span>Step 2: Community & Astrological Details (ஜாதக விபரங்கள்)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-400 text-[10px] block">Community</span>
                    <strong className="text-stone-800">{selectedDraft.community || (selectedDraft.form_data as any)?.community || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Kulam (கூட்டம்)</span>
                    <strong className="text-amber-900 font-bold">{selectedDraft.kulam || (selectedDraft.form_data as any)?.kulam || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Kula Deivam (குலதெய்வம்)</span>
                    <strong className="text-stone-800">{selectedDraft.kuladeivam || (selectedDraft.form_data as any)?.kuladeivam || (selectedDraft.form_data as any)?.kulaDeivam || '—'}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200">
                    <span className="text-orange-900 text-[10px] block font-semibold">Rasi (ராசி)</span>
                    <p className="font-bold text-orange-950 mt-0.5">{selectedDraft.rasi || (selectedDraft.form_data as any)?.rasi || '—'}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200">
                    <span className="text-orange-900 text-[10px] block font-semibold">Natchathiram (நட்சத்திரம்)</span>
                    <p className="font-bold text-orange-950 mt-0.5">{selectedDraft.natchatram || (selectedDraft.form_data as any)?.natchatram || (selectedDraft.form_data as any)?.natchathiram || '—'}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200">
                    <span className="text-orange-900 text-[10px] block font-semibold">Laknam (லக்னம்)</span>
                    <p className="font-bold text-orange-950 mt-0.5">{selectedDraft.laknam || (selectedDraft.form_data as any)?.laknam || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Education & Career */}
              <div className="border border-stone-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-stone-900 flex items-center gap-2 text-sm border-b pb-2">
                  <Building2 className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Step 3: Education & Profession</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-400 text-[10px] block">Qualification</span>
                    <strong className="text-stone-800">{selectedDraft.education_qualification || (selectedDraft.form_data as any)?.educationQualification || (selectedDraft.form_data as any)?.education_qualification || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Profession / Role</span>
                    <strong className="text-stone-800">{selectedDraft.profession || (selectedDraft.form_data as any)?.profession || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Company Name</span>
                    <strong className="text-stone-800">{selectedDraft.company_name || (selectedDraft.form_data as any)?.companyName || (selectedDraft.form_data as any)?.company_name || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Work Location</span>
                    <strong className="text-stone-800">{selectedDraft.work_location || (selectedDraft.form_data as any)?.workLocation || (selectedDraft.form_data as any)?.work_location || '—'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Annual Income</span>
                    <strong className="text-stone-800">{selectedDraft.income || (selectedDraft.form_data as any)?.income || '—'}</strong>
                  </div>
                </div>
              </div>

              {/* Step 4: Family Details */}
              <div className="border border-stone-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-stone-900 flex items-center gap-2 text-sm border-b pb-2">
                  <Heart className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Step 4: Family Details & Partner Preferences</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-400 text-[10px] block">Father's Name & Occupation</span>
                    <strong className="text-stone-800">
                      {selectedDraft.father_name || (selectedDraft.form_data as any)?.fatherName || '—'}{' '}
                      {selectedDraft.father_occupation || (selectedDraft.form_data as any)?.fatherOccupation ? `(${selectedDraft.father_occupation || (selectedDraft.form_data as any)?.fatherOccupation})` : ''}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Mother's Name & Occupation</span>
                    <strong className="text-stone-800">
                      {selectedDraft.mother_name || (selectedDraft.form_data as any)?.motherName || '—'}{' '}
                      {selectedDraft.mother_occupation || (selectedDraft.form_data as any)?.motherOccupation ? `(${selectedDraft.mother_occupation || (selectedDraft.form_data as any)?.motherOccupation})` : ''}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Brothers / Sisters</span>
                    <strong className="text-stone-800">
                      Brothers: {selectedDraft.brothers_count || (selectedDraft.form_data as any)?.brothersCount || (Number((selectedDraft.form_data as any)?.brothersMarried || 0) + Number((selectedDraft.form_data as any)?.brothersUnmarried || 0)) || '0'} • Sisters: {selectedDraft.sisters_count || (selectedDraft.form_data as any)?.sistersCount || (Number((selectedDraft.form_data as any)?.sistersMarried || 0) + Number((selectedDraft.form_data as any)?.sistersUnmarried || 0)) || '0'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] block">Family Type / Status</span>
                    <strong className="text-stone-800">
                      {selectedDraft.family_type || (selectedDraft.form_data as any)?.familyType || '—'} • {selectedDraft.family_status || (selectedDraft.form_data as any)?.familyStatus || '—'}
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-stone-400 text-[10px] block">Partner Preferences</span>
                    <strong className="text-stone-800">
                      {(selectedDraft.partner_age_range || (selectedDraft.form_data as any)?.partnerAgeRange) ? `Age: ${selectedDraft.partner_age_range || (selectedDraft.form_data as any)?.partnerAgeRange}` : ''}
                      {(selectedDraft.partner_education || (selectedDraft.form_data as any)?.partnerEducation) ? ` • Edu: ${selectedDraft.partner_education || (selectedDraft.form_data as any)?.partnerEducation}` : ''}
                      {(selectedDraft.partner_profession || (selectedDraft.form_data as any)?.partnerProfession) ? ` • Prof: ${selectedDraft.partner_profession || (selectedDraft.form_data as any)?.partnerProfession}` : ''}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Technical / DB Identifiers */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between font-mono text-[11px] text-stone-500">
                <span>Draft ID: {selectedDraft.id}</span>
                <button
                  onClick={() => handleCopy(selectedDraft.id, 'draft_id')}
                  className="flex items-center gap-1 text-stone-700 hover:text-stone-900 font-sans text-xs font-semibold"
                >
                  {copiedId === 'draft_id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'draft_id' ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-stone-50 border-t border-stone-200 px-6 py-3.5 flex items-center justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedDraft(null)}
                className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
