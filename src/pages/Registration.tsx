import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ChevronLeft, User, Building2, Star, MessageSquare, FileUp, PenLine, Mail, Phone, MapPin } from 'lucide-react';
import { supabase, supabaseRegistrationsTable, supabaseStorageBucket } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import RegistrationDocumentUpload from '../components/RegistrationDocumentUpload';
import { useSEO } from '../hooks/useSEO';

const STEPS = [
  { id: 1, title: 'Applicant Information', icon: User },
  { id: 2, title: 'Business Information', icon: Building2 },
  { id: 3, title: 'Membership Category', icon: Star },
  { id: 4, title: 'Motivation', icon: MessageSquare },
  { id: 5, title: 'Documents', icon: FileUp },
  { id: 6, title: 'Declaration', icon: PenLine },
];

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  altPhone: string;
  businessName: string;
  businessRegNumber: string;
  typeOfBusiness: string;
  industrySector: string;
  businessAddress: string;
  numberOfEmployees: string;
  membershipCategory: string;
  motivation: string;
  supportingDocs: string[];
  uploadedFiles: File[];
  signatureData: string;
  declarationDate: string;
}

const inputClass = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-chamber-blue focus:border-transparent outline-none text-sm transition-all';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className={labelClass}>
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function RadioOption({ name, value, checked, onChange, label }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; label: string }) {
  return (
    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checked ? 'border-chamber-blue bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'border-chamber-blue' : 'border-slate-300'}`}>
        {checked && <div className="w-2.5 h-2.5 rounded-full bg-chamber-blue" />}
      </div>
      <span className="text-sm text-slate-700 font-medium">{label}</span>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
    </label>
  );
}

function CheckOption({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${checked ? 'border-chamber-blue bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? 'border-chamber-blue bg-chamber-blue' : 'border-slate-300'}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className="text-sm text-slate-700">{label}</span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
    </label>
  );
}

function SignaturePad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    drawing.current = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDraw = () => {
    drawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div>
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-white cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={600}
          height={140}
          className="w-full h-36 touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!value && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-slate-400 text-sm italic">Sign here</span>
          </div>
        )}
      </div>
      {value && (
        <button type="button" onClick={clear} className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium">
          Clear signature
        </button>
      )}
    </div>
  );
}

const sanitizePathSegment = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'applicant';

const dataUrlToFile = (dataUrl: string, fileName: string) => {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) {
    throw new Error('Unsupported signature image format.');
  }

  const [, mimeType, base64Data] = match;
  const byteString = atob(base64Data);
  const buffer = new ArrayBuffer(byteString.length);
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < byteString.length; index += 1) {
    bytes[index] = byteString.charCodeAt(index);
  }

  return new File([buffer], fileName, { type: mimeType });
};

const buildStoragePath = (email: string, fileName: string) => {
  const folder = sanitizePathSegment(email || 'applicant');
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${fileName}`;
  return `${folder}/${uniqueName}`;
};

const buildFallbackDocumentEntry = (file: File | { name: string; type?: string; size?: number }, source: 'uploaded-file' | 'signature') => JSON.stringify({
  source,
  name: file.name,
  type: file.type || 'application/octet-stream',
  size: typeof file.size === 'number' ? file.size : 0,
  storageStatus: 'saved-as-metadata',
});

const buildFallbackSignatureEntry = (signatureData: string) => JSON.stringify({
  source: 'signature',
  name: 'signature.png',
  type: 'image/png',
  storageStatus: 'saved-as-metadata',
  dataUrl: signatureData,
});

const uploadDocumentToStorage = async (file: File, email: string) => {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const path = buildStoragePath(email, file.name);
  const { error } = await supabase.storage.from(supabaseStorageBucket).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(supabaseStorageBucket).getPublicUrl(path);
  return data.publicUrl;
};

const uploadOrRecordDocument = async (file: File, email: string) => {
  try {
    return await uploadDocumentToStorage(file, email);
  } catch {
    return buildFallbackDocumentEntry(file, 'uploaded-file');
  }
};

const captureSignatureFallback = async (signatureData: string, email: string) => {
  try {
    const signatureFile = dataUrlToFile(signatureData, 'signature.png');
    return await uploadDocumentToStorage(signatureFile, email);
  } catch {
    return buildFallbackSignatureEntry(signatureData);
  }
};

const persistRegistration = async (payload: Record<string, unknown>) => {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { error } = await supabase.from(supabaseRegistrationsTable).insert([payload]).select().single();
  if (error) {
    throw error;
  }
};

export default function Registration() {
  useSEO({
    title: 'Member Registration',
    description: 'Apply for membership with the Amajuba Economic Chamber of Commerce. Join 500+ members driving economic growth across the Amajuba District.',
    path: '/register',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Amajuba Economic Chamber — Member Registration',
      url: 'https://amajubaeconomicchamber.org/register',
      description: 'Apply for membership with the Amajuba Economic Chamber of Commerce.',
    },
  });

  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', dateOfBirth: '', gender: '', email: '',
    phone: '', altPhone: '', businessName: '', businessRegNumber: '',
    typeOfBusiness: '', industrySector: '', businessAddress: '',
    numberOfEmployees: '', membershipCategory: '', motivation: '',
    supportingDocs: [], uploadedFiles: [], signatureData: '',
    declarationDate: new Date().toISOString().split('T')[0],
  });
  const [uploadedDocumentUrls, setUploadedDocumentUrls] = useState<string[]>([]);

  useEffect(() => {
    if (user?.email && formData.email !== user.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [formData.email, user]);

  const update = (field: keyof FormData, value: FormData[keyof FormData]) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const toggleDoc = (doc: string) => {
    setFormData(prev => ({
      ...prev,
      supportingDocs: prev.supportingDocs.includes(doc)
        ? prev.supportingDocs.filter(d => d !== doc)
        : [...prev.supportingDocs, doc],
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) setCurrentStep(s => s + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };
  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter' && currentStep < 6) {
      event.preventDefault();
    }
  };
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (currentStep !== 6) {
      setSubmitError('Please complete the final step before submitting your application.');
      return;
    }
    setSubmitError('');

    if (!supabase) {
      setSubmitError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before submitting.');
      return;
    }

    const applicantEmail = user?.email ?? formData.email;
    if (!applicantEmail) {
      setSubmitError('Please enter your email address before submitting.');
      return;
    }

    const normalizedEmployees = formData.numberOfEmployees.trim() === ''
      ? null
      : Number(formData.numberOfEmployees);

    if (
      normalizedEmployees !== null &&
      (!Number.isFinite(normalizedEmployees) || !Number.isInteger(normalizedEmployees) || normalizedEmployees < 0)
    ) {
      setSubmitError('Number of employees must be a whole number greater than or equal to 0.');
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadedDocuments = [...uploadedDocumentUrls];

      if (formData.signatureData) {
        const signatureUrl = await captureSignatureFallback(formData.signatureData, applicantEmail);
        uploadedDocuments.push(signatureUrl);
      }

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        email_address: applicantEmail,
        phone_number: formData.phone,
        alternative_phone_number: formData.altPhone || null,
        business_name: formData.businessName || null,
        registration_number: formData.businessRegNumber || null,
        business_type: formData.typeOfBusiness || null,
        industry_sector: formData.industrySector || null,
        business_address: formData.businessAddress || null,
        number_of_employees: normalizedEmployees,
        membership_category: formData.membershipCategory || null,
        motivation_for_joining: formData.motivation || null,
        copy_of_id_or_passport: formData.supportingDocs.includes('Copy of Valid ID or Passport'),
        business_registration_documents: formData.supportingDocs.includes('Business Registration Documents (if applicable)'),
        proof_of_residence: formData.supportingDocs.includes('Proof of Residence'),
        company_profile: formData.supportingDocs.includes('Company Profile (optional)'),
        uploaded_documents: uploadedDocuments,
        declaration_accepted: true,
        applicant_signature: `${formData.firstName} ${formData.lastName}`.trim(),
        signature_date: formData.declarationDate,
        application_status: 'Pending',
      };

      await persistRegistration(payload);
      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'There was a problem saving your registration. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 md:p-16 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-chamber-navy mb-3">Application Submitted!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Thank you, <strong>{formData.firstName}</strong>. Your membership application has been received. Our team will review it and get back to you shortly.
          </p>
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact the Chamber</p>
              <div className="flex items-center gap-3 text-sm text-slate-600"> 
              <Mail size={16} className="text-chamber-blue shrink-0" />
              <span>amajubaeconomicchamber.office@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone size={16} className="text-chamber-blue shrink-0" />
              <span>067 198 4100 / 068 334 1826</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <MapPin size={16} className="text-chamber-blue shrink-0 mt-0.5" />
              <span>Madadeni Sec 6, Red Street, Industrial Side, Unit 9</span>
            </div>
          </div>
          <a href="/" className="mt-8 inline-block px-8 py-3 bg-chamber-navy text-white rounded-full font-semibold hover:bg-slate-800 transition-colors">
            Return to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-chamber-navy mb-2">Membership Registration</h1>
          <p className="text-slate-500">Amajuba Economic Chamber of Commerce — Membership Application Form</p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0">
              <div
                className="h-full bg-chamber-blue transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STEPS.map(step => {
              const Icon = step.icon;
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done ? 'bg-chamber-blue border-chamber-blue' :
                    active ? 'bg-white border-chamber-blue shadow-md shadow-chamber-blue/20' :
                    'bg-white border-slate-200'
                  }`}>
                    {done
                      ? <CheckCircle2 size={20} className="text-white" />
                      : <Icon size={18} className={active ? 'text-chamber-blue' : 'text-slate-400'} />
                    }
                  </div>
                  <span className={`hidden sm:block text-[10px] font-semibold mt-1.5 text-center max-w-[70px] leading-tight ${
                    active ? 'text-chamber-blue' : done ? 'text-slate-500' : 'text-slate-400'
                  }`}>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-chamber-navy px-8 py-5">
            <p className="text-xs text-chamber-lightgold uppercase font-bold tracking-widest">Step {currentStep} of {STEPS.length}</p>
            <h2 className="text-xl font-bold text-white mt-1">{STEPS[currentStep - 1].title}</h2>
          </div>

          <form onKeyDown={handleFormKeyDown}>
            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >

                  {/* ── STEP 1 ── */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <FieldLabel required>First Name</FieldLabel>
                          <input type="text" required placeholder="First Name" className={inputClass}
                            value={formData.firstName} onChange={e => update('firstName', e.target.value)} />
                        </div>
                        <div>
                          <FieldLabel required>Last Name</FieldLabel>
                          <input type="text" required placeholder="Last Name" className={inputClass}
                            value={formData.lastName} onChange={e => update('lastName', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <FieldLabel required>Date of Birth</FieldLabel>
                        <input type="date" required className={inputClass}
                          value={formData.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel required>Gender</FieldLabel>
                        <div className="grid grid-cols-3 gap-3">
                          {['Male', 'Female', 'Other'].map(g => (
                            <RadioOption key={g} name="gender" value={g} label={g}
                              checked={formData.gender === g} onChange={v => update('gender', v)} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <FieldLabel required>Email Address</FieldLabel>
                        <input
                          type="email"
                          required
                          readOnly={Boolean(user?.email)}
                          placeholder="example@example.com"
                          className={`${inputClass} ${user?.email ? 'bg-slate-100 text-slate-500' : ''}`}
                          value={user?.email ?? formData.email}
                          onChange={e => update('email', e.target.value)}
                        />
                        <p className="mt-2 text-xs text-slate-500">
                          {user?.email
                            ? 'Your account email is used for this application and your profile dashboard.'
                            : 'Enter the email address you want associated with this registration.'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <FieldLabel required>Phone Number</FieldLabel>
                          <input type="tel" required placeholder="(000) 000-0000" className={inputClass}
                            value={formData.phone} onChange={e => update('phone', e.target.value)} />
                        </div>
                        <div>
                          <FieldLabel>Alternative Phone Number</FieldLabel>
                          <input type="tel" placeholder="(000) 000-0000" className={inputClass}
                            value={formData.altPhone} onChange={e => update('altPhone', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2 ── */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <p className="text-sm text-slate-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                        Complete this section if you are registering on behalf of a business or organisation. Leave blank if registering as an individual.
                      </p>
                      <div>
                        <FieldLabel>Business Name</FieldLabel>
                        <input type="text" placeholder="Business Name" className={inputClass}
                          value={formData.businessName} onChange={e => update('businessName', e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Registration Number</FieldLabel>
                        <input type="text" placeholder="e.g. 2026 / 354235 / 08" className={inputClass}
                          value={formData.businessRegNumber} onChange={e => update('businessRegNumber', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <FieldLabel>Type of Business</FieldLabel>
                          <input type="text" placeholder="e.g. Sole Proprietor, PTY Ltd" className={inputClass}
                            value={formData.typeOfBusiness} onChange={e => update('typeOfBusiness', e.target.value)} />
                        </div>
                        <div>
                          <FieldLabel>Industry / Sector</FieldLabel>
                          <input type="text" placeholder="e.g. Agriculture, Manufacturing" className={inputClass}
                            value={formData.industrySector} onChange={e => update('industrySector', e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Business Address</FieldLabel>
                        <input type="text" placeholder="Street address" className={inputClass}
                          value={formData.businessAddress} onChange={e => update('businessAddress', e.target.value)} />
                      </div>
                      <div>
                        <FieldLabel>Number of Employees</FieldLabel>
                        <input type="number" placeholder="e.g. 25" min="0" className={inputClass}
                          value={formData.numberOfEmployees} onChange={e => update('numberOfEmployees', e.target.value)} />
                      </div>
                    </div>
                  )}

                  {/* ── STEP 3 ── */}
                  {currentStep === 3 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-500 mb-4">Select the membership category that best describes you or your organisation.</p>
                      {['Individual Member', 'Small Business Member', 'Corporate Member', 'Youth/Student Member', 'Non-Profit Organization'].map(cat => (
                        <RadioOption key={cat} name="membershipCategory" value={cat} label={cat}
                          checked={formData.membershipCategory === cat} onChange={v => update('membershipCategory', v)} />
                      ))}
                    </div>
                  )}

                  {/* ── STEP 4 ── */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div>
                        <FieldLabel required>Please tell us why you want to join Amajuba Economic Chamber</FieldLabel>
                        <textarea
                          required rows={7}
                          placeholder="Describe your motivation for joining, what you hope to contribute, and what you aim to gain from membership..."
                          className={`${inputClass} resize-none`}
                          value={formData.motivation}
                          onChange={e => update('motivation', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── STEP 5 ── */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <FieldLabel required>Supporting Documents</FieldLabel>
                        <p className="text-xs text-slate-500 mb-3">Please indicate which documents you are providing:</p>
                        <div className="space-y-2">
                          {[
                            'Copy of Valid ID or Passport',
                            'Business Registration Documents (if applicable)',
                            'Proof of Residence',
                            'Company Profile (optional)',
                          ].map(doc => (
                            <CheckOption key={doc} label={doc}
                              checked={formData.supportingDocs.includes(doc)}
                              onChange={() => toggleDoc(doc)} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Upload Supporting Documents</FieldLabel>
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                          <RegistrationDocumentUpload
                            onUploadSuccess={(publicUrl) => {
                              setUploadedDocumentUrls(prev => [...prev, publicUrl])
                            }}
                          />
                          <p className="text-xs text-slate-400 mt-3">After selecting a file, click the <strong>Upload</strong> button to add it to your application.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 6 ── */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed">
                        I hereby declare that the information provided above is true and correct to the best of my knowledge. I agree to abide by the constitution, rules, and regulations of the Amajuba Economic Chamber and commit to supporting its mission of promoting growth and prosperity in the region.
                      </div>
                      <div>
                        <FieldLabel required>Applicant Signature</FieldLabel>
                        <p className="text-xs text-slate-500 mb-2">Draw your signature in the box below using your mouse or finger.</p>
                        <SignaturePad value={formData.signatureData} onChange={v => update('signatureData', v)} />
                      </div>
                      <div>
                        <FieldLabel required>Date</FieldLabel>
                        <input type="date" required className={inputClass}
                          value={formData.declarationDate} onChange={e => update('declarationDate', e.target.value)} />
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-8 pb-8 md:px-10 flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <div className="text-xs text-slate-400 hidden sm:block">
                {currentStep} / {STEPS.length}
              </div>
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-chamber-navy text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-chamber-navy/20"
                >
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-chamber-blue text-white font-bold text-sm hover:bg-chamber-navy transition-all shadow-lg shadow-chamber-blue/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving…' : 'Submit Application'} <CheckCircle2 size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Amajuba Economic Chamber | All Rights Reserved — Promoting Growth &amp; Prosperity
        </p>
      </div>
    </div>
  );
}
