/**
 * Single source of truth for HZA pricing — used by both the on-page
 * Pricing section and the downloadable PDF proposal.
 *
 * Starter is set at AED 1,500/month to match the part-time accounting
 * package quoted in the HZA Facebook brochures.
 */

export type PlanKey = 'starter' | 'growth' | 'group';

export type Plan = {
  key: PlanKey;
  name: string;
  tagline: string;
  price: number; // AED / month
  summary: string;
  featured?: boolean;
  bullets: string[];
  fitFor: string;
};

export const PLANS: Plan[] = [
  {
    key: 'starter',
    name: 'Starter',
    tagline: 'Freelancers · early SMEs',
    price: 1500,
    summary:
      'Part-time accounting support — monthly bookkeeping, bank reconciliation and a tidy year-end.',
    fitFor: 'Up to 50 transactions / month, single bank account, single trade license.',
    bullets: [
      'Monthly bookkeeping (up to 50 transactions)',
      'Bank reconciliation, one account',
      'Quarterly VAT return (FTA filing)',
      'Annual CT return (simple structure)',
      'P&L + balance sheet, monthly',
      'WhatsApp & email support, 24h SLA',
    ],
  },
  {
    key: 'growth',
    name: 'Growth',
    tagline: 'Operating SMEs · scaling teams',
    price: 3500,
    featured: true,
    summary:
      'Everything in Starter plus payroll, WPS, multi-bank books and a dedicated account lead.',
    fitFor: 'Up to 250 transactions / month, multi-bank, employees on WPS.',
    bullets: [
      'Bookkeeping up to 250 transactions',
      'Multi-bank, multi-currency support',
      'Payroll + WPS file generation',
      'End-of-service gratuity accruals',
      'Quarterly VAT, full reconciliation',
      'Annual CT planning + return',
      'Cashflow dashboard, monthly',
      'Dedicated account lead',
    ],
  },
  {
    key: 'group',
    name: 'Group',
    tagline: 'Holdings · multi-entity',
    price: 7500,
    summary:
      'Consolidated reporting, transfer pricing memos and audit-grade compliance across entities.',
    fitFor: 'Multiple entities, free-zone + mainland mix, audit obligation.',
    bullets: [
      'Up to 5 entities consolidated',
      'Group bookkeeping + intercompany',
      'Quarterly VAT for the group',
      'Corporate Tax with group relief',
      'Transfer pricing master file',
      'ESR + UBO filings included',
      'Audit pack ready for sign-off',
      'Quarterly strategy review',
    ],
  },
];

export type Deliverable = {
  label: string;
  includedIn: (p: Plan) => boolean;
};

export const MONTHLY_DELIVERABLES: Deliverable[] = [
  { label: 'Monthly bookkeeping',           includedIn: () => true },
  { label: 'Bank reconciliation',           includedIn: () => true },
  { label: 'Quarterly VAT return',          includedIn: () => true },
  { label: 'Annual Corporate Tax return',   includedIn: () => true },
  { label: 'Payroll + WPS',                 includedIn: (p) => p.key !== 'starter' },
  { label: 'Multi-currency / multi-bank',   includedIn: (p) => p.key !== 'starter' },
  { label: 'Cashflow dashboard',            includedIn: (p) => p.key !== 'starter' },
  { label: 'Dedicated account lead',        includedIn: (p) => p.key !== 'starter' },
  { label: 'Group consolidation',           includedIn: (p) => p.key === 'group' },
  { label: 'Transfer pricing memos',        includedIn: (p) => p.key === 'group' },
  { label: 'ESR + UBO filings',             includedIn: (p) => p.key === 'group' },
  { label: 'Audit-ready year-end pack',     includedIn: (p) => p.key === 'group' },
  { label: 'Quarterly strategy review',     includedIn: (p) => p.key === 'group' },
];

export type Addon = {
  code: string;
  name: string;
  cadence: 'One-time' | 'Monthly' | 'Annual' | 'Per filing';
  price: number;
  blurb: string;
};

export const ADDONS: Addon[] = [
  { code: 'A01', name: 'Historical books clean-up (per year)', cadence: 'One-time',  price: 2500, blurb: 'Re-class, reconcile and document up to one prior financial year.' },
  { code: 'A02', name: 'VAT voluntary disclosure',             cadence: 'Per filing', price: 1500, blurb: 'Correct prior VAT returns with FTA, including penalty mitigation.' },
  { code: 'A03', name: 'Corporate Tax registration',           cadence: 'One-time',  price:  990, blurb: 'EmaraTax CT registration end-to-end.' },
  { code: 'A04', name: 'ESR notification + report',            cadence: 'Annual',    price: 2200, blurb: 'Economic Substance assessment, notification and report filing.' },
  { code: 'A05', name: 'UBO maintenance',                      cadence: 'Annual',    price:  650, blurb: 'Ultimate Beneficial Owner register kept current with the authority.' },
  { code: 'A06', name: 'Audit liaison (per audit)',            cadence: 'Per filing', price: 3500, blurb: 'We handle the auditor end-to-end through sign-off.' },
  { code: 'A07', name: 'Cashflow forecasting model',           cadence: 'One-time',  price: 1800, blurb: '13-week + 12-month rolling cashflow tied to your actuals.' },
  { code: 'A08', name: 'Investor reporting pack',              cadence: 'Monthly',   price:  900, blurb: 'KPI dashboard + monthly investor email written for you.' },
  { code: 'A09', name: 'Payroll setup (per employee)',         cadence: 'One-time',  price:  150, blurb: 'WPS onboarding, MOL alignment, gratuity baseline.' },
  { code: 'A10', name: 'Tax agency representation',            cadence: 'Annual',    price: 2900, blurb: 'Authorised Tax Agent acting on your behalf with the FTA.' },
];
