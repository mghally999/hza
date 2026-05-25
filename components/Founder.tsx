'use client';

import { useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const t = useTranslations('founders');
  const tContact = useTranslations('contact');
  const locale = useLocale();
  const profileHref = locale === 'ar' ? '/docs/hza-profile-ar.pdf' : '/docs/hza-profile-en.pdf';
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-founder-headline] > span', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
      gsap.from('[data-founder-visual]', {
        scale: 0.92,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
      gsap.from('[data-founder-content] > *', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const stats: [string, string][] = [
    [t('bayomy.stats.0.0' as any), t('bayomy.stats.0.1' as any)],
    [t('bayomy.stats.1.0' as any), t('bayomy.stats.1.1' as any)],
  ];

  return (
    <section
      ref={root}
      id="founders"
      className="section-pad relative overflow-hidden noise-overlay"
      style={{ background: 'var(--bg)' }}
    >
      <div className="absolute -top-32 -right-40 w-[420px] sm:w-[520px] h-[420px] sm:h-[520px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[420px] sm:w-[520px] h-[420px] sm:h-[520px] rounded-full bg-blue/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="text-center mb-12 sm:mb-14">
          <div className="pill inline-flex" style={{ background: 'var(--navy)', color: 'var(--cream)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            {t('tag')}
          </div>
          <h2
            data-founder-headline
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

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Founder visual — brand card (no photo) */}
          <div className="lg:col-span-5">
            <div className="relative gold-frame">
              <div
                data-founder-visual
                className="relative aspect-[4/5] rounded-3xl overflow-hidden flex flex-col justify-between p-7 sm:p-8"
                style={{
                  background:
                    'linear-gradient(155deg, var(--navy) 0%, var(--navy-deep) 70%, #050B1F 100%)',
                  color: 'var(--cream)',
                }}
              >
                {/* Decorative target rings */}
                <svg
                  className="absolute -top-8 -right-8 w-44 h-44 sm:w-56 sm:h-56 opacity-25 pointer-events-none"
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

                {/* Header */}
                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] tracking-[0.24em] uppercase text-gold font-bold">
                      {t('bayomy.role')}
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
                      {t('bayomy.name')}
                    </div>
                  </div>
                  <span
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full text-base font-extrabold flex-shrink-0"
                    style={{ background: '#D4A017', color: '#0B2150' }}
                  >
                    MB
                  </span>
                </div>

                {/* Centered initials */}
                <div className="relative z-10 text-center my-2">
                  <div
                    className="font-display font-black uppercase tracking-tightest leading-[0.85]"
                    style={{
                      fontSize: 'clamp(72px, 14vw, 132px)',
                      color: '#D4A017',
                      textShadow: '0 12px 40px rgba(212,160,23,0.35)',
                    }}
                  >
                    HZA
                  </div>
                </div>

                {/* Footer credential */}
                <div className="relative z-10">
                  <div className="h-px w-full bg-gold/30 mb-4" />
                  <div className="text-[11px] sm:text-[12px] text-cream/85">
                    {t('bayomy.credential')}
                  </div>
                </div>
              </div>

              {/* Stat cards floating below the visual */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 w-max">
                {stats.map(([v, l], i) => (
                  <div
                    key={i}
                    className="rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-sm border"
                    style={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)',
                      boxShadow: '0 20px 50px -10px rgba(11,33,80,0.35)',
                    }}
                  >
                    <div className="font-display text-lg sm:text-2xl font-black" style={{ color: 'var(--accent)' }}>
                      {v}
                    </div>
                    <div className="text-[9px] tracking-[0.18em] uppercase font-bold whitespace-nowrap" style={{ color: 'var(--fg-soft)' }}>
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bio + quote */}
          <div data-founder-content className="lg:col-span-7 lg:ps-6 mt-14 lg:mt-0">
            <svg
              className="w-12 h-12 mb-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ color: 'var(--accent)' }}
              aria-hidden
            >
              <path d="M9 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2H5v2h1a4 4 0 0 0 4-4v-8a2 2 0 0 0-1-1zM20 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v3a2 2 0 0 1-2 2h-1v2h1a4 4 0 0 0 4-4v-8a2 2 0 0 0-1-1z" />
            </svg>
            <blockquote
              className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase leading-[0.95] tracking-tight"
              style={{ color: 'var(--fg)' }}
            >
              {t('bayomy.quote')}
            </blockquote>
            <p className="mt-6 sm:mt-7 text-[14.5px] md:text-base leading-relaxed max-w-xl" style={{ color: 'var(--fg-soft)' }}>
              {t('bayomy.bio')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://wa.me/971501980275" target="_blank" rel="noopener" className="btn-magnetic btn-gold">
                WhatsApp
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.3-.1-.5-.1-.1-.6-1.5-.9-2-.2-.5-.5-.4-.6-.4h-.6c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.2-1.3 0-.1-.2-.2-.5-.3z"/><path d="M20 4A10 10 0 0 0 4.7 16.2L3 22l6-1.6A10 10 0 1 0 20 4zM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-3.6 1 1-3.5-.2-.3A8 8 0 1 1 12 20z"/></svg>
              </a>
              <a href="#cta" className="btn-magnetic btn-outline">
                {tContact('phone')}
                <span aria-hidden>→</span>
              </a>
              <a
                href={profileHref}
                target="_blank"
                rel="noopener"
                download
                className="btn-magnetic btn-outline"
              >
                {t('profileCta')}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
