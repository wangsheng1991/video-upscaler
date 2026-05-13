import { useState } from 'react';
import { Link } from 'react-router';
import { Calculator, ArrowLeft, Monitor, Zap } from 'lucide-react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

const MODELS = [
  { name: 'SeedVR2 (7B FP16)', vram: 12 },
  { name: 'SeedVR2 (3B FP16)', vram: 8 },
  { name: 'SeedVR2 (3B FP8)', vram: 6 },
  { name: 'FlashVSR', vram: 8 },
  { name: 'STAR', vram: 10 },
  { name: 'RealisVSR', vram: 12 },
  { name: 'Real-ESRGAN', vram: 4 },
  { name: 'SwinIR-L', vram: 6 },
  { name: 'HAT', vram: 8 },
  { name: 'Topaz Video AI', vram: 4 },
];

export default function VRAMCalculatorPage() {
  const [gpuVRAM, setGpuVRAM] = useState<number>(8);

  const compatible = MODELS.filter((m) => m.vram <= gpuVRAM);

  return (
    <div className="min-h-screen bg-void text-white">
      <Navigation />
      <div className="pt-24 pb-16 px-6">
      <div className="max-w-[700px] mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">VRAM Calculator</h1>
            <p className="text-white/40 text-xs">Find which upscaler fits your GPU</p>
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-6 mb-6">
          <label className="text-white/40 text-xs font-mono uppercase block mb-3">Your GPU VRAM</label>
          <input
            type="range" min={2} max={24} step={1}
            value={gpuVRAM}
            onChange={(e) => setGpuVRAM(Number(e.target.value))}
            className="w-full accent-cyan"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-white/30 text-xs">2GB</span>
            <span className="text-cyan font-bold text-2xl">{gpuVRAM} GB</span>
            <span className="text-white/30 text-xs">24GB</span>
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-4 h-4 text-cyan" />
            <h2 className="text-white font-medium">Compatible Models ({compatible.length})</h2>
          </div>
          <div className="space-y-2">
            {compatible.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <span className="text-white text-sm">{m.name}</span>
                <span className="text-white/40 text-xs">{m.vram}GB VRAM</span>
              </div>
            ))}
            {compatible.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">
                No models fit {gpuVRAM}GB. Try cloud processing or GGUF quantization.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-6 border border-cyan/20 bg-cyan/[0.02]">
          <p className="text-white/50 text-sm mb-3">Compare these models on your video.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-cyan text-void font-semibold px-5 py-2.5 rounded-2xl text-sm hover:shadow-glow-cyan transition-all">
            <Zap className="w-4 h-4" /> Start Comparison
          </Link>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
