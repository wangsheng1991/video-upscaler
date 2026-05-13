import { useState, useEffect } from 'react';
import { Upload, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

const heroCases = [
  { src: '/hero-tokyo.jpg', label: 'Tokyo Skyline', category: 'Cityscape', span: 'col-span-2 row-span-1' },
  { src: '/hero-space.jpg', label: 'Astronaut EVA', category: 'Sci-Fi', span: 'col-span-1 row-span-2' },
  { src: '/hero-sports.jpg', label: 'Slam Dunk', category: 'Sports', span: 'col-span-1 row-span-1' },
  { src: '/hero-canyon.jpg', label: 'Grand Canyon', category: 'Landscape', span: 'col-span-2 row-span-1' },
  { src: '/hero-leaf.jpg', label: 'Morning Dew', category: 'Macro', span: 'col-span-1 row-span-1' },
  { src: '/hero-pyramid.jpg', label: 'Giza Sunset', category: 'Travel', span: 'col-span-2 row-span-1' },
  { src: '/hero-sakura.jpg', label: 'Cherry Blossom', category: 'Nature', span: 'col-span-1 row-span-2' },
  { src: '/hero-fjord.jpg', label: 'Norway Fjord', category: 'Aerial', span: 'col-span-2 row-span-1' },
  { src: '/hero-craftsman.jpg', label: 'Leather Worker', category: 'Documentary', span: 'col-span-1 row-span-1' },
  { src: '/hero-balloon.jpg', label: 'Cappadocia', category: 'Travel', span: 'col-span-2 row-span-1' },
  { src: '/compare-parrot.jpg', label: 'Golden Parrot', category: 'Wildlife', span: 'col-span-1 row-span-1' },
  { src: '/seed-portrait.jpg', label: 'Studio Portrait', category: 'Portrait', span: 'col-span-1 row-span-1' },
  { src: '/case-mountain.jpg', label: 'Alpine Lake', category: 'Landscape', span: 'col-span-2 row-span-1' },
  { src: '/bench-anime.jpg', label: 'Cyberpunk City', category: 'Anime', span: 'col-span-1 row-span-1' },
];

function CompareTile({ item, index }: { item: typeof heroCases[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [splitPos, setSplitPos] = useState(12);

  useEffect(() => {
    if (!hovered) { setSplitPos(12); return; }
    let raf: number;
    const start = performance.now();
    const animate = (t: number) => {
      const p = Math.min((t - start) / 1000, 1);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setSplitPos(12 + 48 * ease);
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  return (
    <div
      className={`${item.span} relative rounded-xl overflow-hidden select-none cursor-crosshair`}
      style={{ animation: `floatH ${3 + (index % 4) * 0.4}s ease-in-out ${index * 0.2}s infinite` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 rounded-xl border border-white/[0.06] z-20 pointer-events-none" />
      <img src={item.src} alt={item.label} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden z-10" style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}>
        <img src={item.src} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(2px) saturate(0.4) contrast(0.75) brightness(0.8)' }} />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>
      <div className="absolute top-0 bottom-0 z-10 transition-all duration-300" style={{
        left: `${splitPos}%`, width: '2px',
        background: 'linear-gradient(to bottom,transparent,rgba(0,229,255,0.7)_20%,rgba(0,229,255,0.7)_80%,transparent)',
        boxShadow: '0 0 8px rgba(0,229,255,0.4)', opacity: hovered ? 1 : 0,
      }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm border border-cyan/40 flex items-center justify-center">
          <ChevronLeft className="w-2.5 h-2.5 text-cyan -mr-px" />
          <ChevronRight className="w-2.5 h-2.5 text-cyan -ml-px" />
        </div>
      </div>
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-end justify-between pointer-events-none">
        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm transition-all ${hovered ? 'bg-cyan/20 text-cyan' : 'bg-black/50 text-white/40'}`}>
          {hovered ? '4K Enhanced' : item.category}
        </span>
        <span className="text-[9px] font-mono text-white/30">{item.label}</span>
      </div>
      <div className="absolute top-2.5 left-2.5 z-20 flex gap-1 pointer-events-none">
        <span className="text-[8px] font-mono text-white/25 bg-black/40 px-1 py-0.5 rounded">480P</span>
        <span className="text-[8px] font-mono text-cyan/50 bg-cyan/10 px-1 py-0.5 rounded">4K</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { setTimeout(() => setIsVisible(true), 100); }, []);

  return (
    <section id="hero" className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-void to-surface z-0" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* HEADLINE */}
      <div className="relative z-10 pt-28 pb-4 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 border border-cyan/20 bg-cyan/5 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              <span className="text-cyan/80 text-[10px] font-mono tracking-wider">8 PAIN TESTED · 20+ MODELS · 1 PLATFORM</span>
            </div>
          </div>

          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-5 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Stop Guessing.
            <br />
            <span className="text-cyan">See Which AI Wins</span>
            <br className="hidden sm:block" />
            {' '}on YOUR Video.
          </h1>

          <p className={`text-base sm:text-lg text-white/45 max-w-[600px] mb-6 leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            Not all AI upscalers are equal. We measure 8 dimensions the industry ignores —
            flickering, edge halos, plastic skin, ghosting, color drift, AI artifacts —
            so you pick the right tool for your specific content.
          </p>

          <div className={`flex items-center gap-4 mb-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            <a href="#upload" className="flex items-center gap-2 bg-cyan text-void font-semibold px-6 py-3 rounded-3xl hover:scale-[1.02] hover:shadow-glow-cyan transition-all text-sm">
              <Upload className="w-4 h-4" />
              Upload & Compare
            </a>
            <a href="#painpoints" className="flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-3xl hover:bg-white/5 transition-all text-sm">
              <BarChart3 className="w-4 h-4" />
              8 Pain Points
            </a>
          </div>

          {/* Mini stats */}
          <div className={`flex items-center gap-6 sm:gap-10 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {[{ v: '8', l: 'Pain Dimensions' }, { v: '20+', l: 'AI Models' }, { v: '14', l: 'Demo Cases' }, { v: '0$', l: 'To Start' }].map((s, i) => (
              <div key={s.l} className="flex items-center gap-3">
                {i > 0 && <div className="hidden sm:block w-px h-5 bg-white/10" />}
                <span className="text-white font-bold text-lg">{s.v}</span>
                <span className="text-white/30 text-xs">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MASONRY WALL */}
      <div className="relative z-10 px-3 sm:px-6 pb-6">
        <div className="max-w-[1280px] mx-auto">
          <div className={`flex items-center justify-between mb-3 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white/25 text-[10px] font-mono tracking-wider">Hover tiles — 480P vs 4K split reveal</span>
            <span className="text-white/20 text-[10px] font-mono">14 real cases across all content types</span>
          </div>
          <div className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 auto-rows-[95px] sm:auto-rows-[110px] md:auto-rows-[120px] transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            {heroCases.map((item, i) => <CompareTile key={item.src} item={item} index={i} />)}
          </div>
        </div>
      </div>

      {/* QUICK UPLOAD BAR */}
      <div className="relative z-10 px-6 pb-16">
        <div className="max-w-[700px] mx-auto">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
            className={`rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-cyan bg-cyan/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-cyan" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Drop image or video here to compare</p>
                  <p className="text-white/25 text-[10px] font-mono">JPG PNG MP4 MOV · max 5s · 50MB · No login required</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <a href="#results" className="flex items-center gap-2 bg-cyan text-void font-semibold px-5 py-2.5 rounded-2xl text-sm hover:shadow-glow-cyan hover:scale-[1.02] transition-all whitespace-nowrap">
                <BarChart3 className="w-4 h-4" />
                See Results
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-void to-transparent z-10 pointer-events-none" />

      <style>{`@keyframes floatH { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }`}</style>
    </section>
  );
}
