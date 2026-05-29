import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Landmark } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chamber-navy text-white pt-16 pb-8 border-t-[6px] border-chamber-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-12">
          
          {/* Brand Col */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 border-white/20">
                <img 
                  src="/logo.jpg" 
                  alt="Amajuba Economic Chamber Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const sibling = target.nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.classList.remove('hidden');
                  }} 
                />
                <div className="hidden">
                  <Landmark size={24} className="text-chamber-lightgold" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-white text-lg leading-tight uppercase">
                  Amajuba Economic
                </span>
                <span className="font-serif font-bold text-slate-300 text-sm leading-tight uppercase">
                  Chamber of Commerce
                </span>
              </div>
            </Link>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Serving as a catalyst for sustainable economic development across the Amajuba District. We operate through a structured governance framework promoting local enterprise development and inclusive growth.
            </p>
            <div className="inline-block mt-auto">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-chamber-lightgold uppercase tracking-wider font-semibold">
                Reg No: 2026 / 354235 / 08
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-serif text-lg font-semibold text-chamber-lightgold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors text-sm">About the Chamber</Link>
              </li>
              <li>
                <Link to="/blog" className="text-slate-300 hover:text-white transition-colors text-sm">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors text-sm">Contact Information</Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 hover:text-white transition-colors text-sm">Online Registration</Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col">
            <h3 className="font-serif text-lg font-semibold text-chamber-lightgold mb-6">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin className="text-chamber-lightgold shrink-0 mt-0.5" size={18} />
                <span className="text-slate-300 text-sm leading-relaxed">
                  KwaZulu-Natal - South Africa<br />
                  Madadeni Sec 6, Red Street<br />
                  Industrial Side, Unit 9
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-chamber-lightgold shrink-0" size={18} />
                <span className="text-slate-300 text-sm">
                  067 198 4100 / 068 334 1826
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-chamber-lightgold shrink-0" size={18} />
                <a href="mailto:amajubaeconomicchamber.office@gmail.com" className="text-slate-300 hover:text-white transition-colors text-sm">
                  amajubaeconomicchamber.office@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {currentYear} Amajuba Economic Chamber of Commerce. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs">
            Promoting Growth & Prosperity
          </p>
          <p className="text-slate-400 text-xs">
            Developed by{' '}
            <a
              href="https://computeintelligence.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chamber-lightgold hover:text-white transition-colors"
            >
              Compute Intelligence
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
