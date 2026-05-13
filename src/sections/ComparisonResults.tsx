import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Download, Star, Lock, Unlock } from 'lucide-react';

interface ResultItem {
  modelId: string;
  modelName: string;
  tag: string;
  type: 'open' | 'closed';
  style: React.CSSProperties;
  rating: number;
  speed: string;
  note: string;
  colorClass: string;
}

const results: ResultItem[] = [
  {
    modelId: 'flashvsr',
    modelName: 'FlashVSR',
    tag: 'Speed King',
    type: 'open',
    style: { filter: 'contrast(1.05) saturate(1.08) brightness(1.02)' },
    rating: 4.5,
    speed: '~17 FPS',
    note: 'Fastest real-time processing. Slight sharpening artifacts on complex edges.',
    colorClass: 'border-gold/30',
  },
  {
    modelId: 'seedvr2',
    modelName: 'SeedVR2',
    tag: 'Best Quality',
    type: 'open',
    style: { filter: 'contrast(1.0) saturate(1.0) brightness(1.0)' },
    rating: 4.9,
    speed: '~1.7 FPS',
    note: 'Most natural texture reconstruction. Preserves skin pores and fabric weave.',
    colorClass: 'border-purple-500/30',
  },
  {
    modelId: 'topaz',
    modelName: 'Topaz Video AI',
    tag: 'Pro Workflow',
    type: 'closed',
    style: { filter: 'contrast(1.02) saturate(0.98) brightness(1.03)' },
    rating: 4.7,
    speed: '~0.5 FPS',
    note: 'Smoothest temporal consistency. Best for professional deliverables.',
    colorClass: 'border-emerald-500/30',
  },
  {
    modelId: 'realesrgan',
    modelName: 'Real-ESRGAN',
    tag: 'Anime Detail',
    type: 'open',
    style: { filter: 'contrast(1.08) saturate(1.15) brightness(1.0)' },
    rating: 4.3,
    speed: '~8 FPS',
    note: 'Exceptional on line art and 2D content. Can oversharpen photos.',
    colorClass: 'border-cyan/30',
  },
];

const compareImages = [
  { src: '/seed-portrait.jpg', label: 'Portrait / Skin Texture', desc: 'Testing fine detail recovery on human subjects' },
  { src: '/case-mountain.jpg', label: 'Landscape / Wide Shot', desc: 'Testing edge preservation on natural scenery' },
  { src: '/bench-anime.jpg', label: 'Anime / Line Art', desc: 'Testing color and line integrity on stylized content' },
  { src: '/bench-vintage.jpg', label: 'Vintage / Archival', desc: 'Testing grain handling and restoration on old footage' },
  { src: '/bench-aigen.jpg', label: 'AI-Generated / Sci-Fi', desc: 'Testing artifact removal on AI-generated video frames' },
];

export default function ComparisonResults() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); }
        });
      }, { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const activeImg = compareImages[activeImageIdx];

  return (
    <section id="results" ref={ref} className="relative w-full py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">Step 2</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Side-by-Side Results</h2>
          <p className="text-white/40 text-sm mt-2 max-w-[500px] mx-auto">
            Same input, 4 different AI models. Hover any result to see the original low-res input.
          </p>
        </div>

        {/* Image selector tabs */}
        <div className={`flex items-center justify-center gap-2 mb-8 flex-wrap transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {compareImages.map((img, i) => (
            <button
              key={img.label}
              onClick={() => setActiveImageIdx(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeImageIdx === i
                  ? 'bg-cyan/15 text-cyan border border-cyan/30'
                  : 'text-white/30 hover:text-white/50 border border-transparent'
              }`}
            >
              {img.label.split(' / ')[0]}
            </button>
          ))}
        </div>

        {/* Compare grid */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Original (leftmost, smaller on desktop) */}
          <div className="col-span-2 lg:col-span-1 rounded-2xl overflow-hidden border border-white/5 bg-surface relative group">
            <div className="absolute top-3 left-3 z-20">
              <span className="text-[10px] font-mono text-white/40 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">ORIGINAL 480P</span>
            </div>
            <img
              src={activeImg.src}
              alt="Original"
              className="w-full h-full object-cover"
              style={{ filter: 'blur(2px) saturate(0.5) contrast(0.8) brightness(0.85)', height: '280px' }}
            />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_4px)]" />
          </div>

          {/* Model results */}
          {results.map((r, i) => (
            <div
              key={r.modelId}
              className={`rounded-2xl overflow-hidden border ${r.colorClass} bg-surface relative group cursor-pointer hover:border-opacity-60 transition-all duration-300`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Model badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  r.type === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {r.type === 'open' ? 'OPEN' : 'CLOSED'}
                </span>
                {r.tag && (
                  <span className="text-[9px] font-mono text-white/40 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {r.tag}
                  </span>
                )}
              </div>

              {/* Image with model-specific styling */}
              <div className="relative overflow-hidden" style={{ height: '200px' }}>
                <img
                  src={activeImg.src}
                  alt={r.modelName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={r.style}
                />
                {/* Hover: show original overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <img
                    src={activeImg.src}
                    alt="Original"
                    className="w-full h-full object-cover"
                    style={{ filter: 'blur(2px) saturate(0.5) contrast(0.8) brightness(0.85)' }}
                  />
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] font-mono text-white/50 bg-black/50 px-2 py-0.5 rounded">Original (hover to see)</span>
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <div className="p-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{r.modelName}</span>
                  <div className="flex items-center gap-1">
                    {r.type === 'open' ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-blue-400" />}
                    <span className="text-white/30 text-[10px] font-mono">{r.speed}</span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className={`w-3 h-3 ${si < Math.floor(r.rating) ? 'text-gold fill-gold' : 'text-white/10'}`} />
                  ))}
                  <span className="text-white/40 text-[10px] ml-1">{r.rating}</span>
                </div>

                <p className="text-white/30 text-[10px] leading-relaxed line-clamp-2">{r.note}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scene info */}
        <div className={`mt-6 text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/30 text-xs">
            <span className="text-cyan font-mono">Scene:</span> {activeImg.desc}
          </p>
        </div>

        {/* Download CTA */}
        <div className={`mt-10 flex items-center justify-center gap-4 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-2xl hover:bg-white/10 transition-all text-sm">
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button className="flex items-center gap-2 text-cyan hover:text-cyan/80 transition-colors text-sm">
            View Full Benchmark <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
