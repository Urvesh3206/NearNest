import {
  Navbar,
  Hero,
  Features,
  BusinessShowcase,
  Communities,
  Testimonials,
  Pricing,
  DownloadApp,
  FAQ,
  Contact,
  Footer,
} from '@/components/landing';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-canvas text-text-primary selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100 flex flex-col w-full relative">
      <Navbar />
      <Hero />
      <Features />
      <BusinessShowcase />
      <Communities />
      <Testimonials />
      <Pricing />
      <DownloadApp />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
