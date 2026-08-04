import couple1 from './assets/images/couple1.webp';
import couple2 from './assets/images/couple2.webp';
import couple3 from './assets/images/couple3.webp';

export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScHfyMu0hFHcybpp9jNI9-NEL-3P7K-Cck3HuyJ-qzH-D1YRA/viewform";
export const PHONE_NUMBER = "+91 94869 55380";
export const PHONE_RAW = "+919486955380";
export const EMAIL_ADDRESS = "contact@vivaahaconnect.com";
export const LOCATION_ADDRESS = "Coimbatore, Tamil Nadu";

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

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I register my profile with Vivaaha Connect?",
    answer: "Registration is simple and quick! Just click on any 'Register Profile' button on our website to fill out our secure Google Form with basic candidate details, education, occupation, and family preferences. Our team will review your details and contact you promptly.",
    category: "Registration"
  },
  {
    id: "faq-2",
    question: "Do you support all communities, religions, and castes?",
    answer: "Yes, absolutely! Vivaaha Connect proudly welcomes brides and grooms from all religions, all castes, and all communities across Tamil Nadu. Matchmaking is open to everyone seeking a genuine life partner.",
    category: "General"
  },
  {
    id: "faq-3",
    question: "Is my personal and contact information kept strictly private?",
    answer: "Yes, 100% privacy protection is guaranteed. Candidate contact details and confidential family information are never made public. Profiles are shared only with mutually verified matches after explicit consent.",
    category: "Privacy"
  },
  {
    id: "faq-4",
    question: "How will I receive matched profiles after registration?",
    answer: "Once registered, our experienced matrimony consultants curate matching profiles based on your specific criteria (age, education, location, community, horoscopes if desired). Matches are delivered directly via phone, WhatsApp, or email with complete profile summaries.",
    category: "Matchmaking"
  },
  {
    id: "faq-5",
    question: "Can I call and speak to a consultant before registering?",
    answer: "Yes! We encourage candidates and family members to call us directly at +91 94869 55380. Our friendly team in Coimbatore is happy to answer your questions and guide you through the process.",
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
  { title: "Bride Registration", description: "Dedicated registration portal for genuine brides across all backgrounds.", iconName: "UserCheck", tag: "Brides" },
  { title: "Groom Registration", description: "Tailored registration for grooms seeking compatible partners.", iconName: "UserCheck", tag: "Grooms" },
  { title: "All Communities Welcome", description: "Open matchmaking across all castes, sub-castes, religions, and regions.", iconName: "Globe", tag: "Inclusive" },
  { title: "Personalized Matchmaking", description: "Human-assisted profile curation based on preferences and compatibility.", iconName: "HeartHandshake", tag: "Curated" },
  { title: "Privacy Assured", description: "Strict data confidentiality. No public listing of personal numbers.", iconName: "ShieldAlert", tag: "100% Private" },
  { title: "Verified Profiles", description: "Background checked profiles to protect against fraudulent entries.", iconName: "BadgeCheck", tag: "Authentic" },
  { title: "Friendly Customer Support", description: "Accessible phone and message assistance for families and candidates.", iconName: "PhoneCall", tag: "Support" },
  { title: "Online Registration", description: "Convenient Google Form registration available 24/7 on mobile or desktop.", iconName: "Laptop", tag: "Easy Form" },
  { title: "Phone Assistance", description: "Direct voice guidance from experienced Tamil matrimony consultants.", iconName: "PhoneForwarded", tag: "Consultation" },
  { title: "Tamil Nadu Coverage", description: "Deep reach in Coimbatore, Chennai, Madurai, Trichy, Salem, Tiruppur & beyond.", iconName: "Map", tag: "Local Focus" },
  { title: "Tamil Nadu Guidance", description: "Connecting families across all districts and major cities in Tamil Nadu.", iconName: "Compass", tag: "Tamil Nadu" },
  { title: "Quick Response", description: "Prompt feedback and match profile updates within 24–48 hours of review.", iconName: "Clock", tag: "Fast" }
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
