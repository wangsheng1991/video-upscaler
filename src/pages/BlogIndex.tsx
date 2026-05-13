import { Link } from 'react-router';
import { blogPosts } from '../data/blogData';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-void text-white">
      <Navigation />
      <div className="pt-24 pb-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-12">
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">Blog & Guides</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Deep Dives & Technical Guides
          </h1>
          <p className="text-white/40 text-sm mt-2 max-w-[500px]">
            In-depth comparisons, problem-solving guides, and workflow recommendations for AI video super-resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group rounded-2xl glass-panel overflow-hidden hover:border-white/15 transition-all duration-300"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
                <h2 className="text-white font-semibold text-base mb-2 group-hover:text-cyan transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-white/40 text-xs mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-4 text-white/25 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
