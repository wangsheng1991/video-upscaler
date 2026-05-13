import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, Zap, Layers, Wand2, Cpu, ArrowRight, Star, Video, ChevronRight } from 'lucide-react';

interface ModelDef {
  id: string;
  name: string;
  category: 'image' | 'video';
  type: 'open' | 'closed';
  org: string;
  year: string;
  tags: string[];
  desc: string;
  bestFor: string;
  speed: string;
  icon: typeof Sparkles;
  color: string;
  link: string;
}

const models: ModelDef[] = [
  // Image - Open
  { id: 'realesrgan', name: 'Real-ESRGAN', category: 'image', type: 'open', org: 'Tencent', year: '2021', tags: ['4x', 'Anime', 'Photo'], desc: 'Enhanced SRGAN for practical restoration with pure synthetic data training.', bestFor: 'Anime, line art, game textures', speed: 'Fast', icon: Layers, color: 'text-cyan', link: '#' },
  { id: 'swinir', name: 'SwinIR-L', category: 'image', type: 'open', org: 'Microsoft', year: '2022', tags: ['Transformer', 'Universal'], desc: 'Swin Transformer for image restoration with long-range dependency modeling.', bestFor: 'General photos, architecture', speed: 'Medium', icon: Cpu, color: 'text-blue-400', link: '#' },
  { id: 'hat', name: 'HAT', category: 'image', type: 'open', org: 'Tsinghua', year: '2023', tags: ['Hybrid', 'SOTA'], desc: 'Hybrid Attention Transformer combining self-attention and channel attention.', bestFor: 'High-frequency detail recovery', speed: 'Slow', icon: Zap, color: 'text-amber-400', link: '#' },
  { id: 'invsr', name: 'InvSR', category: 'image', type: 'open', org: 'CVPR 2025', year: '2025', tags: ['Diffusion', 'Blind'], desc: 'Invertible image super-resolution via diffusion model inversion.', bestFor: 'Blind real-world restoration', speed: 'Medium', icon: Sparkles, color: 'text-purple-400', link: '#' },
  { id: 'hypir', name: 'HYPIR', category: 'image', type: 'open', org: 'SIGGRAPH 2025', year: '2025', tags: ['Hyperspectral', 'Physics'], desc: 'Physics-informed neural network for hyperspectral image restoration.', bestFor: 'Scientific imaging', speed: 'Slow', icon: Cpu, color: 'text-rose-400', link: '#' },

  // Image - Closed
  { id: 'topaz-gp', name: 'Topaz Gigapixel', category: 'image', type: 'closed', org: 'Topaz Labs', year: '2018', tags: ['Pro', 'Face Recovery'], desc: 'Industry-standard AI image upscaler with face recovery and detail enhancement.', bestFor: 'Professional photography', speed: 'Medium', icon: Wand2, color: 'text-emerald-400', link: '#' },
  { id: 'letsenhance', name: 'LetsEnhance', category: 'image', type: 'closed', org: 'LetsEnhance.io', year: '2017', tags: ['Batch', 'E-commerce'], desc: 'Automated batch upscaling for e-commerce and product photography workflows.', bestFor: 'E-commerce, product shots', speed: 'Fast', icon: Layers, color: 'text-indigo-400', link: '#' },
  { id: 'magnific', name: 'Magnific AI', category: 'image', type: 'closed', org: 'Javi Lopez', year: '2023', tags: ['Creative', 'Rescale'], desc: 'Creative upscaler that hallucinates details for artistic enhancement.', bestFor: 'AI art, creative projects', speed: 'Slow', icon: Sparkles, color: 'text-pink-400', link: '#' },

  // Video - Open
  { id: 'flashvsr', name: 'FlashVSR', category: 'video', type: 'open', org: 'OpenImagingLab', year: '2025', tags: ['Real-time', '17 FPS'], desc: 'Diffusion-based video SR with sparse attention for real-time 4K upscaling.', bestFor: 'Real-time streaming, speed', speed: '17 FPS', icon: Zap, color: 'text-gold', link: '#' },
  { id: 'seedvr2', name: 'SeedVR2', category: 'video', type: 'open', org: 'ByteDance Seed', year: '2025', tags: ['One-Step', '3B/7B'], desc: 'One-step diffusion transformer with adversarial post-training for VR.', bestFor: 'Maximum quality, portraits', speed: '~1.7 FPS', icon: Sparkles, color: 'text-purple-400', link: '#' },
  { id: 'star', name: 'STAR', category: 'video', type: 'open', org: 'Multiple', year: '2025', tags: ['T2V Prior', 'Detail'], desc: 'Leverages text-to-video diffusion priors for temporal consistency.', bestFor: 'AI-generated video cleanup', speed: 'Medium', icon: Video, color: 'text-orange-400', link: '#' },
  { id: 'venhancer', name: 'VEnhancer', category: 'video', type: 'open', org: 'Tencent', year: '2024', tags: ['Local', 'Enhance'], desc: 'Video enhancement with local detail boosting and temporal propagation.', bestFor: 'Compressed video recovery', speed: 'Medium', icon: Wand2, color: 'text-teal-400', link: '#' },
  { id: 'realisvsr', name: 'RealisVSR', category: 'video', type: 'open', org: 'CVPR 2025', year: '2025', tags: ['4K SOTA', 'Real-world'], desc: 'Latest 4K video super-resolution SOTA for real-world degraded footage.', bestFor: 'Old footage, VHS restoration', speed: 'Slow', icon: Star, color: 'text-red-400', link: '#' },

  // Video - Closed
  { id: 'topaz-video', name: 'Topaz Video AI', category: 'video', type: 'closed', org: 'Topaz Labs', year: '2020', tags: ['Proteus', 'Iris', 'Astra'], desc: 'Desktop app with 4 dedicated models for different content types.', bestFor: 'Professional deliverables', speed: '~0.5 FPS', icon: Wand2, color: 'text-emerald-400', link: '#' },
  { id: 'capcut', name: 'CapCut Enhance', category: 'video', type: 'closed', org: 'ByteDance', year: '2023', tags: ['Mobile', 'Free'], desc: 'Built-in video enhancement for CapCut mobile and desktop editors.', bestFor: 'Social media content', speed: 'Cloud', icon: Video, color: 'text-blue-400', link: '#' },
  { id: 'wavespeed', name: 'WaveSpeedAI', category: 'video', type: 'closed', org: 'WaveSpeed', year: '2024', tags: ['API', 'Batch'], desc: 'Cloud API service for batch video upscaling with multiple model options.', bestFor: 'Batch processing pipelines', speed: 'Cloud', icon: ArrowRight, color: 'text-cyan', link: '#' },
];

export default function ModelLibrary() {
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'open' | 'closed'>('all');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } });
      }, { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = models.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'open' || filter === 'closed') return m.type === filter;
    return m.category === filter;
  });

  return (
    <section id="models" ref={ref} className="relative w-full py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">Model Library</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Every Upscaler, Ranked</h2>
          <p className="text-white/40 text-sm mt-2 max-w-[500px] mx-auto">
            12 models across image and video. Open-source and commercial. All tested on the same benchmark set.
          </p>
        </div>

        {/* Filters */}
        <div className={`flex items-center justify-center gap-2 mb-10 flex-wrap transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {([
            { key: 'all', label: 'All Models', count: models.length },
            { key: 'image', label: 'Image SR', count: models.filter(m => m.category === 'image').length },
            { key: 'video', label: 'Video SR', count: models.filter(m => m.category === 'video').length },
            { key: 'open', label: 'Open Source', count: models.filter(m => m.type === 'open').length },
            { key: 'closed', label: 'Commercial', count: models.filter(m => m.type === 'closed').length },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === f.key
                  ? 'bg-cyan/15 text-cyan border border-cyan/30'
                  : 'text-white/30 hover:text-white/50 border border-transparent'
              }`}
            >
              {f.label}
              <span className="text-[10px] font-mono text-white/20">{f.count}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m, i) => (
            <div
              key={m.id}
              className={`rounded-2xl glass-panel p-5 hover:border-white/15 transition-all duration-500 group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center`}>
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-medium">{m.name}</h3>
                    <span className="text-white/25 text-[10px] font-mono">{m.org} · {m.year}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  m.type === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {m.type === 'open' ? 'OPEN' : 'CLOSED'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {m.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-white/40 text-xs leading-relaxed mb-3">{m.desc}</p>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-white/20 block">Best for</span>
                  <span className="text-white/50 text-[10px]">{m.bestFor}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/20 block">Speed</span>
                  <span className="text-white/50 text-[10px] font-mono">{m.speed}</span>
                </div>
              </div>

              <Link
                to={`/model/${m.id}`}
                className="mt-3 flex items-center justify-center gap-1 text-cyan/60 hover:text-cyan text-xs py-2 rounded-lg hover:bg-cyan/5 transition-all border border-transparent hover:border-cyan/10"
              >
                Full Review & Benchmarks <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
