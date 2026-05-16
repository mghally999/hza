'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const stepBgs = ['#FAF6EC', '#F4D580', '#FAF6EC', '#0B2150'];
const stepFgs = ['#0B2150', '#0B2150', '#0B2150', '#FAF6EC'];

const StepIllustration = ({ index }: { index: number }) => {
  // Simple geometric illustration per step using brand palette
  const illos = [
    // Step 1 — speech bubble / talk
    <svg key="0" viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="78" fill="#1A4F9E" />
      <path
        d="M50 80c0-16 14-30 32-30h40c18 0 32 14 32 30v22c0 16-14 30-32 30h-12l-18 18v-18h-10c-18 0-32-14-32-30V80z"
        fill="#FAF6EC"
      />
      <circle cx="80" cy="92" r="4" fill="#0B2150" />
      <circle cx="100" cy="92" r="4" fill="#0B2150" />
      <circle cx="120" cy="92" r="4" fill="#0B2150" />
      <circle cx="170" cy="30" r="6" fill="#D4A017" />
      <circle cx="40" cy="170" r="8" fill="#D4A017" />
    </svg>,
    // Step 2 — shield / defences
    <svg key="1" viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <path
        d="M100 25l60 18v50c0 35-25 67-60 82-35-15-60-47-60-82V43l60-18z"
        fill="#0B2150"
      />
      <path
        d="M70 100l20 20 40-44"
        stroke="#D4A017"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="40" r="6" fill="#D4A017" />
      <circle cx="170" cy="160" r="8" fill="#1A4F9E" />
    </svg>,
    // Step 3 — chart up
    <svg key="2" viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <rect x="30" y="30" width="140" height="140" rx="10" fill="#0B2150" />
      <path
        d="M50 140l30-30 30 20 40-60"
        stroke="#D4A017"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="50" cy="140" r="6" fill="#FAF6EC" />
      <circle cx="80" cy="110" r="6" fill="#FAF6EC" />
      <circle cx="110" cy="130" r="6" fill="#FAF6EC" />
      <circle cx="150" cy="70" r="6" fill="#FAF6EC" />
      <path d="M50 160h100" stroke="#FAF6EC" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>,
    // Step 4 — target hit
    <svg key="3" viewBox="0 0 200 200" fill="none" className="w-full h-full">
      <circle cx="100" cy="100" r="78" fill="#D4A017" />
      <circle cx="100" cy="100" r="56" fill="#FAF6EC" />
      <circle cx="100" cy="100" r="34" fill="#1A4F9E" />
      <circle cx="100" cy="100" r="14" fill="#D4A017" />
      <path
        d="M100 100l60 -50"
        stroke="#0B2150"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M160 50l-12 4 4 -12z" fill="#0B2150" />
      <path d="M148 38l-6 2M152 32l-6 2" stroke="#0B2150" strokeWidth="3" strokeLinecap="round" />
    </svg>,
  ];
  return illos[index];
};

export default function Process() {
  const t = useTranslations('process');
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step) => {
        gsap.from(step.querySelectorAll('[data-step-text]'), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 70%' },
        });
        gsap.from(step.querySelector('[data-step-illo]'), {
          scale: 0.8,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 70%' },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="process" className="relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-24 pb-12 bg-cream">
        <div className="text-center">
          <div className="pill bg-navy text-cream inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            {t('tag')}
          </div>
          <h2 className="h-mega text-navy text-[clamp(48px,8vw,140px)] mt-6">
            {t('title')}
          </h2>
        </div>
      </div>

      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          data-step
          style={{ background: stepBgs[i], color: stepFgs[i] }}
          className="section-pad relative noise-overlay"
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <span data-step-text className="pill bg-current text-current inline-flex" style={{
                background: stepFgs[i] + '15',
                color: stepFgs[i]
              }}>
                {t(`steps.${i}.step` as any)}
              </span>
              <h3
                data-step-text
                className="h-mega text-[clamp(40px,6.5vw,110px)] mt-6"
                style={{ color: stepFgs[i] }}
              >
                {t(`steps.${i}.title` as any)}
              </h3>
              <p data-step-text className="font-display text-xl md:text-2xl mt-4 uppercase tracking-tight opacity-80">
                {t(`steps.${i}.subtitle` as any)}
              </p>
              <p data-step-text className="mt-8 max-w-md text-[15px] leading-relaxed opacity-75">
                {t(`steps.${i}.body` as any)}
              </p>
            </div>

            <div data-step-illo className={`flex items-center justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="w-full max-w-[440px] aspect-square">
                <StepIllustration index={i} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
