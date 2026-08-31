import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-supabase-anon-key' &&
    supabaseUrl.startsWith('https://')
  );
};

// Safe initialization of client
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseInstance && isSupabaseConfigured()) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }
  return supabaseInstance;
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
 * Uploads a file to Supabase Storage (matrimony-documents bucket).
 * If Supabase is not configured, converts to a Base64 data URL for local storage.
 */
export async function uploadRegistrationDocument(
  file: File,
  folder: 'photos' | 'jathagam' | 'certificates'
): Promise<{ url: string; fileName: string; isCloud: boolean }> {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop() || 'dat';
  const cleanFileName = `${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${folder}/${cleanFileName}`;

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.storage
        .from('matrimony-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.warn('Supabase storage upload error, falling back to local encoding:', error.message);
      } else if (data) {
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
      console.warn('Error during Supabase upload:', e);
    }
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
 * Inserts the registration record into Supabase `registrations` table.
 * If Supabase is not connected, gracefully saves to browser localStorage and returns the saved object.
 */
export async function submitRegistrationForm(
  formData: RegistrationFormData
): Promise<{ success: boolean; id: string; isCloud: boolean; error?: string }> {
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

  // Always save a local copy in localStorage for backup & demo preview
  try {
    const existing = JSON.parse(localStorage.getItem('vivaaha_registrations') || '[]');
    existing.unshift({
      ...formData,
      id: registrationId,
      createdAt: now,
      status: 'Pending Review',
    });
    localStorage.setItem('vivaaha_registrations', JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to cache registration in localStorage:', e);
  }

  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('registrations').insert([recordPayload]);

      if (error) {
        console.error('Supabase insert error:', error);
        return {
          success: true,
          id: registrationId,
          isCloud: false,
          error: `Saved locally. (Supabase notice: ${error.message})`,
        };
      }

      return {
        success: true,
        id: registrationId,
        isCloud: true,
      };
    } catch (err: any) {
      console.error('Supabase submission failed:', err);
      return {
        success: true,
        id: registrationId,
        isCloud: false,
        error: err.message || 'Saved to offline cache.',
      };
    }
  }

  // Demo / local mode
  return {
    success: true,
    id: registrationId,
    isCloud: false,
  };
}

/**
 * SQL Setup script for the user's Supabase dashboard
 */
export const SUPABASE_SQL_SETUP_SCRIPT = `-- ==============================================================================
-- Vivaaha Connect - Supabase Database Schema Setup
-- Run this script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Create Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE,
  age INTEGER,
  height TEXT,
  weight TEXT,
  marital_status TEXT,
  mobile_number TEXT NOT NULL,
  email TEXT,
  whatsapp_number TEXT,
  current_location TEXT,
  native_place TEXT,
  community TEXT,
  kulam TEXT,
  kuladeivam TEXT,
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public anonymous users to insert new matrimony registrations
CREATE POLICY "Allow public inserts on registrations"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Policy: Allow reading registrations
CREATE POLICY "Allow public read on registrations"
  ON public.registrations
  FOR SELECT
  TO authenticated, anon
  USING (true);
`;
