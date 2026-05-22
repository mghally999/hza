'use client';

import { useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type Item = { key: string; icon: JSX.Element };

const Icons = {
  bookkeeping: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="8" y="6" width="32" height="36" rx="3" />
      <path d="M14 14h20M14 22h20M14 30h12" strokeLinecap="round" />
      <circle cx="34" cy="34" r="4" />
    </svg>
  ),
  vat: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M10 36L36 10" strokeLinecap="round" />
      <circle cx="14" cy="14" r="4" />
      <circle cx="34" cy="34" r="4" />
      <path d="M6 42h36" strokeLinecap="round" />
    </svg>
  ),
  ct: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M8 38h32M12 32V20M20 32V14M28 32V18M36 32V10" strokeLinecap="round" />
      <path d="M6 8l6 6 6-4 6 4 6-6 6 4 6-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  payroll: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="6" y="12" width="36" height="26" rx="3" />
      <circle cx="24" cy="25" r="5" />
      <path d="M12 18h4M32 32h4" strokeLinecap="round" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M10 38V18M18 38V10M26 38V22M34 38V14M42 38V6" strokeLinecap="round" />
      <path d="M6 42h36" strokeLinecap="round" />
    </svg>
  ),
  advisory: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4" strokeLinecap="round" />
      <circle cx="24" cy="24" r="6" />
    </svg>
  ),
};

const items: Item[] = [
  { key: 'bookkeeping', icon: Icons.bookkeeping },
  { key: 'vat', icon: Icons.vat },
  { key: 'ct', icon: Icons.ct },
  { key: 'payroll', icon: Icons.payroll },
  { key: 'reports', icon: Icons.reports },
  { key: 'advisory', icon: Icons.advisory },
];

export default function Services() {
  const t = useTranslations('services');
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!track.current) return;

      const totalWidth = track.current.scrollWidth;
      const viewportW = window.innerWidth;
      const distance = totalWidth - viewportW + 80;

      let horizontalTween: gsap.core.Tween | null = null;

      if (distance > 0) {
        horizontalTween = gsap.to(track.current, {
          x: locale === 'ar' ? distance : -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('[data-svc-card]').forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween || undefined,
            start: 'left 80%',
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={root}
      id="services"
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', background: 'var(--navy)', color: 'var(--cream)' }}
    >
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative h-screen flex flex-col">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-10 w-full">
          <div className="pill inline-flex" style={{ background: 'var(--cream)', color: 'var(--navy)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            {t('tag')}
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mt-6 items-end">
            <h2 className="lg:col-span-7 h-mega text-cream text-[clamp(40px,6.5vw,110px)]">
              {t('title')}
            </h2>
            <div className="lg:col-span-5 lg:pb-4">
              <p className="font-display text-gold text-xl md:text-2xl mb-3 uppercase tracking-tight">
                {t('subtitle')}
              </p>
              <p className="text-cream/70 text-sm leading-relaxed">{t('lead')}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex items-center">
          <div
            ref={track}
            className="flex gap-6 px-6 md:px-10 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {items.map((it, i) => (
              <article
                key={it.key}
                data-svc-card
                className="w-[320px] md:w-[380px] h-[420px] md:h-[460px] rounded-3xl p-7 md:p-8 flex flex-col justify-between bg-cream/[0.04] border border-cream/10 backdrop-blur-sm hover:bg-cream/[0.08] transition-colors flex-shrink-0"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gold text-navy grid place-items-center">
                    <div className="w-7 h-7">{it.icon}</div>
                  </div>
                  <span className="font-mono text-xs text-cream/40">
                    {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-3xl md:text-4xl uppercase leading-[0.95] tracking-tight mb-4">
                    {t(`items.${it.key}.title` as any)}
                  </h3>
                  <p className="text-cream/70 text-sm leading-relaxed">
                    {t(`items.${it.key}.body` as any)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-cream/10">
                  <span className="text-xs uppercase tracking-widest text-cream/50">
                    Service {i + 1}
                  </span>
                  <span className="w-9 h-9 rounded-full border border-cream/20 grid place-items-center text-cream/80 hover:bg-gold hover:text-navy hover:border-gold transition-colors">
                    →
                  </span>
                </div>
              </article>
            ))}

            <div className="w-[320px] flex items-center justify-center text-cream/40 text-sm uppercase tracking-widest">
              End of services
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
