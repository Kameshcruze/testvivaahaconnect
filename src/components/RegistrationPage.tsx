import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Heart,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  DollarSign,
  Home,
  FileCheck,
  Send,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Download,
  Trash2,
} from 'lucide-react';
import {
  RegistrationFormData,
  submitRegistrationForm,
  uploadRegistrationDocument,
} from '../lib/supabase';
import { PHONE_NUMBER, PHONE_RAW } from '../types';
import logoImg from '../assets/images/Logo1.PNG';

interface RegistrationPageProps {
  onBackToHome: () => void;
  onOpenCallModal: () => void;
}

const INITIAL_FORM_DATA: RegistrationFormData = {
  name: '',
  gender: '',
  dob: '',
  age: '',
  height: '',
  weight: '',
  maritalStatus: 'Never Married',

  mobileNumber: '',
  email: '',
  whatsappNumber: '',
  currentLocation: '',
  nativePlace: '',

  community: '',
  kulam: '',
  kuladeivam: '',

  educationQualification: '',
  profession: '',
  companyName: '',
  workLocation: '',
  income: '',

  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  brothersCount: '0',
  brothersMarried: '0',
  brothersUnmarried: '0',
  sistersCount: '0',
  sistersMarried: '0',
  sistersUnmarried: '0',
  familyType: 'Nuclear Family',
  familyStatus: 'Middle Class',
  familyBackground: '',

  partnerAgeRange: '',
  partnerEducation: '',
  partnerProfession: '',
  partnerIncomePreference: '',
  partnerCommunityPreference: '',
  partnerLocationPreference: '',
  partnerOtherExpectations: '',
};

export default function RegistrationPage({ onBackToHome, onOpenCallModal }: RegistrationPageProps) {
  const [formData, setFormData] = useState<RegistrationFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccessId, setSubmitSuccessId] = useState<string | null>(null);
  const [submissionIsCloud, setSubmissionIsCloud] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sameAsMobile, setSameAsMobile] = useState<boolean>(false);

  // File states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [jathagamFile, setJathagamFile] = useState<File | null>(null);
  const [communityCertFile, setCommunityCertFile] = useState<File | null>(null);

  // File upload progress states
  const [uploadingStatus, setUploadingStatus] = useState<string>('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const jathagamInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  // Auto calculate age from DOB
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    let calculatedAge: string | number = '';
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age > 0 && age < 100) {
        calculatedAge = age;
      }
    }
    setFormData((prev) => ({
      ...prev,
      dob: dobValue,
      age: calculatedAge,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'mobileNumber' && sameAsMobile) {
        updated.whatsappNumber = value;
      }
      return updated;
    });
  };

  const handleSameAsMobileToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsMobile(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        whatsappNumber: prev.mobileNumber,
      }));
    }
  };

  // Photo change handler
  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Step navigation validations: ONLY candidate name is mandatory
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setErrorMessage('Please enter candidate full name.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Comprehensive validation across all steps: only name is mandatory
  const validateAllSteps = (): boolean => {
    if (!formData.name.trim()) {
      setCurrentStep(1);
      setErrorMessage('Please enter candidate full name.');
      return false;
    }
    return true;
  };

  // Final Form submission triggered ONLY on Step 5
  const handleFinalSubmit = async () => {
    if (!validateAllSteps()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const finalData: RegistrationFormData = { ...formData };

      // Upload Photo if present
      if (photoFile) {
        setUploadingStatus('Uploading profile photograph...');
        const photoResult = await uploadRegistrationDocument(photoFile, 'photos');
        finalData.photoUrl = photoResult.url;
        finalData.photoFileName = photoResult.fileName;
      }

      // Upload Jathagam if present
      if (jathagamFile) {
        setUploadingStatus('Uploading horoscope (Jathagam) document...');
        const jathagamResult = await uploadRegistrationDocument(jathagamFile, 'jathagam');
        finalData.jathagamUrl = jathagamResult.url;
        finalData.jathagamFileName = jathagamResult.fileName;
      }

      // Upload Community Certificate if present
      if (communityCertFile) {
        setUploadingStatus('Uploading community certificate...');
        const certResult = await uploadRegistrationDocument(communityCertFile, 'certificates');
        finalData.communityCertificateUrl = certResult.url;
        finalData.communityCertificateFileName = certResult.fileName;
      }

      setUploadingStatus('Saving profile to database...');
      const response = await submitRegistrationForm(finalData);

      if (response.success) {
        setSubmitSuccessId(response.id);
        setSubmissionIsCloud(response.isCloud);
      } else {
        setErrorMessage(response.error || 'Failed to submit registration. Please check database connection.');
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
      setUploadingStatus('');
    }
  };

  const steps = [
    { id: 1, title: 'Personal Details', icon: User },
    { id: 2, title: 'Contact & Community', icon: MapPin },
    { id: 3, title: 'Career & Family', icon: Briefcase },
    { id: 4, title: 'Partner Expectations', icon: Heart },
    { id: 5, title: 'Photos & Documents', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#222222] pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar with Logo & Navigation */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#C89B63]/25">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[#C89B63]/40 text-[#6A1E2C] text-xs font-bold shadow-sm hover:bg-[#6A1E2C] hover:text-white transition group"
            >
              <ArrowLeft className="w-4 h-4 text-[#C89B63] group-hover:text-white transition-colors" />
              <span>Back to Home</span>
            </button>

            <img
              src={logoImg}
              alt="Vivaaha Connect"
              className="h-10 w-auto object-contain hidden sm:block"
            />
          </div>
        </div>

        {/* Header Title Banner */}
        {!submitSuccessId && (
          <div className="text-center mb-8 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6A1E2C]/10 text-[#6A1E2C] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C89B63]" /> Matrimony Registration Form
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-[#6A1E2C]">
              Candidate Profile Registration
            </h1>
            <p className="text-xs sm:text-sm text-[#222222]/75 max-w-xl mx-auto">
              Please enter accurate candidate details and family preferences. All submitted information is kept strictly confidential and shared only with verified prospective matches.
            </p>
          </div>
        )}

        {/* Success Confirmation View */}
        {submitSuccessId ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-[#C89B63]/40 p-6 sm:p-10 shadow-xl space-y-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#6A1E2C]">
                Registration Submitted Successfully!
              </h2>
              <p className="text-sm text-[#222222]/80 max-w-md mx-auto">
                Thank you for registering with Vivaaha Connect. Your profile is recorded and our matrimony team will review and contact you shortly.
              </p>
            </div>

            {/* Registration Summary Card */}
            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 max-w-lg mx-auto text-left space-y-3">
              <div className="flex items-center justify-between border-b border-[#C89B63]/20 pb-2.5">
                <span className="text-xs text-[#222222]/70 font-medium">Registration ID:</span>
                <span className="text-sm font-mono font-bold text-[#6A1E2C]">{submitSuccessId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#222222]/60">Candidate Name:</span>
                  <p className="font-bold text-[#222222]">{formData.name}</p>
                </div>
                <div>
                  <span className="text-[#222222]/60">Gender / Age:</span>
                  <p className="font-bold text-[#222222]">{formData.gender} ({formData.age} Yrs)</p>
                </div>
                <div>
                  <span className="text-[#222222]/60">Community:</span>
                  <p className="font-bold text-[#222222]">{formData.community || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[#222222]/60">Mobile Number:</span>
                  <p className="font-bold text-[#222222]">{formData.mobileNumber}</p>
                </div>
                <div>
                  <span className="text-[#222222]/60">Location:</span>
                  <p className="font-bold text-[#222222]">{formData.currentLocation}</p>
                </div>
                <div>
                  <span className="text-[#222222]/60">Database Storage:</span>
                  <p className="font-bold text-emerald-700">
                    {submissionIsCloud ? '✓ Supabase Cloud' : '✓ Saved to System'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href={`https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(
                  `Hello Vivaaha Connect! I have just registered my matrimony profile. Candidate Name: ${formData.name}, Reg ID: ${submitSuccessId}. Please assist with verification.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm shadow-md hover:bg-[#20bd5a] transition"
              >
                <Send className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>

              <button
                onClick={onBackToHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6A1E2C] text-white font-bold text-sm shadow-md hover:bg-[#8C283B] transition"
              >
                <span>Return to Home Page</span>
                <ArrowRight className="w-4 h-4 text-[#C89B63]" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Multi-step Registration Form */
          <div className="bg-white rounded-3xl border border-[#C89B63]/30 shadow-xl overflow-hidden">
            {/* Step Progress Bar Header */}
            <div className="bg-[#FAF3EB] p-4 sm:p-5 border-b border-[#C89B63]/20">
              <div className="grid grid-cols-5 gap-2">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        if (step.id <= currentStep) {
                          setCurrentStep(step.id);
                          setErrorMessage(null);
                        } else {
                          if (validateStep(currentStep)) {
                            setCurrentStep(step.id);
                          }
                        }
                      }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition text-center cursor-pointer ${
                        isActive
                          ? 'bg-[#6A1E2C] text-white shadow-md'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'text-[#222222]/70 hover:bg-white/80 hover:text-[#6A1E2C]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? 'bg-[#C89B63] text-[#2D0A11]'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold line-clamp-1">
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="m-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Steps */}
            <form onSubmit={(e) => e.preventDefault()} className="p-6 sm:p-8 space-y-6">
              {/* STEP 1: Personal Details */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#C89B63]/20 pb-3">
                    <h3 className="text-lg font-bold font-heading text-[#6A1E2C] flex items-center gap-2">
                      <User className="w-5 h-5 text-[#C89B63]" /> 1. Personal & Physical Details
                    </h3>
                    <p className="text-xs text-[#222222]/70">
                      Basic candidate identity and horoscope birth details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Candidate Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter bride or groom's full name"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Gender (Male / Female checkboxes / radio) */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Gender (Profile For)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label
                          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border cursor-pointer transition text-sm font-bold ${
                            formData.gender === 'Female'
                              ? 'bg-[#6A1E2C] text-white border-[#6A1E2C] shadow-md'
                              : 'bg-white border-[#C89B63]/40 text-[#6A1E2C] hover:bg-[#FAF3EB]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === 'Female'}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <span>Bride (Female / பெண்)</span>
                        </label>

                        <label
                          className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border cursor-pointer transition text-sm font-bold ${
                            formData.gender === 'Male'
                              ? 'bg-[#6A1E2C] text-white border-[#6A1E2C] shadow-md'
                              : 'bg-white border-[#C89B63]/40 text-[#6A1E2C] hover:bg-[#FAF3EB]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === 'Male'}
                            onChange={handleInputChange}
                            className="hidden"
                          />
                          <span>Groom (Male / ஆண்)</span>
                        </label>
                      </div>
                    </div>

                    {/* Date of Birth with Calendar */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Date of Birth (Calendar)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleDobChange}
                          className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        name="age"
                        min="18"
                        max="80"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Auto-calculated or enter age"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Height
                      </label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="e.g. 5 ft 6 in / 168 cm"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Weight
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g. 62 kg"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Marital Status */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Marital Status
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      >
                        <option value="Never Married">Never Married (Unmarried)</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                        <option value="Awaiting Divorce">Awaiting Divorce</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Contact, Location & Community Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#C89B63]/20 pb-3">
                    <h3 className="text-lg font-bold font-heading text-[#6A1E2C] flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#C89B63]" /> 2. Contact & Community Details
                    </h3>
                    <p className="text-xs text-[#222222]/70">
                      Reachability and ancestral cultural background.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider">
                          WhatsApp Number
                        </label>
                        <label className="text-[11px] text-[#6A1E2C] font-semibold flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={sameAsMobile}
                            onChange={handleSameAsMobileToggle}
                            className="rounded text-[#6A1E2C]"
                          />
                          Same as Mobile
                        </label>
                      </div>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleInputChange}
                        placeholder="WhatsApp contact number"
                        disabled={sameAsMobile}
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm disabled:opacity-75"
                      />
                    </div>

                    {/* Email ID */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. candidate@example.com"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Current Location */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Current Location (City / State)
                      </label>
                      <input
                        type="text"
                        name="currentLocation"
                        value={formData.currentLocation}
                        onChange={handleInputChange}
                        placeholder="e.g. Coimbatore, Chennai, Bangalore"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Native Place */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Native Place (District / Village)
                      </label>
                      <input
                        type="text"
                        name="nativePlace"
                        value={formData.nativePlace}
                        onChange={handleInputChange}
                        placeholder="e.g. Karur, Madurai, Erode"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Community / Caste */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Community / Caste
                      </label>
                      <input
                        type="text"
                        name="community"
                        value={formData.community}
                        onChange={handleInputChange}
                        placeholder="e.g. Kongu Vellalar, Mudaliar, Chettiar, Nadar, etc."
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Kulam / Gotram */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Kulam / Gotram
                      </label>
                      <input
                        type="text"
                        name="kulam"
                        value={formData.kulam}
                        onChange={handleInputChange}
                        placeholder="e.g. Sempoothan, Kannan, Bharadwaja"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Kuladeivam */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Kuladeivam & Temple Location
                      </label>
                      <input
                        type="text"
                        name="kuladeivam"
                        value={formData.kuladeivam}
                        onChange={handleInputChange}
                        placeholder="e.g. Angala Parameswari, Kodumudi, etc."
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Education, Profession & Family Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#C89B63]/20 pb-3">
                    <h3 className="text-lg font-bold font-heading text-[#6A1E2C] flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-[#C89B63]" /> 3. Education, Career & Family
                    </h3>
                    <p className="text-xs text-[#222222]/70">
                      Professional qualifications, income, and parental details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Education Qualification */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Education Qualification
                      </label>
                      <input
                        type="text"
                        name="educationQualification"
                        value={formData.educationQualification}
                        onChange={handleInputChange}
                        placeholder="e.g. B.Tech / MBA / MBBS / Chartered Accountant"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Profession */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Profession / Job Title
                      </label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Software Engineer / Doctor / Business Owner"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Company / Business Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Company / Business Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g. TCS / Self-employed / Own Enterprise"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Work Location */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Work Location
                      </label>
                      <input
                        type="text"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleInputChange}
                        placeholder="e.g. Chennai, Bangalore, Abroad (USA/UK/Dubai)"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Monthly / Annual Income */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Monthly / Annual Income
                      </label>
                      <input
                        type="text"
                        name="income"
                        value={formData.income}
                        onChange={handleInputChange}
                        placeholder="e.g. 12 LPA / ₹1,00,000 per month"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Father Name & Occupation */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Father's Name
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        placeholder="Father's full name"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Father's Occupation
                      </label>
                      <input
                        type="text"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleInputChange}
                        placeholder="e.g. Business / Retired Govt Official / Agriculture"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Mother Name & Occupation */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Mother's Name
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        placeholder="Mother's full name"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Mother's Occupation
                      </label>
                      <input
                        type="text"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleInputChange}
                        placeholder="e.g. Homemaker / Teacher / Govt Officer"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Siblings */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Brother(s) (Married / Unmarried)
                      </label>
                      <input
                        type="text"
                        name="brothersCount"
                        value={formData.brothersCount}
                        onChange={handleInputChange}
                        placeholder="e.g. 1 Elder brother (Married), 1 Younger (Unmarried)"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Sister(s) (Married / Unmarried)
                      </label>
                      <input
                        type="text"
                        name="sistersCount"
                        value={formData.sistersCount}
                        onChange={handleInputChange}
                        placeholder="e.g. 1 Younger sister (Unmarried) or None"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Family Type & Family Status */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Family Type
                      </label>
                      <select
                        name="familyType"
                        value={formData.familyType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      >
                        <option value="Nuclear Family">Nuclear Family</option>
                        <option value="Joint Family">Joint Family</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Family Status
                      </label>
                      <select
                        name="familyStatus"
                        value={formData.familyStatus}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      >
                        <option value="Middle Class">Middle Class</option>
                        <option value="Upper Middle Class">Upper Middle Class</option>
                        <option value="Affluent / Rich">Affluent / Rich</option>
                      </select>
                    </div>

                    {/* Family Background */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Family Background / About Family
                      </label>
                      <textarea
                        rows={3}
                        name="familyBackground"
                        value={formData.familyBackground}
                        onChange={handleInputChange}
                        placeholder="Tell prospective families about your family values, ancestral heritage, and lifestyle..."
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Partner Expectations */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#C89B63]/20 pb-3">
                    <h3 className="text-lg font-bold font-heading text-[#6A1E2C] flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#C89B63]" /> 4. Partner Expectations
                    </h3>
                    <p className="text-xs text-[#222222]/70">
                      Specify preferences to help our matrimony consultants find the most compatible matches.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Age Range Preference */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Preferred Age Range
                      </label>
                      <input
                        type="text"
                        name="partnerAgeRange"
                        value={formData.partnerAgeRange}
                        onChange={handleInputChange}
                        placeholder="e.g. 24 - 28 Years"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Education Preference */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Education Preference
                      </label>
                      <input
                        type="text"
                        name="partnerEducation"
                        value={formData.partnerEducation}
                        onChange={handleInputChange}
                        placeholder="e.g. Any Graduate / Post Graduate / Doctor / Engineer"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Profession Preference */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Profession Preference
                      </label>
                      <input
                        type="text"
                        name="partnerProfession"
                        value={formData.partnerProfession}
                        onChange={handleInputChange}
                        placeholder="e.g. IT Professional / Govt Job / Business / Doctor"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Income Preference */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Income Preference
                      </label>
                      <input
                        type="text"
                        name="partnerIncomePreference"
                        value={formData.partnerIncomePreference}
                        onChange={handleInputChange}
                        placeholder="e.g. 6 LPA+ / No specific bar"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Community Preference */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Community Preference
                      </label>
                      <input
                        type="text"
                        name="partnerCommunityPreference"
                        value={formData.partnerCommunityPreference}
                        onChange={handleInputChange}
                        placeholder="e.g. Same Community or Open to Inter-caste"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Location Preference */}
                    <div>
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Location Preference
                      </label>
                      <input
                        type="text"
                        name="partnerLocationPreference"
                        value={formData.partnerLocationPreference}
                        onChange={handleInputChange}
                        placeholder="e.g. Tamil Nadu / Bangalore / Abroad Willing"
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>

                    {/* Other Expectations */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#6A1E2C] uppercase tracking-wider mb-1.5">
                        Other Expectations & Values
                      </label>
                      <textarea
                        rows={3}
                        name="partnerOtherExpectations"
                        value={formData.partnerOtherExpectations}
                        onChange={handleInputChange}
                        placeholder="Mention horoscope matching requirements (Sevvai dosham, Rasi/Natchathiram preferences) or personal values..."
                        className="w-full px-4 py-3 rounded-2xl border border-[#C89B63]/30 bg-[#FFF9F5]/40 text-sm focus:outline-none focus:border-[#6A1E2C] transition shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Document & Photo Uploads */}
              {currentStep === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="border-b border-[#C89B63]/20 pb-3">
                    <h3 className="text-lg font-bold font-heading text-[#6A1E2C] flex items-center gap-2">
                      <Upload className="w-5 h-5 text-[#C89B63]" /> 5. Photo & Document Uploads
                    </h3>
                    <p className="text-xs text-[#222222]/70">
                      Upload candidate photograph, horoscope (Jathagam), and community certificate. Supports Image (JPG/PNG), PDF, and document files.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* 1. Recent Photo Upload */}
                    <div className="p-5 rounded-3xl border-2 border-dashed border-[#C89B63]/40 bg-[#FFF9F5]/50 flex flex-col items-center text-center justify-between space-y-3">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#6A1E2C]">
                          <ImageIcon className="w-4 h-4 text-[#C89B63]" /> Recent Photo
                        </div>

                        {photoPreview ? (
                          <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-[#6A1E2C] shadow-md group">
                            <img
                              src={photoPreview}
                              alt="Candidate Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPhotoFile(null);
                                setPhotoPreview(null);
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition shadow"
                              title="Remove Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => photoInputRef.current?.click()}
                            className="w-24 h-24 mx-auto rounded-2xl bg-white border border-[#C89B63]/30 flex flex-col items-center justify-center text-[#C89B63] cursor-pointer hover:bg-[#FAF3EB] transition shadow-sm"
                          >
                            <Upload className="w-6 h-6" />
                            <span className="text-[10px] font-bold mt-1 text-[#6A1E2C]">Upload Photo</span>
                          </div>
                        )}

                        <p className="text-[11px] text-[#222222]/60">
                          {photoFile ? photoFile.name : 'PNG, JPG up to 10MB'}
                        </p>
                      </div>

                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handlePhotoSelect(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="w-full py-2 rounded-xl bg-white border border-[#C89B63]/40 text-[#6A1E2C] text-xs font-bold hover:bg-[#6A1E2C] hover:text-white transition shadow-sm"
                      >
                        {photoFile ? 'Change Photo' : 'Select Photo'}
                      </button>
                    </div>

                    {/* 2. Jathagam Copy (Horoscope) */}
                    <div className="p-5 rounded-3xl border-2 border-dashed border-[#C89B63]/40 bg-[#FFF9F5]/50 flex flex-col items-center text-center justify-between space-y-3">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#6A1E2C]">
                          <FileText className="w-4 h-4 text-[#C89B63]" /> Jathagam / Horoscope
                        </div>

                        {jathagamFile ? (
                          <div className="p-3 bg-white rounded-2xl border border-emerald-300 text-emerald-800 text-xs font-medium space-y-1">
                            <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                            <p className="font-bold line-clamp-1">{jathagamFile.name}</p>
                            <span className="text-[10px] text-emerald-600">Ready to upload</span>
                          </div>
                        ) : (
                          <div
                            onClick={() => jathagamInputRef.current?.click()}
                            className="w-24 h-24 mx-auto rounded-2xl bg-white border border-[#C89B63]/30 flex flex-col items-center justify-center text-[#C89B63] cursor-pointer hover:bg-[#FAF3EB] transition shadow-sm"
                          >
                            <FileText className="w-6 h-6" />
                            <span className="text-[10px] font-bold mt-1 text-[#6A1E2C]">Upload File</span>
                          </div>
                        )}

                        <p className="text-[11px] text-[#222222]/60">
                          {jathagamFile ? `${(jathagamFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Image or PDF (Max 15MB)'}
                        </p>
                      </div>

                      <input
                        ref={jathagamInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setJathagamFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => jathagamInputRef.current?.click()}
                        className="w-full py-2 rounded-xl bg-white border border-[#C89B63]/40 text-[#6A1E2C] text-xs font-bold hover:bg-[#6A1E2C] hover:text-white transition shadow-sm"
                      >
                        {jathagamFile ? 'Change Jathagam' : 'Select Jathagam'}
                      </button>
                    </div>

                    {/* 3. Community Certificate */}
                    <div className="p-5 rounded-3xl border-2 border-dashed border-[#C89B63]/40 bg-[#FFF9F5]/50 flex flex-col items-center text-center justify-between space-y-3">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#6A1E2C]">
                          <ShieldCheck className="w-4 h-4 text-[#C89B63]" /> Community Certificate
                        </div>

                        {communityCertFile ? (
                          <div className="p-3 bg-white rounded-2xl border border-emerald-300 text-emerald-800 text-xs font-medium space-y-1">
                            <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                            <p className="font-bold line-clamp-1">{communityCertFile.name}</p>
                            <span className="text-[10px] text-emerald-600">Ready to upload</span>
                          </div>
                        ) : (
                          <div
                            onClick={() => certInputRef.current?.click()}
                            className="w-24 h-24 mx-auto rounded-2xl bg-white border border-[#C89B63]/30 flex flex-col items-center justify-center text-[#C89B63] cursor-pointer hover:bg-[#FAF3EB] transition shadow-sm"
                          >
                            <ShieldCheck className="w-6 h-6" />
                            <span className="text-[10px] font-bold mt-1 text-[#6A1E2C]">Upload Cert</span>
                          </div>
                        )}

                        <p className="text-[11px] text-[#222222]/60">
                          {communityCertFile ? `${(communityCertFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Image or PDF (Max 15MB)'}
                        </p>
                      </div>

                      <input
                        ref={certInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCommunityCertFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => certInputRef.current?.click()}
                        className="w-full py-2 rounded-xl bg-white border border-[#C89B63]/40 text-[#6A1E2C] text-xs font-bold hover:bg-[#6A1E2C] hover:text-white transition shadow-sm"
                      >
                        {communityCertFile ? 'Change Certificate' : 'Select Certificate'}
                      </button>
                    </div>
                  </div>

                  {/* Privacy & Declaration Notice */}
                  <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#C89B63]/30 text-xs text-[#222222]/80 space-y-1.5">
                    <p className="font-bold text-[#6A1E2C] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#C89B63]" /> Candidate Data Privacy Protection
                    </p>
                    <p>
                      Your photographs and certificates are secured under strict privacy protection. They are never shared publicly or without mutual family consent.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Uploading progress status message */}
              {uploadingStatus && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-center gap-2 font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                  <span>{uploadingStatus}</span>
                </div>
              )}

              {/* Form Navigation Buttons */}
              <div className="pt-6 border-t border-[#C89B63]/20 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#C89B63]/40 bg-white text-[#6A1E2C] font-bold text-xs sm:text-sm hover:bg-[#FAF3EB] transition shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-300 bg-white text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#6A1E2C] hover:bg-[#8C283B] text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <span>{currentStep === 4 ? 'Next: Photos & Documents' : 'Next Step'}</span>
                    <ArrowRight className="w-4 h-4 text-[#C89B63]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#6A1E2C] to-[#8C283B] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#6A1E2C]/25 hover:shadow-[#6A1E2C]/40 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-75 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C89B63]" />
                        <span>Submitting Profile...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#C89B63]" />
                        <span>Submit Registration</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Helpline Contact Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-xs text-[#222222]/70">
            Need help or prefer registering over phone with our matrimony consultants?
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onOpenCallModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#C89B63]/40 text-[#6A1E2C] text-xs font-bold shadow-sm hover:bg-[#6A1E2C] hover:text-white transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#C89B63]" />
              <span>Call Helpline {PHONE_NUMBER}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
