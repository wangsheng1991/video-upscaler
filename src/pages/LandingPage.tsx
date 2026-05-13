import Hero from '../sections/Hero'
import HeroSliderDemo from '../sections/HeroSliderDemo'
import PainPoints from '../sections/PainPoints'
import SceneSelector from '../sections/SceneSelector'
import RadarComparison from '../sections/RadarComparison'
import ComparisonResults from '../sections/ComparisonResults'
import TemporalProfile from '../sections/TemporalProfile'
import AIGenBenchmark from '../sections/AIGenBenchmark'
import ModelLibrary from '../sections/ModelLibrary'
import PricingCTA from '../sections/PricingCTA'
import Metrics from '../sections/Metrics'
import Testimonials from '../sections/Testimonials'
import FAQ from '../sections/FAQ'
import Footer from '../sections/Footer'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <HeroSliderDemo />
      <PainPoints />
      <SceneSelector />
      <RadarComparison />
      <ComparisonResults />
      <TemporalProfile />
      <AIGenBenchmark />
      <ModelLibrary />
      <PricingCTA />
      <Metrics />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
