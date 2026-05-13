import { useParams, Link } from 'react-router';
import { getModelById } from '../data/modelDetails';
import { ArrowLeft, ExternalLink, Github, BookOpen, Star, CheckCircle2, XCircle, Zap, Cpu, Award, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  FlashVSRDiagram, SeedVR2Diagram, RealESRGANDiagram, SwinIRDiagram,
  HATDiagram, TopazDiagram, STARDiagram, RealisVSRDiagram,
  UpscaleAVDiagram, VEnhancerDiagram, InvSRDiagram, HYPIRDiagram,
  TopazGPDiagram,
} from '../components/ArchitectureDiagrams';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

export default function ModelDetail() {
  const { id } = useParams<{ id: string }>();
  const model = getModelById(id ?? '');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, [id]);

  if (!model) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Model not found</p>
          <Link to="/" className="text-cyan hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const avgScore = model.benchmarks.length > 0
    ? (model.benchmarks.reduce((a, b) => a + (b.rank ? b.rank : 0), 0) / model.benchmarks.length).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-void text-white">
      <Navigation />
      <main className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-[1100px] mx-auto px-6 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Compare
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-[1100px] mx-auto px-6">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                model.type === 'open' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
              }`}>
                {model.type.toUpperCase()} SOURCE
              </span>
              <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
                {model.category.toUpperCase()} SR
              </span>
              <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
                {model.year}
              </span>
              {model.paper && (
                <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded">
                  {model.paper.title.includes('CVPR') ? 'CVPR' : model.paper.title.includes('SIGGRAPH') ? 'SIGGRAPH' : 'PAPER'}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3">
              {model.name}
            </h1>
            <p className="text-white/50 text-lg max-w-[700px] mb-6">
              {model.fullName}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              {model.codeUrl && (
                <a href={model.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all text-sm">
                  <Github className="w-4 h-4" /> Code
                </a>
              )}
              {model.paper && (
                <a href={model.paper.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all text-sm">
                  <BookOpen className="w-4 h-4" /> Paper
                </a>
              )}
              {model.websiteUrl && (
                <a href={model.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/10 transition-all text-sm">
                  <ExternalLink className="w-4 h-4" /> Website
                </a>
              )}
              <Link to="/" className="flex items-center gap-2 bg-cyan text-void px-4 py-2 rounded-xl hover:shadow-glow-cyan transition-all text-sm font-medium">
                <Zap className="w-4 h-4" /> Try in Compare
              </Link>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className={`rounded-2xl glass-panel p-6 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan" /> Overview
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">{model.description}</p>
              </div>

              {/* Principle */}
              <div className={`rounded-2xl glass-panel p-6 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan" /> How It Works
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">{model.principle}</p>
              </div>

              {/* Architecture */}
              <div className={`rounded-2xl glass-panel p-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan" /> Architecture
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{model.architecture}</p>
                <ArchitectureDiagram modelId={model.id} />
              </div>

              {/* Key Features */}
              <div className={`rounded-2xl glass-panel p-6 transition-all duration-700 delay-250 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-cyan" /> Key Features
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {model.keyFeatures.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" />
                      <span className="text-white/60 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="rounded-2xl glass-panel p-6 border border-emerald-500/10">
                  <h3 className="text-emerald-400 font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {model.strengths.map((s) => (
                      <li key={s} className="text-white/60 text-sm flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl glass-panel p-6 border border-red-500/10">
                  <h3 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {model.weaknesses.map((w) => (
                      <li key={w} className="text-white/60 text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-1">-</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Benchmarks */}
              <div className={`rounded-2xl glass-panel p-6 transition-all duration-700 delay-350 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan" /> Benchmark Results
                </h2>
                <div className="space-y-3">
                  {model.benchmarks.map((b) => (
                    <div key={b.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                      <span className="text-white/60 text-sm">{b.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-mono text-sm">{b.score}</span>
                        {b.rank && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            b.rank === 1 ? 'bg-gold/10 text-gold' : b.rank === 2 ? 'bg-cyan/10 text-cyan' : 'bg-white/5 text-white/40'
                          }`}>
                            #{b.rank}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best For */}
              <div className={`rounded-2xl glass-panel p-6 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h2 className="text-lg font-semibold text-white mb-4">Best Use Cases</h2>
                <div className="flex flex-wrap gap-2">
                  {model.bestFor.map((use) => (
                    <span key={use} className="text-sm text-white/70 bg-white/5 px-3 py-1.5 rounded-full">{use}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-4">
              {/* Tech Specs */}
              <div className={`rounded-2xl glass-panel p-5 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan" /> Technical Specs
                </h3>
                <div className="space-y-3">
                  {model.techSpecs.map((spec) => (
                    <div key={spec.label}>
                      <span className="text-white/30 text-[10px] font-mono uppercase">{spec.label}</span>
                      <p className="text-white/80 text-sm">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization */}
              <div className={`rounded-2xl glass-panel p-5 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-white font-medium mb-3">Organization</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">Developer</span>
                    <span className="text-white text-sm">{model.org}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">Released</span>
                    <span className="text-white text-sm">{model.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">Category</span>
                    <span className="text-white text-sm capitalize">{model.category} SR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">Type</span>
                    <span className={`text-sm ${model.type === 'open' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {model.type === 'open' ? 'Open Source' : 'Commercial'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className={`rounded-2xl glass-panel p-5 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-white font-medium mb-3">Links</h3>
                <div className="space-y-2">
                  {model.paper && (
                    <a href={model.paper.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors py-1">
                      <BookOpen className="w-4 h-4" /> Research Paper
                    </a>
                  )}
                  {model.codeUrl && (
                    <a href={model.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors py-1">
                      <Github className="w-4 h-4" /> Source Code
                    </a>
                  )}
                  {model.websiteUrl && (
                    <a href={model.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors py-1">
                      <ExternalLink className="w-4 h-4" /> Official Website
                    </a>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className={`rounded-2xl p-5 border border-cyan/20 bg-cyan/[0.02] transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-white/50 text-xs mb-3">Compare {model.name} with other models on your own content.</p>
                <Link to="/" className="flex items-center justify-center gap-2 bg-cyan text-void font-semibold py-2.5 rounded-xl text-sm hover:shadow-glow-cyan transition-all">
                  <Zap className="w-4 h-4" /> Start Comparison
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ArchitectureDiagram({ modelId }: { modelId: string }) {
  const diagrams: Record<string, React.ReactNode> = {
    flashvsr: <FlashVSRDiagram />,
    seedvr2: <SeedVR2Diagram />,
    realesrgan: <RealESRGANDiagram />,
    swinir: <SwinIRDiagram />,
    hat: <HATDiagram />,
    'topaz-video': <TopazDiagram />,
    'topaz-gp': <TopazGPDiagram />,
    star: <STARDiagram />,
    realisvsr: <RealisVSRDiagram />,
    venhancer: <VEnhancerDiagram />,
    invsr: <InvSRDiagram />,
    hypir: <HYPIRDiagram />,
    upscaleav: <UpscaleAVDiagram />,
  };
  return <div className="mt-4">{diagrams[modelId] ?? null}</div>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    processing: 'bg-blue-500/10 text-blue-400',
    done: 'bg-emerald-500/10 text-emerald-400',
    failed: 'bg-red-500/10 text-red-400',
  };
  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${styles[status] ?? 'bg-white/5 text-white/30'}`}>
      {status.toUpperCase()}
    </span>
  );
}
