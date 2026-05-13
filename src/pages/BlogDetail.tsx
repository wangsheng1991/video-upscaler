import { useParams, Link } from 'react-router';
import { getBlogPost } from '../data/blogData';
import { ArrowLeft, Calendar, Clock, Tag, ChevronRight, BookOpen } from 'lucide-react';
import { useEffect } from 'react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPost(slug ?? '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Article not found</p>
          <Link to="/blog" className="text-cyan hover:underline">Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-white">
      <Navigation />
      <main className="pt-24 pb-16">
        <article className="max-w-[800px] mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/30 text-sm mb-6">
            <Link to="/" className="hover:text-white/50 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-white/50 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/50 truncate">{post.title.slice(0, 40)}...</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/30 text-xs">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} read</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-80">
            <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {post.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan" /> {section.heading}
                </h2>
                {section.content && (
                  <div className="text-white/60 text-sm leading-relaxed whitespace-pre-line mb-4">
                    {section.content}
                  </div>
                )}
                {section.table && (
                  <div className="rounded-xl overflow-hidden border border-white/5 mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white/5">
                          {section.table.headers.map((h) => (
                            <th key={h} className="text-left text-white/50 text-xs font-mono px-4 py-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, ri) => (
                          <tr key={ri} className="border-t border-white/5">
                            {row.map((cell, ci) => (
                              <td key={ci} className="text-white/70 text-xs px-4 py-2">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 rounded-2xl border border-cyan/20 bg-cyan/[0.02]">
            <p className="text-white/60 text-sm mb-4">{post.cta}</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-cyan text-void font-semibold px-5 py-2.5 rounded-2xl text-sm hover:shadow-glow-cyan transition-all">
              <ArrowLeft className="w-4 h-4 rotate-180" /> Try the Comparison Tool
            </Link>
          </div>

          {/* SEO Keywords (hidden) */}
          <div className="hidden">{post.seoKeywords}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
