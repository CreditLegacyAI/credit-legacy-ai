import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Philosophy from '@/components/landing/Philosophy';
import FAQ from '@/components/landing/FAQ';
import Waitlist from '@/components/landing/Waitlist';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Philosophy />
        <FAQ />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
