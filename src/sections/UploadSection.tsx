import { useState, useCallback, useRef } from 'react';
import { Upload, Image, Video, X, Check, Sparkles, Cpu, Layers, Wand2, Zap, ArrowRight } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  tag: string;
  type: 'open' | 'closed';
  icon: typeof Sparkles;
  desc: string;
  color: string;
}

const modelOptions: ModelOption[] = [
  { id: 'flashvsr', name: 'FlashVSR', tag: 'Speed', type: 'open', icon: Zap, desc: '~17 FPS real-time', color: 'text-gold border-gold/30 bg-gold/5' },
  { id: 'seedvr2', name: 'SeedVR2', tag: 'Quality', type: 'open', icon: Sparkles, desc: 'One-step diffusion', color: 'text-purple-400 border-purple-500/30 bg-purple-500/5' },
  { id: 'realesrgan', name: 'Real-ESRGAN', tag: 'Anime', type: 'open', icon: Layers, desc: 'Detail-rich 4x', color: 'text-cyan border-cyan/30 bg-cyan/5' },
  { id: 'topaz', name: 'Topaz Video AI', tag: 'Pro', type: 'closed', icon: Wand2, desc: '4 dedicated models', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' },
  { id: 'star', name: 'STAR', tag: 'T2V', type: 'open', icon: Cpu, desc: 'Video diffusion prior', color: 'text-orange-400 border-orange-500/30 bg-orange-500/5' },
  { id: 'upscaleav', name: 'Upscale-A-Video', tag: 'Flow', type: 'open', icon: ArrowRight, desc: 'Optical flow aligned', color: 'text-rose-400 border-rose-500/30 bg-rose-500/5' },
];

export default function UploadSection() {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>(['flashvsr', 'seedvr2', 'topaz']);
  const [isComparing, setIsComparing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setUploadedFile(file.type.startsWith('image/') ? 'image' : 'video');
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.type.startsWith('image/') ? 'image' : 'video');
    }
  }, []);

  const toggleModel = (id: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // min 2
        return prev.filter((m) => m !== id);
      }
      if (prev.length >= 4) return prev; // max 4
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    setIsComparing(true);
    setTimeout(() => {
      setIsComparing(false);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2500);
  };

  return (
    <section id="upload" className="relative w-full py-20">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">Step 1</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Upload & Compare</h2>
          <p className="text-white/40 text-sm mt-2">Supports JPG, PNG, MP4, MOV up to 5 seconds</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Upload area */}
          <div className="lg:col-span-3">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                dragOver
                  ? 'border-cyan bg-cyan/5'
                  : uploadedFile
                  ? 'border-white/10 bg-white/[0.02]'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {!uploadedFile ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-cyan/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7 text-cyan" />
                  </div>
                  <p className="text-white font-medium mb-1">Drop your image or video here</p>
                  <p className="text-white/30 text-xs">or click to browse — max 5s, 50MB</p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center">
                    {uploadedFile === 'image' ? <Image className="w-6 h-6 text-cyan" /> : <Video className="w-6 h-6 text-cyan" />}
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">sample_{uploadedFile}_001.{uploadedFile === 'image' ? 'jpg' : 'mp4'}</p>
                    <p className="text-white/30 text-xs">Ready for processing</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-white/40" />
                  </button>
                </div>
              )}
            </div>

            {/* Compare button */}
            <button
              onClick={handleCompare}
              disabled={!uploadedFile || isComparing || selectedModels.length < 2}
              className={`w-full mt-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                uploadedFile && selectedModels.length >= 2 && !isComparing
                  ? 'bg-cyan text-void hover:shadow-glow-cyan hover:scale-[1.01]'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {isComparing ? (
                <>
                  <span className="w-4 h-4 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                  Running {selectedModels.length} models...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Compare {selectedModels.length} Models
                </>
              )}
            </button>

            {/* Processing animation bar */}
            {isComparing && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/30 mb-1">
                  <span>Initializing pipeline...</span>
                  <span>~25s remaining</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
                <div className="flex gap-2 mt-2">
                  {selectedModels.map((id) => {
                    const m = modelOptions.find((mo) => mo.id === id);
                    return (
                      <span key={id} className="text-[9px] font-mono text-white/20 bg-white/5 px-2 py-0.5 rounded">
                        {m?.name} — running
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Model selector */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl glass-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-xs font-medium">Select Models</span>
                <span className="text-white/30 text-[10px] font-mono">{selectedModels.length}/4</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {modelOptions.map((model) => {
                  const selected = selectedModels.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      onClick={() => toggleModel(model.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                        selected
                          ? `${model.color}`
                          : 'border-white/5 hover:border-white/10 bg-transparent'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selected ? 'bg-white/10' : 'bg-white/5'
                      }`}>
                        <model.icon className={`w-4 h-4 ${selected ? '' : 'text-white/30'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-white/50'}`}>{model.name}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            model.type === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {model.type === 'open' ? 'OPEN' : 'CLOSED'}
                          </span>
                        </div>
                        <span className="text-white/25 text-[10px] block">{model.desc}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected ? 'border-cyan bg-cyan' : 'border-white/20'
                      }`}>
                        {selected && <Check className="w-3 h-3 text-void" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="text-white/20 text-[10px] font-mono leading-relaxed">
                  Open-source models run locally via ComfyUI. Closed-source models processed through our API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
