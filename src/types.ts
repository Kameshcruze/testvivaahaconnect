import couple1 from './assets/images/couple1.webp';
import couple2 from './assets/images/couple2.webp';
import couple3 from './assets/images/couple3.webp';

export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScHfyMu0hFHcybpp9jNI9-NEL-3P7K-Cck3HuyJ-qzH-D1YRA/viewform";
export const PHONE_NUMBER = "+91 94869 55380";
export const PHONE_RAW = "+919486955380";
export const EMAIL_ADDRESS = "contact@vivaahaconnect.com";
export const LOCATION_ADDRESS = "Coimbatore & Karur, Tamil Nadu";

export const HO_ADDRESS = {
  title: "Head Office",
  addressLine1: "30, Devi Poorani Nagar,",
  addressLine2: "Kalapatti(po), Coimbatore -641 048",
  fullText: "30, Devi Poorani Nagar, Kalapatti(po), Coimbatore -641 048",
  city: "Coimbatore"
};

export const BRANCH_ADDRESS = {
  title: "Branch Office",
  addressLine1: "22, Senguthapuram 4th Cross,",
  addressLine2: "Karur-639 002",
  fullText: "22, Senguthapuram 4th Cross, Karur-639 002",
  city: "Karur"
};

export interface Testimonial {
  id: string;
  names: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
  matchType: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Registration' | 'Privacy' | 'Matchmaking' | 'General';
}

export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
  tag?: string;
}

export interface StepItem {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export interface RegistrationRecord {
  id: string;
  created_at: string;
  name: string;
  gender: string;
  dob?: string | null;
  age?: number | string | null;
  height?: string | null;
  weight?: string | null;
  marital_status?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  whatsapp_number?: string | null;
  current_location?: string | null;
  native_place?: string | null;
  community?: string | null;
  kulam?: string | null;
  kuladeivam?: string | null;
  rasi?: string | null;
  natchatram?: string | null;
  laknam?: string | null;
  education_qualification?: string | null;
  profession?: string | null;
  company_name?: string | null;
  work_location?: string | null;
  income?: string | null;
  father_name?: string | null;
  father_occupation?: string | null;
  mother_name?: string | null;
  mother_occupation?: string | null;
  brothers_count?: string | number | null;
  brothers_married?: string | number | null;
  brothers_unmarried?: string | number | null;
  sisters_count?: string | number | null;
  sisters_married?: string | number | null;
  sisters_unmarried?: string | number | null;
  family_type?: string | null;
  family_status?: string | null;
  family_background?: string | null;
  partner_age_range?: string | null;
  partner_education?: string | null;
  partner_profession?: string | null;
  partner_income_preference?: string | null;
  partner_community_preference?: string | null;
  partner_location_preference?: string | null;
  partner_other_expectations?: string | null;
  photo_url?: string | null;
  photo_file_name?: string | null;
  jathagam_url?: string | null;
  jathagam_file_name?: string | null;
  community_certificate_url?: string | null;
  community_certificate_file_name?: string | null;
  status?: string | null;
}

export interface RegistrationDraftRecord {
  id: string;
  created_at: string;
  updated_at?: string;
  session_token?: string | null;
  current_step: number;
  name?: string | null;
  gender?: string | null;
  dob?: string | null;
  age?: number | string | null;
  height?: string | null;
  weight?: string | null;
  marital_status?: string | null;
  mobile_number?: string | null;
  email?: string | null;
  whatsapp_number?: string | null;
  current_location?: string | null;
  native_place?: string | null;
  community?: string | null;
  kulam?: string | null;
  kuladeivam?: string | null;
  rasi?: string | null;
  natchatram?: string | null;
  laknam?: string | null;
  education_qualification?: string | null;
  profession?: string | null;
  company_name?: string | null;
  work_location?: string | null;
  income?: string | null;
  father_name?: string | null;
  father_occupation?: string | null;
  mother_name?: string | null;
  mother_occupation?: string | null;
  brothers_count?: string | number | null;
  brothers_married?: string | number | null;
  brothers_unmarried?: string | number | null;
  sisters_count?: string | number | null;
  sisters_married?: string | number | null;
  sisters_unmarried?: string | number | null;
  family_type?: string | null;
  family_status?: string | null;
  family_background?: string | null;
  partner_age_range?: string | null;
  partner_education?: string | null;
  partner_profession?: string | null;
  partner_income_preference?: string | null;
  partner_community_preference?: string | null;
  partner_location_preference?: string | null;
  partner_other_expectations?: string | null;
  photo_file_name?: string | null;
  jathagam_file_name?: string | null;
  community_certificate_file_name?: string | null;
  form_data?: Record<string, any> | null;
  status: 'Incomplete' | 'Draft' | 'Completed' | 'Followed Up' | 'Abandoned';
  completed_registration_id?: string | null;
}

export type DraftStatus = 'Incomplete' | 'Draft' | 'Completed' | 'Followed Up' | 'Abandoned';

export interface AdminUser {
  username: string;
  role: string;
}

export type EnquiryType = 'callback_request' | 'whatsapp_click' | 'phone_call' | 'contact_form' | 'general_enquiry';
export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed';

export interface EnquiryRecord {
  id: string;
  created_at: string;
  type: EnquiryType;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  community?: string | null;
  source?: string | null;
  message?: string | null;
  status: EnquiryStatus;
  notes?: string | null;
}


export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "1",
    names: "Karthik & Revathi",
    role: "Married in Dec 2024",
    location: "Coimbatore, Tamil Nadu",
    quote: "Vivaaha Connect provided a dignified, respectful, and transparent matchmaking process. We found our ideal life partner with absolute peace of mind for our families.",
    rating: 5,
    image: couple1,
    matchType: "Verified Community Match"
  },
  {
    id: "2",
    names: "Anand & Priya",
    role: "Married in Jan 2025",
    location: "Chennai, Tamil Nadu",
    quote: "The personalized phone assistance and genuine profile checks set Vivaaha Connect apart. They truly care about connecting compatible families.",
    rating: 5,
    image: couple2,
    matchType: "Personalized Consultation Match"
  },
  {
    id: "3",
    names: "Suresh & Divya",
    role: "Married in Nov 2024",
    location: "Madurai & Chennai",
    quote: "Privacy was our biggest priority. Vivaaha Connect respected our confidentiality and shared matches only after mutual family consent.",
    rating: 5,
    image: couple3,
    matchType: "Tamil Nadu Connect"
  }
];

export const KONGU_KULAMS: string[] = [
  "Sempoothan (செம்பூத்தான்)",
  "Kannan (கண்ணன்)",
  "Kannanthai (கண்ணந்தை)",
  "Porulanthai / Porulanthar (பொருளாந்தை)",
  "Aadai (ஆடை)",
  "Pavalan / Pavalankudi (பவளன்)",
  "Vilayan (விளையன்)",
  "Kaari (காரி)",
  "Kaadai (காடை)",
  "Kaadan (காடன்)",
  "Keeran (கீரன்)",
  "Anthuvan (அந்துவன்)",
  "Aariyan (ஆரியன்)",
  "Eenjan (ஈஞ்சன்)",
  "Oonanjaan (ஊனஞ்சான்)",
  "Enkulam (எண்குலம்)",
  "Earan (ஏரன்)",
  "Odhaalan (ஓதாளன்)",
  "Kungkili (குங்கிலி)",
  "Kundali (குண்டலி)",
  "Kunthali (குந்தலி)",
  "Koorai (கூரை)",
  "Kodikaaran (கொடிக்காரன்)",
  "Kovan (கோவன்)",
  "Saathanthai (சாத்தந்தை)",
  "Saathoori (சாத்தூரி)",
  "Sellan (செல்லன்)",
  "Semban (செம்பன்)",
  "Sengkannan (செங்கண்ணன்)",
  "Sengunthar (செங்குந்தர்)",
  "Sevoor (சேவூர்)",
  "Thannasi (தன்னாசி)",
  "Dhananjayan (தனஞ்சயன்)",
  "Thoravalan (தொரவலன்)",
  "Naaraiyan (நாரையன்)",
  "Neelan (நீலன்)",
  "Panangaadar (பனங்காடர்)",
  "Panaiyan (பனையன்)",
  "Payiran (பயிரன்)",
  "Pannai (பண்ணை)",
  "Poochanthai (பூச்சந்தை)",
  "Periyan (பெரியன்)",
  "Ponnan (பொன்னன்)",
  "Maniyan (மணியன்)",
  "Maadalan (மாடளன்)",
  "Medhi (மேதி)",
  "Muthan (முத்தன்)",
  "Moolan (மூலன்)",
  "Mailan (மைலன்)",
  "Vannakkan (வண்ணக்கன்)",
  "Villi (வில்லி)",
  "Venduvan (வெண்டுவன்)",
  "Velli (வெள்ளி)",
  "Vendhan (வேந்தன்)",
  "Other Kongu Kulam (மற்ற கொங்கு குலம்)",
];

export const TAMIL_RASIS: string[] = [
  "Mesham (மேஷம் / Aries)",
  "Rishabam (ரிஷபம் / Taurus)",
  "Mithunam (மிதுனம் / Gemini)",
  "Kadagam (கடகம் / Cancer)",
  "Simmam (சிம்மம் / Leo)",
  "Kanni (கன்னி / Virgo)",
  "Thulaam (துலாம் / Libra)",
  "Viruchigam (விருச்சிகம் / Scorpio)",
  "Dhanusu (தனுசு / Sagittarius)",
  "Makaram (மகரம் / Capricorn)",
  "Kumbam (கும்பம் / Aquarius)",
  "Meenam (மீனம் / Pisces)",
];

export const TAMIL_NATCHATHIRAMS: string[] = [
  "Aswini (அஸ்வினி)",
  "Bharani (பரணி)",
  "Karthigai (கார்த்திகை)",
  "Rohini (ரோகிணி)",
  "Mrigasheersham (மிருகசீரிடம்)",
  "Thiruvathirai (திருவாதிரை)",
  "Punarpoosam (புனர்பூசம்)",
  "Poosam (பூசம்)",
  "Aayilyam (ஆயில்யம்)",
  "Magam (மகம்)",
  "Pooram (பூரம்)",
  "Uthiram (உத்திரம்)",
  "Hastham (அஸ்தம்)",
  "Chithirai (சித்திரை)",
  "Swathi (சுவாதி)",
  "Visagam (விசாகம்)",
  "Anusham (அனுஷம்)",
  "Kettai (கேட்டை)",
  "Moolam (மூலம்)",
  "Pooradam (பூராடம்)",
  "Uthiradam (உத்திராடம்)",
  "Thiruvonam (திருவோணம்)",
  "Avittam (அவிட்டம்)",
  "Sadhayam (சதயம்)",
  "Poorattathi (பூரட்டாதி)",
  "Uthirattathi (உத்திரட்டாதி)",
  "Revathi (ரேவதி)",
];

export const TAMIL_LAGNAMS: string[] = [
  "Mesha Lagnam (மேஷ லக்னம்)",
  "Rishaba Lagnam (ரிஷப லக்னம்)",
  "Mithuna Lagnam (மிதுன லக்னம்)",
  "Kadaga Lagnam (கடக லக்னம்)",
  "Simma Lagnam (சிம்ம லக்னம்)",
  "Kanni Lagnam (கன்னி லக்னம்)",
  "Thulaa Lagnam (துலா லக்னம்)",
  "Viruchiga Lagnam (விருச்சிக லக்னம்)",
  "Dhanusu Lagnam (தனுசு லக்னம்)",
  "Makara Lagnam (மகர லக்னம்)",
  "Kumba Lagnam (கும்ப லக்னம்)",
  "Meena Lagnam (மீன லக்னம்)",
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I register a profile with Vivaaha Connect?",
    answer: "Registration is simple and quick! Fill out the step-by-step matrimony registration form with candidate details, Kulam, education, occupation, and family preferences. Our matrimony consultants will verify the information and contact you promptly.",
    category: "Registration"
  },
  {
    id: "faq-2",
    question: "Is this service exclusively for the Kongu Vellala Gounder community?",
    answer: "Yes, Vivaaha Connect is an exclusive matrimony platform dedicated solely to the Kongu Vellala Gounder (கொங்கு வேளாளர் கவுண்டர்) community across Kongu Nadu, Tamil Nadu, and worldwide.",
    category: "General"
  },
  {
    id: "faq-3",
    question: "How is Kulam / Gotram compatibility handled?",
    answer: "We strictly uphold traditional Kongu Vellala Gounder matrimonial customs, ensuring Thayadhi Kulam (தாயாதி குலம்) exclusions and compatible Kulam alliances are respected during matchmaking.",
    category: "Matchmaking"
  },
  {
    id: "faq-4",
    question: "Is personal and contact information kept strictly private?",
    answer: "Yes, 100% privacy protection is guaranteed. Candidate contact numbers and photographs are never made public. Profiles are shared only with verified Kongu Vellala Gounder families after mutual consent.",
    category: "Privacy"
  },
  {
    id: "faq-5",
    question: "Can I call and speak to a consultant directly?",
    answer: "Yes! We encourage families to call us directly at +91 94869 55380. Our dedicated team in Coimbatore is happy to assist you with profile registration and matching.",
    category: "General"
  }
];

export const WHY_CHOOSE_US_ITEMS = [
  {
    title: "Verified Profiles",
    description: "Every candidate profile undergoes authentic verification to ensure genuine background and trusted credentials.",
    icon: "ShieldCheck"
  },
  {
    title: "Privacy Protection",
    description: "Your contact details and photographs are protected under strict confidentiality protocols.",
    icon: "Lock"
  },
  {
    title: "Dedicated Support",
    description: "Our dedicated matrimony consultants guide parents and candidates through every step of the journey.",
    icon: "Headphones"
  },
  {
    title: "Personalized Match Suggestions",
    description: "Handpicked profile recommendations tailored specifically to your values, family background, and lifestyle.",
    icon: "HeartHandshake"
  },
  {
    title: "Fast Registration",
    description: "Effortless online registration process taking less than 3 minutes to submit your details.",
    icon: "Zap"
  },
  {
    title: "Trusted Service",
    description: "Built on transparency, respect, and high moral standards for lasting marital harmony.",
    icon: "Award"
  },
  {
    title: "Friendly Guidance",
    description: "Empathetic communication and patient consultation tailored to modern expectations.",
    icon: "Users"
  },
  {
    title: "Support Across Tamil Nadu",
    description: "Extensive network reaching brides and grooms across all regions of Tamil Nadu.",
    icon: "MapPin"
  }
];

export const FEATURES_LIST: FeatureItem[] = [
  // { title: "Bride Registration", description: "Dedicated registration portal for genuine brides across all backgrounds.", iconName: "UserCheck", tag: "Brides" },
  // { title: "Groom Registration", description: "Tailored registration for grooms seeking compatible partners.", iconName: "UserCheck", tag: "Grooms" },
  { title: "All Communities Welcome", description: "Open matchmaking across all castes, sub-castes, religions, and regions.", iconName: "Globe", tag: "Inclusive" },
  { title: "Personalized Matchmaking", description: "Human-assisted profile curation based on preferences and compatibility.", iconName: "HeartHandshake", tag: "Curated" },
  { title: "Privacy Assured", description: "Strict data confidentiality. No public listing of personal numbers.", iconName: "ShieldAlert", tag: "100% Private" },
  { title: "Verified Profiles", description: "Background checked profiles to protect against fraudulent entries.", iconName: "BadgeCheck", tag: "Authentic" },
  { title: "Friendly Customer Support", description: "Accessible phone and message assistance for families and candidates.", iconName: "PhoneCall", tag: "Support" },
  { title: "Online Registration", description: "Convenient Google Form registration available 24/7 on mobile or desktop.", iconName: "Laptop", tag: "Easy Form" },
  // { title: "Phone Assistance", description: "Direct voice guidance from experienced Tamil matrimony consultants.", iconName: "PhoneForwarded", tag: "Consultation" },
  // { title: "Tamil Nadu Coverage", description: "Deep reach in Coimbatore, Chennai, Madurai, Trichy, Salem, Tiruppur & beyond.", iconName: "Map", tag: "Local Focus" },
  // { title: "Tamil Nadu Guidance", description: "Connecting families across all districts and major cities in Tamil Nadu.", iconName: "Compass", tag: "Tamil Nadu" },
  // { title: "Quick Response", description: "Prompt feedback and match profile updates within 24–48 hours of review.", iconName: "Clock", tag: "Fast" }
];

export const TIMELINE_STEPS: StepItem[] = [
  {
    step: 1,
    title: "Click Register",
    subtitle: "Initiate Registration",
    description: "Access our secure online form from any device in just one click.",
    iconName: "MousePointerClick"
  },
  {
    step: 2,
    title: "Complete Form",
    subtitle: "Submit Details",
    description: "Fill in candidate preferences, qualification, occupation, and contact info.",
    iconName: "FileSpreadsheet"
  },
  {
    step: 3,
    title: "Profile Review",
    subtitle: "Verification Phase",
    description: "Our team verifies the details to maintain a safe, high-trust network.",
    iconName: "CheckCircle2"
  },
  {
    step: 4,
    title: "Suitable Profiles Shared",
    subtitle: "Curated Matching",
    description: "Receive handpicked profile suggestions matching your criteria.",
    iconName: "Heart"
  },
  {
    step: 5,
    title: "Discussion",
    subtitle: "Mutual Consent",
    description: "Initiate respectful family talks with matched prospective partners.",
    iconName: "MessageCircle"
  },
  {
    step: 6,
    title: "Begin Your Journey",
    subtitle: "Auspicious Beginning",
    description: "Finalize auspicious alliances and celebrate lifelong togetherness.",
    iconName: "Award"
  }
];
