'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export default function Hero() {
  const t = useTranslations('hero');
  const tBrand = useTranslations('brand');
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('[data-hero-tag]', { y: 20, opacity: 0, duration: 0.8 })
        .from('[data-hero-line] > span', { yPercent: 110, duration: 1.2, stagger: 0.08 }, '-=0.5')
        .from('[data-hero-sub]', { y: 24, opacity: 0, duration: 0.8 }, '-=0.7')
        .from('[data-hero-lead]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('[data-hero-cta]', { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5')
        .from('[data-hero-check]', { y: 14, opacity: 0, duration: 0.6, stagger: 0.07 }, '-=0.4')
        .from('[data-hero-visual]', { y: 40, opacity: 0, duration: 1.2 }, '-=1.2')
        .from('[data-hero-stat]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.07 }, '-=0.8');
    }, root);
    return () => ctx.revert();
  }, []);

  const checks = [t('checks.0'), t('checks.1'), t('checks.2')];
  const stats = [
    [t('stats.0.0' as any), t('stats.0.1' as any)],
    [t('stats.1.0' as any), t('stats.1.1' as any)],
    [t('stats.2.0' as any), t('stats.2.1' as any)],
    [t('stats.3.0' as any), t('stats.3.1' as any)],
  ];

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden noise-overlay flex items-center pt-[120px] pb-[80px]"
      style={{ background: 'var(--bg)' }}
    >
      <HeroCanvas />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Headline column */}
          <div className="lg:col-span-7">
            <div
              data-hero-tag
              className="pill mb-6 sm:mb-8 inline-flex"
              style={{ background: 'var(--navy)', color: 'var(--cream)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {t('tag')}
            </div>

            <h1
              className="h-mega text-[clamp(44px,10vw,160px)]"
              style={{ color: 'var(--fg)' }}
            >
              <span data-hero-line className="split-line block">
                <span>{t('title1')}</span>
              </span>
              <span data-hero-line className="split-line block">
                <span style={{ color: 'var(--accent)' }}>{t('title2')}</span>
              </span>
            </h1>

            <p
              data-hero-sub
              className="mt-5 sm:mt-6 font-display text-xl sm:text-2xl md:text-3xl tracking-tight"
              style={{ color: 'var(--fg-soft)' }}
            >
              {t('subtitle')}
            </p>

            <p
              data-hero-lead
              className="mt-5 sm:mt-6 max-w-xl text-[14.5px] sm:text-[15px] leading-relaxed"
              style={{ color: 'var(--fg-soft)' }}
            >
              {t('lead')}
            </p>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3">
              <a data-hero-cta href="#cta" className="btn-magnetic btn-primary">
                {t('ctaPrimary')}
                <span aria-hidden>→</span>
              </a>
              <a data-hero-cta href="#pricing" className="btn-magnetic btn-outline">
                {t('ctaSecondary')}
                <span aria-hidden>↗</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {checks.map((c, i) => (
                <div
                  key={i}
                  data-hero-check
                  className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full border text-[11px] sm:text-[11.5px] font-semibold tracking-wide uppercase"
                  style={{ borderColor: 'var(--border)', color: 'var(--fg)', background: 'var(--surface)' }}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent)' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12.5l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Brand visual column — monogram + stats */}
          <div className="lg:col-span-5 relative">
            <div
              data-hero-visual
              className="relative mx-auto max-w-[460px] rounded-[36px] overflow-hidden gold-frame"
              style={{
                background:
                  'linear-gradient(160deg, var(--navy) 0%, var(--navy-deep) 60%, #050B1F 100%)',
                color: 'var(--cream)',
              }}
            >
              <div className="relative aspect-[4/5] flex flex-col justify-between p-7 sm:p-9">
                {/* Decorative target rings */}
                <svg
                  className="absolute -top-10 -right-10 w-52 h-52 sm:w-64 sm:h-64 opacity-25 pointer-events-none"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="#D4A017"
                  strokeWidth="1.2"
                >
                  <circle cx="50" cy="50" r="48" />
                  <circle cx="50" cy="50" r="38" />
                  <circle cx="50" cy="50" r="28" />
                  <circle cx="50" cy="50" r="18" />
                  <circle cx="50" cy="50" r="8" fill="#D4A017" />
                </svg>

                {/* Gold pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="pill" style={{ background: '#D4A017', color: '#0B2150' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-deep" />
                    Best in Dubai
                  </div>
                  <span className="text-[10px] tracking-[0.24em] uppercase font-bold text-gold/80">
                    Est. 2014
                  </span>
                </div>

                {/* Centered monogram */}
                <div className="relative z-10 text-center my-6 sm:my-8">
                  <div
                    className="font-display font-black uppercase tracking-tightest leading-[0.85]"
                    style={{
                      fontSize: 'clamp(96px, 18vw, 168px)',
                      color: '#D4A017',
                      textShadow: '0 12px 40px rgba(212,160,23,0.35)',
                    }}
                  >
                    HZA
                  </div>
                  <div className="mt-3 text-[10px] sm:text-[11px] tracking-[0.32em] uppercase font-bold text-cream/80">
                    {tBrand('fullName')}
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.2em] uppercase text-cream/60">
                    {tBrand('tagline')}
                  </div>
                </div>

                {/* Promise line */}
                <div className="relative z-10">
                  <div className="h-px w-full bg-gold/30 mb-4" />
                  <p className="text-[12px] sm:text-[13px] leading-relaxed text-cream/85">
                    {tBrand('promise')}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats row beneath visual */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 max-w-[460px] mx-auto">
              {stats.map(([v, l], i) => (
                <div
                  key={i}
                  data-hero-stat
                  className="rounded-2xl px-2.5 py-3 text-center border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
                  }}
                >
                  <div
                    className="font-display font-black text-xl md:text-2xl leading-none"
                    style={{ color: 'var(--accent)' }}
                  >
                    {v}
                  </div>
                  <div
                    className="text-[8.5px] mt-1 tracking-[0.16em] uppercase font-bold"
                    style={{ color: 'var(--fg-soft)' }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Big watermark text */}
      <div className="pointer-events-none absolute -bottom-6 left-0 right-0 overflow-hidden">
        <div
          className="h-mega whitespace-nowrap text-center select-none text-[clamp(120px,18vw,280px)]"
          style={{ color: 'color-mix(in srgb, var(--fg) 5%, transparent)' }}
        >
          HZA · HZA · HZA · HZA
        </div>
      </div>
    </section>
  );
}
