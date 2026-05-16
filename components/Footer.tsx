'use client';

import { useTranslations } from 'next-intl';
import { Logo } from './ui/Logo';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-navy-900 text-cream/80 py-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <Logo />
            <p className="mt-6 text-sm text-cream/60 max-w-xs">{t('tagline')}</p>
          </div>
          <div>
            <h4 className="font-display text-gold uppercase font-bold text-sm tracking-widest mb-4">
              {t('contact')}
            </h4>
            <p className="text-sm leading-relaxed">{t('address')}</p>
            <a href="mailto:hello@hza.example" className="text-sm hover:text-gold transition-colors block mt-2">
              hello@hza.example
            </a>
          </div>
          <div>
            <h4 className="font-display text-gold uppercase font-bold text-sm tracking-widest mb-4">
              {t('social')}
            </h4>
            <div className="flex gap-3">
              {['LinkedIn', 'Instagram', 'X'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="px-3 py-1.5 rounded-full border border-cream/20 text-xs hover:bg-gold hover:text-navy hover:border-gold transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-cream/10 text-xs text-cream/40 flex flex-wrap justify-between gap-4">
          <span>{t('rights')}</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
