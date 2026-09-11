import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  ShieldCheck,
  FileText,
  Calendar,
  DollarSign,
  Printer,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit3,
} from 'lucide-react';
import { RegistrationRecord } from '../types';

interface RegistrationDetailModalProps {
  registration: RegistrationRecord | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (record: RegistrationRecord) => void;
}

export default function RegistrationDetailModal({
  registration,
  onClose,
  onStatusChange,
  onDelete,
  onEdit,
}: RegistrationDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'family' | 'partner' | 'docs'>('overview');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(registration?.status || 'Pending Review');
  const [statusSuccess, setStatusSuccess] = useState(false);

  if (!registration) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      setSelectedStatus(newStatus);
      await onStatusChange(registration.id, newStatus);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const cleanPhone = (phone?: string | null) => {
    if (!phone) return '';
    return phone.replace(/[^0-9]/g, '');
  };

  const getWhatsAppLink = (phone?: string | null, name?: string) => {
    const digits = cleanPhone(phone);
    if (!digits) return '#';
    const formatted = digits.length === 10 ? `91${digits}` : digits;
    const msg = encodeURIComponent(
      `Vanakkam ${name || ''}, this is Vivaaha Connect Matrimony regarding your registration reference ${registration.id}. We have reviewed your profile and would like to share matching profiles with you.`
    );
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="registration-detail-fullscreen-view"
      className="fixed inset-0 z-[120] bg-[#FFF9F5] text-stone-800 flex flex-col w-full h-full min-h-screen overflow-y-auto overflow-x-hidden animate-fade-in"
    >
      {/* Sticky Fullscreen Top Navigation Header */}
      <header className="bg-gradient-to-r from-[#380D14] via-[#5C1925] to-[#380D14] text-[#FAF3EB] px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 border-b border-[#C89B63]/40 sticky top-0 z-50 shadow-lg shrink-0">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-3">
          
          {/* Top Bar: Back Button on Left, Print & Close on Right */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FAF3EB] text-xs font-bold transition border border-white/20 shadow-sm"
              title="Back to Registrations"
            >
              <span>←</span>
              <span className="font-sans">Back to Registrations</span>
            </button>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(registration)}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#C89B63] hover:bg-[#D4A972] active:bg-[#B88A52] text-[#2D0A11] text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  title="Edit Candidate Profile & Sync to Database"
                >
                  <Edit3 className="w-4 h-4 text-[#2D0A11]" />
                  <span>Edit Profile</span>
                </button>
              )}

              <button
                onClick={handlePrint}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FAF3EB] text-xs font-semibold flex items-center gap-1.5 transition border border-white/20"
                title="Print Matrimonial Profile"
              >
                <Printer className="w-4 h-4 text-[#C89B63]" />
                <span className="hidden sm:inline">Print Biodata</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-rose-600/80 active:bg-rose-700 text-[#FAF3EB] transition border border-white/20"
                title="Close Full Screen"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Candidate Profile Summary Row in Header */}
          <div className="flex items-center gap-3 w-full min-w-0 pt-1">
            <div className="relative shrink-0">
              {registration.photo_url ? (
                <img
                  src={registration.photo_url}
                  alt={registration.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-[#C89B63] shadow-md bg-stone-100"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#C89B63]/20 border-2 border-[#C89B63] flex items-center justify-center text-[#C89B63] font-bold text-lg">
                  {registration.name ? registration.name.charAt(0).toUpperCase() : 'V'}
                </div>
              )}
              <span
                className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 text-[9px] font-black rounded-full border shadow-sm ${
                  registration.gender?.toLowerCase() === 'female' || registration.gender?.toLowerCase() === 'bride'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                }`}
              >
                {registration.gender || 'Profile'}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-heading font-bold text-[#FFF9F5] truncate max-w-full">
                  {registration.name || 'Candidate Profile'}
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#C89B63]/30 text-[#C89B63] font-mono text-[11px] sm:text-xs font-bold border border-[#C89B63]/50 shrink-0">
                  {registration.id}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#FAF3EB]/75 flex items-center gap-1.5 sm:gap-2 flex-wrap mt-0.5 leading-snug">
                <span>
                  {registration.age ? `${registration.age} Yrs` : ''} {registration.marital_status ? `• ${registration.marital_status}` : ''}
                </span>
                {registration.community && <span>• {registration.community}</span>}
                {registration.kulam && <span className="text-[#C89B63] font-medium">• Kulam: {registration.kulam}</span>}
                {registration.current_location && <span>• {registration.current_location}</span>}
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* Main Fullscreen Body */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col space-y-4 sm:space-y-6 min-w-0">
        
        {/* Quick Status and Metadata Banner */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#C89B63]/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] sm:text-xs font-bold text-[#6A1E2C] uppercase tracking-wider shrink-0">Candidate Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              disabled={updatingStatus}
              className="bg-[#FFF9F5] border border-[#C89B63]/50 rounded-xl px-3 py-1.5 text-xs font-bold text-[#2D0A11] focus:ring-2 focus:ring-[#C89B63] outline-none shadow-sm cursor-pointer flex-1 sm:flex-initial"
            >
              <option value="Pending Review">Pending Review</option>
              <option value="Verified / Active">Verified / Active</option>
              <option value="Contacted">Contacted</option>
              <option value="Matched / In Talks">Matched / In Talks</option>
              <option value="Closed / Married">Closed / Married</option>
            </select>
            {statusSuccess && (
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Updated!
              </span>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] sm:text-xs text-stone-600 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C89B63] shrink-0" />
              <span>
                Registered: {registration.created_at ? new Date(registration.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
              </span>
            </div>

            {onEdit && (
              <button
                onClick={() => onEdit(registration)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#6A1E2C] font-bold text-[11px] sm:text-xs flex items-center gap-1 transition border border-[#C89B63]/40 shrink-0 cursor-pointer shadow-sm"
                title="Edit this registered profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#6A1E2C]" /> Edit Profile
              </button>
            )}

            <button
              onClick={async () => {
                if (window.confirm(`Are you sure you want to permanently delete registration ${registration.id} (${registration.name})?`)) {
                  await onDelete(registration.id);
                  onClose();
                }
              }}
              className="px-2.5 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-[11px] sm:text-xs flex items-center gap-1 transition border border-rose-200 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        {/* Tab Navigation with Swipe Support on Mobile */}
        <div className="w-full min-w-0">
          <div className="bg-white rounded-2xl p-1.5 sm:p-2 border border-stone-200 shadow-sm flex items-center gap-1.5 sm:gap-2 overflow-x-auto overscroll-x-contain touch-pan-x text-xs font-bold scrollbar-thin">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Overview & Quick Contacts</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Personal, Horoscope & Kulam</span>
            </button>

            <button
              onClick={() => setActiveTab('family')}
              className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'family'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Education, Career & Family</span>
            </button>

            <button
              onClick={() => setActiveTab('partner')}
              className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'partner'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Partner Expectations</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'docs'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Photos & Jathagam Docs</span>
              {(registration.photo_url || registration.jathagam_url || registration.community_certificate_url) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              )}
            </button>
          </div>
          {/* Subtle Mobile Scroll Cue */}
          <div className="sm:hidden text-center mt-1">
            <span className="text-[10px] text-stone-400 font-medium">← Swipe horizontally to switch tabs →</span>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-sm flex-1 space-y-4 sm:space-y-6 min-w-0">
          
          {/* TAB 1: OVERVIEW & CONTACTS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Direct Quick Action CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {registration.mobile_number ? (
                  <a
                    href={`tel:${cleanPhone(registration.mobile_number)}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs transition shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Call: {registration.mobile_number}</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-stone-100 text-stone-400 text-xs">
                    <Phone className="w-4 h-4" /> No Phone Listed
                  </div>
                )}

                {registration.whatsapp_number || registration.mobile_number ? (
                  <a
                    href={getWhatsAppLink(registration.whatsapp_number || registration.mobile_number, registration.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 font-bold text-xs transition shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Chat on WhatsApp</span>
                  </a>
                ) : null}

                {registration.email ? (
                  <a
                    href={`mailto:${registration.email}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 font-bold text-xs transition shadow-sm"
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Email Candidate</span>
                  </a>
                ) : null}
              </div>

              {/* Key Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold font-heading text-[#6A1E2C] uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C89B63]" /> Candidate Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Full Name</span>
                      <strong className="text-stone-800">{registration.name || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Gender & Age</span>
                      <strong className="text-stone-800">{registration.gender || '—'}, {registration.age ? `${registration.age} Yrs` : '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Community / Caste</span>
                      <strong className="text-stone-800">{registration.community || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Kulam / Gothram</span>
                      <strong className="text-stone-800">{registration.kulam || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Rasi & Natchathiram</span>
                      <strong className="text-[#6A1E2C] font-bold">
                        {registration.rasi || '—'} {registration.natchatram ? `• ${registration.natchatram}` : ''}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Laknam / Ascendant</span>
                      <strong className="text-[#6A1E2C] font-bold">{registration.lagnam || registration.laknam || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Dhosham / தோஷம்</span>
                      <strong className="text-rose-900 font-bold">{registration.dhosham || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Qualification</span>
                      <strong className="text-stone-800">{registration.education_qualification || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Profession</span>
                      <strong className="text-stone-800">{registration.profession || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Annual Income</span>
                      <strong className="text-[#6A1E2C] font-bold">{registration.income || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Work Location</span>
                      <strong className="text-stone-800">{registration.work_location || '—'}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold font-heading text-[#6A1E2C] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C89B63]" /> Contact & Residence
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Primary Mobile</span>
                      <strong className="text-stone-800 font-mono">{registration.mobile_number || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">WhatsApp Number</span>
                      <strong className="text-stone-800 font-mono">{registration.whatsapp_number || registration.mobile_number || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Email Address</span>
                      <strong className="text-stone-800 truncate block">{registration.email || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Native Place</span>
                      <strong className="text-stone-800">{registration.native_place || '—'}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 block text-[10px]">Current Location / Address</span>
                      <strong className="text-stone-800 leading-snug block">{registration.current_location || '—'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL & ASTROLOGY */}
          {activeTab === 'personal' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <h4 className="text-sm font-bold font-heading text-[#6A1E2C] flex items-center gap-2 border-b pb-3">
                <User className="w-4 h-4 text-[#C89B63]" /> Personal, Physical & Astrological Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Full Name</span>
                  <p className="font-bold text-stone-800 mt-0.5">{registration.name || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Gender</span>
                  <p className="font-bold text-stone-800 mt-0.5">{registration.gender || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Date of Birth & Age</span>
                  <p className="font-bold text-stone-800 mt-0.5">
                    {registration.dob || '—'} {registration.age ? `(${registration.age} Yrs)` : ''}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Marital Status</span>
                  <p className="font-bold text-stone-800 mt-0.5">{registration.marital_status || 'Never Married'}</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Height</span>
                  <p className="font-bold text-stone-800 mt-0.5">{registration.height || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 text-[10px] block">Weight</span>
                  <p className="font-bold text-stone-800 mt-0.5">{registration.weight ? `${registration.weight} kg` : '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="text-amber-800 text-[10px] block font-semibold">Community / Caste</span>
                  <p className="font-bold text-amber-950 mt-0.5">{registration.community || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="text-amber-800 text-[10px] block font-semibold">Kulam (கூட்டம்)</span>
                  <p className="font-bold text-amber-950 mt-0.5">{registration.kulam || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60">
                  <span className="text-amber-800 text-[10px] block font-semibold">Kula Deivam (குலதெய்வம்)</span>
                  <p className="font-bold text-amber-950 mt-0.5">{registration.kuladeivam || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60">
                  <span className="text-orange-800 text-[10px] block font-semibold">Rasi / Moon Sign (ராசி)</span>
                  <p className="font-bold text-orange-950 mt-0.5">{registration.rasi || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60">
                  <span className="text-orange-800 text-[10px] block font-semibold">Natchathiram / Star (நட்சத்திரம்)</span>
                  <p className="font-bold text-orange-950 mt-0.5">{registration.natchatram || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60">
                  <span className="text-orange-800 text-[10px] block font-semibold">Laknam / Ascendant (லக்னம்)</span>
                  <p className="font-bold text-orange-950 mt-0.5">{registration.lagnam || registration.laknam || '—'}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/60">
                  <span className="text-orange-800 text-[10px] block font-semibold">Dhosham / தோஷம்</span>
                  <p className="font-bold text-orange-950 mt-0.5">{registration.dhosham || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY & CAREER */}
          {activeTab === 'family' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold font-heading text-[#6A1E2C] flex items-center gap-2 border-b pb-3">
                  <Briefcase className="w-4 h-4 text-[#C89B63]" /> Education & Professional Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Educational Qualification</span>
                    <p className="font-bold text-stone-800 mt-0.5">{registration.education_qualification || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Profession / Occupation</span>
                    <p className="font-bold text-stone-800 mt-0.5">{registration.profession || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Annual Income</span>
                    <p className="font-bold text-[#6A1E2C] mt-0.5">{registration.income || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Company Name</span>
                    <p className="font-bold text-stone-800 mt-0.5">{registration.company_name || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Work Location</span>
                    <p className="font-bold text-stone-800 mt-0.5">{registration.work_location || '—'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Native Place</span>
                    <p className="font-bold text-stone-800 mt-0.5">{registration.native_place || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold font-heading text-[#6A1E2C] flex items-center gap-2 border-b pb-3">
                  <Users className="w-4 h-4 text-[#C89B63]" /> Family Background & Siblings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Father's Name & Status</span>
                    <p className="font-bold text-stone-800 mt-0.5">
                      {registration.father_name || '—'} {registration.father_occupation ? `(${registration.father_occupation})` : ''}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Mother's Name & Status</span>
                    <p className="font-bold text-stone-800 mt-0.5">
                      {registration.mother_name || '—'} {registration.mother_occupation ? `(${registration.mother_occupation})` : ''}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Family Type & Status</span>
                    <p className="font-bold text-stone-800 mt-0.5">
                      {registration.family_type || 'Nuclear'} • {registration.family_status || 'Middle Class'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Brothers Details</span>
                    <p className="font-bold text-stone-800 mt-0.5">
                      Total: {registration.brothers_count || '0'}
                      {registration.brothers_married ? ` (${registration.brothers_married} Married)` : ''}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Sisters Details</span>
                    <p className="font-bold text-stone-800 mt-0.5">
                      Total: {registration.sisters_count || '0'}
                      {registration.sisters_married ? ` (${registration.sisters_married} Married)` : ''}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Family Background Notes</span>
                    <p className="font-bold text-stone-800 mt-0.5">{registration.family_background || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PARTNER EXPECTATIONS */}
          {activeTab === 'partner' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold font-heading text-[#6A1E2C] flex items-center gap-2 border-b pb-3">
                <Heart className="w-4 h-4 text-[#C89B63]" /> Partner Preferences & Expectations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 text-[10px] block">Preferred Age Range</span>
                  <p className="font-bold text-stone-800">{registration.partner_age_range || 'Any compatible age'}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 text-[10px] block">Education Preference</span>
                  <p className="font-bold text-stone-800">{registration.partner_education || 'Any Degree'}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 text-[10px] block">Profession Preference</span>
                  <p className="font-bold text-stone-800">{registration.partner_profession || 'Private / Govt / Business'}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 text-[10px] block">Income Expectation</span>
                  <p className="font-bold text-stone-800">{registration.partner_income_preference || 'Decent / Negotiable'}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 text-[10px] block">Community / Caste Preference</span>
                  <p className="font-bold text-stone-800">{registration.partner_community_preference || 'Same Caste / Open'}</p>
                </div>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 text-[10px] block">Location Preference</span>
                  <p className="font-bold text-stone-800">{registration.partner_location_preference || 'Any in Tamil Nadu'}</p>
                </div>
                <div className="col-span-full p-4 rounded-xl bg-[#FAF3EB] border border-[#C89B63]/30 space-y-1">
                  <span className="text-[#6A1E2C] font-bold text-[10px] block">Other Special Expectations</span>
                  <p className="text-stone-800 font-medium leading-relaxed">
                    {registration.partner_other_expectations || 'No specific custom conditions specified.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PHOTOS & DOCS */}
          {activeTab === 'docs' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Candidate Photo */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6A1E2C]">Candidate Photograph</span>
                    {registration.photo_url && (
                      <a
                        href={registration.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#C89B63] hover:underline flex items-center gap-1 font-bold"
                      >
                        <ExternalLink className="w-3 h-3" /> Full View
                      </a>
                    )}
                  </div>
                  <div className="flex-1 min-h-[200px] max-h-[280px] rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
                    {registration.photo_url ? (
                      <img
                        src={registration.photo_url}
                        alt="Candidate"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-4 text-stone-400">
                        <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">No photograph uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horoscope / Jathagam */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6A1E2C]">Horoscope (Jathagam)</span>
                    {registration.jathagam_url && (
                      <a
                        href={registration.jathagam_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#C89B63] hover:underline flex items-center gap-1 font-bold"
                      >
                        <ExternalLink className="w-3 h-3" /> Open File
                      </a>
                    )}
                  </div>
                  <div className="flex-1 min-h-[200px] max-h-[280px] rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
                    {registration.jathagam_url ? (
                      registration.jathagam_url.startsWith('data:image') || registration.jathagam_url.match(/\.(jpeg|jpg|png|webp)/i) ? (
                        <img
                          src={registration.jathagam_url}
                          alt="Horoscope"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <FileText className="w-10 h-10 mx-auto mb-2 text-[#C89B63]" />
                          <p className="text-xs font-bold text-stone-800">Horoscope Document (PDF / File)</p>
                          <a
                            href={registration.jathagam_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6A1E2C] text-white text-xs font-bold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Download / View PDF
                          </a>
                        </div>
                      )
                    ) : (
                      <div className="text-center p-4 text-stone-400">
                        <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">No horoscope attached</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Community Certificate */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6A1E2C]">Community Certificate</span>
                    {registration.community_certificate_url && (
                      <a
                        href={registration.community_certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#C89B63] hover:underline flex items-center gap-1 font-bold"
                      >
                        <ExternalLink className="w-3 h-3" /> Open File
                      </a>
                    )}
                  </div>
                  <div className="flex-1 min-h-[200px] max-h-[280px] rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200">
                    {registration.community_certificate_url ? (
                      registration.community_certificate_url.startsWith('data:image') || registration.community_certificate_url.match(/\.(jpeg|jpg|png|webp)/i) ? (
                        <img
                          src={registration.community_certificate_url}
                          alt="Certificate"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-600" />
                          <p className="text-xs font-bold text-stone-800">Verification Certificate</p>
                          <a
                            href={registration.community_certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Download / View PDF
                          </a>
                        </div>
                      )
                    ) : (
                      <div className="text-center p-4 text-stone-400">
                        <ShieldCheck className="w-10 h-10 mx-auto mb-2 opacity-40" />
                        <p className="text-xs">No certificate attached</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={async () => {
              if (window.confirm(`Are you sure you want to permanently delete registration ${registration.id} (${registration.name})?`)) {
                await onDelete(registration.id);
                onClose();
              }
            }}
            className="px-4 py-2 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition border border-rose-200"
          >
            <Trash2 className="w-4 h-4" /> Delete Profile
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
