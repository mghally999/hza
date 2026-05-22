import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alhadfalzaki.ae';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/en`, lastModified: now, alternates: { languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar` } }, priority: 1 },
    { url: `${SITE_URL}/ar`, lastModified: now, alternates: { languages: { en: `${SITE_URL}/en`, ar: `${SITE_URL}/ar` } }, priority: 1 },
  ];
}
