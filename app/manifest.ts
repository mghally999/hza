import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HZA — Alhadf Alzaki Accounting & Bookkeeping',
    short_name: 'HZA',
    description: 'Dubai accounting, VAT, Corporate Tax & WPS payroll. License 1320675.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#FAF6EC',
    theme_color: '#0B2150',
    icons: [
      { src: '/img/brand/hzao-logo-square.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
