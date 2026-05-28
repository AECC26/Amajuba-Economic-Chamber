import { motion } from 'motion/react';
import { Target, Users, Map, Layers, Eye, Compass, BookOpen, Gavel, TrendingUp, Handshake } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function About() {
  useSEO({
    title: 'About the Chamber',
    description:
      'Learn about the Amajuba Economic Chamber of Commerce — our vision, mission, community empowerment programmes, and regional footprint across the Amajuba District, KwaZulu-Natal.',
    path: '/about',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About the Amajuba Economic Chamber of Commerce',
      url: 'https://amajubaeconomicchamber.org/about',
      description:
        'Vision, mission, community empowerment programmes, and regional footprint of the Amajuba Economic Chamber of Commerce.',
      mainEntity: {
        '@type': 'Organization',
        name: 'Amajuba Economic Chamber of Commerce',
        url: 'https://amajubaeconomicchamber.org',
      },
    },
  });

  const footprint = ['Dannhauser', 'Utrecht', 'Osizweni', 'Madadeni', 'Newcastle', 'Charlestown'];

  const programmes = [
    {
      icon: <Gavel size={22} className="text-chamber-blue" />,
      title: 'Tendering & Procurement',
      description: 'Training communities on municipal procurement processes, tender applications, compliance requirements, and ethical participation.',
    },
    {
      icon: <BookOpen size={22} className="text-chamber-blue" />,
      title: 'Governance Literacy',
      description: 'Building awareness of municipal structures, councillor roles, ward committees, civic rights, and public accountability mechanisms.',
    },
    {
      icon: <TrendingUp size={22} className="text-chamber-blue" />,
      title: 'Economic Participation',
      description: 'Supporting cooperative development, informal trader growth, youth enterprise, and community-owned economic models.',
    },
    {
      icon: <Handshake size={22} className="text-chamber-blue" />,
      title: 'LED Partnerships',
      description: 'Collaborating with the Newcastle Local Municipality and Amajuba District Municipality to align capacity-building with LED mandates.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-chamber-blue font-bold tracking-wider uppercase text-sm mb-2 block">Who We Are</span>
          <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-chamber-navy mb-6">About the Chamber</h1>
          <div className="w-24 h-1 bg-chamber-gold mx-auto rounded-full"></div>
          <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
            Reg No: 2026 / 354235 / 08 &nbsp;·&nbsp; KwaZulu-Natal, South Africa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-chamber-navy text-white rounded-2xl p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Eye size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-chamber-gold/20 rounded-lg flex items-center justify-center">
                  <Eye size={20} className="text-chamber-lightgold" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-chamber-lightgold">Our Vision</h2>
              </div>
              <p className="text-white text-lg leading-relaxed">
                To be the leading catalyst for sustainable economic development and inclusive prosperity in the Amajuba District — building a region where communities, businesses, and institutions thrive together.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Compass size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-chamber-blue/10 rounded-lg flex items-center justify-center">
                  <Compass size={20} className="text-chamber-blue" />
                </div>
                <h2 className="text-2xl font-bold font-serif text-chamber-navy">Our Mission</h2>
              </div>
              <p className="text-slate-700 text-base leading-relaxed">
                To serve as a structured platform that facilitates growth, innovation, and community empowerment — implementing targeted sectoral interventions across the <strong>Primary</strong> (Agriculture &amp; Mining), <strong>Secondary</strong> (Manufacturing &amp; Processing), and <strong>Tertiary</strong> (Services &amp; Distribution) sectors, while building integrated competence across knowledge, skills, and attitudes for lasting economic transformation.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Who We Are narrative + Core Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg text-slate-600"
          >
            <p className="lead text-xl text-chamber-navy font-medium mb-6">
              The Amajuba Economic Chamber of Commerce serves as a catalyst for sustainable economic development across the Amajuba District.
            </p>
            <p className="mb-4">
              We operate through a structured governance framework and implement targeted sectoral interventions aimed at strengthening economic participation, promoting local enterprise development, and driving inclusive growth.
            </p>
            <p>
              Our mandate is centred on transformation, sustainability, and structured collaboration across all sectors of the economy. We convene leaders from business, government, civil society, and academia to transform dialogue into action and shared understanding into measurable progress.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100"
          >
            <h3 className="text-2xl font-bold font-serif text-chamber-navy mb-6 flex items-center gap-3">
              <Target className="text-chamber-gold" size={28} />
              Core Value Proposition
            </h3>
            <p className="text-lg italic text-slate-700 leading-relaxed border-l-4 border-chamber-blue pl-6 py-2">
              "Developing integrated competence — woven from knowledge, skills, and attitudes — to drive economic transformation and sustainable livelihoods across all sectors within 3–5 years."
            </p>
          </motion.div>
        </div>

        {/* Community Empowerment Programmes */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-serif text-chamber-navy mb-3">Community Empowerment Programmes</h2>
            <div className="w-20 h-1 bg-chamber-gold mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 max-w-2xl mx-auto">
              In partnership with the Newcastle Local Municipality and Amajuba District Municipality LED Units, we deliver structured capacity-building initiatives that enable communities to participate meaningfully in local economic development.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.map((prog, i) => (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  {prog.icon}
                </div>
                <h4 className="font-bold text-chamber-navy mb-2">{prog.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{prog.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How We Work & Footprint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-2xl font-bold text-chamber-navy mb-6 flex items-center gap-3">
              <Layers className="text-chamber-blue" size={24} />
              How We Work
            </h3>
            <ul className="space-y-4">
              {[
                'Foresight and strategic planning',
                'Structured dialogue between stakeholders',
                'Cooperation across public and private sectors',
                'Accredited local facilitation and skills transfer',
                'Practical, measurable outcomes-based solutions',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="h-6 w-6 rounded-full bg-blue-50 text-chamber-blue flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-chamber-blue"></div>
                  </div>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-chamber-navy text-white rounded-xl shadow-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Map size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold font-serif text-chamber-lightgold mb-6 flex items-center gap-3">
                <Users className="text-white" size={24} />
                Our Regional Footprint
              </h3>
              <p className="text-slate-300 mb-6">
                We actively engage across the district, bringing together stakeholders to identify challenges, exchange insights, and advance a shared economic agenda in:
              </p>
              <div className="flex flex-wrap gap-3">
                {footprint.map(area => (
                  <span key={area} className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium border border-white/20">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
