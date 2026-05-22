'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type Photo = {
  id: string;
  url: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  source: 'unsplash' | 'pexels' | 'pixabay';
  sourceUrl: string;
};

// Themed queries — luxury business / finance / tax imagery.
const QUERIES = [
  'businessman tuxedo',
  'finance executive office',
  'tax documents desk',
  'accounting calculator',
  'corporate boardroom',
  'business handshake',
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const root = useRef<HTMLElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch photos across the themed queries, in parallel.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settled = await Promise.allSettled(
          QUERIES.map((q) =>
            fetch(`/api/stock?q=${encodeURIComponent(q)}&count=2`)
              .then((r) => (r.ok ? r.json() : { photos: [] }))
              .then((d: { photos?: Photo[] }) => d.photos ?? []),
          ),
        );
        if (cancelled) return;
        const all: Photo[] = [];
        // Interleave for visual variety
        const lanes = settled.map((s) => (s.status === 'fulfilled' ? s.value : []));
        const max = Math.max(...lanes.map((l) => l.length), 0);
        for (let i = 0; i < max; i++) {
          for (const lane of lanes) {
            if (lane[i]) all.push(lane[i]);
            if (all.length >= 9) break;
          }
          if (all.length >= 9) break;
        }
        setPhotos(all.slice(0, 9));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Stagger reveal on scroll
  useEffect(() => {
    if (!photos.length) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-gallery-tile]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
    }, root);
    return () => ctx.revert();
  }, [photos]);

  return (
    <section
      ref={root}
      id="gallery"
      className="section-pad relative overflow-hidden noise-overlay"
      style={{ background: 'var(--bg-soft)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <div className="pill inline-flex" style={{ background: 'var(--navy)', color: 'var(--cream)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {t('tag')}
            </div>
            <h2
              className="h-mega mt-5 text-[clamp(48px,8vw,130px)]"
              style={{ color: 'var(--fg)' }}
            >
              {t('title')}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-4">
            <p
              className="font-display uppercase tracking-tight text-xl md:text-2xl mb-3"
              style={{ color: 'var(--accent)' }}
            >
              {t('subtitle')}
            </p>
            <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--fg-soft)' }}>
              {t('lead')}
            </p>
          </div>
        </div>

        {loading && photos.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl animate-pulse"
                style={{ background: 'color-mix(in srgb, var(--fg) 8%, transparent)' }}
              />
            ))}
          </div>
        ) : photos.length === 0 ? (
          // Soft fallback if all APIs failed at runtime
          <div
            className="rounded-2xl p-8 text-center text-sm"
            style={{ background: 'var(--surface)', color: 'var(--fg-soft)', borderColor: 'var(--border)' }}
          >
            {t('loading')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {photos.map((p, i) => {
              // Vary tile sizes for an editorial mosaic feel
              const featured = i === 0 || i === 4;
              return (
                <a
                  key={p.id}
                  data-gallery-tile
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative block overflow-hidden rounded-2xl brand-tint lift ${
                    featured ? 'md:col-span-2 md:row-span-2 aspect-[3/2] md:aspect-[4/3]' : 'aspect-[4/3]'
                  }`}
                >
                  <Image
                    src={p.url}
                    alt={p.alt}
                    fill
                    sizes={featured ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </a>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
