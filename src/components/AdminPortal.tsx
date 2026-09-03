import React, { useState, useEffect } from 'react';
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  Search,
  Filter,
  RefreshCw,
  Download,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  ArrowLeft,
  Users,
  Heart,
  FileSpreadsheet,
  Layers,
  Check,
  Building2,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { RegistrationRecord, AdminUser, EnquiryRecord, EnquiryStatus, RegistrationDraftRecord, DraftStatus } from '../types';
import RegistrationDetailModal from './RegistrationDetailModal';
import AdminEnquiriesTab from './AdminEnquiriesTab';
import AdminDraftsTab from './AdminDraftsTab';
import {
  getSupabase,
  normalizeEnquiryRecord,
  fetchAdminRegistrationDrafts,
  updateRegistrationDraftStatus,
  deleteRegistrationDraft,
} from '../lib/supabase';
import logoImg from '../assets/images/Logo1.PNG';

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

export default function AdminPortal({ onBackToWebsite }: AdminPortalProps) {
  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<'registrations' | 'drafts' | 'enquiries'>('registrations');

  // Authentication State
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('vivaaha_admin_token');
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const cached = sessionStorage.getItem('vivaaha_admin_user');
    return cached ? JSON.parse(cached) : null;
  });

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registrations Data State
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    try {
      const cached = sessionStorage.getItem('vivaaha_cached_admin_records');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Drafts Data State (Incomplete Registrations)
  const [drafts, setDrafts] = useState<RegistrationDraftRecord[]>(() => {
    try {
      const cached = localStorage.getItem('vivaaha_cached_drafts');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Enquiries Data State
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() => {
    try {
      const cached = localStorage.getItem('vivaaha_enquiries');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loadingData, setLoadingData] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);

  // Filter & Search State for Registrations
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Female' | 'Male'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kulamFilter, setKulamFilter] = useState<string>('all');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  // Verify existing token on mount and listen for real-time enquiry submissions
  useEffect(() => {
    if (token) {
      verifyAndFetch(token);
    }

    const handleNewEnquiry = (event: any) => {
      const newEnquiry = event?.detail;
      if (newEnquiry?.id) {
        setEnquiries((prev) => {
          const exists = prev.some((e) => e.id === newEnquiry.id);
          if (exists) return prev;
          const updated = [newEnquiry, ...prev];
          try {
            localStorage.setItem('vivaaha_enquiries', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vivaaha_enquiries' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setEnquiries(parsed);
          }
        } catch {}
      }
    };

    window.addEventListener('vivaaha_enquiry_submitted', handleNewEnquiry);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('vivaaha_enquiry_submitted', handleNewEnquiry);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  const verifyAndFetch = async (authToken: string, force = false) => {
    try {
      if (registrations.length === 0 || force) {
        setLoadingData(true);
      } else {
        setIsSyncing(true);
      }
      setDataError(null);

      let records: RegistrationRecord[] | null = null;
      let enqRecords: EnquiryRecord[] | null = null;

      // 1. Fetch from Supabase database
      const supabase = getSupabase();
      if (supabase) {
        try {
          // Fetch Registrations
          const { data: dbData, error: dbError } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

          if (!dbError && dbData) {
            records = dbData as RegistrationRecord[];
          }

          // Fetch Enquiries
          const { data: enqData, error: enqError } = await supabase
            .from('enquiries')
            .select('*')
            .order('created_at', { ascending: false });

          if (!enqError && enqData && Array.isArray(enqData)) {
            enqRecords = enqData.map(normalizeEnquiryRecord);
          }
        } catch (dbErr) {
          console.warn('Direct Supabase fetch caught:', dbErr);
        }
      }

      // 2. Server API fallback for Registrations & Enquiries
      if (!records) {
        try {
          const url = force ? '/api/admin/registrations?force=true' : '/api/admin/registrations';
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.success && Array.isArray(data.registrations)) {
              records = data.registrations;
            }
          }
        } catch {}
      }

      if (!enqRecords) {
        try {
          const url = force ? '/api/admin/enquiries?force=true' : '/api/admin/enquiries';
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.success && Array.isArray(data.enquiries)) {
              enqRecords = data.enquiries.map(normalizeEnquiryRecord);
            }
          }
        } catch {}
      }

      // 3. Resilient Deduplicating Merging for Enquiries
      const localEnquiries: EnquiryRecord[] = (() => {
        try {
          const raw = localStorage.getItem('vivaaha_enquiries');
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })();

      const mergedEnquiriesMap = new Map<string, EnquiryRecord>();
      // 1. Current in-memory state
      enquiries.forEach((e) => {
        if (e && e.id) mergedEnquiriesMap.set(e.id, e);
      });
      // 2. Local storage records
      localEnquiries.forEach((e) => {
        if (e && e.id) mergedEnquiriesMap.set(e.id, e);
      });
      // 3. Remote records (from Supabase or server API)
      if (Array.isArray(enqRecords)) {
        enqRecords.forEach((e) => {
          if (e && e.id) mergedEnquiriesMap.set(e.id, e);
        });
      }

      const finalEnquiries = Array.from(mergedEnquiriesMap.values()).sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      if (finalEnquiries.length > 0) {
        setEnquiries(finalEnquiries);
        try {
          localStorage.setItem('vivaaha_enquiries', JSON.stringify(finalEnquiries));
        } catch {}
      }

      // 4. Resilient Deduplicating Merging for Registrations
      const localRegistrations: RegistrationRecord[] = (() => {
        try {
          const raw = localStorage.getItem('vivaaha_registrations');
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      })();

      const mergedRegMap = new Map<string, RegistrationRecord>();
      registrations.forEach((r) => {
        if (r && r.id) mergedRegMap.set(r.id, r);
      });
      localRegistrations.forEach((r) => {
        if (r && r.id) mergedRegMap.set(r.id, r);
      });
      if (Array.isArray(records)) {
        records.forEach((r) => {
          if (r && r.id) mergedRegMap.set(r.id, r);
        });
      }

      const finalRegistrations = Array.from(mergedRegMap.values()).sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      if (finalRegistrations.length > 0) {
        setRegistrations(finalRegistrations);
        try {
          sessionStorage.setItem('vivaaha_cached_admin_records', JSON.stringify(finalRegistrations));
          localStorage.setItem('vivaaha_registrations', JSON.stringify(finalRegistrations));
        } catch {}
      }

      // 5. Fetch Incomplete Registration Drafts from Supabase & API
      try {
        const draftList = await fetchAdminRegistrationDrafts(authToken);
        if (Array.isArray(draftList)) {
          setDrafts(draftList);
          try {
            localStorage.setItem('vivaaha_cached_drafts', JSON.stringify(draftList));
          } catch {}
        }
      } catch (dErr) {
        console.warn('Error fetching registration drafts:', dErr);
      }
    } catch (err: any) {
      if (registrations.length === 0) {
        setDataError(err.message || 'Network error fetching data');
      }
    } finally {
      setLoadingData(false);
      setIsSyncing(false);
    }
  };

  // Registration Draft Status Update Handler
  const handleUpdateDraftStatus = async (id: string, newStatus: DraftStatus) => {
    try {
      setDrafts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus, updated_at: new Date().toISOString() } : d))
      );
      const res = await updateRegistrationDraftStatus(id, newStatus, token || undefined);
      return res;
    } catch (err) {
      console.error('Error updating draft status:', err);
      return false;
    }
  };

  // Registration Draft Delete Handler
  const handleDeleteDraft = async (id: string) => {
    try {
      setDrafts((prev) => {
        const next = prev.filter((d) => d.id !== id);
        try {
          localStorage.setItem('vivaaha_cached_drafts', JSON.stringify(next));
        } catch {}
        return next;
      });
      const res = await deleteRegistrationDraft(id, token || undefined);
      return res;
    } catch (err) {
      console.error('Error deleting draft:', err);
      return false;
    }
  };

  // Enquiry Update Status Handler
  const handleUpdateEnquiryStatus = async (id: string, newStatus: EnquiryStatus, notes?: string) => {
    try {
      // Optimistic update
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus, notes: notes !== undefined ? notes : e.notes } : e))
      );

      // Direct Supabase
      const supabase = getSupabase();
      if (supabase) {
        const updatePayload: any = { status: newStatus };
        if (notes !== undefined) updatePayload.notes = notes;
        await supabase.from('enquiries').update(updatePayload).eq('id', id);
      }

      // Server endpoint
      if (token) {
        await fetch(`/api/admin/enquiries/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus, notes }),
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Error updating enquiry:', err);
    }
  };

  // Enquiry Delete Handler
  const handleDeleteEnquiry = async (id: string) => {
    try {
      setEnquiries((prev) => {
        const next = prev.filter((e) => e.id !== id);
        try {
          localStorage.setItem('vivaaha_enquiries', JSON.stringify(next));
        } catch {}
        return next;
      });

      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('enquiries').delete().eq('id', id);
      }

      if (token) {
        await fetch(`/api/admin/enquiries/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Error deleting enquiry:', err);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    if (!cleanUser || !cleanPass) {
      setLoginError('Please enter both username and password');
      return;
    }

    try {
      setLoginLoading(true);
      setLoginError(null);

      // Check standard administrator credentials immediately
      const expectedUser = 'admin';
      const expectedPass = 'vivaaha@admin2026';

      if (
        cleanUser.toLowerCase() === expectedUser.toLowerCase() &&
        cleanPass === expectedPass
      ) {
        const sessionToken = `vivaaha_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const userData: AdminUser = { username: cleanUser, role: 'Super Admin' };

        setToken(sessionToken);
        setAdminUser(userData);
        sessionStorage.setItem('vivaaha_admin_token', sessionToken);
        sessionStorage.setItem('vivaaha_admin_user', JSON.stringify(userData));
        setPasswordInput('');
        return;
      }

      // Try server verification for custom backend credentials if configured
      let serverAuthenticated = false;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cleanUser,
            password: cleanPass,
          }),
        });

        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data?.success && data?.token) {
            serverAuthenticated = true;
            setToken(data.token);
            const userObj = data.user || { username: cleanUser, role: 'Super Admin' };
            setAdminUser(userObj);
            sessionStorage.setItem('vivaaha_admin_token', data.token);
            sessionStorage.setItem('vivaaha_admin_user', JSON.stringify(userObj));
            setPasswordInput('');
            return;
          }
        }
      } catch (fetchErr) {
        // Ignore static hosting 405/404 fetch errors
      }

      if (!serverAuthenticated) {
        setLoginError('Invalid credentials. Please verify your administrator ID and password.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error logging in. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    sessionStorage.removeItem('vivaaha_admin_token');
    sessionStorage.removeItem('vivaaha_admin_user');
    sessionStorage.removeItem('vivaaha_cached_admin_records');
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!token) return;
    try {
      // 1. Try server API
      let serverUpdated = false;
      try {
        const res = await fetch(`/api/admin/registrations/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) serverUpdated = true;
        }
      } catch {}

      // 2. Direct Supabase client update fallback
      if (!serverUpdated) {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('registrations').update({ status: newStatus }).eq('id', id);
        }
      }

      // Update state locally
      setRegistrations((prev) => {
        const updated = prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
        try {
          sessionStorage.setItem('vivaaha_cached_admin_records', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord({ ...selectedRecord, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!token) return;
    try {
      // 1. Try server API
      let serverDeleted = false;
      try {
        const res = await fetch(`/api/admin/registrations/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) serverDeleted = true;
        }
      } catch {}

      // 2. Direct Supabase client deletion fallback
      if (!serverDeleted) {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from('registrations').delete().eq('id', id);
        }
      }

      // Update state locally
      setRegistrations((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        try {
          sessionStorage.setItem('vivaaha_cached_admin_records', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      'ID',
      'Created Date',
      'Name',
      'Gender',
      'Age',
      'DOB',
      'Mobile',
      'WhatsApp',
      'Email',
      'Community',
      'Kulam',
      'Rasi',
      'Natchathiram',
      'Laknam',
      'Qualification',
      'Profession',
      'Income',
      'Location',
      'Native Place',
      'Status',
    ];

    const rows = filteredRegistrations.map((r) => [
      `"${r.id || ''}"`,
      `"${r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}"`,
      `"${r.name || ''}"`,
      `"${r.gender || ''}"`,
      `"${r.age || ''}"`,
      `"${r.dob || ''}"`,
      `"${r.mobile_number || ''}"`,
      `"${r.whatsapp_number || ''}"`,
      `"${r.email || ''}"`,
      `"${r.community || ''}"`,
      `"${r.kulam || ''}"`,
      `"${r.rasi || ''}"`,
      `"${r.natchatram || ''}"`,
      `"${r.laknam || ''}"`,
      `"${r.education_qualification || ''}"`,
      `"${r.profession || ''}"`,
      `"${r.income || ''}"`,
      `"${r.current_location || ''}"`,
      `"${r.native_place || ''}"`,
      `"${r.status || 'Pending Review'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VivaahaConnect_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = r.name?.toLowerCase().includes(q);
      const matchId = r.id?.toLowerCase().includes(q);
      const matchPhone = r.mobile_number?.includes(q) || r.whatsapp_number?.includes(q);
      const matchCity = r.current_location?.toLowerCase().includes(q) || r.native_place?.toLowerCase().includes(q);
      const matchCommunity = r.community?.toLowerCase().includes(q) || r.kulam?.toLowerCase().includes(q);
      const matchAstrology = r.rasi?.toLowerCase().includes(q) || r.natchatram?.toLowerCase().includes(q) || r.laknam?.toLowerCase().includes(q);
      const matchProf = r.profession?.toLowerCase().includes(q) || r.education_qualification?.toLowerCase().includes(q);

      if (!matchName && !matchId && !matchPhone && !matchCity && !matchCommunity && !matchAstrology && !matchProf) {
        return false;
      }
    }

    // Gender Filter
    if (genderFilter !== 'all') {
      const g = (r.gender || '').toLowerCase();
      if (genderFilter === 'Female' && !g.includes('female') && !g.includes('bride')) {
        return false;
      }
      if (genderFilter === 'Male' && !g.includes('male') && !g.includes('groom')) {
        return false;
      }
    }

    // Status Filter
    if (statusFilter !== 'all') {
      const s = r.status || 'Pending Review';
      if (s !== statusFilter) {
        return false;
      }
    }

    // Kulam Filter
    if (kulamFilter !== 'all') {
      if (r.kulam !== kulamFilter) {
        return false;
      }
    }

    return true;
  });

  // Extract unique Kulams for Kongu Vellala Gounder matching
  const uniqueKulams = Array.from(
    new Set(registrations.map((r) => r.kulam).filter(Boolean))
  ) as string[];

  // Metric counts
  const totalCount = registrations.length;
  const brideCount = registrations.filter(
    (r) => (r.gender || '').toLowerCase().includes('female') || (r.gender || '').toLowerCase().includes('bride')
  ).length;
  const groomCount = registrations.filter(
    (r) => (r.gender || '').toLowerCase().includes('male') || (r.gender || '').toLowerCase().includes('groom')
  ).length;
  const pendingCount = registrations.filter(
    (r) => !r.status || r.status.toLowerCase().includes('pending')
  ).length;
  const verifiedCount = registrations.filter(
    (r) => r.status && r.status.toLowerCase().includes('verified')
  ).length;

  const cleanPhone = (phone?: string | null) => {
    if (!phone) return '';
    return phone.replace(/[^0-9]/g, '');
  };

  const getWhatsAppLink = (phone?: string | null, name?: string, id?: string) => {
    const digits = cleanPhone(phone);
    if (!digits) return '#';
    const formatted = digits.length === 10 ? `91${digits}` : digits;
    const msg = encodeURIComponent(
      `Vanakkam ${name || ''}, this is Vivaaha Connect Matrimony regarding your registration ${id || ''}. We would like to assist you with matched profiles.`
    );
    return `https://wa.me/${formatted}?text=${msg}`;
  };

  // ================= RENDER LOGIN SCREEN =================
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#C89B63]/30 relative">
          
          {/* Back button */}
          <button
            onClick={onBackToWebsite}
            className="absolute top-6 left-6 text-xs text-stone-500 hover:text-[#6A1E2C] flex items-center gap-1 font-bold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {/* Logo & Header */}
          <div className="text-center mt-4 space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-[#FAF3EB] border border-[#C89B63]/30 shadow-inner">
              <Shield className="w-8 h-8 text-[#6A1E2C]" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-[#6A1E2C]">
              Administrator Portal
            </h1>
            <p className="text-xs text-stone-500">
              Sign in to manage and review Vivaaha Connect matrimonial registrations securely.
            </p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <div className="mt-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Admin Username / ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter administrator ID"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 text-xs text-stone-800 outline-none transition"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 text-xs text-stone-800 outline-none transition"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#6A1E2C] hover:bg-[#8C283B] text-[#FFF9F5] font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Secure Admin Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Confidential Notice */}
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Server-authenticated encrypted session</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-stone-800 flex flex-col font-sans overflow-x-hidden">
      
      {/* Top Navbar */}
      <header className="bg-[#2D0A11] text-[#FAF3EB] px-3 sm:px-8 py-3.5 sm:py-4 border-b border-[#C89B63]/30 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Vivaaha Connect"
                className="h-9 sm:h-10 w-auto bg-white/95 px-2 py-1 rounded-lg border border-[#C89B63]/40 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm sm:text-base text-[#FFF9F5]">Vivaaha Connect</span>
                  <span className="text-[10px] bg-[#C89B63] text-[#2D0A11] font-bold px-2 py-0.5 rounded-full">
                    Admin Panel
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] sm:text-[11px] text-[#FAF3EB]/75 font-medium">Connected to Vivaaha Database</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-3 flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <button
              onClick={() => verifyAndFetch(token, true)}
              disabled={loadingData || isSyncing}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FAF3EB] text-xs font-semibold flex items-center gap-1.5 transition"
              title="Force Refresh from Vivaaha Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData || isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-xs">{isSyncing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#C89B63]/20 hover:bg-[#C89B63]/30 active:bg-[#C89B63]/40 text-[#C89B63] text-xs font-bold flex items-center gap-1.5 transition border border-[#C89B63]/40"
              title="Export as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-xs">Export CSV</span>
            </button>

            <button
              onClick={onBackToWebsite}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FAF3EB] text-xs font-semibold transition"
            >
              View Site
            </button>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 active:bg-rose-950 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition border border-rose-700/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 flex-1 min-w-0">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Registrations Tab */}
            <button
              onClick={() => setActiveTab('registrations')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                activeTab === 'registrations'
                  ? 'bg-[#6A1E2C] text-white shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registrations & Profiles</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'registrations' ? 'bg-[#FAF3EB] text-[#6A1E2C]' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {totalCount}
              </span>
            </button>

            {/* Incomplete Registration Drafts Tab */}
            <button
              onClick={() => setActiveTab('drafts')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer relative ${
                activeTab === 'drafts'
                  ? 'bg-[#6A1E2C] text-white shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Incomplete Drafts</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'drafts'
                    ? 'bg-[#FAF3EB] text-[#6A1E2C]'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {drafts.length}
              </span>
              {drafts.filter((d) => d.status === 'Incomplete' || d.status === 'Draft').length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Enquiries & Callbacks Tab */}
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer relative ${
                activeTab === 'enquiries'
                  ? 'bg-[#6A1E2C] text-white shadow-md'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquiries & Callbacks</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'enquiries' ? 'bg-[#FAF3EB] text-[#6A1E2C]' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {enquiries.length}
              </span>
              {enquiries.filter((e) => e.status === 'New').length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>
          </div>

          <div className="text-[11px] text-stone-400 font-medium">
            {activeTab === 'registrations' && `${filteredRegistrations.length} of ${totalCount} records`}
            {activeTab === 'drafts' && `${drafts.length} incomplete drafts logged`}
            {activeTab === 'enquiries' && `${enquiries.length} customer enquiries logged`}
          </div>
        </div>

        {/* Tab 3: Incomplete Registration Drafts View */}
        {activeTab === 'drafts' && (
          <AdminDraftsTab
            drafts={drafts}
            onUpdateStatus={handleUpdateDraftStatus}
            onDelete={handleDeleteDraft}
            onRefresh={() => verifyAndFetch(token, true)}
            loading={loadingData || isSyncing}
          />
        )}

        {/* Tab 2: Enquiries View */}
        {activeTab === 'enquiries' && (
          <AdminEnquiriesTab
            enquiries={enquiries}
            onUpdateStatus={handleUpdateEnquiryStatus}
            onDelete={handleDeleteEnquiry}
            onRefresh={() => verifyAndFetch(token, true)}
            loading={loadingData || isSyncing}
          />
        )}

        {/* Tab 1: Registrations View */}
        {activeTab === 'registrations' && (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4">
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
                <span className="text-stone-400 text-[11px] sm:text-xs block font-medium">Total Registrations</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl sm:text-3xl font-heading font-bold text-[#6A1E2C]">{totalCount}</span>
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-stone-300" />
                </div>
              </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-rose-700 text-[11px] sm:text-xs block font-medium">Brides (Female)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-3xl font-heading font-bold text-rose-800">{brideCount}</span>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-300" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-blue-700 text-[11px] sm:text-xs block font-medium">Grooms (Male)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-3xl font-heading font-bold text-blue-800">{groomCount}</span>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-amber-700 text-[11px] sm:text-xs block font-medium">Pending Review</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-3xl font-heading font-bold text-amber-800">{pendingCount}</span>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-emerald-700 text-[11px] sm:text-xs block font-medium">Verified Active</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl sm:text-3xl font-heading font-bold text-emerald-800">{verifiedCount}</span>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search candidate name, ID, mobile, town, or kulam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#C89B63] focus:ring-2 focus:ring-[#C89B63]/20 text-xs text-stone-800 outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded text-stone-400 hover:text-stone-700 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto text-xs font-bold">
              <button
                onClick={() => setGenderFilter('all')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition ${
                  genderFilter === 'all' ? 'bg-white shadow text-[#6A1E2C]' : 'text-stone-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setGenderFilter('Female')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition ${
                  genderFilter === 'Female' ? 'bg-white shadow text-rose-700' : 'text-stone-500'
                }`}
              >
                Brides
              </button>
              <button
                onClick={() => setGenderFilter('Male')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition ${
                  genderFilter === 'Male' ? 'bg-white shadow text-blue-700' : 'text-stone-500'
                }`}
              >
                Grooms
              </button>
            </div>
          </div>

          {/* Sub Filters: Status & Community & View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-semibold text-[11px] sm:text-xs">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-700 outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Verified / Active">Verified / Active</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Matched / In Talks">Matched / In Talks</option>
                  <option value="Closed / Married">Closed / Married</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-semibold text-[11px] sm:text-xs">Kulam (கூட்டம்):</span>
                <select
                  value={kulamFilter}
                  onChange={(e) => setKulamFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-700 outline-none cursor-pointer max-w-[170px] sm:max-w-[210px] truncate"
                >
                  <option value="all">All Kulams (Kongu Vellala Gounder)</option>
                  {uniqueKulams.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-stone-500 text-xs">
              <span>
                Showing <strong>{filteredRegistrations.length}</strong> of {registrations.length}
              </span>

              {/* View Mode Toggle: Cards vs Table */}
              <div className="inline-flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    viewMode === 'cards' ? 'bg-white shadow text-[#6A1E2C]' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                    viewMode === 'table' ? 'bg-white shadow text-[#6A1E2C]' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Loading / Error States */}
        {loadingData && registrations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm space-y-3">
            <RefreshCw className="w-8 h-8 text-[#C89B63] animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-600">Loading registrations from Vivaaha Database...</p>
          </div>
        ) : dataError ? (
          <div className="bg-rose-50 rounded-2xl p-8 text-center border border-rose-200 text-rose-800 space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <p className="text-xs font-bold">{dataError}</p>
            <button
              onClick={() => verifyAndFetch(token)}
              className="px-4 py-2 rounded-xl bg-rose-800 text-white text-xs font-bold shadow"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm space-y-2">
            <Users className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-700">No Registrations Found</h3>
            <p className="text-xs text-stone-400">
              {searchTerm || genderFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or clearing filters.'
                : 'No candidate registrations have been submitted yet.'}
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          /* Card View (Optimal for Mobile & CRM Browsing) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredRegistrations.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-[#C89B63]/50 shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between space-y-3.5 group"
              >
                <div>
                  {/* Card Top: Avatar, Name, ID, Gender */}
                  <div className="flex items-start gap-3">
                    {item.photo_url && !brokenImages[item.id] ? (
                      <img
                        src={item.photo_url}
                        alt={item.name || 'Candidate'}
                        onError={() => handleImageError(item.id)}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-xl text-white font-bold flex items-center justify-center text-base shrink-0 shadow-sm ${
                        (item.gender || '').toLowerCase().includes('female') || (item.gender || '').toLowerCase().includes('bride')
                          ? 'bg-gradient-to-br from-rose-500 to-[#6A1E2C]'
                          : 'bg-gradient-to-br from-amber-600 to-[#6A1E2C]'
                      }`}>
                        {item.name ? item.name.charAt(0).toUpperCase() : 'V'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-stone-900 truncate">
                          {item.name || 'Unnamed Candidate'}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            (item.gender || '').toLowerCase().includes('female') || (item.gender || '').toLowerCase().includes('bride')
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.gender || 'Profile'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                        <span className="font-mono text-[#6A1E2C] font-bold">{item.id}</span>
                        <span>•</span>
                        <span>{item.age ? `${item.age} Yrs` : ''}</span>
                        {item.current_location && <span>• {item.current_location}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Card Details: Kulam, Astrology, Profession, Income */}
                  <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Kulam (கூட்டம்)</span>
                      <p className="font-semibold text-stone-800 truncate">
                        {item.kulam || item.community || '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block">Astrology (ராசி / நட்சத்திரம்)</span>
                      <p className="font-semibold text-[#6A1E2C] truncate">
                        {item.rasi || item.natchatram ? `${item.rasi || ''} ${item.natchatram ? `• ${item.natchatram}` : ''}` : '—'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-stone-400 text-[10px] block">Profession & Income</span>
                      <p className="font-semibold text-stone-800 truncate">
                        {item.profession || item.education_qualification || '—'} {item.income ? `(${item.income})` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="mt-3 flex items-center gap-2">
                    {item.mobile_number && (
                      <a
                        href={`tel:${cleanPhone(item.mobile_number)}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold transition"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Call</span>
                      </a>
                    )}
                    {(item.whatsapp_number || item.mobile_number) && (
                      <a
                        href={getWhatsAppLink(item.whatsapp_number || item.mobile_number, item.name, item.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 text-[11px] font-bold transition"
                      >
                        <MessageCircle className="w-3 h-3 text-green-600" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Status Selector + View Details Button */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <select
                    value={item.status || 'Pending Review'}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                    className={`text-[11px] font-bold rounded-xl px-2.5 py-1.5 border outline-none cursor-pointer transition flex-1 max-w-[140px] ${
                      (item.status || 'Pending Review') === 'Verified / Active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : (item.status || 'Pending Review') === 'Contacted'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : (item.status || 'Pending Review') === 'Closed / Married'
                        ? 'bg-stone-100 text-stone-600 border-stone-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Verified / Active">Verified / Active</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Matched / In Talks">Matched / In Talks</option>
                    <option value="Closed / Married">Closed / Married</option>
                  </select>

                  <button
                    onClick={() => setSelectedRecord(item)}
                    className="px-3 py-1.5 rounded-xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-w-0">
            {/* Scroll Hint on mobile */}
            <div className="sm:hidden px-3 py-1.5 bg-[#FAF3EB] text-center border-b border-[#C89B63]/20">
              <span className="text-[10px] text-stone-500 font-medium">← Swipe horizontally to view all candidate columns →</span>
            </div>
            
            <div className="overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-thin">
              <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                <thead>
                  <tr className="bg-[#FAF3EB] text-[#6A1E2C] font-bold border-b border-[#C89B63]/20">
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">ID & Date</th>
                    <th className="py-3.5 px-4">Community & Kulam</th>
                    <th className="py-3.5 px-4">Profession & Income</th>
                    <th className="py-3.5 px-4">Contact Details</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                  {filteredRegistrations.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-stone-50/80 transition group"
                    >
                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.photo_url && !brokenImages[item.id] ? (
                            <img
                              src={item.photo_url}
                              alt={item.name || 'Candidate'}
                              onError={() => handleImageError(item.id)}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0 shadow-sm"
                            />
                          ) : (
                            <div className={`w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center shrink-0 shadow-sm ${
                              (item.gender || '').toLowerCase().includes('female') || (item.gender || '').toLowerCase().includes('bride')
                                ? 'bg-gradient-to-br from-rose-500 to-[#6A1E2C]'
                                : 'bg-gradient-to-br from-amber-600 to-[#6A1E2C]'
                            }`}>
                              {item.name ? item.name.charAt(0).toUpperCase() : 'V'}
                            </div>
                          )}
                          <div>
                            <button
                              onClick={() => setSelectedRecord(item)}
                              className="font-bold text-stone-900 hover:text-[#6A1E2C] text-left transition flex items-center gap-1.5"
                            >
                              <span>{item.name || 'Unnamed Candidate'}</span>
                            </button>
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                  (item.gender || '').toLowerCase().includes('female') || (item.gender || '').toLowerCase().includes('bride')
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {item.gender || 'Bride'}
                              </span>
                              <span>• {item.age ? `${item.age} Yrs` : ''}</span>
                              {item.current_location && <span>• {item.current_location}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ID & Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                        <span className="font-bold text-[#6A1E2C] block">{item.id}</span>
                        <span className="text-[10px] text-stone-400">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </td>

                      {/* Community & Astrology */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block">{item.community || '—'}</span>
                        <span className="text-[11px] text-stone-500 block">{item.kulam ? `Kulam: ${item.kulam}` : ''}</span>
                        {(item.rasi || item.natchatram) && (
                          <span className="text-[10px] text-[#8B4513] font-semibold block">
                            {item.rasi || ''}{item.natchatram ? ` • ${item.natchatram}` : ''}
                          </span>
                        )}
                      </td>

                      {/* Profession & Income */}
                      <td className="py-3.5 px-4">
                        <span className="text-stone-800 block truncate max-w-[160px]">{item.profession || item.education_qualification || '—'}</span>
                        <span className="text-[11px] font-bold text-[#6A1E2C] block">{item.income || '—'}</span>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {item.mobile_number && (
                            <a
                              href={`tel:${cleanPhone(item.mobile_number)}`}
                              className="font-mono text-stone-800 hover:text-emerald-700 flex items-center gap-1 font-bold"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{item.mobile_number}</span>
                            </a>
                          )}
                          {(item.whatsapp_number || item.mobile_number) && (
                            <a
                              href={getWhatsAppLink(item.whatsapp_number || item.mobile_number, item.name, item.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-green-700 hover:underline flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3 text-green-600" />
                              <span>WhatsApp Chat</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={item.status || 'Pending Review'}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer transition ${
                            (item.status || 'Pending Review') === 'Verified / Active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : (item.status || 'Pending Review') === 'Contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : (item.status || 'Pending Review') === 'Closed / Married'
                              ? 'bg-stone-100 text-stone-600 border-stone-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Verified / Active">Verified / Active</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Matched / In Talks">Matched / In Talks</option>
                          <option value="Closed / Married">Closed / Married</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#6A1E2C] hover:bg-[#8C283B] text-white text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
                            title="View Full Profile"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-3 h-3" />
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
          </>
        )}
      </main>

      {/* Detailed Modal */}
      {selectedRecord && (
        <RegistrationDetailModal
          registration={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onStatusChange={handleUpdateStatus}
          onDelete={handleDeleteRecord}
        />
      )}
    </div>
  );
}
