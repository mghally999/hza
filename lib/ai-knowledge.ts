// HZA AI Assistant — local knowledge base. No external API required.
// Hand-crafted answers for UAE accounting, VAT, Corporate Tax, payroll/WPS,
// licensing and HZA-specific business questions, in EN and AR.

export type Locale = 'en' | 'ar';

type Rule = {
  keywords: string[]; // case-insensitive substrings; any match scores
  reply: string;
};

const EN_RULES: Rule[] = [
  {
    keywords: ['vat return', 'vat filing', 'vat due', 'when is my vat', 'vat deadline', 'vat period'],
    reply:
      'VAT returns in the UAE are filed quarterly (or monthly for large taxpayers) — due by the 28th of the month following the tax period. Late filing triggers AED 1,000 first time, AED 2,000 if repeated within 24 months, plus penalties on unpaid tax.\n\nFor the exact filing, book a 30-min call with HZA.',
  },
  {
    keywords: ['vat rate', 'vat percentage', 'vat %', 'how much vat'],
    reply:
      'Standard VAT in the UAE is 5%. A 0% rate applies to exports, international transport, certain healthcare/education, and qualifying free-zone designated-zone supplies. Some financial services and bare land/local passenger transport are exempt.',
  },
  {
    keywords: ['vat registration', 'register for vat', 'vat threshold'],
    reply:
      'VAT registration is mandatory once taxable supplies exceed AED 375,000 in 12 months (or expected to). Voluntary registration is allowed above AED 187,500. Failure to register on time: AED 10,000 penalty.\n\nFor the exact filing, book a 30-min call with HZA.',
  },
  {
    keywords: ['corporate tax', 'ct rate', '9%', 'ct deadline', 'corporate tax return'],
    reply:
      'UAE Corporate Tax is 9% on taxable profits above AED 375,000 (0% below). The CT return is due 9 months after the end of the financial year — e.g. for a Dec-2025 year-end, due 30 Sep 2026. Free-zone qualifying income can still hit 0% if QFZP conditions are met.',
  },
  {
    keywords: ['free zone', 'free-zone', 'qfzp', 'qualifying income', 'freezone'],
    reply:
      'A Qualifying Free Zone Person (QFZP) pays 0% CT on qualifying income only — broadly: transactions with other free-zone persons, qualifying activities, and excluded-activity carve-outs. Non-qualifying income is taxed at 9% and can taint the whole entity if de-minimis (the lower of AED 5m or 5% of revenue) is breached.\n\nFor the exact filing, book a 30-min call with HZA.',
  },
  {
    keywords: ['wps', 'salary file', 'payroll deadline', 'wage protection'],
    reply:
      'WPS files must be uploaded so salaries land within 15 days of the salary due date — otherwise MOHRE issues fines and can block new work permits. HZA handles WPS submission monthly across all UAE banks.',
  },
  {
    keywords: ['esr', 'economic substance', 'ubo'],
    reply:
      'ESR is mostly retired for periods starting on/after 1 Jan 2023 — but ESR notifications and reports for prior years still must be filed. UBO declarations are required at incorporation and on any ownership change. We file both.',
  },
  {
    keywords: ['penalty', 'fine', 'fta penalty', 'late'],
    reply:
      'Typical FTA penalties: AED 10,000 for late VAT registration, AED 1,000–2,000 for late VAT returns, 2% then 4% monthly on unpaid VAT, AED 500/month late CT return, AED 10,000 for not keeping records. We keep clients out of these brackets — zero penalties in the last 12 months across our book.',
  },
  {
    keywords: ['mainland', 'free zone vs', 'mainland vs', 'license type', 'licence'],
    reply:
      'Mainland licenses (DED) let you sell across the UAE without restriction; free zones offer 0% CT (if QFZP) and 100% foreign ownership but restrict onshore trading without a distributor. HZA is mainland-licensed in Muhaisnah 4 and serves both.',
  },
  {
    keywords: ['pricing', 'how much', 'cost', 'fee', 'price', 'monthly'],
    reply:
      'HZA plans start at AED 1,500/month (Starter — for freelancers and micro-businesses), AED 3,500/month (Growth — typical SME with VAT) and AED 7,500/month (Group — multi-entity / audit-grade). Fixed fee, no surprises. See the Pricing section for a full breakdown.',
  },
  {
    keywords: ['contact', 'whatsapp', 'phone', 'email', 'call', 'book'],
    reply:
      'Talk to us directly: WhatsApp +971 50 198 0275, email mohamedbayomy1998@gmail.com. Office in Muhaisnah 4, Dubai. License 1320675.',
  },
  {
    keywords: ['who are you', 'about hza', 'what is hza', 'founder', 'mohammed'],
    reply:
      'HZA = Alhadf Alzaki Accounting & Bookkeeping L.L.C., a UAE mainland-licensed practice in Muhaisnah 4, Dubai. Founded by Mohammed Bayomy, chartered accountant with 12+ years in UAE finance. We file VAT, CT, WPS payroll and full books for founders, SMEs and groups.',
  },
  {
    keywords: ['audit', 'auditor', 'audit support'],
    reply:
      'We prepare audit-ready books, schedules and disclosures, and coordinate directly with your external auditor (or recommend one). For groups we also handle consolidation and inter-company eliminations.',
  },
  {
    keywords: ['bookkeeping', 'books', 'reconcile', 'ledger'],
    reply:
      'Monthly bookkeeping covers bank/credit-card reconciliations, AP/AR, accruals, fixed-asset register, and a closed trial balance — plus a management report you actually read. We work on Zoho, QuickBooks, Xero or your own ERP.',
  },
];

const AR_RULES: Rule[] = [
  {
    keywords: ['إقرار القيمة', 'موعد القيمة', 'إقرار ضريبة القيمة', 'القيمة المضافة موعد'],
    reply:
      'إقرارات ضريبة القيمة المضافة تُقدَّم ربعيًا (أو شهريًا للمكلفين الكبار) — بحد أقصى يوم 28 من الشهر التالي للفترة الضريبية. التأخير يبدأ بـ 1,000 درهم أول مرة، و2,000 درهم إن تكرّر خلال 24 شهر، مع فوائد على الضريبة المتأخرة.\n\nللإقرار الدقيق احجز مكالمة 30 دقيقة مع HZA.',
  },
  {
    keywords: ['نسبة القيمة', 'كم القيمة', 'نسبة الضريبة', 'كم نسبة'],
    reply:
      'النسبة الأساسية لضريبة القيمة المضافة في الإمارات هي 5%. تُطبَّق 0% على الصادرات، النقل الدولي، بعض الرعاية الصحية والتعليم، والتوريدات المؤهلة من المناطق الحرة المعيّنة. بعض الخدمات المالية والأراضي الفضاء والنقل الجماعي المحلي معفاة.',
  },
  {
    keywords: ['تسجيل القيمة', 'حد التسجيل', 'سجل للقيمة'],
    reply:
      'التسجيل في القيمة المضافة إلزامي عند تجاوز التوريدات الخاضعة 375,000 درهم خلال 12 شهرًا. التسجيل الاختياري متاح من 187,500 درهم. التأخر في التسجيل: غرامة 10,000 درهم.\n\nللإقرار الدقيق احجز مكالمة 30 دقيقة مع HZA.',
  },
  {
    keywords: ['ضريبة الشركات', 'إقرار الشركات', 'موعد الشركات', '9'],
    reply:
      'ضريبة الشركات في الإمارات 9% على الأرباح فوق 375,000 درهم (0% دونها). الإقرار يُقدَّم خلال 9 أشهر من نهاية السنة المالية — مثلاً سنة تنتهي ديسمبر 2025 يكون إقرارها 30 سبتمبر 2026. دخل المناطق الحرة المؤهَّل قد يبقى 0% إذا تحقّقت شروط QFZP.',
  },
  {
    keywords: ['منطقة حرة', 'qfzp', 'مؤهل', 'الحرة'],
    reply:
      'الشخص المؤهَّل في المنطقة الحرة (QFZP) يدفع 0% على الدخل المؤهَّل فقط — بشكل عام: التعاملات مع كيانات حرة أخرى، الأنشطة المؤهَّلة، واستثناءات محدّدة. الدخل غير المؤهَّل يخضع لـ 9% وقد يُسقط الوضع كاملاً إذا تجاوز حد المعيار (الأقل بين 5 مليون درهم أو 5% من الإيراد).',
  },
  {
    keywords: ['wps', 'حماية الأجور', 'الرواتب'],
    reply:
      'ملفات WPS يجب رفعها بحيث تصل الرواتب خلال 15 يومًا من تاريخ الاستحقاق — وإلا تصدر MOHRE غرامات وقد تُجمّد تصاريح العمل الجديدة. نتولّى رفع WPS شهريًا عبر جميع البنوك.',
  },
  {
    keywords: ['esr', 'الجوهر', 'ubo', 'المستفيد'],
    reply:
      'متطلبات الجوهر الاقتصادي (ESR) أُلغيت أساسًا للفترات من 1 يناير 2023، لكن إخطارات وتقارير ESR للسنوات السابقة لا تزال مطلوبة. إقرارات المستفيد الحقيقي (UBO) مطلوبة عند التأسيس وعند أي تغيير ملكية. نتولّى الاثنين.',
  },
  {
    keywords: ['غرامة', 'مخالفة', 'تأخر', 'عقوبة'],
    reply:
      'غرامات شائعة: 10,000 درهم تأخر تسجيل القيمة المضافة، 1,000–2,000 درهم تأخر إقرار، 2% ثم 4% شهريًا على الضريبة المتأخرة، 500 درهم/شهر تأخر إقرار الشركات، 10,000 درهم لعدم حفظ السجلات. عملاء HZA: صفر غرامات خلال العام الماضي.',
  },
  {
    keywords: ['بر رئيسي', 'الفرق بين', 'الرخصة', 'مناطق حرة'],
    reply:
      'رخصة البر الرئيسي (DED) تسمح بالبيع داخل الإمارات بدون قيود. المناطق الحرة تمنح 0% ضريبة شركات (إذا تأهّلت) وملكية أجنبية 100% لكنها تقيّد التجارة الداخلية بدون موزّع. HZA مرخّصة بَرّ رئيسي في محيصنة 4 وتخدم النوعين.',
  },
  {
    keywords: ['السعر', 'الأسعار', 'كم', 'تكلفة', 'الرسم'],
    reply:
      'باقات HZA تبدأ من 1,500 درهم/شهريًا (مستقل / منشأة صغيرة)، 3,500 درهم/شهريًا (نمو — شركة صغيرة بضريبة قيمة) و7,500 درهم/شهريًا (مجموعة — جاهزة للتدقيق). رسم ثابت بدون مفاجآت. راجع قسم الأسعار للتفاصيل.',
  },
  {
    keywords: ['تواصل', 'واتساب', 'هاتف', 'بريد', 'احجز'],
    reply:
      'تواصل مباشرة: واتساب +971 50 198 0275 — بريد mohamedbayomy1998@gmail.com — المكتب في محيصنة 4 بدبي. رخصة 1320675.',
  },
  {
    keywords: ['من أنتم', 'ما هي', 'المؤسس', 'محمد', 'الهدف الذكي'],
    reply:
      'الهدف الذكي للمحاسبة ومسك الدفاتر ذ.م.م — مكتب بَرّ رئيسي في محيصنة 4 بدبي، تأسّس على يد محمد بيومي محاسب قانوني بخبرة تتجاوز 12 سنة في السوق الإماراتية. نقدّم خدمات ضريبة القيمة المضافة، ضريبة الشركات، رواتب WPS ومسك الدفاتر.',
  },
  {
    keywords: ['تدقيق', 'مدقق'],
    reply:
      'نُعدّ دفاتر جاهزة للتدقيق مع الجداول والإفصاحات، وننسّق مباشرة مع المدقق الخارجي (أو نرشّح أحدهم). للمجموعات نتولّى التوحيد وإلغاء العمليات البينية.',
  },
  {
    keywords: ['مسك دفاتر', 'دفاتر', 'تسوية'],
    reply:
      'مسك الدفاتر الشهري يشمل التسويات البنكية وبطاقات الائتمان، الذمم، المخصصات، سجل الأصول الثابتة، وميزان مراجعة مغلق — مع تقرير إداري عملي. نعمل على Zoho، QuickBooks، Xero أو نظامك الخاص.',
  },
];

function bestMatch(text: string, rules: Rule[]): Rule | null {
  const t = text.toLowerCase();
  let best: { rule: Rule; score: number } | null = null;
  for (const rule of rules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (t.includes(kw.toLowerCase())) score += kw.length;
    }
    if (score && (!best || score > best.score)) best = { rule, score };
  }
  return best?.rule ?? null;
}

const DEFAULT_EN =
  "I'm HZA's onboard assistant — I can answer UAE accounting, VAT (5%), Corporate Tax (9%), WPS payroll, licensing, ESR/UBO and basic FTA-procedure questions. Try asking about VAT deadlines, free-zone CT, registration thresholds, or our pricing.\n\nFor anything specific to your books — book a 30-min call with HZA.";

const DEFAULT_AR =
  'أنا مساعد HZA على الموقع — أجيب عن أسئلة المحاسبة الإماراتية، ضريبة القيمة المضافة (5%)، ضريبة الشركات (9%)، رواتب WPS، الرخص، ESR/UBO وإجراءات الهيئة الاتحادية. جرّب السؤال عن مواعيد الإقرارات، ضريبة المناطق الحرة، حدّ التسجيل، أو باقاتنا.\n\nلأي تفصيل خاص بدفاترك، احجز مكالمة 30 دقيقة مع HZA.';

export function answer(question: string, locale: Locale): string {
  if (!question.trim()) return locale === 'ar' ? DEFAULT_AR : DEFAULT_EN;
  const rules = locale === 'ar' ? AR_RULES : EN_RULES;
  const match = bestMatch(question, rules);
  if (match) return match.reply;
  return locale === 'ar' ? DEFAULT_AR : DEFAULT_EN;
}
