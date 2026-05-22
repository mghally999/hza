'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitch() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = locale === 'en' ? 'ar' : 'en';

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: switchTo })}
      className="inline-flex items-center justify-center h-9 px-3 rounded-full border transition-all text-[11px] font-bold tracking-[0.16em] uppercase hover:bg-gold hover:text-navy hover:border-gold"
      style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}
      aria-label={`Switch language to ${switchTo}`}
    >
      {t('lang')}
    </button>
  );
}
