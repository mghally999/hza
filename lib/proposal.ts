/**
 * HZA Proposal PDF generator.
 *
 * Loads jsPDF + jspdf-autotable from a CDN on first call (cached by the
 * browser thereafter) so the bundle stays light. Produces a multi-page
 * branded proposal: cover with HZA crest, intro, pricing breakdown table,
 * add-on services, terms, and a signature block.
 */

import { PLANS, ADDONS, MONTHLY_DELIVERABLES, type Plan, type Addon } from './pricing-data';

declare global {
  interface Window {
    jspdf?: { jsPDF: new (opts?: unknown) => JsPDFInstance };
  }
}

// Minimal typed surface of the parts of jsPDF / autotable we touch.
type RGB = [number, number, number];

type AutoTableOptions = {
  startY: number;
  head: string[][];
  body: (string | number)[][];
  theme?: 'plain' | 'grid' | 'striped';
  styles?: Record<string, unknown>;
  headStyles?: Record<string, unknown>;
  bodyStyles?: Record<string, unknown>;
  alternateRowStyles?: Record<string, unknown>;
  columnStyles?: Record<number, Record<string, unknown>>;
  margin?: { left: number; right: number };
  didDrawPage?: () => void;
};

interface JsPDFInstance {
  internal: {
    pageSize: { getWidth: () => number; getHeight: () => number };
    getNumberOfPages: () => number;
  };
  setFillColor: (...c: number[]) => JsPDFInstance;
  setDrawColor: (...c: number[]) => JsPDFInstance;
  setTextColor: (...c: number[]) => JsPDFInstance;
  setFont: (name: string, style?: string) => JsPDFInstance;
  setFontSize: (size: number) => JsPDFInstance;
  setLineWidth: (w: number) => JsPDFInstance;
  rect: (x: number, y: number, w: number, h: number, style?: string) => JsPDFInstance;
  roundedRect: (
    x: number,
    y: number,
    w: number,
    h: number,
    rx: number,
    ry: number,
    style?: string,
  ) => JsPDFInstance;
  circle: (x: number, y: number, r: number, style?: string) => JsPDFInstance;
  line: (x1: number, y1: number, x2: number, y2: number) => JsPDFInstance;
  triangle: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    style?: string,
  ) => JsPDFInstance;
  text: (
    text: string | string[],
    x: number,
    y: number,
    opts?: { align?: string; maxWidth?: number; lineHeightFactor?: number },
  ) => JsPDFInstance;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  addPage: () => JsPDFInstance;
  setPage: (n: number) => JsPDFInstance;
  save: (filename: string) => void;
  lastAutoTable?: { finalY: number };
}

// Brand palette (0–255).
const NAVY: RGB = [11, 33, 80];
const NAVY_DEEP: RGB = [7, 22, 56];
const BLUE: RGB = [26, 79, 158];
const GOLD: RGB = [212, 160, 23];
const GOLD_LIGHT: RGB = [244, 213, 128];
const CREAM: RGB = [250, 246, 236];
const CREAM_WARM: RGB = [242, 235, 217];
const INK: RGB = [10, 21, 48];
const MUTED: RGB = [120, 130, 155];

// -----------------------------------------------------------------------------
// CDN loader — caches the in-flight promise so concurrent clicks share one fetch.
// -----------------------------------------------------------------------------
let loaderPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-cdn="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === '1') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.cdn = src;
    s.onload = () => {
      s.dataset.loaded = '1';
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function ensureJsPDF(): Promise<void> {
  if (typeof window === 'undefined') throw new Error('jsPDF can only run in the browser');
  if (window.jspdf?.jsPDF) return;
  if (!loaderPromise) {
    loaderPromise = (async () => {
      await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
      await loadScript(
        'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js',
      );
    })().catch((err) => {
      loaderPromise = null; // allow retry on next click
      throw err;
    });
  }
  await loaderPromise;
}

// -----------------------------------------------------------------------------
// Drawing primitives
// -----------------------------------------------------------------------------
function drawLogoCrest(doc: JsPDFInstance, cx: number, cy: number, scale = 1): void {
  // Outer ribbon ring (light blue)
  doc.setFillColor(...BLUE).circle(cx, cy, 26 * scale, 'F');
  // Inner cream face — gives "ribbon" feel
  doc.setFillColor(...CREAM).circle(cx, cy, 22 * scale, 'F');
  // Concentric target rings
  doc.setFillColor(...NAVY_DEEP).circle(cx + 8 * scale, cy + 1 * scale, 8 * scale, 'F');
  doc.setFillColor(...CREAM).circle(cx + 8 * scale, cy + 1 * scale, 6 * scale, 'F');
  doc.setFillColor(...BLUE).circle(cx + 8 * scale, cy + 1 * scale, 4 * scale, 'F');
  doc.setFillColor(...GOLD).circle(cx + 8 * scale, cy + 1 * scale, 1.8 * scale, 'F');
  // HZA monogram
  doc.setTextColor(...NAVY_DEEP);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18 * scale);
  doc.text('HZA', cx - 11 * scale, cy + 3 * scale);
  // Arrow accent (gold shaft + tip)
  doc.setDrawColor(...GOLD).setLineWidth(0.9 * scale);
  doc.line(
    cx + 6 * scale,
    cy - 1 * scale,
    cx + 18 * scale,
    cy - 12 * scale,
  );
  doc
    .setFillColor(...GOLD)
    .triangle(
      cx + 18 * scale,
      cy - 12 * scale,
      cx + 14 * scale,
      cy - 9 * scale,
      cx + 16 * scale,
      cy - 14 * scale,
      'F',
    );
  // Bottom wave bar (deep navy ribbon under crest)
  doc.setFillColor(...NAVY_DEEP);
  doc.roundedRect(cx - 22 * scale, cy + 16 * scale, 44 * scale, 5 * scale, 2.5 * scale, 2.5 * scale, 'F');
}

function header(doc: JsPDFInstance, pageW: number): void {
  // Thin top bar
  doc.setFillColor(...NAVY).rect(0, 0, pageW, 6, 'F');
  // Logo block
  drawLogoCrest(doc, 22, 30, 0.55);
  doc.setTextColor(...NAVY_DEEP).setFont('helvetica', 'bold').setFontSize(11);
  doc.text('HZA', 40, 25);
  doc.setFont('helvetica', 'normal').setFontSize(7).setTextColor(...MUTED);
  doc.text('ALHADF ALZAKI · ACCOUNTING & BOOKKEEPING L.L.C.', 40, 30);
  doc.text('Dubai, United Arab Emirates · hello@hza.example', 40, 34);
  // Gold rule
  doc.setDrawColor(...GOLD).setLineWidth(0.4);
  doc.line(15, 42, pageW - 15, 42);
}

function footer(doc: JsPDFInstance, pageW: number, pageH: number): void {
  doc.setDrawColor(...GOLD).setLineWidth(0.3).line(15, pageH - 18, pageW - 15, pageH - 18);
  doc.setFont('helvetica', 'normal').setFontSize(7).setTextColor(...MUTED);
  doc.text('HZA — Aim higher. Pay smarter.', 15, pageH - 12);
  doc.text('hello@hza.example · +971 4 000 0000', pageW / 2, pageH - 12, { align: 'center' });
  doc.text('hza.example', pageW - 15, pageH - 12, { align: 'right' });
}

function sectionTitle(doc: JsPDFInstance, label: string, y: number, num: string): number {
  doc.setFillColor(...GOLD).rect(15, y - 4, 3, 8, 'F');
  doc.setFont('helvetica', 'bold').setFontSize(7).setTextColor(...GOLD);
  doc.text(num, 22, y - 1);
  doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(...NAVY_DEEP);
  doc.text(label, 22, y + 6);
  return y + 14;
}

function aedFmt(n: number): string {
  return 'AED ' + n.toLocaleString('en-US');
}

// -----------------------------------------------------------------------------
// Page builders
// -----------------------------------------------------------------------------
function buildCover(doc: JsPDFInstance, ref: string, dateStr: string): void {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Full-bleed navy cover
  doc.setFillColor(...NAVY_DEEP).rect(0, 0, pageW, pageH, 'F');

  // Subtle blue radial-feel using overlapping rings
  doc.setDrawColor(...BLUE).setLineWidth(1.5);
  for (let r = 30; r < 160; r += 20) doc.circle(pageW + 10, pageH + 10, r, 'S');
  doc.setDrawColor(...GOLD).setLineWidth(0.6);
  for (let r = 20; r < 90; r += 14) doc.circle(-5, -5, r, 'S');

  // Crest top-left
  drawLogoCrest(doc, 28, 32, 0.85);
  doc.setFont('helvetica', 'bold').setFontSize(13).setTextColor(...CREAM);
  doc.text('HZA', 52, 28);
  doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...GOLD_LIGHT);
  doc.text('ALHADF ALZAKI · ACCOUNTING & BOOKKEEPING L.L.C.', 52, 33);

  // Gold rule + label
  doc.setDrawColor(...GOLD).setLineWidth(0.8);
  doc.line(28, pageH / 2 - 30, 70, pageH / 2 - 30);
  doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...GOLD);
  doc.text('PROPOSAL · ' + dateStr.toUpperCase(), 28, pageH / 2 - 22);

  // Huge title
  doc.setFont('helvetica', 'bold').setFontSize(40).setTextColor(...CREAM);
  doc.text('Aim higher.', 28, pageH / 2);
  doc.setTextColor(...GOLD);
  doc.text('Pay smarter.', 28, pageH / 2 + 16);

  // Subtitle
  doc.setFont('helvetica', 'normal').setFontSize(11).setTextColor(...CREAM);
  doc.text('Accounting, tax & advisory proposal', 28, pageH / 2 + 32);
  doc.setFontSize(9).setTextColor(...GOLD_LIGHT);
  doc.text('Prepared for prospective HZA clients', 28, pageH / 2 + 38);

  // Bottom meta strip
  doc.setFillColor(...NAVY).rect(0, pageH - 40, pageW, 40, 'F');
  doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...GOLD);
  doc.text('REFERENCE', 28, pageH - 28);
  doc.text('VALID UNTIL', pageW / 2 - 10, pageH - 28);
  doc.text('PREPARED BY', pageW - 80, pageH - 28);
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...CREAM);
  doc.text(ref, 28, pageH - 20);
  const valid = new Date();
  valid.setDate(valid.getDate() + 30);
  doc.text(
    valid.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    pageW / 2 - 10,
    pageH - 20,
  );
  doc.text('HZA Partners', pageW - 80, pageH - 20);
}

function buildIntro(doc: JsPDFInstance): void {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.addPage();
  header(doc, pageW);

  let y = sectionTitle(doc, 'About HZA', 60, '01');

  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...INK);
  const intro =
    'HZA — Alhadf Alzaki Accounting & Bookkeeping L.L.C. is a UAE-licensed practice ' +
    'serving founders, SMEs and group companies across Dubai, Abu Dhabi and the free ' +
    'zones. We bring institutional discipline to growing businesses: clean books, ' +
    'tight VAT and Corporate Tax, and quiet quarter-ends.';
  doc.text(doc.splitTextToSize(intro, pageW - 30), 15, y, { lineHeightFactor: 1.5 });
  y += 28;

  // Highlights grid
  const highlights = [
    ['FTA-registered', 'Approved Tax Agent — VAT and Corporate Tax compliant by default.'],
    ['IFRS-aligned', 'Monthly close in 5 working days, audit-ready reconciliations.'],
    ['Fixed monthly fee', 'No surprise hourly bills. Scope and price agreed upfront.'],
    ['Bilingual EN / AR', 'Founder-friendly communication across both languages.'],
  ];
  const colW = (pageW - 30 - 9) / 2;
  highlights.forEach((h, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 15 + col * (colW + 9);
    const ry = y + row * 30;
    doc.setFillColor(...CREAM_WARM).roundedRect(x, ry, colW, 24, 3, 3, 'F');
    doc.setFillColor(...GOLD).rect(x, ry, 2, 24, 'F');
    doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(...NAVY_DEEP);
    doc.text(h[0], x + 6, ry + 8);
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...INK);
    doc.text(doc.splitTextToSize(h[1], colW - 12), x + 6, ry + 13, { lineHeightFactor: 1.35 });
  });
  y += 70;

  // Stat strip
  y = sectionTitle(doc, 'Track record', y, '02');
  const stats: [string, string][] = [
    ['12+', 'Years in UAE finance'],
    ['300+', 'Returns filed yearly'],
    ['0', 'FTA penalties last year'],
    ['24h', 'Median response'],
  ];
  const sw = (pageW - 30 - 9) / 4;
  stats.forEach(([v, l], i) => {
    const x = 15 + i * (sw + 3);
    doc.setFillColor(...NAVY_DEEP).roundedRect(x, y, sw, 30, 3, 3, 'F');
    doc.setFont('helvetica', 'bold').setFontSize(18).setTextColor(...GOLD);
    doc.text(v, x + 5, y + 14);
    doc.setFont('helvetica', 'normal').setFontSize(7).setTextColor(...CREAM);
    doc.text(l.toUpperCase(), x + 5, y + 22);
  });

  footer(doc, pageW, pageH);
}

function buildPricing(doc: JsPDFInstance): void {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.addPage();
  header(doc, pageW);

  let y = sectionTitle(doc, 'Plans & pricing', 60, '03');

  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...INK);
  const blurb =
    'All plans are fixed-fee monthly retainers in AED. VAT (5%) is excluded. ' +
    'Plans can be upgraded mid-quarter without penalty.';
  doc.text(doc.splitTextToSize(blurb, pageW - 30), 15, y, { lineHeightFactor: 1.5 });
  y += 12;

  // Plan cards row (drawn manually for branding)
  const cardW = (pageW - 30 - 12) / 3;
  const cardH = 72;
  PLANS.forEach((p, i) => {
    const x = 15 + i * (cardW + 6);
    const isFeat = p.featured;
    doc.setFillColor(...(isFeat ? NAVY_DEEP : CREAM_WARM)).roundedRect(x, y, cardW, cardH, 4, 4, 'F');
    if (isFeat) doc.setFillColor(...GOLD).rect(x, y, cardW, 3, 'F');

    doc.setFont('helvetica', 'bold').setFontSize(10);
    doc.setTextColor(...(isFeat ? GOLD : NAVY_DEEP));
    doc.text(p.tagline.toUpperCase(), x + 6, y + 9);

    doc.setFont('helvetica', 'bold').setFontSize(16).setTextColor(...(isFeat ? CREAM : NAVY_DEEP));
    doc.text(p.name, x + 6, y + 19);

    doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(...(isFeat ? GOLD : NAVY_DEEP));
    doc.text(aedFmt(p.price), x + 6, y + 33);
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...(isFeat ? CREAM : MUTED));
    doc.text('/ month', x + 6, y + 39);

    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...(isFeat ? CREAM : INK));
    const lines = doc.splitTextToSize(p.summary, cardW - 12);
    doc.text(lines, x + 6, y + 48, { lineHeightFactor: 1.4 });
  });
  y += cardH + 8;

  // Feature comparison table
  doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...NAVY_DEEP);
  doc.text('What each plan includes', 15, y);
  y += 3;

  const featureRows: (string | number)[][] = MONTHLY_DELIVERABLES.map((row) => [
    row.label,
    ...PLANS.map((p) => (row.includedIn(p) ? '✓' : '—')),
  ]);

  // @ts-expect-error autoTable plugin attaches at runtime
  doc.autoTable({
    startY: y + 3,
    head: [['Deliverable', ...PLANS.map((p) => p.name)]],
    body: featureRows,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2.5, textColor: INK, lineColor: [220, 220, 220] },
    headStyles: { fillColor: NAVY_DEEP, textColor: GOLD, fontStyle: 'bold', halign: 'left' },
    alternateRowStyles: { fillColor: CREAM_WARM },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
    },
    margin: { left: 15, right: 15 },
  } as AutoTableOptions);

  footer(doc, pageW, pageH);
}

function buildAddons(doc: JsPDFInstance): void {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.addPage();
  header(doc, pageW);

  let y = sectionTitle(doc, 'Add-on services', 60, '04');

  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...INK);
  doc.text(
    doc.splitTextToSize(
      'Stack any of the following on top of your monthly plan. Prices are one-time unless noted.',
      pageW - 30,
    ),
    15,
    y,
    { lineHeightFactor: 1.5 },
  );
  y += 12;

  const rows = ADDONS.map((a: Addon) => [
    a.code,
    a.name,
    a.cadence,
    aedFmt(a.price),
  ]);

  // @ts-expect-error autotable
  doc.autoTable({
    startY: y,
    head: [['Code', 'Service', 'Cadence', 'Fee']],
    body: rows,
    theme: 'striped',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 3, textColor: INK },
    headStyles: { fillColor: NAVY_DEEP, textColor: GOLD, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: CREAM_WARM },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 40 },
      3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 15, right: 15 },
  } as AutoTableOptions);

  // Pull-quote
  const finalY = doc.lastAutoTable?.finalY ?? y + 80;
  doc.setFillColor(...NAVY_DEEP).roundedRect(15, finalY + 8, pageW - 30, 28, 3, 3, 'F');
  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...GOLD);
  doc.text('Bundle discount', 22, finalY + 18);
  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...CREAM);
  doc.text(
    doc.splitTextToSize(
      'Any two add-ons billed together: 10% off. Three or more: 15% off, locked for the year.',
      pageW - 50,
    ),
    22,
    finalY + 25,
    { lineHeightFactor: 1.4 },
  );

  footer(doc, pageW, pageH);
}

function buildTerms(doc: JsPDFInstance): void {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  doc.addPage();
  header(doc, pageW);

  let y = sectionTitle(doc, 'Engagement & terms', 60, '05');

  const items: [string, string][] = [
    ['Onboarding', 'Kick-off call within 48h. Cloud accounting set up in week one. Historical clean-up scoped separately.'],
    ['Billing', 'Invoiced on the 1st, payable in 14 days by bank transfer. VAT 5% applied where applicable.'],
    ['Term', 'Monthly rolling. Either party may cancel with 30 days written notice. Annual prepay = 1 month free.'],
    ['Data', 'You retain full ownership of your data and access. All records exported on offboarding within 5 working days.'],
    ['Confidentiality', 'NDA-grade handling by default. Files stored in UAE-region cloud, encrypted at rest and in transit.'],
    ['Out of scope', 'Litigation support, forensic accounting and SOX work are quoted separately on request.'],
  ];

  doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(...INK);
  items.forEach((it) => {
    doc.setFillColor(...GOLD).circle(17, y + 1, 1.2, 'F');
    doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(...NAVY_DEEP);
    doc.text(it[0], 22, y + 2);
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...INK);
    const wrapped = doc.splitTextToSize(it[1], pageW - 42);
    doc.text(wrapped, 22, y + 7, { lineHeightFactor: 1.45 });
    y += 7 + wrapped.length * 4.2 + 4;
  });

  // Signature block
  y = Math.max(y + 6, pageH - 80);
  doc.setDrawColor(...GOLD).setLineWidth(0.4).line(15, y, pageW - 15, y);

  doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(...NAVY_DEEP);
  doc.text('Accepted & agreed', 15, y + 10);

  // Two signature columns
  const sigY = y + 26;
  ['Client signature', 'HZA partner'].forEach((label, i) => {
    const x = 15 + i * ((pageW - 30) / 2);
    doc.setDrawColor(...MUTED).setLineWidth(0.3);
    doc.line(x, sigY + 14, x + (pageW - 30) / 2 - 10, sigY + 14);
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(...MUTED);
    doc.text(label.toUpperCase(), x, sigY + 19);
    doc.text('Name / Title', x, sigY + 24);
    doc.text('Date', x, sigY + 29);
  });

  footer(doc, pageW, pageH);
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------
export async function generateProposal(): Promise<void> {
  await ensureJsPDF();
  const { jsPDF } = window.jspdf!;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true }) as JsPDFInstance;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const ref =
    'HZA-' +
    now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    Math.floor(Math.random() * 9000 + 1000);

  buildCover(doc, ref, dateStr);
  buildIntro(doc);
  buildPricing(doc);
  buildAddons(doc);
  buildTerms(doc);

  // Page numbers
  const total = doc.internal.getNumberOfPages();
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal').setFontSize(7).setTextColor(...MUTED);
    doc.text(
      `Page ${i} of ${total}`,
      doc.internal.pageSize.getWidth() - 15,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'right' },
    );
  }

  doc.save(`HZA-Proposal-${ref}.pdf`);
}

export { PLANS, ADDONS, MONTHLY_DELIVERABLES };
export type { Plan, Addon };
