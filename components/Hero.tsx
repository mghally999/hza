'use client';

import Image from 'next/image';
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
        .from('[data-hero-line] > span', { yPercent: 110, duration: 1.2, stagger: 0.08 }, '-=0.5')
        .from('[data-hero-sub]', { y: 24, opacity: 0, duration: 0.8 }, '-=0.7')
        .from('[data-hero-lead]', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('[data-hero-cta]', { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.5')
        .from('[data-hero-check]', { y: 14, opacity: 0, duration: 0.6, stagger: 0.07 }, '-=0.4')
        .from('[data-hero-portrait]', { scale: 1.08, opacity: 0, duration: 1.4 }, '-=1.4')
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

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          {/* Headline column */}
          <div className="lg:col-span-7">
            <div
              data-hero-tag
              className="pill mb-8 inline-flex"
              style={{ background: 'var(--navy)', color: 'var(--cream)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {t('tag')}
            </div>

            <h1
              className="h-mega text-[clamp(54px,10vw,160px)]"
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
              className="mt-6 font-display text-2xl md:text-3xl tracking-tight"
              style={{ color: 'var(--fg-soft)' }}
            >
              {t('subtitle')}
            </p>

            <p
              data-hero-lead
              className="mt-6 max-w-xl text-[15px] leading-relaxed"
              style={{ color: 'var(--fg-soft)' }}
            >
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

            <div className="mt-8 flex flex-wrap gap-2.5">
              {checks.map((c, i) => (
                <div
                  key={i}
                  data-hero-check
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-[11.5px] font-semibold tracking-wide uppercase"
                  style={{ borderColor: 'var(--border)', color: 'var(--fg)', background: 'var(--surface)' }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--accent)' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12.5l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Portrait column */}
          <div className="lg:col-span-5 relative">
            <div className="relative gold-frame mx-auto max-w-[460px]">
              <div
                data-hero-portrait
                className="relative aspect-[4/5] rounded-3xl overflow-hidden brand-tint"
                style={{ background: 'var(--navy-deep)' }}
              >
                <Image
                  src="/img/team/mohammed-bayomy.png"
                  alt="Mohammed Bayomy — Founder & CEO of HZA"
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, 90vw"
                  className="object-cover"
                />
                {/* corner badge */}
                <div className="absolute top-4 left-4 z-10 pill" style={{ background: '#D4A017', color: '#0B2150' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-deep" />
                  Best in Dubai
                </div>
                {/* caption ribbon */}
                <div
                  className="absolute left-0 right-0 bottom-0 px-5 py-4 z-10"
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(7,22,56,0.95))',
                    color: '#FAF6EC',
                  }}
                >
                  <div className="text-[10px] tracking-[0.24em] uppercase text-gold font-bold">
                    Founder · CEO
                  </div>
                  <div className="font-display text-2xl font-black uppercase tracking-tight mt-0.5">
                    Mohammed Bayomy
                  </div>
                </div>
              </div>

              {/* Stats row beneath portrait */}
              <div className="grid grid-cols-4 gap-2 mt-5">
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
