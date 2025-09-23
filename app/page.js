// app/page.jsx
import HeroSection from '@/components/pages/landing/HeroSection';
// You can create and import more sections here, like PlatformInfoSection, Features, etc.

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      {/* Add other sections for the landing page below */}
      {/* <PlatformInfoSection /> */}
      {/* <FeaturesSection /> */}
    </main>
  );
}