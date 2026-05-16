'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const t = useTranslations('cta');
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cta-line] > span', {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });
      gsap.from('[data-cta-body]', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      });

      // Arrow rotation on scroll for the floating accent
      gsap.to('[data-cta-arrow]', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="cta"
      className="section-pad bg-navy text-cream relative overflow-hidden noise-overlay"
    >
      {/* gold ring decoration */}
      <div
        data-cta-arrow
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[40px] border-gold/15 pointer-events-none"
      />
      <div
        data-cta-arrow
        className="absolute -left-40 top-1/4 w-[500px] h-[500px] rounded-full border-[30px] border-blue/20 pointer-events-none"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 text-center">
        <h2
          className="h-mega text-cream text-[clamp(56px,11vw,200px)]"
          data-cta
        >
          {(t('title') as string).split(' ').map((w, i) => (
            <span key={i} data-cta-line className="inline-block split-line mr-[0.25em]">
              <span>{w}</span>
            </span>
          ))}
        </h2>
        <p data-cta-body className="mt-8 max-w-xl mx-auto text-cream/80 text-base md:text-lg leading-relaxed">
          {t('lead')}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a href="#" className="btn-magnetic btn-gold">
            {t('button')}
            <span aria-hidden>→</span>
          </a>
          <a href="#" className="btn-magnetic btn-outline !text-cream !border-cream/30 hover:!bg-cream hover:!text-navy">
            {t('secondary')}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
