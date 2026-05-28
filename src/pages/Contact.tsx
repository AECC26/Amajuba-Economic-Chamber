import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';

export default function Contact() {
  useSEO({
    title: 'Contact Us',
    description:
      'Get in touch with the Amajuba Economic Chamber of Commerce. Visit us at Madadeni Sec 6, Red Street, or call 067 198 4100 / 068 334 1826.',
    path: '/contact',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact the Amajuba Economic Chamber of Commerce',
      url: 'https://amajubaeconomicchamber.org/contact',
      mainEntity: {
        '@type': 'Organization',
        name: 'Amajuba Economic Chamber of Commerce',
        telephone: ['+27-67-198-4100', '+27-68-334-1826'],
        email: 'amajubaeconomicchamber.office@gmail.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Madadeni Sec 6, Red Street, Industrial Side, Unit 9',
          addressLocality: 'Madadeni',
          addressRegion: 'KwaZulu-Natal',
          addressCountry: 'ZA',
        },
      },
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <span className="text-chamber-blue font-bold tracking-wider uppercase text-sm mb-2 block">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-chamber-navy mb-6">Contact Us</h1>
          <div className="w-24 h-1 bg-chamber-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-blue-50 text-chamber-blue rounded-full flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-chamber-navy mb-2">Visit Us</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  KwaZulu-Natal - South Africa<br />
                  Madadeni Sec 6, Red Street<br />
                  Industrial Side, Unit 9
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-blue-50 text-chamber-blue rounded-full flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-chamber-navy mb-2">Call Us</h3>
                <a href="tel:0671984100" className="block text-slate-600 text-sm hover:text-chamber-blue transition-colors mb-1">067 198 4100</a>
                <a href="tel:0683341826" className="block text-slate-600 text-sm hover:text-chamber-blue transition-colors">068 334 1826</a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-blue-50 text-chamber-blue rounded-full flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-chamber-navy mb-2">Email Us</h3>
                <a href="mailto:amajubaeconomicchamber.office@gmail.com" className="text-slate-600 text-sm hover:text-chamber-blue transition-colors break-all">
                  amajubaeconomicchamber.office@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-bold text-chamber-navy mb-6">Send us a Message</h2>
              
              {submitted ? (
                <div className="bg-green-50 text-green-800 p-6 rounded-lg border border-green-200 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Message Sent</h3>
                  <p>Thank you for reaching out. A representative from the chamber will contact you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-chamber-blue font-medium hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        id="name"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-chamber-blue outline-none text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-chamber-blue outline-none text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Subject</label>
                    <input 
                      type="text" 
                      id="subject"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-chamber-blue outline-none text-sm"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-chamber-blue outline-none text-sm resize-y"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-chamber-navy text-white rounded-full font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-chamber-navy/20"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
