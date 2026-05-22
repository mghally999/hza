'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const t = useTranslations('cta');
  const c = useTranslations('contact');
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
      className="section-pad relative overflow-hidden noise-overlay"
      style={{ background: 'var(--navy)', color: 'var(--cream)' }}
    >
      <div
        data-cta-arrow
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[40px] border-gold/15 pointer-events-none"
      />
      <div
        data-cta-arrow
        className="absolute -left-40 top-1/4 w-[500px] h-[500px] rounded-full border-[30px] border-blue/20 pointer-events-none"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 text-center">
        <h2 className="h-mega text-cream text-[clamp(56px,11vw,200px)]">
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
          <a href="https://wa.me/971501980275" target="_blank" rel="noopener" className="btn-magnetic btn-gold">
            {t('whatsapp')}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.3-.1-.5-.1-.1-.6-1.5-.9-2-.2-.5-.5-.4-.6-.4h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.2-1.3 0-.1-.2-.2-.5-.3z"/></svg>
          </a>
          <a
            href={`tel:${c('phone').replace(/\s/g, '')}`}
            className="btn-magnetic btn-outline !text-cream !border-cream/30 hover:!bg-cream hover:!text-navy"
          >
            {t('button')}
            <span aria-hidden>→</span>
          </a>
          <a href="#pricing" className="btn-magnetic btn-outline !text-cream !border-cream/30 hover:!bg-cream hover:!text-navy">
            {t('secondary')}
            <span aria-hidden>↗</span>
          </a>
        </div>

        {/* Contact grid */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { label: c('tag'), value: c('address') },
            { label: 'Phone', value: c('phone') },
            { label: 'Email', value: c('email') },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-cream/15 px-4 py-4 text-left rtl:text-right">
              <div className="text-[10px] tracking-[0.22em] uppercase font-bold text-gold">{item.label}</div>
              <div className="text-[13px] mt-1 break-words">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
