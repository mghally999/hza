'use client';

import Image from 'next/image';

/**
 * Official HZA logo. The brand PNG is a circular badge:
 *
 *   - "HZA" mark with bar chart + arrow + swoosh on top
 *   - "ALHADF ALZAKI · ACCOUNTING & BOOKKEEPING L.L.C." text below
 *
 * The original Facebook upload (1942×809) has whitespace on the sides; the
 * `hzao-logo-square.png` is the 809×809 centred crop we display everywhere.
 *
 * Props:
 *   size      → rendered pixel height/width (square).
 *   mark      → compact SVG monogram (favicon-style).
 *   onDark    → "auto" picks based on prefers-color-scheme / theme;
 *               "true" forces the dark-background treatment;
 *               "false" forces the light-background treatment.
 *               On dark backgrounds we set a cream disc behind the image so
 *               the navy + gold artwork pops cleanly — the brand mark was
 *               drawn on a white circle, so this preserves its design.
 */
export function Logo({
  className = '',
  size = 56,
  mark = false,
  onDark = 'auto',
}: {
  className?: string;
  size?: number;
  mark?: boolean;
  onDark?: boolean | 'auto';
}) {
  if (mark) {
    return (
      <svg
        viewBox="0 0 64 64"
        className={className}
        width={size}
        height={size}
        fill="none"
        aria-label="HZA mark"
      >
        <defs>
          <linearGradient id="hzao-grad" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#1A4F9E" />
            <stop offset="100%" stopColor="#0B2150" />
          </linearGradient>
          <linearGradient id="hzao-gold" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#F4D580" />
            <stop offset="100%" stopColor="#D4A017" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="#FAF6EC" stroke="url(#hzao-grad)" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="22" stroke="url(#hzao-gold)" strokeWidth="1.5" fill="none" opacity="0.7" />
        <text
          x="32" y="38" textAnchor="middle"
          fontFamily="ui-serif, Georgia"
          fontWeight="900" fontSize="17"
          letterSpacing="-0.04em"
          fill="url(#hzao-grad)"
        >
          HZA
        </text>
        <path d="M44 24l8 -6 -2 8z" fill="url(#hzao-gold)" />
        <rect x="14" y="40" width="2.5" height="6"  fill="url(#hzao-grad)" />
        <rect x="18" y="37" width="2.5" height="9"  fill="url(#hzao-grad)" />
        <rect x="22" y="34" width="2.5" height="12" fill="url(#hzao-gold)" />
      </svg>
    );
  }

  const explicit = onDark === true || onDark === false;
  // For auto: rely on CSS to switch via [data-theme="dark"] selector below.
  return (
    <div
      className={`hzao-logo relative shrink-0 inline-flex items-center justify-center rounded-full ${
        explicit ? (onDark ? 'is-dark' : 'is-light') : 'is-auto'
      } ${className}`}
      style={{ width: size, height: size }}
      aria-label="HZA — Alhadf Alzaki Accounting & Bookkeeping L.L.C."
    >
      <Image
        src="/img/brand/hzao-logo-square.png"
        alt="HZA — Alhadf Alzaki Accounting & Bookkeeping L.L.C."
        fill
        priority
        sizes={`${size}px`}
        className="object-contain rounded-full"
      />

      {/* Inline CSS scoped to this component. Keeps theming local and tidy. */}
      <style jsx>{`
        .hzao-logo {
          background: transparent;
          transition: background 400ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* Treatment when explicitly placed over a dark background (footer, navy hero) */
        .hzao-logo.is-dark {
          background: #faf6ec;
          box-shadow: 0 0 0 1px rgba(212, 160, 23, 0.45),
            0 14px 30px -8px rgba(0, 0, 0, 0.45);
        }
        .hzao-logo.is-light {
          background: transparent;
        }
        /* Auto: light theme keeps it transparent (PNG already has cream interior);
           dark theme adds the cream backing to preserve the brand design. */
        :global(html[data-theme='dark']) .hzao-logo.is-auto {
          background: #faf6ec;
          box-shadow: 0 0 0 1px rgba(212, 160, 23, 0.45),
            0 12px 28px -8px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
