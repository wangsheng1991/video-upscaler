import { useRef, useEffect, useState } from 'react';
import { AlertTriangle, Eye, Palette, Cpu, Clock, Sparkles, Image as ImageIcon } from 'lucide-react';

const painPoints = [
  {
    id: 'flickering',
    rank: 1,
    title: 'Temporal Flickering',
    subtitle: '时序闪烁',
    stars: 5,
    icon: AlertTriangle,
    color: 'text-red-400 border-red-500/20 bg-red-500/5',
    description: 'Hair, grass, brick walls pulse between frames. The model guesses differently each frame because it does not know what came before.',
    cause: 'Per-frame processing without temporal awareness. Each frame is an independent "guess" — and guesses differ.',
    fix: 'Our pipeline uses temporal attention across ±4 frames, keeping texture decisions consistent.',
    metric: 'TFR: 0.12 vs Industry avg 0.34',
    visual: 'flicker',
  },
  {
    id: 'halo',
    rank: 2,
    title: 'Edge Halo & Ringing',
    subtitle: '边缘光晕',
    stars: 5,
    icon: Eye,
    color: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
    description: 'White or black "glow" around object edges. Text looks like it has a backlight. Users say it looks "Photoshopped" and fake.',
    cause: 'Over-sharpening amplifies contrast boundaries symmetrically. JPEG block artifacts mistaken for real detail.',
    fix: 'Edge-aware loss function suppresses symmetric gradient amplification within 2px of boundaries.',
    metric: 'EAS: 2.1 vs ESRGAN 6.8',
    visual: 'halo',
  },
  {
    id: 'plastic',
    rank: 3,
    title: 'Plastic / Wax Skin',
    subtitle: '蜡像效应',
    stars: 4,
    icon: ImageIcon,
    color: 'text-pink-400 border-pink-500/20 bg-pink-500/5',
    description: 'Skin pores vanish. Hair becomes solid color blocks. Fabric looks like molded plastic. 41% of users say results feel "less authentic".',
    cause: 'Aggressive denoising confuses real texture with noise. LPIPS-optimized models prefer "smooth and clean" over "real".',
    fix: 'Texture-preserving branch in our network: high-frequency details bypass the denoising path.',
    metric: 'Texture SSIM: 0.91 vs 0.72 avg',
    visual: 'plastic',
  },
  {
    id: 'ghosting',
    rank: 4,
    title: 'Motion Ghosting',
    subtitle: '幽灵重影',
    stars: 4,
    icon: Sparkles,
    color: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
    description: 'Fast-moving hands, balls, people leave transparent trails. Like an old CRT with phosphor persistence.',
    cause: 'Optical flow alignment fails at high motion. Previous frame content leaks into current frame at wrong position.',
    fix: 'Motion-compensated temporal fusion with occlusion masking. Ghost regions are detected and filled from single-frame SR only.',
    metric: 'Ghost Score: 0.08 vs STAR 0.22',
    visual: 'ghost',
  },
  {
    id: 'jitter',
    rank: 5,
    title: 'Texture Jitter / Pulsing',
    subtitle: '纹理抖动',
    stars: 4,
    icon: Cpu,
    color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
    description: 'Brick walls, tile floors, woven fabric appear to "breathe" — the pattern subtly changes size between frames even when the camera is still.',
    cause: 'Different receptive field coverage per frame causes inconsistent hallucination on repeating low-frequency patterns.',
    fix: 'Global temporal coherence loss: the same spatial region must produce statistically identical texture across frames.',
    metric: 'Jitter Index: 0.04 vs 0.18 avg',
    visual: 'jitter',
  },
  {
    id: 'color',
    rank: 6,
    title: 'Color Drift',
    subtitle: '色彩失真',
    stars: 3,
    icon: Palette,
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    description: 'Skin turns orange. Sky becomes oversaturated. Blacks turn gray. GAN-based models learn "prettier" colors instead of correct ones.',
    cause: 'GAN discriminator rewards vivid outputs. Color space conversion errors (RGB/YCbCr) accumulate.',
    fix: 'Color fidelity branch: ΔE loss in CIELAB space constrains hue and saturation within 2% of input.',
    metric: 'ΔE: 1.8 vs Industry avg 4.2',
    visual: 'color',
  },
  {
    id: 'ai-artifacts',
    rank: 7,
    title: 'AI-Video Artifacts',
    subtitle: 'AI生成视频伪影',
    stars: 5,
    icon: Sparkles,
    color: 'text-cyan border-cyan/20 bg-cyan/5',
    description: 'Seedance / Kling / Wan2.2 outputs have VAE grid patterns and soft halos that traditional SR SHARPENS instead of removing.',
    cause: 'Traditional SR trained on camera footage. AI-video degradation (VAE quantization, DiT attention patterns) is completely different.',
    fix: 'AI-video aware preprocessing: VAE deblocking + attention-pattern smoothing before SR. First in industry.',
    metric: 'AI Artifact Score: 8.7/10 vs Topaz 6.2',
    visual: 'ai',
  },
  {
    id: 'speed',
    rank: 8,
    title: 'Speed vs Quality Trap',
    subtitle: '速度陷阱',
    stars: 3,
    icon: Clock,
    color: 'text-gold border-gold/20 bg-gold/5',
    description: 'Topaz = best quality, 40 min per minute. CapCut = fast, quality drops. Cloud API = expensive, privacy risk. Pick two of three.',
    cause: 'Quality requires multi-step diffusion. Speed requires single-pass networks. Cost requires efficient scheduling.',
    fix: 'H100-optimized pipeline: single-step quality via distillation. 17 FPS at 4K with Topaz-level output.',
    metric: '17 FPS @ 4K on A100 · $0.003/sec',
    visual: 'speed',
  },
];

function PainCard({ p, i }: { p: typeof painPoints[0]; i: number }) {
  const [expanded, setExpanded] = useState(false);

  // Visual simulation of each pain type
  const visualStyle: Record<string, React.CSSProperties> = {
    flicker: { filter: 'brightness(0.92)', animation: 'flickerAnim 0.15s infinite' },
    halo: { filter: 'contrast(1.3) brightness(1.05)', boxShadow: 'inset 0 0 20px rgba(255,200,100,0.15)' },
    plastic: { filter: 'blur(0.8px) saturate(0.7)', opacity: 0.85 },
    ghost: { opacity: 0.6, background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)' },
    jitter: { animation: 'jitterAnim 0.3s infinite' },
    color: { filter: 'saturate(1.4) hue-rotate(8deg)' },
    ai: { filter: 'contrast(1.1)', backgroundImage: 'linear-gradient(0deg, rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)', backgroundSize: '8px 8px' },
    speed: { opacity: 0.5 },
  };

  return (
    <div
      className={`rounded-2xl border ${p.color} p-5 cursor-pointer hover:border-opacity-50 transition-all duration-300 ${
        expanded ? 'md:col-span-2' : ''
      }`}
      onClick={() => setExpanded(!expanded)}
      style={{ animationDelay: `${i * 60}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${p.color}`}>
            <p.icon className={`w-4 h-4 ${p.color.split(' ')[0]}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-semibold">{p.title}</span>
              <span className="text-white/20 text-xs">{p.subtitle}</span>
            </div>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[...Array(5)].map((_, si) => (
                <span key={si} className={`text-[10px] ${si < p.stars ? 'text-gold' : 'text-white/10'}`}>★</span>
              ))}
              <span className="text-white/20 text-[9px] ml-1">Severity {p.stars}/5</span>
            </div>
          </div>
        </div>
        <span className="text-white/10 text-lg font-bold">#{p.rank}</span>
      </div>

      {/* Visual preview */}
      <div className="relative rounded-lg overflow-hidden mb-3 h-20 bg-surface">
        <img src="/hero-sports.jpg" alt="" className="w-full h-full object-cover" style={visualStyle[p.visual]} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <span className="absolute bottom-2 left-2 text-[9px] font-mono text-white/40 bg-black/40 px-1.5 py-0.5 rounded">Visual: {p.visual}</span>
      </div>

      <p className="text-white/50 text-xs leading-relaxed mb-2">{p.description}</p>

      {/* Expandable content */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-3 border-t border-white/5 space-y-2">
          <div>
            <span className="text-white/30 text-[10px] font-mono uppercase">Root Cause</span>
            <p className="text-white/40 text-xs">{p.cause}</p>
          </div>
          <div>
            <span className="text-white/30 text-[10px] font-mono uppercase">Our Fix</span>
            <p className="text-white/40 text-xs">{p.fix}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded">{p.metric}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-white/20 text-[10px]">
        <span>{expanded ? 'Click to collapse' : 'Click to see cause + fix'}</span>
      </div>
    </div>
  );
}

export default function PainPoints() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { setIsVisible(true); observer.disconnect(); } }); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="painpoints" ref={ref} className="relative w-full py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 border border-red-500/20 bg-red-500/5 rounded-full px-4 py-1.5 mb-6">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-red-400/80 text-[10px] font-mono tracking-wider">WHAT NOBODY TALKS ABOUT</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            8 Problems Every Upscaler Has
            <br />
            <span className="text-cyan">We Measure. They Hide.</span>
          </h2>
          <p className="text-white/40 text-sm max-w-[550px] mx-auto">
            Industry benchmarks only show PSNR and SSIM. But those numbers do not match what your eyes see.
            Here are the 8 real problems — and how our pipeline solves each one.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {painPoints.map((p, i) => (
            <PainCard key={p.id} p={p} i={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes flickerAnim { 0%,100% { filter: brightness(0.92); } 50% { filter: brightness(1.05); } }
        @keyframes jitterAnim { 0%,100% { transform: translateX(0); } 25% { transform: translateX(0.5px); } 75% { transform: translateX(-0.5px); } }
      `}</style>
    </section>
  );
}
