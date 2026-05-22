'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

type Video = {
  id: string;
  url: string;
  poster: string;
  width: number;
  height: number;
  duration: number;
  alt: string;
};

// Themed queries — businessman in tuxedo / suit, finance, taxes, meetings.
const QUERIES = [
  'businessman suit',
  'finance office',
  'accountant calculator',
  'corporate handshake',
];

export default function VideoShowcase() {
  const t = useTranslations('video');
  const root = useRef<HTMLElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settled = await Promise.allSettled(
          QUERIES.map((q) =>
            fetch(`/api/videos?q=${encodeURIComponent(q)}&count=2`)
              .then((r) => (r.ok ? r.json() : { videos: [] }))
              .then((d: { videos?: Video[] }) => d.videos ?? []),
          ),
        );
        if (cancelled) return;
        // Take one from each lane first to maximise variety
        const lanes = settled.map((s) => (s.status === 'fulfilled' ? s.value : []));
        const out: Video[] = [];
        const max = Math.max(...lanes.map((l) => l.length), 0);
        for (let i = 0; i < max && out.length < 4; i++) {
          for (const lane of lanes) {
            if (lane[i] && out.length < 4) out.push(lane[i]);
          }
        }
        setVideos(out);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!videos.length) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-vid-tile]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      });
    }, root);
    return () => ctx.revert();
  }, [videos]);

  return (
    <section
      ref={root}
      id="video"
      className="section-pad relative overflow-hidden noise-overlay"
      style={{ background: 'var(--navy)', color: 'var(--cream)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <div className="pill inline-flex" style={{ background: '#FAF6EC', color: '#0B2150' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              {t('tag')}
            </div>
            <h2 className="h-mega mt-5 text-cream text-[clamp(42px,7vw,110px)]">
              {t('title')}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-4">
            <p className="font-display uppercase tracking-tight text-xl md:text-2xl text-gold mb-3">
              {t('subtitle')}
            </p>
            <p className="text-cream/70 text-[14.5px] leading-relaxed">{t('lead')}</p>
          </div>
        </div>

        {loading && !videos.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-2xl animate-pulse"
                style={{ background: 'rgba(250,246,236,0.05)' }}
              />
            ))}
          </div>
        ) : videos.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {videos.map((v) => (
              <div
                key={v.id}
                data-vid-tile
                className="relative aspect-video rounded-2xl overflow-hidden brand-tint lift"
              >
                <video
                  src={v.url}
                  poster={v.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cream/60 text-sm">{t('empty')}</p>
        )}
      </div>
    </section>
  );
}
