import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import WhoItsFor from '@/components/WhoItsFor';
import Services from '@/components/Services';
import Founder from '@/components/Founder';
import WhyUs from '@/components/WhyUs';
import Process from '@/components/Process';
import Gallery from '@/components/Gallery';
import VideoShowcase from '@/components/VideoShowcase';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Header />
      <Hero />
      <Marquee />
      <WhoItsFor />
      <Services />
      <Founder />
      <VideoShowcase />
      <Gallery />
      <WhyUs />
      <Process />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
