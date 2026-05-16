'use client';

import { useTranslations } from 'next-intl';

export default function Marquee() {
  const t = useTranslations();
  const items = t.raw('marquee') as string[];
  const doubled = [...items, ...items, ...items];

  return (
    <section className="relative py-8 bg-navy text-cream overflow-hidden border-y border-navy/60">
      <div className="flex">
        <div
          className="flex shrink-0 gap-12 items-center pr-12 animate-marquee"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {doubled.map((item, i) => (
            <div key={i} className="flex items-center gap-12 whitespace-nowrap">
              <span className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight">
                {item}
              </span>
              <svg className="w-6 h-6 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        :global(html[dir='rtl']) .animate-marquee {
          animation-direction: reverse !important;
        }
      `}</style>
    </section>
  );
}
