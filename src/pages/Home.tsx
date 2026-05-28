import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pickaxe, Factory, ShoppingCart, ArrowRight, Users, TrendingUp, Building, MapPin, ChevronDown } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Home() {
  useSEO({
    title: 'Amajuba Economic Chamber of Commerce | Promoting Growth & Prosperity',
    description:
      'The Amajuba Economic Chamber of Commerce drives sustainable economic development across the Amajuba District, KwaZulu-Natal. 500+ members. Primary, Secondary & Tertiary sectors.',
    path: '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Amajuba Economic Chamber of Commerce',
      url: 'https://amajubaeconomicchamber.org',
      description:
        'Driving sustainable economic development across the Amajuba District, KwaZulu-Natal, South Africa.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://amajubaeconomicchamber.org/blog?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  });

  const sectors = [
    {
      title: 'Primary Sector',
      icon: <Pickaxe size={32} className="text-chamber-blue" />,
      description: 'Focused on extraction and raw materials including Agriculture and Mining to provide foundational resources.',
      color: 'bg-blue-50',
    },
    {
      title: 'Secondary Sector',
      icon: <Factory size={32} className="text-chamber-blue" />,
      description: 'Focused on manufacturing and processing, including Steel, Textiles, Chemicals, and Industrial processing.',
      color: 'bg-slate-50',
    },
    {
      title: 'Tertiary Sector',
      icon: <ShoppingCart size={32} className="text-chamber-blue" />,
      description: 'Focused on services, distribution, retail, professional services, and logistics ensuring robust service delivery.',
      color: 'bg-blue-50',
    },
  ];

  const stats = [
    { icon: <Users size={22} />, value: '500+', label: 'Members' },
    { icon: <Building size={22} />, value: '6', label: 'Local Municipalities' },
    { icon: <TrendingUp size={22} />, value: '3', label: 'Economic Sectors' },
  ];

  return (
    <div className="flex flex-col">

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-chamber-navy">

        {/* Background image with parallax feel */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2940&auto=format&fit=crop')`,
          }}
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-chamber-navy/95 via-chamber-navy/80 to-chamber-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-chamber-navy/60" />

        {/* Decorative geometric shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-chamber-blue/10 blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-chamber-gold/10 blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-chamber-gold to-transparent" />

        {/* Vertical gold rule — desktop only */}
        <div className="absolute left-[max(2rem,calc(50%-38rem))] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-chamber-gold/30 to-transparent hidden lg:block" />

        {/* Main content — split layout */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Left column — text */}
              <div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6"
                >
                  Promoting{' '}
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-chamber-gold to-amber-400">
                      Growth
                    </span>
                    {/* Underline accent */}
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-300 to-chamber-gold rounded-full" />
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-chamber-gold to-amber-300">
                    &amp; Prosperity
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="text-lg text-blue-100/90 mb-10 max-w-lg leading-relaxed"
                >
                  We serve as a catalyst for sustainable economic development across the Amajuba District — transforming dialogue into action and shared understanding into measurable progress.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-chamber-gold text-chamber-navy font-bold rounded-full hover:bg-amber-400 transition-all shadow-xl shadow-amber-900/30 text-base group"
                  >
                    Become a Member
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all text-base border border-white/25"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>

              {/* Right column — stats cards */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:flex flex-col gap-4"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                    className="flex items-center gap-5 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-5 hover:bg-white/12 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-chamber-gold/20 flex items-center justify-center text-chamber-gold shrink-0">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-3xl font-extrabold text-white leading-none">{stat.value}</div>
                      <div className="text-sm text-blue-200 font-medium mt-0.5">{stat.label}</div>
                    </div>
                    {/* Decorative right bar */}
                    <div className="ml-auto w-1 h-10 rounded-full bg-gradient-to-b from-chamber-gold/60 to-transparent" />
                  </motion.div>
                ))}

                {/* Reg badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.5 }}
                  className="mt-2 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <p className="text-xs text-blue-300/70 font-medium uppercase tracking-widest mb-1">Registered Entity</p>
                  <p className="text-white/80 text-sm font-semibold">Reg No: 2026 / 354235 / 08</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Mobile stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="lg:hidden mt-12 grid grid-cols-3 gap-3"
            >
              {stats.map(stat => (
                <div key={stat.label} className="flex flex-col items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl py-4 px-2">
                  <div className="text-chamber-gold">{stat.icon}</div>
                  <span className="text-2xl font-extrabold text-white leading-none">{stat.value}</span>
                  <span className="text-[10px] text-blue-200 font-medium uppercase tracking-wide text-center">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="relative z-10 flex justify-center pb-8"
        >
          <div className="flex flex-col items-center gap-1 text-white/40">
            <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
            <ChevronDown size={16} className="animate-bounce" />
          </div>
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 80 L0 40 C240 10 480 60 720 40 C960 20 1200 55 1440 35 L1440 80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Core Sectors ── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-chamber-navy mb-4">Our Economic Development Framework</h2>
            <div className="w-24 h-1 bg-chamber-gold mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our strategy is organized across three interconnected economic sectors, aligned with standard economic classification to drive transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`${sector.color} rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}
              >
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {sector.icon}
                </div>
                <h3 className="text-xl font-bold text-chamber-navy mb-3">{sector.title}</h3>
                <p className="text-slate-600 leading-relaxed">{sector.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Prop Banner ── */}
      <section className="py-20 bg-chamber-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-balance">
          <h2 className="text-2xl md:text-4xl font-serif font-medium leading-relaxed italic">
            "Developing integrated competence — woven from knowledge, skills, and attitudes — to drive economic transformation and sustainable livelihoods across all sectors within 3–5 years."
          </h2>
          <div className="mt-8 flex justify-center">
            <Link
              to="/about"
              className="text-white border-b border-chamber-gold bg-transparent pb-1 hover:text-chamber-lightgold transition-colors font-medium"
            >
              Read our full strategic framework
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
