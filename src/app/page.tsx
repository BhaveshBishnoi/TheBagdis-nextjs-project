
import HeroSection from '../components/homepage/Hero';
import FeaturesSection from '../components/homepage/FeaturesSection';
import ProgressSection from '../components/homepage/ProgressSection';
import OurPromise from '../components/homepage/Promise';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <FeaturesSection />
      <ProgressSection />
      <OurPromise />

    </div>
  );
}
