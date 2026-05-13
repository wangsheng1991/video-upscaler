import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How is dlss5 Compare different from other upscaler tools?',
    answer: 'Most tools let you use ONE upscaler. We let you compare MULTIPLE side-by-side on YOUR own content. We are not selling a single model — we are a neutral comparison platform that tests open-source and commercial models on the same benchmark, so you can pick the right tool for your specific footage.',
  },
  {
    question: 'Do I need an account to compare models?',
    answer: 'No. You can upload an image or video and compare up to 2 models completely free, no login required. Results will have a small watermark. To compare more models, download outputs, or process video, sign up for a free account with 5 comparisons per month.',
  },
  {
    question: 'Which models are free vs paid?',
    answer: 'All open-source models (FlashVSR, SeedVR2, Real-ESRGAN, STAR, etc.) are free to use. Commercial models like Topaz Video AI require a Pro subscription because we pay licensing fees per inference. Your Pro subscription unlocks access to all closed-source models.',
  },
  {
    question: 'How accurate is the comparison?',
    answer: 'We run every model with its recommended settings on identical hardware (A100 GPUs). For video, we ensure the same batch size and temporal window settings. Results are reproducible — you can download the raw outputs and verify yourself. We also include human-voted scores from 3,700+ verified comparisons.',
  },
  {
    question: 'What content types are supported?',
    answer: 'We benchmark across 5 content categories: photographs, anime/line art, video footage, vintage/archival material, and AI-generated content (Seedance, Sora, Kling, Wan). Each model performs differently per category — our comparison reveals the real winners.',
  },
  {
    question: 'Can I use this for commercial projects?',
    answer: 'Yes. Free tier outputs are watermarked and for personal use only. Pro and API tier outputs are royalty-free for commercial use. API users also get SLA guarantees and dedicated GPU allocation.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
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
    <section id="faq" ref={ref} className="relative w-full py-24">
      <div className="max-w-[800px] mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="inline-block font-mono text-cyan text-xs tracking-[0.3em] uppercase mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/50 max-w-[500px] mx-auto">
            Everything you need to know about comparing AI upscalers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl glass-panel overflow-hidden transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium text-sm pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-white/50 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="text-white/60 text-sm leading-relaxed px-5 pb-5">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
