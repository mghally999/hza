'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  (window as any).ScrollTrigger = ScrollTrigger;
}

export default function WhoItsFor() {
  const t = useTranslations('who');
  const root = useRef<HTMLElement>(null);

  const cards = [
    { key: 'freelancers', bg: '#F4D580', color: '#0B2150', rotate: -14 },
    { key: 'smes',        bg: '#1A4F9E', color: '#FAF6EC', rotate: -5 },
    { key: 'startups',    bg: '#D4A017', color: '#0B2150', rotate: 5 },
    { key: 'groups',      bg: '#0B2150', color: '#FAF6EC', rotate: 14 },
  ] as const;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 768px) and (hover: hover)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.from('[data-who-headline] > span', {
        yPercent: 110,
        duration: 1,
        stagger: 0.06,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });

      // Only run the fancy fan-out on desktop with motion enabled.
      // On mobile/touch, the cards are a clean responsive grid (see JSX below).
      if (!mql.matches || reduced) return;

      const cardsEls = gsap.utils.toArray<HTMLElement>('[data-card]');
      const stage = root.current?.querySelector<HTMLElement>('[data-card-stage]');
      if (!cardsEls.length || !stage) return;

      cardsEls.forEach((c) => {
        gsap.set(c, { rotate: 0, y: 80, x: 0, scale: 0.92, opacity: 0 });
      });

      ScrollTrigger.create({
        trigger: stage,
        start: 'top 60%',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (st) => {
          const p = st.progress;
          const stageWidth = stage.getBoundingClientRect().width;
          const spread = Math.min(250, stageWidth / cards.length - 20);
          cardsEls.forEach((c, i) => {
            const final = cards[i];
            const offsetX = (i - (cards.length - 1) / 2) * spread;
            gsap.to(c, {
              x: offsetX * p,
              y: 60 - 60 * p,
              rotate: final.rotate * p,
              scale: 0.92 + 0.08 * p,
              opacity: Math.min(1, p * 2),
              duration: 0.4,
              overwrite: 'auto',
              ease: 'power2.out',
            });
          });
        },
      });

      cardsEls.forEach((c) => {
        c.addEventListener('mouseenter', () => {
          gsap.to(c, { y: '-=12', scale: 1.04, duration: 0.4, ease: 'power2.out' });
        });
        c.addEventListener('mouseleave', () => {
          gsap.to(c, { y: '+=12', scale: 1.0, duration: 0.4, ease: 'power2.out' });
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="who"
      className="section-pad relative noise-overlay overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="text-center mb-12">
          <div className="pill inline-flex" style={{ background: 'var(--navy)', color: 'var(--cream)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            {t('tag')}
          </div>

          <h2
            data-who-headline
            className="h-mega mt-6 text-[clamp(40px,8vw,140px)]"
            style={{ color: 'var(--fg)' }}
          >
            {(t('title') as string).split(' ').map((w, i) => (
              <span key={i} className="inline-block split-line me-[0.25em]">
                <span>{w}</span>
              </span>
            ))}
          </h2>

          <p
            className="mt-4 text-sm md:text-base font-semibold tracking-widest uppercase"
            style={{ color: 'var(--fg-soft)' }}
          >
            {t('subtitle')}
          </p>
        </div>

        {/* Mobile: clean responsive grid */}
        <div className="grid sm:grid-cols-2 gap-4 md:hidden">
          {cards.map((c, i) => (
            <article
              key={c.key}
              className="rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-[0_20px_50px_-15px_rgba(11,33,80,0.25)]"
              style={{ background: c.bg, color: c.color }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[11px] font-extrabold"
                  style={{ background: c.color, color: c.bg }}
                >
                  0{i + 1}
                </span>
                <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-black text-2xl uppercase leading-[0.95] tracking-tight">
                  {t(`cards.${c.key}.title` as any)}
                </h3>
                <p className="mt-3 text-[13px] leading-relaxed opacity-85">
                  {t(`cards.${c.key}.body` as any)}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop: animated fan-out */}
        <div data-card-stage className="relative h-[560px] lg:h-[620px] items-center justify-center hidden md:flex">
          {cards.map((c, i) => (
            <article
              key={c.key}
              data-card
              className="absolute w-[260px] h-[360px] md:w-[280px] md:h-[380px] rounded-3xl p-7 flex flex-col justify-between cursor-pointer shadow-[0_30px_80px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0_40px_100px_rgba(0,0,0,0.25)]"
              style={{ background: c.bg, color: c.color, zIndex: 10 + i }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-[11px] font-extrabold"
                  style={{ background: c.color, color: c.bg }}
                >
                  0{i + 1}
                </span>
                <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div>
                <h3 className="font-display font-black text-2xl md:text-3xl uppercase leading-[0.95] tracking-tight">
                  {t(`cards.${c.key}.title` as any)}
                </h3>
                <p className="mt-4 text-[13px] leading-relaxed opacity-85">
                  {t(`cards.${c.key}.body` as any)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
