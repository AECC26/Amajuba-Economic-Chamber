import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, LogOut, Home, LayoutDashboard, MessageSquare, Info, Phone, UserPlus, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const publicNavLinks = [
  { title: 'Home', path: '/' },
  { title: 'About Us', path: '/about' },
  { title: 'Blog', path: '/blog' },
  { title: 'Contact', path: '/contact' },
];

const authNavLinks = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Chat', path: '/chat', icon: MessageSquare },
  { title: 'About Us', path: '/about', icon: Info },
  { title: 'Contact', path: '/contact', icon: Phone },
];

const activeDesktopClass = 'text-chamber-navy border-b-2 border-chamber-lightgold -mb-[2px] pb-[22px]';
const inactiveDesktopClass = 'text-slate-600 hover:text-chamber-navy';
const activeMobileClass = 'bg-chamber-navy/5 text-chamber-navy font-semibold';
const inactiveMobileClass = 'text-slate-700 hover:bg-slate-50 hover:text-chamber-navy';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-slate-100 overflow-hidden">
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
              <div className="hidden w-full h-full bg-chamber-navy flex-col items-center justify-center text-white">
                <div className="w-6 h-6 border-t-2 border-r-2 border-chamber-lightgold rotate-45 transform -translate-x-1 translate-y-1" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-chamber-navy text-lg uppercase">AMAJUBA</span>
              <span className="font-medium text-[9px] text-slate-500 tracking-widest uppercase mt-1">
                Economic Chamber of Commerce
              </span>
            </div>
          </Link>

          {/* ── AUTHENTICATED DESKTOP ── */}
          {user ? (
            <>
              <nav className="hidden md:flex items-center space-x-6">
                {authNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        isActive ? activeDesktopClass : inactiveDesktopClass
                      }`
                    }
                  >
                    <link.icon size={14} />
                    {link.title}
                  </NavLink>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-2">
                {/* Member Registration CTA */}
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 bg-chamber-navy text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-sm shadow-chamber-navy/20"
                >
                  <UserPlus size={14} />
                  Member Registration
                </Link>

                {/* Profile icon */}
                <Link
                  to="/dashboard"
                  title="My Dashboard"
                  className="w-9 h-9 rounded-full bg-chamber-navy text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <User size={16} />
                </Link>

                {/* Logout icon */}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  title="Sign Out"
                  aria-label="Sign Out"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex md:hidden text-slate-600 hover:text-chamber-navy focus:outline-none"
                aria-label="Toggle menu"
              >
                <Menu size={28} />
              </button>
            </>
          ) : (
            /* ── UNAUTHENTICATED DESKTOP ── */
            <>
              <nav className="hidden md:flex items-center space-x-8">
                {publicNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors ${
                        isActive ? activeDesktopClass : inactiveDesktopClass
                      }`
                    }
                  >
                    {link.title}
                  </NavLink>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/auth"
                  className="px-5 py-2 border border-slate-200 text-sm font-semibold rounded-full hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-chamber-navy text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-sm shadow-chamber-navy/20"
                >
                  Member Portal
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex md:hidden text-slate-600 hover:text-chamber-navy focus:outline-none"
                aria-label="Toggle menu"
              >
                <Menu size={28} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            {user ? (
              <div className="px-3 pt-3 pb-5 flex flex-col gap-1">
                {/* User identity strip */}
                <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-chamber-navy text-white">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <User size={18} />
                  </div>
                  <span className="text-sm font-medium truncate">{user.email}</span>
                </div>

                {authNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={close}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? activeMobileClass : inactiveMobileClass
                      }`
                    }
                  >
                    <link.icon size={16} className="shrink-0" />
                    {link.title}
                  </NavLink>
                ))}

                <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/register"
                    onClick={close}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-chamber-navy text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <UserPlus size={15} />
                    Member Registration
                  </Link>
                  <button
                    type="button"
                    onClick={() => { void signOut(); close(); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="shrink-0" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3 pt-3 pb-5 flex flex-col gap-1">
                {publicNavLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={close}
                    className={({ isActive }) =>
                      `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? activeMobileClass : inactiveMobileClass
                      }`
                    }
                  >
                    {link.title}
                  </NavLink>
                ))}

                <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/auth"
                    onClick={close}
                    className="w-full text-center px-5 py-2.5 border border-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={close}
                    className="w-full text-center px-5 py-2.5 bg-chamber-navy text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Member Portal
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
