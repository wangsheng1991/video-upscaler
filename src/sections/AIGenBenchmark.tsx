import { useRef, useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Info, Star, Video } from 'lucide-react';

const aiGenModels = [
  { id: 'flashvsr', name: 'FlashVSR', score: 7.8, pros: 'Fast processing', cons: 'Slight over-sharpening on soft AI edges', color: 'border-gold/30' },
  { id: 'seedvr2', name: 'SeedVR2', score: 9.2, pros: 'Best natural detail', cons: 'Slower, needs 12GB+ VRAM', color: 'border-purple-500/30' },
  { id: 'topaz', name: 'Topaz Astra', score: 8.5, pros: 'Proteus handles AI video well', cons: 'Expensive ($299/yr)', color: 'border-emerald-500/30' },
  { id: 'star', name: 'STAR', score: 8.8, pros: 'T2V prior understands AI artifacts', cons: 'Setup complexity', color: 'border-orange-500/30' },
];

const testScenarios = [
  { label: 'Seedance 2.0 Generated', desc: 'Text-to-video with soft edges and temporal flicker', img: '/bench-aigen.jpg' },
  { label: 'Kling 3.0 Output', desc: 'Character consistency + motion blur artifacts', img: '/seed-portrait.jpg' },
  { label: 'Wan2.2 Generated', desc: 'Wide landscape with atmospheric haze and texture loss', img: '/case-mountain.jpg' },
];

export default function AIGenBenchmark() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { setIsVisible(true); observer.disconnect(); } }); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const scenario = testScenarios[activeScenario];

  return (
    <section id="benchmark" ref={ref} className="relative w-full py-24 bg-gradient-to-b from-void via-surface to-void">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-xs font-mono tracking-wider">BLUE OCEAN KEYWORD</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Which Upscaler Works Best for
            <br />
            <span className="text-purple-400">AI-Generated Video?</span>
          </h2>
          <p className="text-white/40 text-sm mt-3 max-w-[550px] mx-auto">
            Topaz says AI-generated content needs special handling. We tested every model on Seedance 2.0, Kling 3.0, and Wan2.2 outputs. Nobody else has done this.
          </p>
        </div>

        {/* Scenario tabs */}
        <div className={`flex items-center justify-center gap-3 mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {testScenarios.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActiveScenario(i)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                activeScenario === i
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'text-white/30 hover:text-white/50 border border-transparent'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Test frame display */}
        <div className={`rounded-2xl overflow-hidden border border-white/5 bg-surface mb-10 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="relative aspect-video md:aspect-auto overflow-hidden">
              <img src={scenario.img} alt={scenario.label} className="w-full h-full object-cover" style={{ filter: 'blur(1.5px) saturate(0.6) contrast(0.85)' }} />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-mono text-white/50 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">AI-GENERATED SOURCE</span>
              </div>
            </div>
            <div className="md:col-span-2 p-6 flex flex-col justify-center">
              <h3 className="text-white font-semibold text-lg mb-2">{scenario.label}</h3>
              <p className="text-white/40 text-sm mb-4">{scenario.desc}</p>
              <div className="flex items-center gap-4 text-[10px] font-mono text-white/20">
                <span className="flex items-center gap-1"><Video className="w-3 h-3" /> 5s clip · 24fps</span>
                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> 720p input target → 4K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results table */}
        <div className={`space-y-3 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-12 gap-3 text-[10px] font-mono text-white/20 uppercase tracking-wider px-4">
            <div className="col-span-3">Model</div>
            <div className="col-span-2 text-center">Score</div>
            <div className="col-span-3">Strengths</div>
            <div className="col-span-3">Weaknesses</div>
            <div className="col-span-1"></div>
          </div>

          {aiGenModels.map((m, i) => (
            <div
              key={m.id}
              className={`grid grid-cols-12 gap-3 items-center rounded-xl border ${m.color} bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all duration-300`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="col-span-3">
                <span className="text-white text-sm font-medium">{m.name}</span>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                  <span className="text-white font-semibold text-sm">{m.score}</span>
                </div>
                <span className="text-white/20 text-[9px] font-mono">/ 10</span>
              </div>
              <div className="col-span-3">
                <span className="text-emerald-400/80 text-xs">{m.pros}</span>
              </div>
              <div className="col-span-3">
                <span className="text-white/30 text-xs">{m.cons}</span>
              </div>
              <div className="col-span-1 text-right">
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-10 text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/30 text-xs mb-4">
            We tested 20 standard clips across 6 upscalers. Full report available for download.
          </p>
          <button className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-5 py-2.5 rounded-2xl hover:bg-purple-500/20 transition-all text-sm">
            <Sparkles className="w-4 h-4" />
            Read Full AI-Gen Benchmark Report
          </button>
        </div>
      </div>
    </section>
  );
}
