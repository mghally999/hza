'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { PLANS, ADDONS, MONTHLY_DELIVERABLES } from '@/lib/pricing-data';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type Status = 'idle' | 'loading' | 'ready' | 'error';

export default function Pricing() {
  const t = useTranslations('pricing');
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>('idle');

  // Preload jsPDF on hover/focus so the click feels instant.
  const warmUp = () => {
    if (status !== 'idle') return;
    import('@/lib/proposal').catch(() => {});
  };

  const download = async () => {
    setStatus('loading');
    try {
      const mod = await import('@/lib/proposal');
      await mod.generateProposal();
      setStatus('ready');
      // brief success window, then back to idle
      setTimeout(() => setStatus('idle'), 2500);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3500);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-pricing-head] > span', {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.07,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
      gsap.from('[data-pricing-card]', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-pricing-cards]', start: 'top 80%' },
      });
      gsap.from('[data-pricing-row]', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-pricing-table]', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const btnLabel = {
    idle: t('downloadCta'),
    loading: t('downloadLoading'),
    ready: t('downloadReady'),
    error: t('downloadError'),
  }[status];

  return (
    <section
      ref={root}
      id="pricing"
      className="section-pad relative overflow-hidden noise-overlay"
      style={{ background: 'var(--bg)' }}
    >
      {/* Soft brand orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full bg-gold/10 blur-3xl" />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="text-center mb-14">
          <div className="pill bg-navy text-cream inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            {t('tag')}
          </div>

          <h2
            data-pricing-head
            className="h-mega text-navy text-[clamp(40px,8vw,140px)] mt-6"
          >
            {(t('title') as string).split(' ').map((w, i) => (
              <span key={i} className="inline-block split-line me-[0.25em]">
                <span>{w}</span>
              </span>
            ))}
          </h2>

          <p className="mt-4 text-navy/70 text-sm md:text-base font-semibold tracking-widest uppercase">
            {t('subtitle')}
          </p>

          <p className="mt-5 max-w-2xl mx-auto text-navy/70 text-[15px] leading-relaxed">
            {t('lead')}
          </p>
        </div>

        {/* Plan cards */}
        <div data-pricing-cards className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
          {PLANS.map((p) => {
            const featured = p.featured;
            return (
              <article
                key={p.key}
                data-pricing-card
                className={`relative rounded-3xl p-7 md:p-8 flex flex-col group transition-colors ${
                  featured
                    ? 'bg-navy text-cream border-2 border-gold shadow-[0_30px_80px_-20px_rgba(11,33,80,0.5)]'
                    : 'bg-cream border-2 border-navy/12 text-navy hover:border-gold'
                }`}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-navy text-[10px] font-extrabold tracking-[0.2em] uppercase">
                    {t('popular')}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                      featured ? 'text-gold' : 'text-navy/55'
                    }`}
                  >
                    {p.tagline}
                  </span>
                  <span
                    className={`w-9 h-9 rounded-full grid place-items-center text-sm font-extrabold ${
                      featured ? 'bg-gold text-navy' : 'bg-navy text-cream'
                    }`}
                  >
                    {p.key.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h3 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight leading-[0.95] mt-5">
                  {p.name}
                </h3>

                <div className="mt-4 flex items-end gap-2">
                  <span
                    className={`font-display font-black text-4xl sm:text-5xl md:text-6xl leading-none ${
                      featured ? 'text-gold' : 'text-navy'
                    }`}
                  >
                    {p.price.toLocaleString('en-US')}
                  </span>
                  <span className={`text-xs font-semibold mb-2 ${featured ? 'text-cream/70' : 'text-navy/60'}`}>
                    AED / {t('month')}
                  </span>
                </div>

                <p className={`mt-3 text-[13.5px] leading-relaxed ${featured ? 'text-cream/80' : 'text-navy/70'}`}>
                  {p.summary}
                </p>

                <div
                  className={`mt-5 text-[11px] uppercase tracking-[0.15em] font-bold ${
                    featured ? 'text-gold' : 'text-navy/50'
                  }`}
                >
                  {t('fitFor')}
                </div>
                <p className={`text-[12.5px] mt-1 ${featured ? 'text-cream/70' : 'text-navy/65'}`}>
                  {p.fitFor}
                </p>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start gap-2.5 text-[13px] leading-snug ${
                        featured ? 'text-cream/90' : 'text-navy/80'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${featured ? 'text-gold' : 'text-gold'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                      >
                        <path d="M8 12.5l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#cta"
                  className={`btn-magnetic mt-7 justify-center ${
                    featured ? 'btn-gold' : 'btn-outline'
                  }`}
                >
                  {t('choose')}
                  <span aria-hidden>→</span>
                </a>
              </article>
            );
          })}
        </div>

        {/* Detailed comparison table */}
        <div data-pricing-table className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <div className="pill bg-cream-200 text-navy inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                {t('compareTag')}
              </div>
              <h3 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-navy mt-3">
                {t('compareTitle')}
              </h3>
            </div>
            <button
              type="button"
              onClick={download}
              onMouseEnter={warmUp}
              onFocus={warmUp}
              disabled={status === 'loading'}
              className="btn-magnetic btn-primary !py-3 !px-6"
            >
              {status === 'loading' && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {status !== 'loading' && (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 3v13m0 0l-5-5m5 5l5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {btnLabel}
            </button>
          </div>

          <div className="rounded-3xl overflow-hidden border-2 border-navy/12 bg-cream">
            <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="bg-navy text-cream text-[11px] uppercase tracking-[0.18em]">
                  <th className="py-4 px-5 font-bold">{t('deliverable')}</th>
                  {PLANS.map((p) => (
                    <th key={p.key} className="py-4 px-5 text-center font-bold">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHLY_DELIVERABLES.map((row, i) => (
                  <tr
                    key={row.label}
                    data-pricing-row
                    className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-200/60'}
                  >
                    <td className="py-3.5 px-5 text-navy text-[13.5px] font-medium">{row.label}</td>
                    {PLANS.map((p) => (
                      <td key={p.key} className="py-3.5 px-5 text-center">
                        {row.includedIn(p) ? (
                          <span className="inline-flex w-7 h-7 rounded-full bg-gold/20 text-gold items-center justify-center">
                            <svg
                              viewBox="0 0 24 24"
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M5 12.5l5 5 10-12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        ) : (
                          <span className="inline-block w-4 h-[2px] bg-navy/20 rounded-full" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-navy-900 text-cream">
                  <td className="py-5 px-5 text-[12px] uppercase tracking-[0.18em] font-bold text-gold">
                    {t('monthlyFee')}
                  </td>
                  {PLANS.map((p) => (
                    <td key={p.key} className="py-5 px-5 text-center">
                      <div className="font-display font-black text-2xl md:text-3xl text-cream">
                        {p.price.toLocaleString('en-US')}
                      </div>
                      <div className="text-[10px] text-cream/60 tracking-[0.18em] uppercase mt-0.5">
                        AED / {t('month')}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            </div>
          </div>

          {/* Add-ons */}
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div>
                <div className="pill bg-cream-200 text-navy inline-flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  {t('addonsTag')}
                </div>
                <h3 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight text-navy mt-3">
                  {t('addonsTitle')}
                </h3>
                <p className="text-navy/70 text-sm mt-2 max-w-2xl">{t('addonsLead')}</p>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-navy text-gold text-[11px] font-bold tracking-[0.18em] uppercase">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
                </svg>
                {t('bundleNote')}
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border-2 border-navy/12">
              <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="bg-navy text-cream text-[11px] uppercase tracking-[0.18em]">
                    <th className="py-4 px-5 font-bold w-16">{t('code')}</th>
                    <th className="py-4 px-5 font-bold">{t('service')}</th>
                    <th className="py-4 px-5 font-bold">{t('cadence')}</th>
                    <th className="py-4 px-5 font-bold text-right">{t('fee')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ADDONS.map((a, i) => (
                    <tr
                      key={a.code}
                      data-pricing-row
                      className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-200/60'}
                    >
                      <td className="py-3.5 px-5 font-mono text-[12px] font-bold text-gold">
                        {a.code}
                      </td>
                      <td className="py-3.5 px-5 text-navy text-[13.5px]">
                        <div className="font-semibold">{a.name}</div>
                        <div className="text-navy/55 text-[12px] mt-0.5">{a.blurb}</div>
                      </td>
                      <td className="py-3.5 px-5 text-navy/70 text-[12.5px]">{a.cadence}</td>
                      <td className="py-3.5 px-5 text-right font-display font-black text-lg text-navy">
                        {a.price.toLocaleString('en-US')}
                        <span className="text-[10px] font-semibold text-navy/55 tracking-widest ms-1">
                          AED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          {/* Final CTA strip */}
          <div className="mt-12 grid md:grid-cols-3 gap-4 items-center bg-navy text-cream rounded-3xl p-6 md:p-8">
            <div className="md:col-span-2">
              <h4 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight">
                {t('ctaTitle')}
              </h4>
              <p className="text-cream/70 text-[13.5px] mt-2 max-w-xl">{t('ctaLead')}</p>
            </div>
            <div className="flex md:justify-end gap-3 flex-wrap">
              <button
                type="button"
                onClick={download}
                onMouseEnter={warmUp}
                onFocus={warmUp}
                disabled={status === 'loading'}
                className="btn-magnetic btn-gold"
              >
                {btnLabel}
                {status === 'idle' && <span aria-hidden>↓</span>}
              </button>
              <a
                href="#cta"
                className="btn-magnetic btn-outline !text-cream !border-cream/30 hover:!bg-cream hover:!text-navy"
              >
                {t('bookCta')}
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
