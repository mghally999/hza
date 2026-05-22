import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Big_Shoulders_Display, Plus_Jakarta_Sans, Tajawal } from 'next/font/google';

import { routing } from '@/i18n/routing';
import LenisProvider from '@/components/Lenis';
import ThemeProvider from '@/components/ThemeProvider';
import AIChat from '@/components/AIChat';
import '../globals.css';

const display = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const arabic = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-arabic',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alhadfalzaki.ae';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const brand = await getTranslations({ locale, namespace: 'brand' });

  const title =
    locale === 'ar'
      ? `الهدف الذكي للمحاسبة ومسك الدفاتر ذ.م.م — محاسبة وضرائب في دبي`
      : `HZA — Alhadf Alzaki Accounting & Bookkeeping L.L.C. · Dubai`;

  const description =
    locale === 'ar'
      ? 'محاسبة، ضريبة القيمة المضافة، ضريبة الشركات، رواتب WPS ومسك دفاتر في دبي. مكتب بَرّ رئيسي في محيصنة 4. مسجَّل لدى الهيئة — رخصة 1320675.'
      : 'Mainland-licensed accounting, VAT, Corporate Tax, WPS payroll & bookkeeping in Dubai. Muhaisnah 4 office. FTA-registered — license 1320675. From AED 1,500/month.';

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${brand('name')}` },
    description,
    applicationName: 'HZA',
    keywords: [
      'Dubai accounting',
      'accounting Dubai',
      'bookkeeping Dubai',
      'VAT Dubai',
      'Corporate Tax UAE',
      'FTA VAT returns',
      'WPS payroll',
      'bookkeeping services UAE',
      'tax consultant Dubai',
      'free zone accounting',
      'مسك دفاتر دبي',
      'محاسبة دبي',
      'ضريبة القيمة المضافة',
      'ضريبة الشركات',
      'الهدف الذكي',
      'Alhadf Alzaki',
      'HZA',
      'Muhaisnah accounting',
    ],
    authors: [{ name: 'Mohammed Bayomy' }],
    creator: 'HZA — Alhadf Alzaki',
    publisher: 'HZA — Alhadf Alzaki Accounting & Bookkeeping L.L.C.',
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar` },
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      title,
      description,
      siteName: 'HZA',
      locale: locale === 'ar' ? 'ar_AE' : 'en_AE',
      images: [
        {
          url: '/img/brand/hzao-logo-square.png',
          width: 809,
          height: 809,
          alt: 'HZA — Alhadf Alzaki Accounting & Bookkeeping L.L.C.',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/img/brand/hzao-logo-square.png'],
    },
    icons: {
      icon: '/icon.svg',
      apple: '/img/brand/hzao-logo-square.png',
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF6EC' },
    { media: '(prefers-color-scheme: dark)', color: '#050B1F' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: 'HZA — Alhadf Alzaki Accounting & Bookkeeping L.L.C.',
    alternateName: ['Alhadf Alzaki', 'الهدف الذكي'],
    image: `${SITE_URL}/img/brand/hzao-logo-square.png`,
    url: SITE_URL,
    telephone: '+971501980275',
    email: 'mohamedbayomy1998@gmail.com',
    priceRange: 'AED 1,500 – AED 7,500 / month',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Muhaisnah 4',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.241, longitude: 55.422 },
    sameAs: ['https://www.facebook.com/profile.php?id=61589782902352'],
    founder: { '@type': 'Person', name: 'Mohammed Bayomy' },
    areaServed: { '@type': 'Country', name: 'United Arab Emirates' },
    serviceType: [
      'Accounting',
      'Bookkeeping',
      'VAT Filing',
      'Corporate Tax',
      'WPS Payroll',
      'Financial Reporting',
      'Audit Support',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '00:00',
      closes: '23:59',
    },
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${display.variable} ${body.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          // Avoid FOUC by setting theme before paint.
        >{`
          try {
            var t = localStorage.getItem('hzao-theme');
            if (!t) {
              t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            document.documentElement.dataset.theme = t;
          } catch (e) {}
        `}</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider>
            <LenisProvider>{children}</LenisProvider>
            <AIChat />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
