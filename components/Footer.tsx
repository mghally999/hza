'use client';

import { useTranslations } from 'next-intl';
import { Logo } from './ui/Logo';

export default function Footer() {
  const t = useTranslations('footer');
  const c = useTranslations('contact');
  return (
    <footer className="py-16" style={{ background: 'var(--navy-deep)', color: 'rgba(250,246,236,0.8)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Logo size={84} onDark />
            <p className="mt-6 text-sm max-w-md" style={{ color: 'rgba(250,246,236,0.6)' }}>
              {t('tagline')}
            </p>
          </div>

          <div>
            <h4 className="font-display text-gold uppercase font-bold text-sm tracking-widest mb-4">
              {t('contact')}
            </h4>
            <p className="text-sm leading-relaxed">{c('address')}</p>
            <a
              href={`tel:${c('phone').replace(/\s/g, '')}`}
              className="text-sm hover:text-gold transition-colors block mt-2"
            >
              {c('phone')}
            </a>
            <a
              href={`tel:${c('phoneAlt').replace(/\s/g, '')}`}
              className="text-sm hover:text-gold transition-colors block"
            >
              {c('phoneAlt')}
            </a>
            <a
              href={`mailto:${c('email')}`}
              className="text-sm hover:text-gold transition-colors block mt-2 break-all"
            >
              {c('email')}
            </a>
            <p className="text-[11px] mt-3 tracking-[0.18em] uppercase font-bold text-gold/80">
              {c('license')}
            </p>
          </div>

          <div>
            <h4 className="font-display text-gold uppercase font-bold text-sm tracking-widest mb-4">
              {t('social')}
            </h4>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.facebook.com/profile.php?id=61589782902352"
                target="_blank"
                rel="noopener"
                className="px-3 py-1.5 rounded-full border text-xs hover:bg-gold hover:text-navy hover:border-gold transition-colors"
                style={{ borderColor: 'rgba(250,246,236,0.2)' }}
              >
                Facebook
              </a>
              <a
                href="https://wa.me/971501980275"
                target="_blank"
                rel="noopener"
                className="px-3 py-1.5 rounded-full border text-xs hover:bg-gold hover:text-navy hover:border-gold transition-colors"
                style={{ borderColor: 'rgba(250,246,236,0.2)' }}
              >
                WhatsApp
              </a>
              <a
                href={`mailto:${c('email')}`}
                className="px-3 py-1.5 rounded-full border text-xs hover:bg-gold hover:text-navy hover:border-gold transition-colors"
                style={{ borderColor: 'rgba(250,246,236,0.2)' }}
              >
                Email
              </a>
            </div>
            <p className="text-[11px] mt-4 opacity-60">{t('credits')}</p>
          </div>
        </div>
        <div className="pt-8 border-t flex flex-wrap justify-between gap-4" style={{ borderColor: 'rgba(250,246,236,0.1)' }}>
          <span className="text-xs" style={{ color: 'rgba(250,246,236,0.4)' }}>{t('rights')}</span>
          <span className="font-mono text-xs" style={{ color: 'rgba(250,246,236,0.4)' }}>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
