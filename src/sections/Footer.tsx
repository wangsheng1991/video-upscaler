import { Github, Twitter, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

const footerLinks: Record<string, { label: string; href: string; external?: boolean }[]> = {
  Product: [
    { label: 'Compare Tool', href: '/#upload' },
    { label: 'Model Library', href: '/#models' },
    { label: 'Benchmarks', href: '/#benchmarks' },
    { label: 'API Docs', href: '#' },
  ],
  Resources: [
    { label: 'AI-Gen Video Guide', href: '/blog/ai-generated-video-upscale' },
    { label: 'VRAM Calculator', href: '/tools/vram-calculator' },
    { label: 'ComfyUI Workflows', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Blog', href: '/blog' },
    { label: 'dlls5.app', href: 'https://dlls5.app', external: true },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'MIT License', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative w-full py-16 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan flex items-center justify-center">
                <span className="text-void font-bold text-sm">d</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-bold text-lg">dlss5</span>
                <span className="text-white/40 text-sm">Compare</span>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              The neutral AI upscaler comparison platform. Test open-source and commercial models side-by-side on your own content.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-medium text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/40 text-sm hover:text-white transition-colors duration-200 flex items-center gap-1">
                        {link.label} <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-white/40 text-sm hover:text-white transition-colors duration-200 flex items-center gap-1">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-white/40 text-sm hover:text-white transition-colors duration-200 flex items-center gap-1">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; 2026 dlss5 Compare. Independent benchmark platform. Not affiliated with NVIDIA.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/30 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-white/30 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
