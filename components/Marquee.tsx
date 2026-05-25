'use client';

import { useTranslations } from 'next-intl';

export default function Marquee() {
  const t = useTranslations();
  const items = t.raw('marquee') as string[];
  const doubled = [...items, ...items, ...items];

  return (
    <section
      className="relative py-8 overflow-hidden border-y"
      style={{ background: 'var(--navy)', color: 'var(--cream)', borderColor: 'rgba(7,22,56,0.6)' }}
    >
      <div className="flex">
        <div className="marquee-track flex shrink-0 gap-8 md:gap-12 items-center pe-12">
          {doubled.map((item, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-12 whitespace-nowrap">
              <span className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight">
                {item}
              </span>
              <svg className="w-6 h-6 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
