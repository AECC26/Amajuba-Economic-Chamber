import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Tag, ArrowRight, BookOpen, Star } from 'lucide-react';
import { posts } from '../data/posts';
import { usePostRatingSummaries } from '../hooks/usePostRatingSummary';

export default function Blog() {
  const ratingSummaries = usePostRatingSummaries(posts.map(p => p.slug));

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Page header */}
      <div className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-chamber-blue font-bold tracking-wider uppercase text-sm mb-3">
            <BookOpen size={16} />
            <span>Chamber Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-chamber-navy mb-4">Our Blog</h1>
          <div className="w-20 h-1 bg-chamber-gold mx-auto rounded-full" />
          <p className="mt-5 text-slate-500 max-w-xl mx-auto">
            In-depth articles on economic development, community empowerment, and the work of the Amajuba Economic Chamber of Commerce.
          </p>
        </div>
      </div>

      {/* Post list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <Link to={`/blog/${post.slug}`} className="flex flex-col md:flex-row">

                {/* Cover thumbnail */}
                <div className="md:w-72 lg:w-80 shrink-0 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-52 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between p-7 lg:p-9 flex-1">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-chamber-gold/15 text-chamber-navy rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                      <Tag size={11} /> {post.category}
                    </span>

                    <h2 className="text-xl lg:text-2xl font-extrabold text-chamber-navy leading-snug mb-3 group-hover:text-chamber-blue transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><User size={12} /> {post.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-chamber-blue group-hover:gap-2.5 transition-all">
                      Read article <ArrowRight size={14} />
                    </span>
                  </div>

                  {/* Star rating summary */}
                  {(() => {
                    const summary = ratingSummaries[post.slug];
                    if (!summary || summary.avgRating === null) return null;
                    const filled = Math.round(summary.avgRating);
                    return (
                      <div className="mt-3 flex items-center gap-1.5">
                        {[1,2,3,4,5].map(s => (
                          <Star
                            key={s}
                            size={13}
                            className={s <= filled ? 'fill-chamber-gold text-chamber-gold' : 'text-slate-300'}
                          />
                        ))}
                        <span className="text-xs text-slate-400 ml-1">
                          {summary.avgRating} ({summary.ratingCount} {summary.ratingCount === 1 ? 'rating' : 'ratings'})
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

    </div>
  );
}
