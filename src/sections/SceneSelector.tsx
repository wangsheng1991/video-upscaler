import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Wand2, User, Archive, Tv, Dumbbell, Zap, ArrowRight, Check } from 'lucide-react';

const scenes = [
  {
    id: 'ecommerce',
    icon: ShoppingBag,
    label: 'E-Commerce Product Video',
    desc: 'Color accuracy and material texture are everything. One shade off = lost sale.',
    best: 'Our Private Pipeline',
    why: 'ΔE < 2.0 color fidelity + texture-preserving branch for fabric/leather/metal',
    runners: ['Topaz Gigapixel (color stable)', 'LetsEnhance (batch friendly)'],
  },
  {
    id: 'aigen',
    icon: Wand2,
    label: 'AI-Generated Video (Seedance/Kling)',
    desc: 'AI video degradation is completely different from camera footage. Traditional SR makes it worse.',
    best: 'SeedVR2 or Our Pipeline',
    why: 'Understands VAE grid patterns and DiT attention artifacts. Does not sharpen them.',
    runners: ['STAR (T2V prior)', 'Topaz Astra (dedicated AI model)'],
  },
  {
    id: 'portrait',
    icon: User,
    label: 'Portrait / Face Video',
    desc: 'Skin must look real, not like a wax figure. Pores and micro-texture must survive.',
    best: 'Topaz Iris / Our Pipeline',
    why: 'Face-aware processing with texture preservation. No over-smoothing.',
    runners: ['SeedVR2 (natural detail)', 'FlashVSR (real-time preview)'],
  },
  {
    id: 'archive',
    icon: Archive,
    label: 'Old Archive / VHS Footage',
    desc: 'Complex multi-degradation: noise, blur, compression, film grain, color fade.',
    best: 'Topaz Proteus',
    why: 'Multi-degradation model trained specifically on vintage footage restoration.',
    runners: ['RealisVSR (4K SOTA)', 'Real-ESRGAN (general purpose)'],
  },
  {
    id: 'anime',
    icon: Tv,
    label: 'Anime / 2D Content',
    desc: 'Lines must stay sharp. Colors must stay flat. No anti-aliasing artifacts.',
    best: 'Real-ESRGAN + Anime Model',
    why: 'Trained on anime-specific dataset. Preserves line integrity and flat color regions.',
    runners: ['Waifu2X (classic)', 'Anime4K (real-time)'],
  },
  {
    id: 'sports',
    icon: Dumbbell,
    label: 'Sports / Fast Motion',
    desc: 'Ghosting is the killer. Hands, balls, athletes in motion need frame-perfect alignment.',
    best: 'STAR / Our Pipeline',
    why: 'Motion-compensated temporal fusion with occlusion masking. No ghost trails.',
    runners: ['FlashVSR (17 FPS real-time)', 'Upscale-A-Video (flow aligned)'],
  },
  {
    id: 'batch',
    icon: Zap,
    label: 'Batch API Processing',
    desc: 'Process 1000+ videos programmatically. Speed, cost, and data sovereignty matter.',
    best: 'dlls5.app API',
    why: 'H100 cluster = Topaz quality at API speed. Data never leaves our infrastructure.',
    runners: ['WaveSpeedAI (cloud)', 'CapCut (consumer)'],
  },
];

export default function SceneSelector() {
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { setIsVisible(true); observer.disconnect(); } }); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const s = scenes[active];

  return (
    <section id="scenes" ref={ref} className="relative w-full py-24 bg-gradient-to-b from-void via-surface to-void">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">Scene-Based Recommendations</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            No "Best" Model.
            <br />
            <span className="text-cyan">Only the Right Model for Your Content.</span>
          </h2>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Scene list */}
          <div className="space-y-1.5">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                  active === i
                    ? 'border-cyan/30 bg-cyan/5'
                    : 'border-transparent hover:border-white/10 hover:bg-white/[0.02]'
                }`}
              >
                <scene.icon className={`w-4 h-4 flex-shrink-0 ${active === i ? 'text-cyan' : 'text-white/30'}`} />
                <div>
                  <span className={`text-sm block ${active === i ? 'text-white font-medium' : 'text-white/50'}`}>{scene.label}</span>
                </div>
                {active === i && <ArrowRight className="w-4 h-4 text-cyan ml-auto flex-shrink-0" />}
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 rounded-2xl glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{s.label}</h3>
                <p className="text-white/30 text-xs">{s.desc}</p>
              </div>
            </div>

            <div className="rounded-xl bg-cyan/5 border border-cyan/20 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-cyan" />
                <span className="text-cyan text-xs font-mono uppercase tracking-wider">Best Choice</span>
              </div>
              <p className="text-white font-medium text-lg mb-1">{s.best}</p>
              <p className="text-white/50 text-sm">{s.why}</p>
            </div>

            <div>
              <span className="text-white/20 text-[10px] font-mono uppercase tracking-wider">Also Consider</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {s.runners.map((r) => (
                  <span key={r} className="text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded-full">{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
