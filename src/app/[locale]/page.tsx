import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Philosophy from '@/components/Philosophy';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Philosophy />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
