import type { ReactNode } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '../data/posts';
import PostActions from '../components/PostActions';

function formatInlineText(text: string) {
  const fragments: Array<string | ReactNode> = [];
  const regex = /(\*\*[^*]+\*\*|==[^=]+==)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      fragments.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      fragments.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('==') && token.endsWith('==')) {
      fragments.push(
        <mark key={match.index} className="rounded-sm bg-chamber-gold/20 px-0.5 text-chamber-navy">
          {token.slice(2, -2)}
        </mark>,
      );
    } else {
      fragments.push(token);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    fragments.push(text.slice(lastIndex));
  }

  return fragments;
}

function renderSectionBody(body: string) {
  return body.split('\n\n').map((paragraph, index) => {
    const lines = paragraph.split('\n').filter(Boolean);

    if (lines.every(line => line.trim().startsWith('- '))) {
      return (
        <div key={index} className="space-y-2">
          {lines.map((line, lineIndex) => {
            const raw = line.trim().replace(/^-\s*/, '');
            const [label, rest] = raw.split(/:\s*/, 2);
            return (
              <div key={lineIndex} className="flex gap-3 items-start pl-2">
                <div className="w-2 h-2 rounded-full bg-chamber-blue mt-2 shrink-0" />
                <p>
                  <strong className="text-chamber-navy">{label}:</strong>{' '}
                  {rest ? formatInlineText(rest) : null}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <p key={index}>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex}>
            {formatInlineText(line)}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    );
  });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug ?? '');

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Cover hero */}
      <div className="relative h-72 md:h-[480px] overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chamber-navy/80 via-chamber-navy/40 to-transparent" />

        {/* Back link */}
        <div className="absolute top-6 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Blog
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-chamber-gold text-chamber-navy rounded-full text-xs font-bold uppercase tracking-wide mb-3">
              <Tag size={11} /> {post.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-snug max-w-3xl">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200"
        >
          <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
        </motion.div>

        {/* Intro pull-quote */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-xl text-chamber-navy font-medium leading-relaxed mb-12 border-l-4 border-chamber-gold pl-6"
        >
          {post.intro}
        </motion.p>

        {/* Sections */}
        <div className="space-y-12">
          {post.sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-chamber-navy mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-chamber-gold/20 text-chamber-gold text-sm font-extrabold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {section.heading}
              </h2>
              <div className="text-slate-700 leading-relaxed space-y-4">
                {renderSectionBody(section.body)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Like / Rate / Share */}
        <PostActions slug={post.slug} title={post.title} />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-chamber-navy rounded-3xl p-10 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-3">Ready to be part of the change?</h3>
          <p className="text-blue-200 mb-6 max-w-md mx-auto">
            Join the Amajuba Economic Chamber of Commerce and help shape the economic future of the district.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3 bg-chamber-gold text-chamber-navy font-bold rounded-full hover:bg-amber-400 transition-colors"
            >
              Become a Member <ArrowRight size={16} />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Ask the Chamber AI
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
