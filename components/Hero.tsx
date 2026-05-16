'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export default function Hero() {
  const t = useTranslations('hero');
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.from('[data-hero-tag]', { y: 20, opacity: 0, duration: 0.8 })
        .from(
          '[data-hero-line] > span',
          { yPercent: 110, duration: 1.1, stagger: 0.08 },
          '-=0.5'
        )
        .from(
          '[data-hero-sub]',
          { y: 24, opacity: 0, duration: 0.8 },
          '-=0.7'
        )
        .from(
          '[data-hero-lead]',
          { y: 20, opacity: 0, duration: 0.8 },
          '-=0.6'
        )
        .from(
          '[data-hero-cta]',
          { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 },
          '-=0.5'
        )
        .from(
          '[data-hero-check]',
          { y: 14, opacity: 0, duration: 0.6, stagger: 0.07 },
          '-=0.4'
        );
    }, root);

    return () => ctx.revert();
  }, []);

  const checks = [t('checks.0'), t('checks.1'), t('checks.2')];

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden bg-cream noise-overlay flex items-center pt-[120px] pb-[80px]"
    >
      <HeroCanvas />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <div data-hero-tag className="pill bg-navy text-cream mb-8 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              {t('tag')}
            </div>

            <h1 className="h-mega text-navy text-[clamp(56px,11vw,180px)]">
              <span data-hero-line className="split-line block">
                <span>{t('title1')}</span>
              </span>
              <span data-hero-line className="split-line block">
                <span className="text-gold">{t('title2')}</span>
              </span>
            </h1>

            <p data-hero-sub className="mt-6 text-navy/80 font-display text-2xl md:text-3xl tracking-tight">
              {t('subtitle')}
            </p>

            <p data-hero-lead className="mt-6 max-w-xl text-navy/70 text-[15px] leading-relaxed">
              {t('lead')}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a data-hero-cta href="#cta" className="btn-magnetic btn-primary">
                {t('ctaPrimary')}
                <span aria-hidden>→</span>
              </a>
              <a data-hero-cta href="#pricing" className="btn-magnetic btn-outline">
                {t('ctaSecondary')}
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
            {checks.map((c, i) => (
              <div
                key={i}
                data-hero-check
                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-navy text-cream border border-navy/80 backdrop-blur w-fit"
              >
                <svg className="w-4 h-4 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12.5l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[12px] font-semibold tracking-wide uppercase">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Big watermark text */}
      <div className="pointer-events-none absolute -bottom-6 left-0 right-0 overflow-hidden">
        <div className="h-mega text-navy/[0.045] text-[clamp(120px,18vw,280px)] whitespace-nowrap text-center select-none">
          HZA · HZA · HZA · HZA
        </div>
      </div>
    </section>
  );
}
