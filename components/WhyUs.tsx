'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function WhyUs() {
  const t = useTranslations('why');
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-why-headline] > span', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      });

      gsap.from('[data-why-card]', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-why-cards]', start: 'top 80%' },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="why" className="section-pad bg-cream-100 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <div className="pill bg-navy text-cream inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            {t('tag')}
          </div>

          <h2 data-why-headline className="h-mega text-navy text-[clamp(48px,8vw,140px)] mt-6">
            {(t('title') as string).split(' ').map((w, i) => (
              <span key={i} className="inline-block split-line mr-[0.25em]">
                <span>{w}</span>
              </span>
            ))}
          </h2>

          <p className="mt-4 text-navy/70 text-sm md:text-base font-semibold tracking-widest uppercase">
            {t('subtitle')}
          </p>

          <a href="#cta" className="btn-magnetic btn-outline mt-8 inline-flex">
            {t('cta')}
            <span aria-hidden>→</span>
          </a>
        </div>

        <div data-why-cards className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <article
              key={i}
              data-why-card
              className="p-7 md:p-8 rounded-3xl bg-cream border-2 border-navy/15 hover:border-gold transition-colors group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-navy text-gold grid place-items-center group-hover:bg-gold group-hover:text-navy transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M8 12.5l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <span className="font-mono text-xs text-navy/40 tracking-widest">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display font-black text-2xl uppercase leading-[0.95] tracking-tight mb-4 text-navy">
                {t(`cards.${i}.title` as any)}
              </h3>
              <p className="text-navy/70 text-sm leading-relaxed">
                {t(`cards.${i}.body` as any)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
