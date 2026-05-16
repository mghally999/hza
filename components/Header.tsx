'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from './ui/Logo';
import LanguageSwitch from './LanguageSwitch';

export default function Header() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream/85 backdrop-blur-lg border-b border-navy/8'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between gap-6">
        <Link href="/" aria-label="HZA Home">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-navy">
          <a href="#services" className="hover:text-gold transition-colors">
            {t('services')}
          </a>
          <a href="#who" className="hover:text-gold transition-colors">
            {t('company')}
          </a>
          <a href="#process" className="hover:text-gold transition-colors">
            {t('resources')}
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <a href="#pricing" className="hidden sm:inline-flex btn-magnetic btn-outline !py-2.5 !px-5 !text-[13px]">
            {t('pricing')}
            <span aria-hidden>↓</span>
          </a>
          <a href="#cta" className="btn-magnetic btn-primary !py-2.5 !px-5 !text-[13px]">
            {t('talk')}
            <span aria-hidden>→</span>
          </a>
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
