import { useRef, useEffect, useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';

// Simulated temporal profile data: [frame][pixel] = brightness 0-255
function generateProfile(type: 'good' | 'bad' | 'moderate'): number[][] {
  const frames = 60;
  const pixels = 200;
  const data: number[][] = [];
  for (let f = 0; f < frames; f++) {
    const row: number[] = [];
    for (let p = 0; p < pixels; p++) {
      let base = 120;
      if (type === 'good') {
        // Smooth, flat lines
        base += Math.sin(p * 0.1) * 30 + Math.sin(f * 0.05) * 5;
      } else if (type === 'moderate') {
        // Some wobble
        base += Math.sin(p * 0.1) * 30 + Math.sin(f * 0.15) * 15;
      } else {
        // Bad: heavy flickering, waves
        base += Math.sin(p * 0.1) * 30 + Math.sin(f * 0.4) * 40 + (Math.random() - 0.5) * 20;
      }
      row.push(Math.max(0, Math.min(255, base + 128)));
    }
    data.push(row);
  }
  return data;
}

function TemporalCanvas({ data, label, color }: { data: number[][]; label: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.createImageData(w, h);

    for (let y = 0; y < h; y++) {
      const frameIdx = Math.floor((y / h) * data.length);
      for (let x = 0; x < w; x++) {
        const pixelIdx = Math.floor((x / w) * data[0].length);
        const val = data[frameIdx]?.[pixelIdx] ?? 128;
        const idx = (y * w + x) * 4;
        imgData.data[idx] = val;
        imgData.data[idx + 1] = val;
        imgData.data[idx + 2] = val;
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [data]);

  return (
    <div>
      <p className="text-white/40 text-xs font-mono mb-1">{label}</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={120}
        className="w-full rounded-lg border border-white/5"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="flex items-center justify-between mt-1">
        <span className="text-white/20 text-[9px] font-mono">← pixels →</span>
        <span className="text-white/20 text-[9px] font-mono">← frames (time) →</span>
      </div>
    </div>
  );
}

export default function TemporalProfile() {
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

  const good = generateProfile('good');
  const moderate = generateProfile('moderate');
  const bad = generateProfile('bad');

  return (
    <section ref={ref} className="relative w-full py-24 bg-gradient-to-b from-void via-surface to-void">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className={`text-center mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 border border-cyan/20 bg-cyan/5 rounded-full px-4 py-1.5 mb-6">
            <Activity className="w-3 h-3 text-cyan" />
            <span className="text-cyan/80 text-[10px] font-mono tracking-wider">EXCLUSIVE VISUALIZATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            See Flickering with Your Eyes
          </h2>
          <p className="text-white/40 text-sm mt-2 max-w-[550px] mx-auto">
            Temporal Profile: a single horizontal line of pixels, stacked over time.
            Smooth = stable. Wavy = flickering.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="rounded-2xl glass-panel p-5 border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Stable (Topaz / SeedVR2)</span>
            </div>
            <TemporalCanvas data={good} label="Temporal Profile — Stable" color="#10B981" />
            <p className="text-white/30 text-xs mt-3">
              The line stays flat across frames. No texture variation = no flickering.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-cyan/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan" />
              <span className="text-cyan text-xs font-medium">Moderate (FlashVSR / STAR)</span>
            </div>
            <TemporalCanvas data={moderate} label="Temporal Profile — Moderate" color="#00E5FF" />
            <p className="text-white/30 text-xs mt-3">
              Subtle waves visible. Sparse attention misses some long-range dependencies.
            </p>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-red-500/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-400 text-xs font-medium">Flickering (Per-Frame SR)</span>
            </div>
            <TemporalCanvas data={bad} label="Temporal Profile — Heavy Flicker" color="#EF4444" />
            <p className="text-white/30 text-xs mt-3">
              Severe waves = independent frame processing. Each frame hallucinates different textures.
            </p>
          </div>
        </div>

        {/* How to read guide */}
        <div className={`mt-8 rounded-2xl glass-panel p-5 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="text-white font-medium text-sm mb-3">How to Read a Temporal Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/40">
            <div>
              <span className="text-cyan font-mono block mb-1">1. Horizontal Axis</span>
              A single row of pixels from the video frame (left to right).
            </div>
            <div>
              <span className="text-cyan font-mono block mb-1">2. Vertical Axis</span>
              Time — each row is a subsequent frame (top to bottom = earlier to later).
            </div>
            <div>
              <span className="text-cyan font-mono block mb-1">3. Brightness = Color</span>
              Brighter = lighter pixel. Darker = darker pixel. Smooth vertical lines = stable texture.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
