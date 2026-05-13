import { useState, useRef, useEffect } from 'react';

interface ModelScore {
  name: string;
  color: string;
  scores: number[]; // 8 dimensions, 0-10
}

const dimensions = [
  'Temporal Stability',
  'Edge Quality',
  'Texture Realism',
  'Motion Handling',
  'Color Accuracy',
  'AI-Video Score',
  'Speed (FPS)',
  'Overall Quality',
];

const models: ModelScore[] = [
  { name: 'FlashVSR', color: '#FFD700', scores: [6.5, 7.0, 6.0, 6.5, 7.5, 5.5, 9.5, 7.0] },
  { name: 'SeedVR2', color: '#A855F7', scores: [9.0, 8.5, 9.0, 8.0, 8.5, 9.0, 3.0, 9.2] },
  { name: 'Topaz Video AI', color: '#10B981', scores: [8.5, 8.0, 7.5, 8.5, 8.0, 6.5, 2.5, 8.5] },
  { name: 'STAR', color: '#F97316', scores: [7.5, 7.5, 7.0, 7.0, 7.0, 7.5, 5.0, 7.5] },
  { name: 'Real-ESRGAN', color: '#06B6D4', scores: [3.0, 6.0, 5.5, 3.5, 6.5, 4.0, 7.5, 5.5] },
];

function RadarChart({ activeModels, size = 280 }: { activeModels: number[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const n = dimensions.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const px = (i: number, v: number) => cx + radius * v * Math.cos(angle(i));
  const py = (i: number, v: number) => cy + radius * v * Math.sin(angle(i));

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={Array.from({ length: n }, (_, i) => `${px(i, level)},${py(i, level)}`).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {/* Axis lines */}
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={px(i, 1)} y2={py(i, 1)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Dimension labels */}
      {dimensions.map((d, i) => {
        const labelR = radius + 18;
        const x = cx + labelR * Math.cos(angle(i));
        const y = cy + labelR * Math.sin(angle(i));
        return (
          <text
            key={d}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
          >
            {d}
          </text>
        );
      })}
      {/* Model polygons */}
      {activeModels.map((mi) => {
        const m = models[mi];
        const points = m.scores.map((s, i) => `${px(i, s / 10)},${py(i, s / 10)}`).join(' ');
        return (
          <g key={m.name}>
            <polygon
              points={points}
              fill={`${m.color}15`}
              stroke={m.color}
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />
            {m.scores.map((s, i) => (
              <circle key={i} cx={px(i, s / 10)} cy={py(i, s / 10)} r="2.5" fill={m.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function RadarComparison() {
  const [activeModels, setActiveModels] = useState<number[]>([0, 1, 2]);
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

  const toggleModel = (i: number) => {
    setActiveModels((prev) => {
      if (prev.includes(i)) {
        if (prev.length <= 2) return prev;
        return prev.filter((m) => m !== i);
      }
      if (prev.length >= 4) return prev;
      return [...prev, i];
    });
  };

  return (
    <section id="radar" ref={ref} className="relative w-full py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">8-Dimension Quantified Evaluation</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Not "Looks Better."
            <br />
            <span className="text-cyan">Measured Better.</span>
          </h2>
          <p className="text-white/40 text-sm mt-2 max-w-[500px] mx-auto">
            8 dimensions the industry ignores — from temporal stability to AI-video artifacts.
            Each model scored 0-10 by our automated evaluation pipeline.
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Model toggles */}
          <div className="space-y-2">
            <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Select models to compare (2-4)</p>
            {models.map((m, i) => (
              <button
                key={m.name}
                onClick={() => toggleModel(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  activeModels.includes(i)
                    ? 'border-white/10 bg-white/[0.03]'
                    : 'border-transparent opacity-40 hover:opacity-60'
                }`}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                <span className="text-white text-sm">{m.name}</span>
                <span className="text-white/30 text-xs ml-auto font-mono">
                  avg {(m.scores.reduce((a, b) => a + b, 0) / m.scores.length).toFixed(1)}
                </span>
              </button>
            ))}

            {/* Dimension table */}
            <div className="mt-6 rounded-xl glass-panel p-4">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Score Breakdown</p>
              <div className="space-y-1.5">
                {dimensions.map((d, di) => (
                  <div key={d} className="flex items-center justify-between">
                    <span className="text-white/40 text-[10px]">{d}</span>
                    <div className="flex items-center gap-1">
                      {activeModels.map((mi) => (
                        <span key={mi} className="text-[10px] font-mono px-1 py-0.5 rounded" style={{ color: models[mi].color, backgroundColor: `${models[mi].color}15` }}>
                          {models[mi].scores[di]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Radar chart */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="rounded-2xl glass-panel p-6 w-full">
              <RadarChart activeModels={activeModels} size={400} />
              <div className="text-center mt-4">
                <p className="text-white/20 text-[10px] font-mono">
                  Larger area = better overall. Each axis is independently scored 0-10.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
