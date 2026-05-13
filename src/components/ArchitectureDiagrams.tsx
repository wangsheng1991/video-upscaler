import React from 'react';

interface ArchNode {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  textColor?: string;
}

interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

function Diagram({ nodes, edges, title, width = 700, height = 280 }: {
  nodes: ArchNode[];
  edges: ArchEdge[];
  title: string;
  width?: number;
  height?: number;
}) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="w-full overflow-x-auto">
      <div className="text-center mb-2">
        <span className="text-white/40 text-[10px] font-mono tracking-wider">{title}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[700px] mx-auto"
        style={{ minWidth: '500px' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.25)" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((e, i) => {
          const from = nodeMap.get(e.from)!;
          const to = nodeMap.get(e.to)!;
          const sx = from.x + from.w;
          const sy = from.y + from.h / 2;
          const tx = to.x;
          const ty = to.y + to.h / 2;
          const mx = (sx + tx) / 2;
          const my = (sy + ty) / 2;
          return (
            <g key={i}>
              <path
                d={`M ${sx} ${sy} L ${tx} ${ty}`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              {e.label && (
                <text x={mx} y={my - 4} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="JetBrains Mono, monospace">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx="6"
              fill={n.color}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <text
              x={n.x + n.w / 2}
              y={n.y + n.h / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={n.textColor || 'rgba(255,255,255,0.85)'}
              fontSize="10"
              fontWeight="500"
              fontFamily="Inter, sans-serif"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── FlashVSR ─────────────────────────────────
export function FlashVSRDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'Low-Res Video', x: 20, y: 110, w: 90, h: 40, color: 'rgba(0,229,255,0.12)' },
    { id: 'enc', label: 'U-Net Encoder', x: 140, y: 100, w: 110, h: 60, color: 'rgba(255,215,0,0.12)' },
    { id: 'lcsa', label: 'LCSA\nSparse Attention', x: 280, y: 90, w: 120, h: 80, color: 'rgba(0,229,255,0.15)' },
    { id: 'dec', label: 'U-Net Decoder', x: 430, y: 100, w: 110, h: 60, color: 'rgba(255,215,0,0.12)' },
    { id: 'output', label: '4K Video', x: 570, y: 110, w: 90, h: 40, color: 'rgba(0,229,255,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'enc' },
    { from: 'enc', to: 'lcsa', label: 'features' },
    { from: 'lcsa', to: 'dec', label: 'enhanced' },
    { from: 'dec', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="FlashVSR Pipeline: Single-step Diffusion + LCSA" />;
}

// ─── SeedVR2 ─────────────────────────────────
export function SeedVR2Diagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: '720p Input', x: 20, y: 110, w: 80, h: 40, color: 'rgba(168,85,247,0.12)' },
    { id: 'distill', label: 'Distilled DiT\n(3B / 7B)', x: 130, y: 95, w: 110, h: 70, color: 'rgba(168,85,247,0.18)' },
    { id: 'ada', label: 'Adaptive\nWindow Attn', x: 270, y: 85, w: 110, h: 90, color: 'rgba(168,85,247,0.22)' },
    { id: 'adv', label: 'Adversarial\nPost-Training', x: 410, y: 95, w: 110, h: 70, color: 'rgba(168,85,247,0.18)' },
    { id: 'output', label: '4K Output', x: 550, y: 110, w: 80, h: 40, color: 'rgba(168,85,247,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'distill' },
    { from: 'distill', to: 'ada', label: 'latents' },
    { from: 'ada', to: 'adv', label: '1-step' },
    { from: 'adv', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="SeedVR2: One-Step DiT with Adversarial Post-Training" />;
}

// ─── Real-ESRGAN ──────────────────────────────
export function RealESRGANDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'LR Image', x: 20, y: 100, w: 80, h: 40, color: 'rgba(6,182,212,0.12)' },
    { id: 'deg', label: 'High-Order\nDegradation', x: 130, y: 85, w: 100, h: 70, color: 'rgba(6,182,212,0.15)' },
    { id: 'rrdb', label: '23x RRDB\nBlocks', x: 260, y: 75, w: 100, h: 90, color: 'rgba(6,182,212,0.20)' },
    { id: 'unet', label: 'U-Net\nDiscriminator', x: 390, y: 85, w: 100, h: 70, color: 'rgba(6,182,212,0.15)' },
    { id: 'output', label: 'SR Image', x: 520, y: 100, w: 80, h: 40, color: 'rgba(6,182,212,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'deg' },
    { from: 'deg', to: 'rrdb', label: 'synthetic' },
    { from: 'rrdb', to: 'unet', label: 'GAN' },
    { from: 'unet', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="Real-ESRGAN: RRDB + High-Order Degradation + U-Net D" />;
}

// ─── SwinIR ─────────────────────────────────
export function SwinIRDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'LR Image', x: 20, y: 100, w: 80, h: 40, color: 'rgba(59,130,246,0.12)' },
    { id: 'shallow', label: 'Shallow\nFeature', x: 130, y: 90, w: 80, h: 60, color: 'rgba(59,130,246,0.12)' },
    { id: 'rstb', label: '6x RSTB\n(Swin Blocks)', x: 240, y: 70, w: 120, h: 100, color: 'rgba(59,130,246,0.20)' },
    { id: 'skip', label: 'Skip\nConnection', x: 240, y: 185, w: 120, h: 40, color: 'rgba(59,130,246,0.08)' },
    { id: 'head', label: 'Reconstruction\nHead', x: 390, y: 90, w: 90, h: 60, color: 'rgba(59,130,246,0.12)' },
    { id: 'output', label: 'HR Image', x: 510, y: 100, w: 80, h: 40, color: 'rgba(59,130,246,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'shallow' },
    { from: 'shallow', to: 'rstb' },
    { from: 'rstb', to: 'head' },
    { from: 'shallow', to: 'skip', label: 'skip' },
    { from: 'skip', to: 'head' },
    { from: 'head', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="SwinIR: Swin Transformer + RSTB + Skip Connections" />;
}

// ─── HAT ────────────────────────────────────
export function HATDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'LR Image', x: 20, y: 100, w: 80, h: 40, color: 'rgba(245,158,11,0.12)' },
    { id: 'feat', label: 'Feature\nExtraction', x: 130, y: 90, w: 80, h: 60, color: 'rgba(245,158,11,0.12)' },
    { id: 'self', label: 'Self\nAttention', x: 240, y: 70, w: 70, h: 50, color: 'rgba(245,158,11,0.18)' },
    { id: 'channel', label: 'Channel\nAttention', x: 240, y: 130, w: 70, h: 50, color: 'rgba(245,158,11,0.18)' },
    { id: 'hybrid', label: '20x Hybrid\nBlocks', x: 340, y: 75, w: 110, h: 100, color: 'rgba(245,158,11,0.22)' },
    { id: 'output', label: 'HR Image', x: 480, y: 100, w: 80, h: 40, color: 'rgba(245,158,11,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'feat' },
    { from: 'feat', to: 'self' },
    { from: 'feat', to: 'channel' },
    { from: 'self', to: 'hybrid' },
    { from: 'channel', to: 'hybrid' },
    { from: 'hybrid', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="HAT: Hybrid Self + Channel Attention Transformer" />;
}

// ─── Topaz Video AI ─────────────────────────
export function TopazDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'Input Video', x: 20, y: 110, w: 80, h: 40, color: 'rgba(16,185,129,0.12)' },
    { id: 'classify', label: 'Content\nClassifier', x: 130, y: 100, w: 80, h: 60, color: 'rgba(16,185,129,0.15)' },
    { id: 'proteus', label: 'Proteus\n(General)', x: 240, y: 35, w: 80, h: 50, color: 'rgba(16,185,129,0.12)' },
    { id: 'iris', label: 'Iris\n(Face)', x: 240, y: 90, w: 80, h: 50, color: 'rgba(16,185,129,0.12)' },
    { id: 'nyx', label: 'Nyx\n(Low-light)', x: 240, y: 145, w: 80, h: 50, color: 'rgba(16,185,129,0.12)' },
    { id: 'astra', label: 'Astra\n(AI-video)', x: 240, y: 200, w: 80, h: 50, color: 'rgba(16,185,129,0.12)' },
    { id: 'temporal', label: 'Temporal\nConsistency', x: 350, y: 100, w: 100, h: 60, color: 'rgba(16,185,129,0.18)' },
    { id: 'output', label: 'Enhanced\nVideo', x: 480, y: 110, w: 80, h: 40, color: 'rgba(16,185,129,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'classify' },
    { from: 'classify', to: 'proteus' },
    { from: 'classify', to: 'iris' },
    { from: 'classify', to: 'nyx' },
    { from: 'classify', to: 'astra' },
    { from: 'proteus', to: 'temporal', label: '' },
    { from: 'iris', to: 'temporal', label: '' },
    { from: 'nyx', to: 'temporal', label: '' },
    { from: 'astra', to: 'temporal', label: '' },
    { from: 'temporal', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="Topaz Video AI: Multi-Model Pipeline with Temporal Engine" height={280} />;
}

// ─── STAR ───────────────────────────────────
export function STARDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: '720p Video', x: 20, y: 110, w: 80, h: 40, color: 'rgba(249,115,22,0.12)' },
    { id: 't2v', label: 'T2V Diffusion\nPrior (CogVideo)', x: 130, y: 90, w: 120, h: 80, color: 'rgba(249,115,22,0.18)' },
    { id: 'spatial', label: 'Spatial\nAttention', x: 280, y: 70, w: 80, h: 50, color: 'rgba(249,115,22,0.15)' },
    { id: 'temporal', label: 'Temporal\nAttention', x: 280, y: 130, w: 80, h: 50, color: 'rgba(249,115,22,0.15)' },
    { id: 'fusion', label: 'Spatio-Temporal\nFusion', x: 390, y: 90, w: 110, h: 80, color: 'rgba(249,115,22,0.20)' },
    { id: 'output', label: '4K Video', x: 530, y: 110, w: 80, h: 40, color: 'rgba(249,115,22,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 't2v' },
    { from: 't2v', to: 'spatial' },
    { from: 't2v', to: 'temporal' },
    { from: 'spatial', to: 'fusion' },
    { from: 'temporal', to: 'fusion' },
    { from: 'fusion', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="STAR: T2V Diffusion Prior + Spatio-Temporal Fusion" />;
}

// ─── RealisVSR ──────────────────────────────
export function RealisVSRDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'Degraded\nVideo', x: 20, y: 110, w: 80, h: 40, color: 'rgba(239,68,68,0.12)' },
    { id: 'est', label: 'Degradation\nEstimator', x: 130, y: 100, w: 90, h: 60, color: 'rgba(239,68,68,0.15)' },
    { id: 'aware', label: 'Degradation-\nAware Network', x: 250, y: 80, w: 110, h: 100, color: 'rgba(239,68,68,0.20)' },
    { id: 'fusion', label: 'Multi-Scale\nTemporal Fusion', x: 390, y: 90, w: 110, h: 80, color: 'rgba(239,68,68,0.18)' },
    { id: 'output', label: '4K Clean\nVideo', x: 530, y: 110, w: 80, h: 40, color: 'rgba(239,68,68,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'est' },
    { from: 'est', to: 'aware', label: 'params' },
    { from: 'input', to: 'aware' },
    { from: 'aware', to: 'fusion' },
    { from: 'fusion', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="RealisVSR: Real-World Degradation Estimation + 4K Fusion" />;
}

// ─── Upscale-A-Video ────────────────────────
export function UpscaleAVDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'LR Frames', x: 20, y: 110, w: 80, h: 40, color: 'rgba(236,72,153,0.12)' },
    { id: 'raft', label: 'RAFT\nFlow Est.', x: 130, y: 100, w: 80, h: 60, color: 'rgba(236,72,153,0.15)' },
    { id: 'warp', label: 'Flow-Guided\nWarping', x: 240, y: 90, w: 90, h: 70, color: 'rgba(236,72,153,0.18)' },
    { id: 'align', label: 'Feature\nAlignment', x: 360, y: 100, w: 90, h: 60, color: 'rgba(236,72,153,0.15)' },
    { id: 'sr', label: 'Spatial\nSR Network', x: 480, y: 100, w: 90, h: 60, color: 'rgba(236,72,153,0.15)' },
    { id: 'output', label: 'HR Frames', x: 600, y: 110, w: 80, h: 40, color: 'rgba(236,72,153,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'raft' },
    { from: 'raft', to: 'warp', label: 'flow' },
    { from: 'warp', to: 'align', label: 'aligned' },
    { from: 'align', to: 'sr' },
    { from: 'sr', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="Upscale-A-Video: RAFT Flow → Warp → Align → SR" />;
}

// ─── VEnhancer ────────────────────────────
export function VEnhancerDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'Input\nVideo', x: 20, y: 110, w: 70, h: 40, color: 'rgba(20,184,166,0.12)' },
    { id: 'boost', label: 'Local Detail\nBoosting (U-Net)', x: 120, y: 90, w: 130, h: 80, color: 'rgba(20,184,166,0.18)' },
    { id: 'prop', label: 'Temporal\nPropagation\n(3D Conv)', x: 280, y: 85, w: 110, h: 90, color: 'rgba(20,184,166,0.22)' },
    { id: 'refine', label: 'Quality\nRefinement', x: 420, y: 100, w: 90, h: 60, color: 'rgba(20,184,166,0.15)' },
    { id: 'output', label: 'Enhanced\nVideo', x: 540, y: 110, w: 70, h: 40, color: 'rgba(20,184,166,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'boost' },
    { from: 'boost', to: 'prop', label: 'details' },
    { from: 'prop', to: 'refine' },
    { from: 'refine', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="VEnhancer: Detail Boosting → 3D Temporal Propagation → Refine" />;
}

// ─── InvSR ─────────────────────────────────
export function InvSRDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'LR Image', x: 20, y: 110, w: 80, h: 40, color: 'rgba(139,92,246,0.12)' },
    { id: 'invert', label: 'Diffusion\nInversion\n(→ Latent)', x: 130, y: 80, w: 110, h: 100, color: 'rgba(139,92,246,0.20)' },
    { id: 'guidance', label: 'LR-Guided\nDenoising', x: 270, y: 90, w: 110, h: 80, color: 'rgba(139,92,246,0.18)' },
    { id: 'refine', label: 'Iterative\nRefinement', x: 410, y: 95, w: 90, h: 70, color: 'rgba(139,92,246,0.15)' },
    { id: 'output', label: 'SR Image', x: 530, y: 110, w: 80, h: 40, color: 'rgba(139,92,246,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'invert' },
    { from: 'invert', to: 'guidance', label: 'latents' },
    { from: 'guidance', to: 'refine' },
    { from: 'refine', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="InvSR: Diffusion Inversion → LR-Guided Denoising → Refinement" />;
}

// ─── HYPIR ─────────────────────────────────
export function HYPIRDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'HS Image\n(Degraded)', x: 20, y: 110, w: 80, h: 40, color: 'rgba(217,70,239,0.12)' },
    { id: 'sensor', label: 'Embedded\nSensor Model', x: 130, y: 100, w: 90, h: 60, color: 'rgba(217,70,239,0.15)' },
    { id: 'spectral', label: 'Spectral\nAttention\nLayers', x: 250, y: 75, w: 100, h: 100, color: 'rgba(217,70,239,0.22)' },
    { id: 'joint', label: 'Joint Spatial-\nSpectral Opt.', x: 380, y: 90, w: 110, h: 80, color: 'rgba(217,70,239,0.18)' },
    { id: 'output', label: 'Restored\nHS Image', x: 520, y: 110, w: 80, h: 40, color: 'rgba(217,70,239,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'sensor' },
    { from: 'sensor', to: 'spectral', label: 'calibrated' },
    { from: 'spectral', to: 'joint' },
    { from: 'joint', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="HYPIR: Sensor Model → Spectral Attention → Joint Spatial-Spectral" />;
}

// ─── Topaz Gigapixel ────────────────────────
export function TopazGPDiagram() {
  const nodes: ArchNode[] = [
    { id: 'input', label: 'Input Image', x: 20, y: 110, w: 80, h: 40, color: 'rgba(16,185,129,0.12)' },
    { id: 'detect', label: 'Content\nDetection', x: 130, y: 100, w: 80, h: 60, color: 'rgba(16,185,129,0.15)' },
    { id: 'photo', label: 'Photo\nModel', x: 240, y: 40, w: 70, h: 45, color: 'rgba(16,185,129,0.10)' },
    { id: 'art', label: 'Art\nModel', x: 240, y: 92, w: 70, h: 45, color: 'rgba(16,185,129,0.10)' },
    { id: 'comp', label: 'Compressed\nModel', x: 240, y: 145, w: 70, h: 45, color: 'rgba(16,185,129,0.10)' },
    { id: 'face', label: 'Face\nRecovery', x: 240, y: 198, w: 70, h: 45, color: 'rgba(16,185,129,0.12)' },
    { id: 'post', label: 'Post-\nProcessing', x: 340, y: 100, w: 80, h: 60, color: 'rgba(16,185,129,0.15)' },
    { id: 'output', label: 'Upscaled\nImage', x: 450, y: 110, w: 80, h: 40, color: 'rgba(16,185,129,0.12)' },
  ];
  const edges: ArchEdge[] = [
    { from: 'input', to: 'detect' },
    { from: 'detect', to: 'photo' },
    { from: 'detect', to: 'art' },
    { from: 'detect', to: 'comp' },
    { from: 'detect', to: 'face' },
    { from: 'photo', to: 'post' },
    { from: 'art', to: 'post' },
    { from: 'comp', to: 'post' },
    { from: 'face', to: 'post' },
    { from: 'post', to: 'output' },
  ];
  return <Diagram nodes={nodes} edges={edges} title="Topaz Gigapixel: Content Detection → Multi-Model → Post-Processing" height={270} />;
}
