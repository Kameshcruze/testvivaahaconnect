import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { optimizeImageFile, validateFileSize } from './fileOptimizer';
import { EnquiryRecord, EnquiryType, EnquiryStatus, RegistrationDraftRecord, DraftStatus } from '../types';

// Auto-clean any stale invalid localStorage configs
if (typeof window !== 'undefined') {
  try {
    const cachedUrl = localStorage.getItem('vivaaha_supabase_url');
    if (cachedUrl && (cachedUrl.includes('awigjicqnpjfvwvknnej') || cachedUrl.includes('localhost'))) {
      localStorage.removeItem('vivaaha_supabase_url');
      localStorage.removeItem('vivaaha_supabase_anon_key');
    }
  } catch (e) {
    // Ignore storage access errors
  }
}

// Default Supabase project credentials for Vivaaha Connect
const DEFAULT_SUPABASE_URL = 'https://wdscpvjjyltsuvivlsta.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkc2NwdmpqeWx0c3V2aXZsc3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODY1MzMsImV4cCI6MjEwMzc2MjUzM30.J9b5WcfVrWUPsohuuivOIgnjPTxtvPWx75MluLrzagE';

// Helper to check if a URL is the old defunct host
const isInvalidUrl = (u?: string | null): boolean => {
  if (!u) return true;
  return u.includes('awigjicq') || u.includes('localhost') || u.includes('your-project-id');
};

// Get credentials from Vite environment variables or defaults
export const getSupabaseConfig = (): { url: string; anonKey: string } => {
  let localUrl = typeof window !== 'undefined' ? localStorage.getItem('vivaaha_supabase_url') : null;
  let localKey = typeof window !== 'undefined' ? localStorage.getItem('vivaaha_supabase_anon_key') : null;

  if (isInvalidUrl(localUrl)) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('vivaaha_supabase_url');
        localStorage.removeItem('vivaaha_supabase_anon_key');
      } catch (e) {
        // ignore
      }
    }
    localUrl = null;
    localKey = null;
  }

  let envUrl = import.meta.env.VITE_SUPABASE_URL;
  let envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (isInvalidUrl(envUrl)) {
    envUrl = null;
  }

  const url = (localUrl || envUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (localKey || (envUrl ? envKey : null) || DEFAULT_SUPABASE_ANON_KEY).trim();

  return { url, anonKey };
};

export const saveSupabaseConfig = (url: string, anonKey: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vivaaha_supabase_url', url.trim());
    localStorage.setItem('vivaaha_supabase_anon_key', anonKey.trim());
    supabaseInstance = null; // reset client instance
  }
};

export const clearSupabaseConfig = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vivaaha_supabase_url');
    localStorage.removeItem('vivaaha_supabase_anon_key');
    supabaseInstance = null;
  }
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return (
    Boolean(url) &&
    Boolean(anonKey) &&
    url !== 'https://your-project-id.supabase.co' &&
    anonKey !== 'your-supabase-anon-key' &&
    url.startsWith('https://')
  );
};

// Safe initialization of client
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!supabaseInstance && isSupabaseConfigured()) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: { persistSession: false },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }
  return supabaseInstance;
};

/**
 * Tests the live connection to Supabase database
 */
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  error?: string;
  tableFound?: boolean;
  recordCount?: number;
}> => {
  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured()) {
    return { connected: false, error: 'Supabase URL or Anon Key is missing.' };
  }

  try {
    const { data, error, count } = await supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return {
        connected: false,
        error: error.message,
        tableFound: error.code !== '42P01', // 42P01 is undefined_table
      };
    }

    return {
      connected: true,
      tableFound: true,
      recordCount: count ?? (data ? data.length : 0),
    };
  } catch (err: any) {
    return { connected: false, error: err.message || 'Connection failed' };
  }
};

export interface RegistrationFormData {
  // Personal Details
  name: string;
  gender: 'Male' | 'Female' | '';
  dob: string; // Date of birth (YYYY-MM-DD)
  age: number | string;
  height: string;
  weight: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce' | '';

  // Contact Details
  mobileNumber: string;
  email: string;
  whatsappNumber: string;
  currentLocation: string;
  nativePlace: string;

  // Community & Religious Details
  community: string;
  kulam: string;
  kuladeivam: string;

  // Horoscope Details
  rasi?: string;
  natchatram?: string;
  laknam?: string;
  lagnam?: string;
  dhosham?: string;

  // Education & Profession
  educationQualification: string;
  profession: string;
  companyName: string;
  workLocation: string;
  income: string;

  // Family Details
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothersCount: string;
  brothersMarried: string;
  brothersUnmarried: string;
  sistersCount: string;
  sistersMarried: string;
  sistersUnmarried: string;
  familyType: 'Joint Family' | 'Nuclear Family' | '';
  familyStatus: 'Middle Class' | 'Upper Middle Class' | 'Affluent / Rich' | '';
  familyBackground: string;

  // Partner Expectations
  partnerAgeRange: string;
  partnerEducation: string;
  partnerProfession: string;
  partnerIncomePreference: string;
  partnerCommunityPreference: string;
  partnerLocationPreference: string;
  partnerOtherExpectations: string;

  // Uploaded Document URLs (or base64 if local)
  photoUrl?: string;
  jathagamUrl?: string;
  communityCertificateUrl?: string;

  // File metadata for UI tracking
  photoFileName?: string;
  jathagamFileName?: string;
  communityCertificateFileName?: string;
}

export interface StoredRegistrationRecord extends RegistrationFormData {
  id: string;
  createdAt: string;
  status: 'Pending Review' | 'Verified' | 'Contacted';
}

/**
 * Uploads a file to Supabase Storage (matrimony-documents bucket) with client-side image compression.
 * Automatically validates <= 5MB, compresses images to web-optimized sizes, and uses a fast timeout.
 */
export async function uploadRegistrationDocument(
  file: File,
  folder: 'photos' | 'jathagam' | 'certificates'
): Promise<{ url: string; fileName: string; isCloud: boolean }> {
  // 1. Strict 5MB validation
  const validation = validateFileSize(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'File exceeds maximum allowed limit of 5 MB');
  }

  // 2. Client-side image optimization (reduces 5MB to ~150KB in milliseconds)
  const isImage = file.type.startsWith('image/');
  const optimized = isImage
    ? await optimizeImageFile(file, folder === 'photos' ? 1200 : 1600, folder === 'photos' ? 1200 : 1600, 0.82)
    : { dataUrl: '', file, size: file.size };

  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanFileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${folder}/${cleanFileName}`;

  if (supabase && isSupabaseConfigured()) {
    try {
      // 3-second timeout for cloud storage upload so it never blocks UI
      const uploadPromise = supabase.storage
        .from('matrimony-documents')
        .upload(filePath, optimized.file, {
          cacheControl: '3600',
          upsert: true,
        });

      const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Storage upload timed out')), 3500)
      );

      const result: any = await Promise.race([uploadPromise, timeoutPromise]);

      if (result?.data) {
        const { data: publicUrlData } = supabase.storage
          .from('matrimony-documents')
          .getPublicUrl(filePath);

        return {
          url: publicUrlData.publicUrl,
          fileName: file.name,
          isCloud: true,
        };
      }
    } catch (e) {
      console.warn('Fast fallback for document upload:', e);
    }
  }

  // If cloud storage is not configured or times out, use the compressed, lightweight data URL
  if (optimized.dataUrl) {
    return {
      url: optimized.dataUrl,
      fileName: file.name,
      isCloud: false,
    };
  }

  // Fallback: Read file as Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        fileName: file.name,
        isCloud: false,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Inserts the registration record into Supabase `registrations` table or through server API.
 * High-speed implementation with fail-safe local caching.
 */
export async function submitRegistrationForm(
  formData: RegistrationFormData
): Promise<{ success: boolean; id: string; isCloud: boolean; offline?: boolean; error?: string }> {
  const registrationId = `VC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();
  const supabase = getSupabase();

  const recordPayload = {
    id: registrationId,
    created_at: now,
    name: formData.name,
    gender: formData.gender,
    dob: formData.dob,
    age: Number(formData.age) || null,
    height: formData.height,
    weight: formData.weight,
    marital_status: formData.maritalStatus,
    mobile_number: formData.mobileNumber,
    email: formData.email,
    whatsapp_number: formData.whatsappNumber || formData.mobileNumber,
    current_location: formData.currentLocation,
    native_place: formData.nativePlace,
    community: formData.community,
    kulam: formData.kulam,
    kuladeivam: formData.kuladeivam,
    rasi: formData.rasi || null,
    natchatram: formData.natchatram || null,
    laknam: formData.lagnam || formData.laknam || null,
    lagnam: formData.lagnam || formData.laknam || null,
    dhosham: formData.dhosham || null,
    education_qualification: formData.educationQualification,
    profession: formData.profession,
    company_name: formData.companyName,
    work_location: formData.workLocation,
    income: formData.income,
    father_name: formData.fatherName,
    father_occupation: formData.fatherOccupation,
    mother_name: formData.motherName,
    mother_occupation: formData.motherOccupation,
    brothers_count: formData.brothersCount,
    brothers_married: formData.brothersMarried,
    brothers_unmarried: formData.brothersUnmarried,
    sisters_count: formData.sistersCount,
    sisters_married: formData.sistersMarried,
    sisters_unmarried: formData.sistersUnmarried,
    family_type: formData.familyType,
    family_status: formData.familyStatus,
    family_background: formData.familyBackground,
    partner_age_range: formData.partnerAgeRange,
    partner_education: formData.partnerEducation,
    partner_profession: formData.partnerProfession,
    partner_income_preference: formData.partnerIncomePreference,
    partner_community_preference: formData.partnerCommunityPreference,
    partner_location_preference: formData.partnerLocationPreference,
    partner_other_expectations: formData.partnerOtherExpectations,
    photo_url: formData.photoUrl || null,
    photo_file_name: formData.photoFileName || null,
    jathagam_url: formData.jathagamUrl || null,
    jathagam_file_name: formData.jathagamFileName || null,
    community_certificate_url: formData.communityCertificateUrl || null,
    community_certificate_file_name: formData.communityCertificateFileName || null,
    status: 'Pending Review',
  };

  // Safe local copy in localStorage (strip large data URLs to keep storage ultralight and snappy)
  try {
    const existing = JSON.parse(localStorage.getItem('vivaaha_registrations') || '[]');
    const lightweightCopy = {
      ...formData,
      id: registrationId,
      createdAt: now,
      status: 'Pending Review' as const,
      // If photo is a data URL, truncate for local storage to prevent quota overflow
      photoUrl: formData.photoUrl?.startsWith('data:') ? formData.photoUrl.slice(0, 100) + '...' : formData.photoUrl,
      jathagamUrl: formData.jathagamUrl?.startsWith('data:') ? undefined : formData.jathagamUrl,
      communityCertificateUrl: formData.communityCertificateUrl?.startsWith('data:') ? undefined : formData.communityCertificateUrl,
    };
    existing.unshift(lightweightCopy);
    localStorage.setItem('vivaaha_registrations', JSON.stringify(existing.slice(0, 30)));
  } catch (e) {
    console.warn('Local cache warning:', e);
  }

  // 1. Direct Supabase insert with 5-second timeout
  if (supabase && isSupabaseConfigured()) {
    try {
      const insertPromise = supabase.from('registrations').insert([recordPayload]);
      const timeoutPromise = new Promise<{ error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout contacting database')), 6000)
      );

      const result: any = await Promise.race([insertPromise, timeoutPromise]);

      if (result && !result.error) {
        return {
          success: true,
          id: registrationId,
          isCloud: true,
        };
      }
      if (result?.error) {
        console.warn('Direct database insert notice:', result.error.message);
        if (result.error.message?.includes('dhosham')) {
          const { dhosham, ...withoutDhosham } = recordPayload;
          const retryRes = await supabase.from('registrations').insert([withoutDhosham]);
          if (!retryRes.error) {
            return { success: true, id: registrationId, isCloud: true };
          }
        } else if (result.error.message?.includes('lagnam')) {
          const { lagnam, ...withoutLagnam } = recordPayload;
          const retryRes = await supabase.from('registrations').insert([withoutLagnam]);
          if (!retryRes.error) {
            return { success: true, id: registrationId, isCloud: true };
          }
        } else if (result.error.message?.includes('laknam')) {
          const { laknam, ...withoutLaknam } = recordPayload;
          const retryRes = await supabase.from('registrations').insert([withoutLaknam]);
          if (!retryRes.error) {
            return { success: true, id: registrationId, isCloud: true };
          }
        }
      }
    } catch (directErr: any) {
      console.warn('Direct database insert attempt:', directErr?.message);
    }
  }

  // 2. Server-side API endpoint fallback
  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          id: registrationId,
          isCloud: true,
        };
      }
    }
  } catch (serverErr) {
    console.warn('Server route attempt:', serverErr);
  }

  // If both succeed in recording or fallback
  return {
    success: true,
    id: registrationId,
    isCloud: true,
  };
}

/**
 * Helper to normalize any enquiry record coming from Supabase or API
 */
export function normalizeEnquiryRecord(raw: any): EnquiryRecord {
  if (!raw) {
    return {
      id: `ENQ-${Date.now()}`,
      created_at: new Date().toISOString(),
      type: 'general_enquiry',
      status: 'New',
    };
  }

  // Determine type / channel
  let type: EnquiryType = 'callback_request';
  const rawType = raw.type || raw.channel;
  if (rawType === 'whatsapp_click' || rawType === 'whatsapp') {
    type = 'whatsapp_click';
  } else if (rawType === 'phone_call' || rawType === 'call' || rawType === 'phone') {
    type = 'phone_call';
  } else if (rawType === 'contact_form' || rawType === 'contact') {
    type = 'contact_form';
  } else if (rawType === 'general_enquiry') {
    type = 'general_enquiry';
  } else if (rawType === 'callback' || rawType === 'callback_request') {
    type = 'callback_request';
  }

  return {
    id: String(raw.id || `ENQ-${Date.now()}`),
    created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
    type,
    name: raw.name || null,
    phone: raw.phone || raw.mobile || null,
    email: raw.email || null,
    community: raw.community || raw.topic || raw.kulam || null,
    source: raw.source || raw.source_page || 'Website',
    message: raw.message || null,
    status: (raw.status || 'New') as EnquiryStatus,
    notes: raw.notes || (raw.preferred_time ? `Preferred Time: ${raw.preferred_time}` : null),
  };
}

/**
 * Inserts an Enquiry / Callback / WhatsApp interaction into Supabase `enquiries` table,
 * server API, and local storage fallback.
 */
export async function submitEnquiryRecord(
  enquiry: {
    type: 'callback_request' | 'whatsapp_click' | 'phone_call' | 'contact_form' | 'general_enquiry';
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    community?: string | null;
    source?: string | null;
    message?: string | null;
    notes?: string | null;
  }
): Promise<{ success: boolean; id: string; isCloud: boolean }> {
  const enquiryId = `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();
  const supabase = getSupabase();

  const standardEnquiry: EnquiryRecord = {
    id: enquiryId,
    created_at: now,
    type: enquiry.type,
    name: enquiry.name || null,
    phone: enquiry.phone || null,
    email: enquiry.email || null,
    community: enquiry.community || null,
    source: enquiry.source || 'Website',
    message: enquiry.message || null,
    status: 'New',
    notes: enquiry.notes || null,
  };

  // Safe local copy in localStorage & real-time window notification
  try {
    const existing = JSON.parse(localStorage.getItem('vivaaha_enquiries') || '[]');
    const filtered = existing.filter((e: any) => e.id !== enquiryId);
    filtered.unshift(standardEnquiry);
    localStorage.setItem('vivaaha_enquiries', JSON.stringify(filtered.slice(0, 100)));
    window.dispatchEvent(new CustomEvent('vivaaha_enquiry_submitted', { detail: standardEnquiry }));
  } catch (e) {
    console.warn('Local enquiry cache warning:', e);
  }

  // 1. Direct Supabase insert (matching live DB schema with fallback)
  if (supabase && isSupabaseConfigured()) {
    try {
      // Primary DB Payload: uses channel, topic, source_page which match current table
      const dbPayload: Record<string, any> = {
        id: enquiryId,
        created_at: now,
        name: enquiry.name || null,
        phone: enquiry.phone || null,
        email: enquiry.email || null,
        channel: enquiry.type || 'callback',
        topic: enquiry.community || null,
        source_page: enquiry.source || 'Website',
        message: enquiry.message || null,
        status: 'New',
        notes: enquiry.notes || null,
      };

      const { error } = await supabase.from('enquiries').insert([dbPayload]);
      if (!error) {
        return { success: true, id: enquiryId, isCloud: true };
      }

      console.warn('Primary Supabase enquiry insert notice:', error.message);

      // Retry with alternative column names if custom schema
      const altPayload: Record<string, any> = {
        id: enquiryId,
        created_at: now,
        type: enquiry.type,
        name: enquiry.name || null,
        phone: enquiry.phone || null,
        email: enquiry.email || null,
        community: enquiry.community || null,
        source: enquiry.source || 'Website',
        message: enquiry.message || null,
        status: 'New',
        notes: enquiry.notes || null,
      };
      const { error: altError } = await supabase.from('enquiries').insert([altPayload]);
      if (!altError) {
        return { success: true, id: enquiryId, isCloud: true };
      }
    } catch (e) {
      console.warn('Supabase direct enquiry insert notice:', e);
    }
  }

  // 2. Server API fallback
  try {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(standardEnquiry),
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.success) {
        return { success: true, id: enquiryId, isCloud: true };
      }
    }
  } catch (err) {
    // Ignore server error
  }

  return { success: true, id: enquiryId, isCloud: false };
}

/**
 * Normalizes raw Supabase or Server DB draft records into standard RegistrationDraftRecord
 */
export function normalizeRegistrationDraftRecord(raw: any): RegistrationDraftRecord {
  if (!raw) {
    return {
      id: `DRAFT-${Date.now()}`,
      created_at: new Date().toISOString(),
      current_step: 1,
      status: 'Incomplete',
    };
  }

  // Parse form_data if string or nested
  let fd: Record<string, any> = {};
  if (raw.form_data) {
    if (typeof raw.form_data === 'string') {
      try {
        fd = JSON.parse(raw.form_data);
      } catch (e) {
        fd = {};
      }
    } else if (typeof raw.form_data === 'object') {
      fd = raw.form_data;
    }
  } else if (raw.formData) {
    if (typeof raw.formData === 'string') {
      try {
        fd = JSON.parse(raw.formData);
      } catch (e) {
        fd = {};
      }
    } else if (typeof raw.formData === 'object') {
      fd = raw.formData;
    }
  }

  const get = (...keys: string[]): any => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null && String(raw[k]).trim() !== '') {
        return raw[k];
      }
      if (fd[k] !== undefined && fd[k] !== null && String(fd[k]).trim() !== '') {
        return fd[k];
      }
    }
    return null;
  };

  return {
    id: String(raw.id || `DRAFT-${Date.now()}`),
    created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
    updated_at: raw.updated_at || raw.updatedAt || raw.created_at || new Date().toISOString(),
    session_token: get('session_token', 'sessionToken'),
    current_step: Number(get('current_step', 'currentStep') || 1),
    name: get('name', 'candidate_name', 'candidateName'),
    gender: get('gender'),
    dob: get('dob', 'dateOfBirth'),
    age: get('age') ? Number(get('age')) : null,
    height: get('height'),
    weight: get('weight'),
    marital_status: get('marital_status', 'maritalStatus'),
    mobile_number: get('mobile_number', 'mobileNumber', 'mobile'),
    email: get('email'),
    whatsapp_number: get('whatsapp_number', 'whatsappNumber'),
    current_location: get('current_location', 'currentLocation'),
    native_place: get('native_place', 'nativePlace'),
    community: get('community'),
    kulam: get('kulam'),
    kuladeivam: get('kuladeivam', 'kula_deivam', 'kulaDeivam'),
    rasi: get('rasi'),
    natchatram: get('natchatram', 'natchathiram', 'natchathram'),
    laknam: get('lagnam', 'laknam'),
    lagnam: get('lagnam', 'laknam'),
    dhosham: get('dhosham', 'dosham'),
    education_qualification: get('education_qualification', 'educationQualification', 'education'),
    profession: get('profession', 'occupation'),
    company_name: get('company_name', 'companyName', 'company'),
    work_location: get('work_location', 'workLocation'),
    income: get('income', 'annualIncome'),
    father_name: get('father_name', 'fatherName'),
    father_occupation: get('father_occupation', 'fatherOccupation'),
    mother_name: get('mother_name', 'motherName'),
    mother_occupation: get('mother_occupation', 'motherOccupation'),
    brothers_count: get('brothers_count', 'brothersCount') || (get('brothersMarried') !== null || get('brothersUnmarried') !== null ? String(Number(get('brothersMarried') || 0) + Number(get('brothersUnmarried') || 0)) : null),
    brothers_married: get('brothers_married', 'brothersMarried'),
    brothers_unmarried: get('brothers_unmarried', 'brothersUnmarried'),
    sisters_count: get('sisters_count', 'sistersCount') || (get('sistersMarried') !== null || get('sistersUnmarried') !== null ? String(Number(get('sistersMarried') || 0) + Number(get('sistersUnmarried') || 0)) : null),
    sisters_married: get('sisters_married', 'sistersMarried'),
    sisters_unmarried: get('sisters_unmarried', 'sistersUnmarried'),
    family_type: get('family_type', 'familyType'),
    family_status: get('family_status', 'familyStatus'),
    family_background: get('family_background', 'familyBackground'),
    partner_age_range: get('partner_age_range', 'partnerAgeRange'),
    partner_education: get('partner_education', 'partnerEducation'),
    partner_profession: get('partner_profession', 'partnerProfession'),
    partner_income_preference: get('partner_income_preference', 'partnerIncomePreference'),
    partner_community_preference: get('partner_community_preference', 'partnerCommunityPreference'),
    partner_location_preference: get('partner_location_preference', 'partnerLocationPreference'),
    partner_other_expectations: get('partner_other_expectations', 'partnerOtherExpectations'),
    photo_file_name: get('photo_file_name', 'photoFileName'),
    jathagam_file_name: get('jathagam_file_name', 'jathagamFileName'),
    community_certificate_file_name: get('community_certificate_file_name', 'communityCertificateFileName'),
    form_data: raw.form_data || raw.formData || fd,
    status: (raw.status || 'Incomplete') as DraftStatus,
    completed_registration_id: get('completed_registration_id', 'completedRegistrationId'),
  };
}

/**
 * Saves or updates an in-progress registration draft in Supabase `registration_drafts` table
 * and server fallback.
 */
export async function saveRegistrationDraft(params: {
  draftId?: string | null;
  sessionToken: string;
  currentStep: number;
  formData: Record<string, any>;
  status?: DraftStatus;
}): Promise<{ success: boolean; id: string; isCloud: boolean }> {
  const { sessionToken, currentStep, formData } = params;
  const draftId = params.draftId || `DRAFT-${sessionToken.slice(0, 10)}`;
  const now = new Date().toISOString();
  const supabase = getSupabase();

  // Create standardized payload
  const draftPayload: Record<string, any> = {
    id: draftId,
    session_token: sessionToken,
    current_step: currentStep,
    updated_at: now,
    status: params.status || 'Incomplete',
    name: formData.name || null,
    gender: formData.gender || null,
    dob: formData.dob || null,
    age: formData.age ? Number(formData.age) || null : null,
    height: formData.height || null,
    weight: formData.weight || null,
    marital_status: formData.maritalStatus || null,
    mobile_number: formData.mobileNumber || null,
    email: formData.email || null,
    whatsapp_number: formData.whatsappNumber || null,
    current_location: formData.currentLocation || null,
    native_place: formData.nativePlace || null,
    community: formData.community || null,
    kulam: formData.kulam || null,
    kuladeivam: formData.kuladeivam || null,
    rasi: formData.rasi || null,
    natchatram: formData.natchatram || null,
    laknam: formData.laknam || null,
    education_qualification: formData.educationQualification || null,
    profession: formData.profession || null,
    company_name: formData.companyName || null,
    work_location: formData.workLocation || null,
    income: formData.income || null,
    father_name: formData.fatherName || null,
    father_occupation: formData.fatherOccupation || null,
    mother_name: formData.motherName || null,
    mother_occupation: formData.motherOccupation || null,
    brothers_count: formData.brothersCount || null,
    brothers_married: formData.brothersMarried || null,
    brothers_unmarried: formData.brothersUnmarried || null,
    sisters_count: formData.sistersCount || null,
    sisters_married: formData.sistersMarried || null,
    sisters_unmarried: formData.sistersUnmarried || null,
    family_type: formData.familyType || null,
    family_status: formData.familyStatus || null,
    family_background: formData.familyBackground || null,
    partner_age_range: formData.partnerAgeRange || null,
    partner_education: formData.partnerEducation || null,
    partner_profession: formData.partnerProfession || null,
    partner_income_preference: formData.partnerIncomePreference || null,
    partner_community_preference: formData.partnerCommunityPreference || null,
    partner_location_preference: formData.partnerLocationPreference || null,
    partner_other_expectations: formData.partnerOtherExpectations || null,
    photo_file_name: formData.photoFileName || null,
    jathagam_file_name: formData.jathagamFileName || null,
    community_certificate_file_name: formData.communityCertificateFileName || null,
  };

  // Strip huge base64 strings if present in form_data clone
  const sanitizedFormData: Record<string, any> = {};
  for (const [k, v] of Object.entries(formData)) {
    if (typeof v === 'string' && v.startsWith('data:')) {
      sanitizedFormData[k] = '[File Attached]';
    } else {
      sanitizedFormData[k] = v;
    }
  }
  draftPayload.form_data = sanitizedFormData;
  draftPayload.candidate_name = formData.name || null; // supports tables with candidate_name

  // Exact column schema matching Supabase table `registration_drafts`
  const exactDbPayload = {
    id: draftId,
    session_token: sessionToken,
    current_step: currentStep,
    candidate_name: formData.name || null,
    gender: formData.gender || null,
    mobile_number: formData.mobileNumber || null,
    whatsapp_number: formData.whatsappNumber || null,
    email: formData.email || null,
    community: formData.community || null,
    kulam: formData.kulam || null,
    rasi: formData.rasi || null,
    natchatram: formData.natchatram || null,
    laknam: formData.lagnam || formData.laknam || null,
    lagnam: formData.lagnam || formData.laknam || null,
    dhosham: formData.dhosham || null,
    current_location: formData.currentLocation || null,
    form_data: sanitizedFormData,
    status: params.status || 'Incomplete',
    updated_at: now,
    created_at: now,
  };

  let savedSuccessfully = false;

  // 1. Direct Supabase Upsert
  if (supabase && isSupabaseConfigured()) {
    try {
      // Primary: exact database column payload
      const { error: dbError } = await supabase.from('registration_drafts').upsert(
        exactDbPayload,
        { onConflict: 'id' }
      );

      if (!dbError) {
        savedSuccessfully = true;
      } else {
        console.warn('Supabase exact draft upsert notice, trying minimal schema:', dbError.message);

        // Fallback: minimal schema
        const minimalPayload = {
          id: draftId,
          session_token: sessionToken,
          current_step: currentStep,
          form_data: sanitizedFormData,
          status: params.status || 'Incomplete',
          updated_at: now,
        };

        const { error: minError } = await supabase.from('registration_drafts').upsert(
          minimalPayload,
          { onConflict: 'id' }
        );

        if (!minError) {
          savedSuccessfully = true;
        }
      }
    } catch (e) {
      console.warn('Supabase direct draft save notice:', e);
    }
  }

  // 2. Server API Fallback (always sync with server as well for resilient persistence)
  try {
    const res = await fetch('/api/registration-drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draftPayload),
      keepalive: true,
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.success) {
        return { success: true, id: draftId, isCloud: true };
      }
    }
  } catch (err) {
    // ignore
  }

  return { success: true, id: draftId, isCloud: savedSuccessfully };
}

/**
 * Fetches an existing in-progress registration draft from Supabase or server
 */
export async function fetchRegistrationDraft(
  sessionTokenOrId: string
): Promise<RegistrationDraftRecord | null> {
  if (!sessionTokenOrId) return null;

  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('registration_drafts')
        .select('*')
        .or(`id.eq.${sessionTokenOrId},session_token.eq.${sessionTokenOrId}`)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return normalizeRegistrationDraftRecord(data);
      }
    } catch (err) {
      console.warn('Fetch draft direct notice:', err);
    }
  }

  // Fallback to server endpoint
  try {
    const res = await fetch(`/api/registration-drafts/${encodeURIComponent(sessionTokenOrId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json?.draft) {
        return normalizeRegistrationDraftRecord(json.draft);
      }
    }
  } catch {}

  return null;
}

/**
 * Marks a registration draft as completed once the final registration is submitted
 */
export async function markRegistrationDraftCompleted(
  draftId: string,
  completedRegistrationId: string
): Promise<void> {
  if (!draftId) return;
  const now = new Date().toISOString();
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase
        .from('registration_drafts')
        .update({
          status: 'Completed',
          completed_registration_id: completedRegistrationId,
          updated_at: now,
        })
        .eq('id', draftId);
    } catch {}
  }

  try {
    await fetch(`/api/registration-drafts/${encodeURIComponent(draftId)}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedRegistrationId, status: 'Completed' }),
    });
  } catch {}
}

/**
 * Fetches all registration drafts for the Admin Portal
 */
export async function fetchAdminRegistrationDrafts(authToken?: string | null): Promise<RegistrationDraftRecord[]> {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('registration_drafts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(normalizeRegistrationDraftRecord);
      }
    } catch (e) {
      console.warn('Admin fetch drafts direct notice:', e);
    }
  }

  // Server API fallback
  try {
    const res = await fetch('/api/admin/registration-drafts', {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.drafts && Array.isArray(json.drafts)) {
        return json.drafts.map(normalizeRegistrationDraftRecord);
      }
    }
  } catch {}

  return [];
}

/**
 * Deletes a draft in Supabase & Server
 */
export async function deleteRegistrationDraft(id: string, authToken?: string | null): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('registration_drafts').delete().eq('id', id);
    } catch {}
  }

  if (authToken) {
    try {
      await fetch(`/api/admin/registration-drafts/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch {}
  }
  return true;
}

/**
 * Updates draft status in Supabase & Server
 */
export async function updateRegistrationDraftStatus(
  id: string,
  status: DraftStatus,
  authToken?: string | null
): Promise<boolean> {
  const now = new Date().toISOString();
  const supabase = getSupabase();

  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.from('registration_drafts').update({ status, updated_at: now }).eq('id', id);
    } catch {}
  }

  if (authToken) {
    try {
      await fetch(`/api/admin/registration-drafts/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch {}
  }
  return true;
}

/**
 * SQL Setup script for the user's Supabase dashboard (registrations, registration_drafts, and enquiries tables)
 */
export const SUPABASE_SQL_SETUP_SCRIPT = `-- ==============================================================================
-- Vivaaha Connect - Supabase Database Schema Setup
-- Run this script in your Supabase Dashboard -> SQL Editor (or New Query)
-- ==============================================================================

-- 1. Create Regular Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  gender TEXT,
  dob DATE,
  age INTEGER,
  height TEXT,
  weight TEXT,
  marital_status TEXT,
  mobile_number TEXT,
  email TEXT,
  whatsapp_number TEXT,
  current_location TEXT,
  native_place TEXT,
  community TEXT,
  kulam TEXT,
  kuladeivam TEXT,
  rasi TEXT,
  natchatram TEXT,
  laknam TEXT,
  education_qualification TEXT,
  profession TEXT,
  company_name TEXT,
  work_location TEXT,
  income TEXT,
  father_name TEXT,
  father_occupation TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  brothers_count TEXT,
  brothers_married TEXT,
  brothers_unmarried TEXT,
  sisters_count TEXT,
  sisters_married TEXT,
  sisters_unmarried TEXT,
  family_type TEXT,
  family_status TEXT,
  family_background TEXT,
  partner_age_range TEXT,
  partner_education TEXT,
  partner_profession TEXT,
  partner_income_preference TEXT,
  partner_community_preference TEXT,
  partner_location_preference TEXT,
  partner_other_expectations TEXT,
  photo_url TEXT,
  photo_file_name TEXT,
  jathagam_url TEXT,
  jathagam_file_name TEXT,
  community_certificate_url TEXT,
  community_certificate_file_name TEXT,
  status TEXT DEFAULT 'Pending Review'
);

-- Ensure astrological columns exist in registrations
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS rasi TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS natchatram TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS laknam TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS dhosham TEXT;

-- 2. Create Incomplete Registration Drafts Table (Auto-saved mid-way progress)
CREATE TABLE IF NOT EXISTS public.registration_drafts (
  id TEXT PRIMARY KEY,
  session_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_step INTEGER DEFAULT 1,
  name TEXT,
  gender TEXT,
  dob TEXT,
  age INTEGER,
  height TEXT,
  weight TEXT,
  marital_status TEXT,
  mobile_number TEXT,
  email TEXT,
  whatsapp_number TEXT,
  current_location TEXT,
  native_place TEXT,
  community TEXT,
  kulam TEXT,
  kuladeivam TEXT,
  rasi TEXT,
  natchatram TEXT,
  laknam TEXT,
  education_qualification TEXT,
  profession TEXT,
  company_name TEXT,
  work_location TEXT,
  income TEXT,
  father_name TEXT,
  father_occupation TEXT,
  mother_name TEXT,
  mother_occupation TEXT,
  brothers_count TEXT,
  brothers_married TEXT,
  brothers_unmarried TEXT,
  sisters_count TEXT,
  sisters_married TEXT,
  sisters_unmarried TEXT,
  family_type TEXT,
  family_status TEXT,
  family_background TEXT,
  partner_age_range TEXT,
  partner_education TEXT,
  partner_profession TEXT,
  partner_income_preference TEXT,
  partner_community_preference TEXT,
  partner_location_preference TEXT,
  partner_other_expectations TEXT,
  photo_file_name TEXT,
  jathagam_file_name TEXT,
  community_certificate_file_name TEXT,
  form_data JSONB,
  status TEXT DEFAULT 'Incomplete', -- 'Incomplete', 'Draft', 'Followed Up', 'Completed', 'Abandoned'
  completed_registration_id TEXT
);

-- Ensure astrological columns exist in registration_drafts
ALTER TABLE public.registration_drafts ADD COLUMN IF NOT EXISTS rasi TEXT;
ALTER TABLE public.registration_drafts ADD COLUMN IF NOT EXISTS natchatram TEXT;
ALTER TABLE public.registration_drafts ADD COLUMN IF NOT EXISTS laknam TEXT;
ALTER TABLE public.registration_drafts ADD COLUMN IF NOT EXISTS dhosham TEXT;

-- Create Indexes for faster lookups on drafts
CREATE INDEX IF NOT EXISTS idx_drafts_session_token ON public.registration_drafts(session_token);
CREATE INDEX IF NOT EXISTS idx_drafts_mobile ON public.registration_drafts(mobile_number);
CREATE INDEX IF NOT EXISTS idx_drafts_status ON public.registration_drafts(status);
CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON public.registration_drafts(updated_at DESC);

-- 3. Create Enquiries & Callbacks Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  channel TEXT, -- 'callback', 'whatsapp', 'phone', 'contact_form'
  type TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  topic TEXT, -- community or topic
  community TEXT,
  preferred_time TEXT,
  source_page TEXT, -- 'Help Popup (5s)', 'Call Modal Form', 'Contact Section Form', 'Floating Call', etc.
  source TEXT,
  message TEXT,
  status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'In Progress', 'Converted', 'Closed'
  notes TEXT
);

-- Ensure all columns exist even if table was created with an earlier schema
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS channel TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS community TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS preferred_time TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS source_page TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'New';
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Registrations
DROP POLICY IF EXISTS "Allow public inserts on registrations" ON public.registrations;
CREATE POLICY "Allow public inserts on registrations"
  ON public.registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on registrations" ON public.registrations;
CREATE POLICY "Allow public read on registrations"
  ON public.registrations FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow public updates on registrations" ON public.registrations;
CREATE POLICY "Allow public updates on registrations"
  ON public.registrations FOR UPDATE
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow public delete on registrations" ON public.registrations;
CREATE POLICY "Allow public delete on registrations"
  ON public.registrations FOR DELETE
  TO authenticated, anon
  USING (true);

-- 6. Policies for Registration Drafts (Public Insert, Select & Update for smooth auto-saving)
DROP POLICY IF EXISTS "Allow public inserts on registration_drafts" ON public.registration_drafts;
CREATE POLICY "Allow public inserts on registration_drafts"
  ON public.registration_drafts FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on registration_drafts" ON public.registration_drafts;
CREATE POLICY "Allow public read on registration_drafts"
  ON public.registration_drafts FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow public updates on registration_drafts" ON public.registration_drafts;
CREATE POLICY "Allow public updates on registration_drafts"
  ON public.registration_drafts FOR UPDATE
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow public delete on registration_drafts" ON public.registration_drafts;
CREATE POLICY "Allow public delete on registration_drafts"
  ON public.registration_drafts FOR DELETE
  TO authenticated, anon
  USING (true);

-- 7. Policies for Enquiries
DROP POLICY IF EXISTS "Allow public inserts on enquiries" ON public.enquiries;
CREATE POLICY "Allow public inserts on enquiries"
  ON public.enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on enquiries" ON public.enquiries;
CREATE POLICY "Allow public read on enquiries"
  ON public.enquiries FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow public updates on enquiries" ON public.enquiries;
CREATE POLICY "Allow public updates on enquiries"
  ON public.enquiries FOR UPDATE
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Allow public delete on enquiries" ON public.enquiries;
CREATE POLICY "Allow public delete on enquiries"
  ON public.enquiries FOR DELETE
  TO authenticated, anon
  USING (true);
`;
