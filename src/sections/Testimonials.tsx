import { useRef, useEffect, useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Post-Production Lead',
    text: 'We used to spend days testing upscalers manually. dlss5 Compare let us see all results in one grid — we picked the right model for each project in minutes.',
  },
  {
    name: 'Maria Rodriguez',
    role: 'AI Video Creator',
    text: 'The AI-generated video benchmark was eye-opening. SeedVR2 clearly outperformed everything else on my Sora outputs. Saved me from buying the wrong tool.',
  },
  {
    name: 'David Park',
    role: 'Indie Filmmaker',
    text: 'As a solo creator, I can\'t afford to test every model myself. This platform does the heavy lifting. I just upload my footage and pick the winner.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Video Editor',
    text: 'The side-by-side comparison is brutally honest. No marketing fluff — just raw output from each model. Made our purchase decision data-driven.',
  },
  {
    name: 'Wei Zhang',
    role: 'Content Producer',
    text: 'We process 100+ videos per week. The batch API lets us run A/B tests across models automatically. Game changer for our pipeline.',
  },
  {
    name: 'James Kim',
    role: 'Tech Lead',
    text: 'Finally a platform that treats open-source and commercial models equally. We benchmarked Real-ESRGAN vs Topaz and found our sweet spot.',
  },
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative w-full py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <span className="inline-block font-mono text-cyan text-xs tracking-[0.3em] uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Creators Say
          </h2>
          <p className="text-white/50 max-w-[500px] mx-auto">
            Professionals who use dlss5 Compare to make smarter upscaling decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-2xl glass-panel p-6 transition-all duration-700 hover:border-white/15 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
