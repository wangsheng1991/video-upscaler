import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const demos = [
  { before: '/compare-parrot.jpg', after: '/compare-parrot.jpg', label: 'Wildlife / Feather Detail', desc: 'See how each model handles fine texture' },
  { before: '/compare-city.jpg', after: '/compare-city.jpg', label: 'Architecture / Edge Sharpness', desc: 'Test edge halo and ringing artifacts' },
  { before: '/seed-portrait.jpg', after: '/seed-portrait.jpg', label: 'Portrait / Skin Texture', desc: 'Compare plastic vs realistic skin' },
  { before: '/bench-anime.jpg', after: '/bench-anime.jpg', label: 'Anime / Line Art', desc: 'Check line integrity and color accuracy' },
];

export default function HeroSliderDemo() {
  const [active, setActive] = useState(0);
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);

  const current = demos[active];

  const handleMove = (clientX: number) => {
    const rect = document.getElementById('slider-container')?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    setSplit(pct);
  };

  return (
    <div className="w-full py-16">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">Interactive Demo</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Drag to Compare — No Upload Needed
          </h2>
          <p className="text-white/40 text-sm mt-2">
            See the difference before you commit. 4 pre-loaded scenarios.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          {demos.map((d, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setSplit(50); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                active === i ? 'bg-cyan/15 text-cyan border border-cyan/30' : 'text-white/30 hover:text-white/50'
              }`}
            >
              {d.label.split(' / ')[0]}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div
          id="slider-container"
          className="relative rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10"
          style={{ height: '420px' }}
          onMouseDown={(e) => { setDragging(true); handleMove(e.clientX); }}
          onMouseMove={(e) => { if (dragging) handleMove(e.clientX); }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onTouchStart={(e) => { setDragging(true); handleMove(e.touches[0].clientX); }}
          onTouchMove={(e) => { if (dragging) handleMove(e.touches[0].clientX); }}
          onTouchEnd={() => setDragging(false)}
        >
          {/* After (full, high quality) */}
          <img src={current.after} alt="Enhanced" className="absolute inset-0 w-full h-full object-cover" />

          {/* Before (clipped, low quality) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
          >
            <img
              src={current.before}
              alt="Original"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(2px) saturate(0.45) contrast(0.8) brightness(0.85)' }}
            />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)]" />
          </div>

          {/* Split line */}
          <div
            className="absolute top-0 bottom-0 z-20"
            style={{
              left: `${split}%`,
              width: '3px',
              background: 'linear-gradient(to bottom, transparent, #00E5FF 20%, #00E5FF 80%, transparent)',
              boxShadow: '0 0 12px rgba(0,229,255,0.5)',
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-cyan/50 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-cyan -mr-0.5" />
              <ChevronRight className="w-4 h-4 text-cyan -ml-0.5" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-black/50 text-white/50 text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm">
              480P Original
            </span>
          </div>
          <div className="absolute bottom-4 right-4 z-20">
            <span className="bg-cyan/20 text-cyan text-xs font-mono px-3 py-1 rounded-full backdrop-blur-sm border border-cyan/30">
              4K AI Enhanced
            </span>
          </div>
        </div>

        {/* Info + CTA */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <div>
            <p className="text-white/50 text-sm font-medium">{current.label}</p>
            <p className="text-white/30 text-xs">{current.desc}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 bg-cyan text-void font-semibold px-5 py-2.5 rounded-2xl text-sm hover:shadow-glow-cyan transition-all"
          >
            Upload Your Own <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
