import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  User,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import {
  RegistrationRecord,
  KONGU_KULAMS,
  TAMIL_RASIS,
  TAMIL_NATCHATHIRAMS,
  TAMIL_LAGNAMS,
  TAMIL_DHOSHAMS,
} from '../types';

interface EditRegistrationModalProps {
  registration: RegistrationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecord: RegistrationRecord) => Promise<boolean>;
}

export default function EditRegistrationModal({
  registration,
  isOpen,
  onClose,
  onSave,
}: EditRegistrationModalProps) {
  const [formData, setFormData] = useState<Partial<RegistrationRecord>>({});
  const [activeTab, setActiveTab] = useState<'personal' | 'contact' | 'community' | 'education' | 'family' | 'partner' | 'media'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCustomKulam, setIsCustomKulam] = useState(false);

  // Initialize or reset form state whenever registration changes
  useEffect(() => {
    if (registration) {
      setFormData({
        ...registration,
        community: registration.community || 'Kongu Vellala Gounder',
      });
      // Check if kulam matches the standard list
      const kulam = registration.kulam || '';
      const matched = KONGU_KULAMS.some((k) => k.toLowerCase() === kulam.toLowerCase());
      setIsCustomKulam(!matched && kulam !== '');
      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [registration, isOpen]);

  if (!isOpen || !registration) return null;

  const handleChange = (field: keyof RegistrationRecord, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // If DOB changes, automatically update age
      if (field === 'dob' && value) {
        try {
          const birthDate = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (!isNaN(age) && age > 0 && age < 120) {
            updated.age = age;
          }
        } catch {}
      }

      return updated;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.name?.trim()) {
      setSaveError('Candidate name is required.');
      setActiveTab('personal');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const completeRecord: RegistrationRecord = {
        ...registration,
        ...formData,
        id: registration.id,
        community: 'Kongu Vellala Gounder', // Strictly enforced for Kongu Vellala Gounder
      } as RegistrationRecord;

      const success = await onSave(completeRecord);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1200);
      } else {
        setSaveError('Failed to save updates to the database. Please check your network and Supabase connection.');
      }
    } catch (err: any) {
      setSaveError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="edit-registration-modal"
      className="fixed inset-0 z-[130] bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#C89B63]/30 flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2D0A11] via-[#5C1925] to-[#2D0A11] text-[#FAF3EB] px-5 sm:px-8 py-4 sm:py-5 border-b border-[#C89B63]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C89B63]/20 border border-[#C89B63]/50 flex items-center justify-center text-[#C89B63]">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-heading font-bold text-white">
                  Edit Candidate Profile
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#C89B63]/30 text-[#C89B63] font-mono text-xs font-bold border border-[#C89B63]/50">
                  {registration.id}
                </span>
              </div>
              <p className="text-xs text-[#FAF3EB]/70">
                Updating profile for <strong className="text-white">{registration.name}</strong> • Changes will sync directly to Supabase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF3EB] transition disabled:opacity-50"
            title="Close Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#FAF3EB] border-b border-stone-200 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-thin shrink-0">
          <div className="flex items-center gap-1.5 min-w-max text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'personal'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'contact'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('community')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C89B63]" />
              <span>Community & Astrology</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'education'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Career & Income</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('family')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'family'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Family Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('partner')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'partner'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'media'
                  ? 'bg-[#6A1E2C] text-white shadow-sm'
                  : 'text-stone-600 hover:bg-white hover:text-stone-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Status & Media</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Save Error Alert */}
          {saveError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Save Failed</span>
                <span>{saveError}</span>
              </div>
            </div>
          )}

          {/* Save Success Alert */}
          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Profile successfully saved and synced to database!</span>
            </div>
          )}

          {/* TAB 1: PERSONAL & BASIC DETAILS */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Personal & Basic Information</span>
                </h3>
                <p className="text-xs text-stone-500">Candidate identification and physical details</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Candidate Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="e.g. S. Karthikeyan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Gender <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.gender || 'Female'}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="Female">Female (மணமகள் / Bride)</option>
                    <option value="Male">Male (மணமகன் / Groom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Date of Birth (பிறந்த தேதி)
                  </label>
                  <input
                    type="date"
                    value={formData.dob ? formData.dob.substring(0, 10) : ''}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Age (வயது)
                  </label>
                  <input
                    type="number"
                    value={formData.age !== undefined && formData.age !== null ? formData.age : ''}
                    onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value, 10) : '')}
                    placeholder="e.g. 27"
                    min="18"
                    max="100"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Height (உயரம்)
                  </label>
                  <input
                    type="text"
                    value={formData.height || ''}
                    onChange={(e) => handleChange('height', e.target.value)}
                    placeholder="e.g. 5 ft 8 in / 172 cm"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Weight (எடை)
                  </label>
                  <input
                    type="text"
                    value={formData.weight || ''}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="e.g. 68 kg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Marital Status (திருமண நிலை)
                  </label>
                  <select
                    value={formData.marital_status || 'Never Married'}
                    onChange={(e) => handleChange('marital_status', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="Never Married">Never Married (மணமாகாதவர்)</option>
                    <option value="Divorced">Divorced (விவாகரத்து பெற்றவர்)</option>
                    <option value="Widowed">Widowed (துணையை இழந்தவர்)</option>
                    <option value="Awaiting Divorce">Awaiting Divorce (விவாகரத்து எதிர்பார்ப்பு)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT & LOCATION */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Contact & Communication Details</span>
                </h3>
                <p className="text-xs text-stone-500">Candidate and family communication channels</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Primary Mobile Number (தொடர்பு எண்) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile_number || ''}
                    onChange={(e) => handleChange('mobile_number', e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    WhatsApp Number (வாட்ஸ்அப் எண்)
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp_number || ''}
                    onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address (மின்னஞ்சல்)
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g. candidate@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Current Location / Residence (தற்போது வசிக்கும் ஊர்)
                  </label>
                  <input
                    type="text"
                    value={formData.current_location || ''}
                    onChange={(e) => handleChange('current_location', e.target.value)}
                    placeholder="e.g. Coimbatore / Tiruppur / Chennai / Bangalore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Native Place / District (பூர்வீகம் / மாவட்டம்)
                  </label>
                  <input
                    type="text"
                    value={formData.native_place || ''}
                    onChange={(e) => handleChange('native_place', e.target.value)}
                    placeholder="e.g. Erode / Dharapuram / Kangeyam / Pollachi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY & ASTROLOGY */}
          {activeTab === 'community' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B63]" />
                  <span>Kongu Vellala Gounder Community & Astrology Details</span>
                </h3>
                <p className="text-xs text-stone-500">Community lineage, Kootam / Kulam, and horoscope attributes</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Community Field - Enforced & Locked */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Community / Caste (சமூகம்)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="Kongu Vellala Gounder"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#C89B63]/40 bg-amber-50/70 font-semibold text-xs text-[#6A1E2C] outline-none cursor-not-allowed select-none"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-bold text-[#6A1E2C] bg-[#C89B63]/20 px-2 py-0.5 rounded-md">
                      Exclusive Service
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Vivaaha Connect exclusively serves the Kongu Vellala Gounder community.
                  </p>
                </div>

                {/* Kulam Selection */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700">
                      Kulam / Kootam (கூட்டம்)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomKulam(!isCustomKulam)}
                      className="text-[11px] font-bold text-[#6A1E2C] hover:underline cursor-pointer"
                    >
                      {isCustomKulam ? '← Choose from Standard Kulams' : '+ Enter Other Kulam'}
                    </button>
                  </div>

                  {isCustomKulam ? (
                    <input
                      type="text"
                      value={formData.kulam || ''}
                      onChange={(e) => handleChange('kulam', e.target.value)}
                      placeholder="Type candidate's Kulam name..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                    />
                  ) : (
                    <select
                      value={formData.kulam || ''}
                      onChange={(e) => handleChange('kulam', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                    >
                      <option value="">Select Kulam (கூட்டம்)</option>
                      {KONGU_KULAMS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kuladeivam & Temple Location (குலதெய்வம் & கோவில் ஊர்)
                  </label>
                  <input
                    type="text"
                    value={formData.kuladeivam || ''}
                    onChange={(e) => handleChange('kuladeivam', e.target.value)}
                    placeholder="e.g. பொன் முத்துசுவாமி கோவில், கொத்தமங்கலம்"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                {/* Astrology: Rasi, Natchathiram, Lagnam, Dhosham */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Rasi / Moon Sign (ராசி)
                  </label>
                  <select
                    value={formData.rasi || ''}
                    onChange={(e) => handleChange('rasi', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="">Select Rasi</option>
                    {TAMIL_RASIS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Natchathiram / Star (நட்சத்திரம்)
                  </label>
                  <select
                    value={formData.natchatram || ''}
                    onChange={(e) => handleChange('natchatram', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="">Select Natchathiram</option>
                    {TAMIL_NATCHATHIRAMS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Lagnam (லக்னம்)
                  </label>
                  <select
                    value={formData.laknam || formData.lagnam || ''}
                    onChange={(e) => {
                      handleChange('laknam', e.target.value);
                      handleChange('lagnam', e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="">Select Lagnam</option>
                    {TAMIL_LAGNAMS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Dhosham (தோஷம்)
                  </label>
                  <select
                    value={formData.dhosham || ''}
                    onChange={(e) => handleChange('dhosham', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="">Select Dhosham status</option>
                    {TAMIL_DHOSHAMS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION & CAREER */}
          {activeTab === 'education' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Educational Qualification & Professional Details</span>
                </h3>
                <p className="text-xs text-stone-500">Degree, work, company, and annual remuneration</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Educational Qualification (கல்வித் தகுதி)
                  </label>
                  <input
                    type="text"
                    value={formData.education_qualification || ''}
                    onChange={(e) => handleChange('education_qualification', e.target.value)}
                    placeholder="e.g. B.E. Mechanical / MBA / MBBS / MS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Profession / Job Role (பணி / தொழில்)
                  </label>
                  <input
                    type="text"
                    value={formData.profession || ''}
                    onChange={(e) => handleChange('profession', e.target.value)}
                    placeholder="e.g. Software Engineer / Business Owner / Auditor"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Company / Organization Name (நிறுவனத்தின் பெயர்)
                  </label>
                  <input
                    type="text"
                    value={formData.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    placeholder="e.g. TCS / Cognizant / Self-Employed Textile Mill"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Work Location (பணிபுரியும் இடம்)
                  </label>
                  <input
                    type="text"
                    value={formData.work_location || ''}
                    onChange={(e) => handleChange('work_location', e.target.value)}
                    placeholder="e.g. Coimbatore / Bangalore / Abroad (USA/UK)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Annual Income (ஆண்டு வருமானம்)
                  </label>
                  <input
                    type="text"
                    value={formData.income || ''}
                    onChange={(e) => handleChange('income', e.target.value)}
                    placeholder="e.g. 12 Lakhs Per Annum / 18 - 24 LPA / 50K USD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAMILY BACKGROUND */}
          {activeTab === 'family' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Family Background & Siblings</span>
                </h3>
                <p className="text-xs text-stone-500">Parents, family heritage, and siblings' marriage status</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Father's Name (தந்தை பெயர்)
                  </label>
                  <input
                    type="text"
                    value={formData.father_name || ''}
                    onChange={(e) => handleChange('father_name', e.target.value)}
                    placeholder="Father's full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Father's Occupation (தந்தை தொழில்)
                  </label>
                  <input
                    type="text"
                    value={formData.father_occupation || ''}
                    onChange={(e) => handleChange('father_occupation', e.target.value)}
                    placeholder="e.g. Agriculture / Business / Retired Officer"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mother's Name (தாய் பெயர்)
                  </label>
                  <input
                    type="text"
                    value={formData.mother_name || ''}
                    onChange={(e) => handleChange('mother_name', e.target.value)}
                    placeholder="Mother's full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mother's Occupation (தாய் தொழில்)
                  </label>
                  <input
                    type="text"
                    value={formData.mother_occupation || ''}
                    onChange={(e) => handleChange('mother_occupation', e.target.value)}
                    placeholder="e.g. Homemaker / Teacher / Government Employee"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                {/* Brothers */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Brothers Count (சகோதரர்கள்)
                  </label>
                  <input
                    type="text"
                    value={formData.brothers_count || ''}
                    onChange={(e) => handleChange('brothers_count', e.target.value)}
                    placeholder="e.g. 1 (Married: 1, Unmarried: 0)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                {/* Sisters */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Sisters Count (சகோதரிகள்)
                  </label>
                  <input
                    type="text"
                    value={formData.sisters_count || ''}
                    onChange={(e) => handleChange('sisters_count', e.target.value)}
                    placeholder="e.g. 1 (Married: 1, Unmarried: 0)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Family Type (குடும்ப வகை)
                  </label>
                  <select
                    value={formData.family_type || 'Nuclear Family'}
                    onChange={(e) => handleChange('family_type', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="Nuclear Family">Nuclear Family (தனிக்குடும்பம்)</option>
                    <option value="Joint Family">Joint Family (கூட்டுக்குடும்பம்)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Family Status (பொருளாதார நிலை)
                  </label>
                  <select
                    value={formData.family_status || 'Upper Middle Class'}
                    onChange={(e) => handleChange('family_status', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="Middle Class">Middle Class (நடுத்தர குடும்பம்)</option>
                    <option value="Upper Middle Class">Upper Middle Class (உயர் நடுத்தர குடும்பம்)</option>
                    <option value="Rich / Affluent">Rich / Affluent (வசதியான குடும்பம்)</option>
                    <option value="High Class">High Class (உயர் செல்வாக்குடைய குடும்பம்)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Family Heritage & Properties / Background (குடும்ப பின்னணி & சொத்து விவரம்)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.family_background || ''}
                    onChange={(e) => handleChange('family_background', e.target.value)}
                    placeholder="Details regarding ancestral assets, agriculture lands, native prestige..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PARTNER PREFERENCES */}
          {activeTab === 'partner' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Partner Expectations & Matchmaking Preferences</span>
                </h3>
                <p className="text-xs text-stone-500">Desired qualities for prospective match</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Partner Age Preference (வயது விருப்பம்)
                  </label>
                  <input
                    type="text"
                    value={formData.partner_age_range || ''}
                    onChange={(e) => handleChange('partner_age_range', e.target.value)}
                    placeholder="e.g. 23 - 27 Years"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Partner Education Preference (கல்வி எதிர்பார்ப்பு)
                  </label>
                  <input
                    type="text"
                    value={formData.partner_education || ''}
                    onChange={(e) => handleChange('partner_education', e.target.value)}
                    placeholder="e.g. Professional Degree / Any Graduate / Post Graduate"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Partner Profession Preference (தொழில் எதிர்பார்ப்பு)
                  </label>
                  <input
                    type="text"
                    value={formData.partner_profession || ''}
                    onChange={(e) => handleChange('partner_profession', e.target.value)}
                    placeholder="e.g. IT Professional / Business / Doctor / Govt. Job"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Partner Income Expectation (வருமானம்)
                  </label>
                  <input
                    type="text"
                    value={formData.partner_income_preference || ''}
                    onChange={(e) => handleChange('partner_income_preference', e.target.value)}
                    placeholder="e.g. 8+ LPA / Any Decent Income"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Community Preference
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Kongu Vellala Gounder"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-xs text-stone-600 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Location Preference (இடம் விருப்பம்)
                  </label>
                  <input
                    type="text"
                    value={formData.partner_location_preference || ''}
                    onChange={(e) => handleChange('partner_location_preference', e.target.value)}
                    placeholder="e.g. Kongu Nadu / Coimbatore / Chennai / Abroad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Other Expectations & Notes (மற்ற எதிர்பார்ப்புகள்)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.partner_other_expectations || ''}
                    onChange={(e) => handleChange('partner_other_expectations', e.target.value)}
                    placeholder="Specific astrological preferences, Thayadhi Kulam exclusions, food habits..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STATUS & MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#6A1E2C]" />
                  <span>Verification Status & Document URLs</span>
                </h3>
                <p className="text-xs text-stone-500">Candidate verification workflow and uploaded assets</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Application / Candidate Status
                  </label>
                  <select
                    value={formData.status || 'Pending Review'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition cursor-pointer"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Verified / Active">Verified / Active</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Matched / In Talks">Matched / In Talks</option>
                    <option value="Closed / Married">Closed / Married</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Photo URL (புகைப்பட இணைப்பு)
                  </label>
                  <input
                    type="url"
                    value={formData.photo_url || ''}
                    onChange={(e) => handleChange('photo_url', e.target.value)}
                    placeholder="https://... or data:image/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                  {formData.photo_url && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={formData.photo_url}
                        alt="Candidate preview"
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[11px] text-stone-500">Photo preview loaded</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Jathagam / Horoscope URL (ஜாதக இணைப்பு)
                  </label>
                  <input
                    type="url"
                    value={formData.jathagam_url || ''}
                    onChange={(e) => handleChange('jathagam_url', e.target.value)}
                    placeholder="https://... or storage link"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Community Certificate URL
                  </label>
                  <input
                    type="url"
                    value={formData.community_certificate_url || ''}
                    onChange={(e) => handleChange('community_certificate_url', e.target.value)}
                    placeholder="https://... or storage link"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Modal Sticky Footer */}
        <div className="bg-[#FFF9F5] px-5 sm:px-8 py-3.5 sm:py-4 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes to Database</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
