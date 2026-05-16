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
      onClick={() => router.replace(pathname, { locale: switchTo })}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-navy/20 hover:border-navy/60 hover:bg-navy hover:text-cream transition-all text-sm font-bold"
      aria-label={`Switch language to ${switchTo}`}
    >
      {t('lang')}
    </button>
  );
}
