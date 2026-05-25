'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Logo } from './ui/Logo';
import LanguageSwitch from './LanguageSwitch';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-lg border-b' : 'bg-transparent'
      }`}
      style={
        scrolled
          ? { background: 'color-mix(in srgb, var(--bg) 85%, transparent)', borderColor: 'var(--border)' }
          : {}
      }
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-5 md:px-10 h-[68px] sm:h-[76px] flex items-center justify-between gap-3 sm:gap-6">
        <Link href="/" aria-label="HZA Home" className="inline-flex items-center gap-2 sm:gap-3 min-w-0">
          <Logo size={48} />
          <span className="hidden sm:flex flex-col leading-none">
            <span
              className="text-[15px] font-extrabold tracking-[0.22em] uppercase"
              style={{ color: 'var(--fg)' }}
            >
              HZA
            </span>
            <span
              className="text-[8.5px] font-bold tracking-[0.28em] uppercase mt-1"
              style={{ color: 'var(--fg-soft)' }}
            >
              Alhadf Alzaki
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold" style={{ color: 'var(--fg)' }}>
          <a href="#services" className="u-link hover:text-gold transition-colors">{t('services')}</a>
          <a href="#founders" className="u-link hover:text-gold transition-colors">{t('founders')}</a>
          <a href="#process" className="u-link hover:text-gold transition-colors">{t('process')}</a>
          <a href="#pricing" className="u-link hover:text-gold transition-colors">{t('pricing')}</a>
          <a href="#cta" className="u-link hover:text-gold transition-colors">{t('contact')}</a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitch />
          <a
            href="#cta"
            className="hidden md:inline-flex btn-magnetic btn-primary !py-2.5 !px-5 !text-[13px]"
          >
            {t('talk')}
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-full border grid place-items-center"
            style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'var(--bg)' }}
      >
        <nav className="flex flex-col gap-2 px-5 pb-4 pt-2 text-[15px] font-semibold" style={{ color: 'var(--fg)' }}>
          {[
            ['services', '#services'],
            ['founders', '#founders'],
            ['process', '#process'],
            ['pricing', '#pricing'],
            ['contact', '#cta'],
          ].map(([k, href]) => (
            <a
              key={k}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="py-2 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              {t(k as any)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
