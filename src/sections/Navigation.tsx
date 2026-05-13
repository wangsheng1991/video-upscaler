import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, ArrowUpRight, User, LayoutDashboard } from 'lucide-react';

const navLinks = [
  { label: 'Compare', href: '#upload' },
  { label: '8 Pains', href: '#painpoints' },
  { label: 'Models', href: '#models' },
  { label: 'Blog', href: '/blog' },
  { label: 'VRAM Calc', href: '/tools/vram-calculator' },
];

const pageNavLinks = [
  { label: 'Compare', to: '/' },
  { label: 'Models', to: '/#models' },
  { label: 'Blog', to: '/blog' },
  { label: 'VRAM Calc', to: '/tools/vram-calculator' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isModelPage = location.pathname.startsWith('/model/');
  const isBlogPage = location.pathname.startsWith('/blog');
  const isToolPage = location.pathname.startsWith('/tools/');
  const isSubPage = isModelPage || isBlogPage || isToolPage;
  const isDash = location.pathname === '/dashboard';
  const isLogin = location.pathname === '/login';
  const hideNav = isDash || isLogin;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (hideNav) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
      scrolled || isSubPage ? 'bg-void/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-[1280px] w-full mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-cyan flex items-center justify-center">
            <span className="text-void font-bold text-sm">d</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-white font-bold text-lg tracking-tight">dlss5</span>
            <span className="text-white/40 text-sm font-medium">Compare</span>
          </div>
        </Link>

        {!isSubPage && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link key={link.label} to={link.href} className="text-white/50 text-sm hover:text-white transition-colors duration-200">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className="text-white/50 text-sm hover:text-white transition-colors duration-200">
                  {link.label}
                </a>
              )
            ))}
          </div>
        )}

        {isSubPage && (
          <div className="hidden md:flex items-center gap-6">
            {pageNavLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-white/50 text-sm hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="hidden md:flex items-center gap-3">
          {!isModelPage && (
            <a href="https://dlls5.app" target="_blank" rel="noopener noreferrer" className="text-white/50 text-sm hover:text-white transition-colors px-4 py-2 flex items-center gap-1">
              dlls5.app <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors px-3 py-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-cyan" />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-cyan text-void text-sm font-semibold px-5 py-2 rounded-3xl hover:shadow-glow-cyan hover:scale-[1.02] transition-all duration-300"
            >
              Try Free
            </button>
          )}
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-void/95 backdrop-blur-xl border-b border-white/5 md:hidden">
          <div className="px-6 py-6 flex flex-col gap-4">
            {isSubPage ? (
              pageNavLinks.map((link) => (
                <Link key={link.label} to={link.to} className="text-white/70 text-base py-2 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))
            ) : (
              navLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link key={link.label} to={link.href} className="text-white/70 text-base py-2 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} className="text-white/70 text-base py-2 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </a>
                )
              ))
            )}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              {user ? (
                <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="text-white/70 text-base py-2 text-left flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
              ) : (
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="bg-cyan text-void text-sm font-semibold px-5 py-2.5 rounded-3xl">
                  Try Free
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
