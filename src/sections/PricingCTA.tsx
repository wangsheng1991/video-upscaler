import { useRef, useEffect, useState } from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Explore and compare without commitment',
    features: ['Compare 2 models side-by-side', '5 comparisons per month', 'Image only (up to 2K)', 'Results watermarked', 'Community support'],
    cta: 'Start Free',
    popular: false,
    color: 'border-white/5',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'Full access to all models and features',
    features: ['Compare up to 4 models', '100 comparisons per month', 'Image + Video (up to 5s)', 'Download raw outputs', 'No watermark', 'Priority processing', 'Email support'],
    cta: 'Get Pro',
    popular: true,
    color: 'border-cyan/30 bg-cyan/[0.02]',
  },
  {
    name: 'API',
    price: '$299',
    period: '/month',
    desc: 'Scale your workflow with direct API access',
    features: ['Unlimited comparisons', 'Batch processing', 'Video up to 60s', 'REST API + SDKs', 'Custom model weights', 'Private inference', 'Dedicated support'],
    cta: 'Contact Sales',
    popular: false,
    color: 'border-purple-500/30',
  },
];

export default function PricingCTA() {
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

  return (
    <section id="pricing" ref={ref} className="relative w-full py-24">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-cyan text-xs font-mono tracking-[0.3em] uppercase">Pricing</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">Compare for Free. Scale When Ready.</h2>
          <p className="text-white/40 text-sm mt-2 max-w-[500px] mx-auto">
            Start with zero commitment. Upgrade when you need more power. All paid plans include access to closed-source models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-2xl border ${plan.color} p-6 relative transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-cyan text-void text-[10px] font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-white text-3xl font-bold">{plan.price}</span>
                  <span className="text-white/30 text-sm">{plan.period}</span>
                </div>
                <p className="text-white/30 text-xs mt-2">{plan.desc}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan/60 flex-shrink-0 mt-0.5" />
                    <span className="text-white/50 text-xs">{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                plan.popular
                  ? 'bg-cyan text-void hover:shadow-glow-cyan hover:scale-[1.01]'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className={`mt-10 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-white/20 text-xs">
            Need more?{' '}
            <a href="#" className="text-cyan/60 hover:text-cyan transition-colors">Contact us</a>{' '}
            for custom enterprise pricing with SLAs and dedicated GPU clusters.
          </p>
        </div>
      </div>
    </section>
  );
}
