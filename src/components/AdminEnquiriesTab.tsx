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
  HelpCircle,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  MapPin,
  Calendar,
  Check,
} from 'lucide-react';
import { EnquiryRecord, EnquiryStatus, EnquiryType } from '../types';

interface AdminEnquiriesTabProps {
  enquiries: EnquiryRecord[];
  onUpdateStatus: (id: string, newStatus: EnquiryStatus, notes?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
}

export default function AdminEnquiriesTab({
  enquiries,
  onUpdateStatus,
  onDelete,
  onRefresh,
  loading,
}: AdminEnquiriesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Clean phone helper
  const cleanPhone = (phone?: string | null) => {
    if (!phone) return '';
    return phone.replace(/[^0-9]/g, '');
  };

  const getWhatsAppLink = (phone?: string | null, name?: string | null, source?: string | null) => {
    const digits = cleanPhone(phone);
    if (!digits) return '#';
    const formatted = digits.length === 10 ? `91${digits}` : digits;
    const greetingName = name ? ` ${name}` : '';
    const sourceInfo = source ? ` regarding your enquiry on Vivaaha Connect (${source})` : ' regarding your enquiry on Vivaaha Connect';
    const msg = encodeURIComponent(
      `Vanakkam${greetingName}! This is Vivaaha Connect Matrimony${sourceInfo}. How can we assist you today?`
    );
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  // Filtered list
  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = e.name?.toLowerCase().includes(q);
        const matchPhone = e.phone?.includes(q);
        const matchEmail = e.email?.toLowerCase().includes(q);
        const matchSource = e.source?.toLowerCase().includes(q);
        const matchMsg = e.message?.toLowerCase().includes(q);
        const matchNotes = e.notes?.toLowerCase().includes(q);
        const matchComm = e.community?.toLowerCase().includes(q);

        if (!matchName && !matchPhone && !matchEmail && !matchSource && !matchMsg && !matchNotes && !matchComm) {
          return false;
        }
      }

      // Type Filter
      if (typeFilter !== 'all') {
        if (e.type !== typeFilter) return false;
      }

      // Status Filter
      if (statusFilter !== 'all') {
        if (e.status !== statusFilter) return false;
      }

      return true;
    });
  }, [enquiries, searchTerm, typeFilter, statusFilter]);

  // Metrics
  const totalCount = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === 'New').length;
  const callbackCount = enquiries.filter((e) => e.type === 'callback_request').length;
  const whatsappCount = enquiries.filter((e) => e.type === 'whatsapp_click').length;
  const contactedCount = enquiries.filter((e) => e.status === 'Contacted' || e.status === 'In Progress').length;
  const convertedCount = enquiries.filter((e) => e.status === 'Converted').length;

  // Export to CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['ID', 'Date & Time', 'Enquiry Type', 'Name', 'Phone', 'Email', 'Community', 'Source', 'Message / Intent', 'Status', 'Staff Notes'];
    const rows = filtered.map((e) => [
      `"${e.id || ''}"`,
      `"${e.created_at ? new Date(e.created_at).toLocaleString() : ''}"`,
      `"${e.type || ''}"`,
      `"${e.name || 'Anonymous Visitor'}"`,
      `"${e.phone || 'N/A'}"`,
      `"${e.email || ''}"`,
      `"${e.community || ''}"`,
      `"${e.source || ''}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      `"${e.status || 'New'}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VivaahaConnect_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNotes = async (id: string, currentStatus: EnquiryStatus) => {
    await onUpdateStatus(id, currentStatus, tempNotes);
    setEditingNotesId(null);
    setTempNotes('');
  };

  const getTypeBadge = (type: EnquiryType) => {
    switch (type) {
      case 'callback_request':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold">
            <Phone className="w-3 h-3 text-amber-700" />
            <span>Callback Request</span>
          </span>
        );
      case 'whatsapp_click':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold">
            <MessageCircle className="w-3 h-3 text-emerald-700" />
            <span>WhatsApp Lead</span>
          </span>
        );
      case 'phone_call':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold">
            <Phone className="w-3 h-3 text-blue-700" />
            <span>Helpline Dial</span>
          </span>
        );
      case 'contact_form':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold">
            <FileText className="w-3 h-3 text-purple-700" />
            <span>Contact Form</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-300 text-[11px] font-bold">
            <HelpCircle className="w-3 h-3 text-stone-600" />
            <span>General Enquiry</span>
          </span>
        );
    }
  };

  const getStatusColor = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-200';
      case 'Contacted':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'In Progress':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Closed':
        return 'bg-stone-100 text-stone-600 border-stone-300';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Metric Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-stone-400 text-[11px] sm:text-xs block font-medium">Total Enquiries</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-3xl font-heading font-bold text-[#6A1E2C]">{totalCount}</span>
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <span className="text-rose-700 text-[11px] sm:text-xs block font-medium">New / Uncontacted</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-3xl font-heading font-bold text-rose-800">{newCount}</span>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <span className="text-amber-800 text-[11px] sm:text-xs block font-medium">Callback Requests</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-3xl font-heading font-bold text-amber-900">{callbackCount}</span>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-emerald-700 text-[11px] sm:text-xs block font-medium">WhatsApp Leads</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-3xl font-heading font-bold text-emerald-800">{whatsappCount}</span>
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-emerald-700 text-[11px] sm:text-xs block font-medium">Converted / Registered</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-3xl font-heading font-bold text-emerald-800">{convertedCount}</span>
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, phone, message, source, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#C89B63] text-xs text-stone-800 outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              disabled={filtered.length === 0}
              className="px-3 py-2 rounded-xl bg-[#C89B63]/20 hover:bg-[#C89B63]/30 active:bg-[#C89B63]/40 text-[#6A1E2C] text-xs font-bold flex items-center gap-1.5 transition border border-[#C89B63]/40 disabled:opacity-50"
              title="Export enquiries to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-400 font-semibold text-[11px]">Filter Type:</span>
          {[
            { id: 'all', label: 'All Types' },
            { id: 'callback_request', label: 'Callbacks' },
            { id: 'whatsapp_click', label: 'WhatsApp' },
            { id: 'phone_call', label: 'Helpline Calls' },
            { id: 'contact_form', label: 'Contact Form' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                typeFilter === t.id
                  ? 'bg-[#6A1E2C] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t.label}
            </button>
          ))}

          <span className="text-stone-400 font-semibold text-[11px] ml-2">Status:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'New', label: 'New' },
            { id: 'Contacted', label: 'Contacted' },
            { id: 'In Progress', label: 'In Progress' },
            { id: 'Converted', label: 'Converted' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                statusFilter === s.id
                  ? 'bg-[#C89B63] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries List Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-700">No Enquiries Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'No enquiry records matched your search filters. Try clearing your filters.'
              : 'New callback requests, WhatsApp clicks, and helpline enquiries will appear here automatically in real time.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF3EB] text-[#6A1E2C] border-b border-[#C89B63]/30 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Enquiry Type</th>
                  <th className="py-3.5 px-4">Enquirer / Contact</th>
                  <th className="py-3.5 px-4">Source / Context</th>
                  <th className="py-3.5 px-4">Message / Details</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Instant Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FFF9F5] transition group">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 block font-mono mt-0.5">
                        {item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getTypeBadge(item.type)}
                    </td>

                    {/* Contact & Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">
                        {item.name || <span className="text-stone-400 italic font-normal">Anonymous Visitor</span>}
                      </div>
                      {item.phone ? (
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`tel:${cleanPhone(item.phone)}`}
                            className="font-mono text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{item.phone}</span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-medium">Direct Site Click</span>
                      )}
                      {item.community && (
                        <div className="text-[10px] text-[#C89B63] font-bold mt-0.5">
                          Community: {item.community}
                        </div>
                      )}
                    </td>

                    {/* Source */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold text-[11px] border border-stone-200">
                        {item.source || 'Website'}
                      </span>
                    </td>

                    {/* Message / Staff Notes */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {item.message && (
                        <p className="text-stone-800 text-[11px] leading-relaxed line-clamp-2">
                          {item.message}
                        </p>
                      )}

                      {/* Staff Notes */}
                      {editingNotesId === item.id ? (
                        <div className="mt-2 flex items-center gap-1">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Add follow-up notes..."
                            className="px-2 py-1 text-xs border border-[#C89B63] rounded-md flex-1 bg-white outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveNotes(item.id, item.status)}
                            className="p-1 rounded bg-[#6A1E2C] text-white hover:bg-[#8C283B]"
                            title="Save note"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="p-1 text-stone-400 hover:text-stone-700 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-1.5">
                          {item.notes ? (
                            <span className="text-[11px] text-stone-500 italic bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Note: {item.notes}
                            </span>
                          ) : null}
                          <button
                            onClick={() => {
                              setEditingNotesId(item.id);
                              setTempNotes(item.notes || '');
                            }}
                            className="text-[10px] text-[#C89B63] font-bold hover:underline"
                          >
                            {item.notes ? 'Edit Note' : '+ Add Note'}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={item.status || 'New'}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as EnquiryStatus, item.notes || undefined)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer transition ${getStatusColor(
                          item.status || 'New'
                        )}`}
                      >
                        <option value="New">🔴 New (Uncontacted)</option>
                        <option value="Contacted">🔵 Contacted</option>
                        <option value="In Progress">🟡 In Progress</option>
                        <option value="Converted">🟢 Converted / Registered</option>
                        <option value="Closed">⚪ Closed</option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.phone && (
                          <>
                            <a
                              href={`tel:${cleanPhone(item.phone)}`}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                              title={`Call ${item.phone}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            <a
                              href={getWhatsAppLink(item.phone, item.name, item.source)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete enquiry from ${item.name || item.phone || item.id}?`)) {
                              onDelete(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Delete enquiry"
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
    </div>
  );
}
