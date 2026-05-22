import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT_EN = `You are HZA's AI assistant, embedded on the website of "Alhadf Alzaki Accounting & Bookkeeping L.L.C." (brand HZA) — a UAE mainland-licensed practice in Muhaisnah 4, Dubai. The founder is Mohammed Bayomy.

Scope: UAE accounting, bookkeeping, VAT (5%), Corporate Tax (9%), payroll & WPS, free-zone vs mainland licensing, audit, ESR/UBO, FTA procedures, basic UAE commercial law.

Style:
- Short, direct, confident. No fluff, no AI disclaimers.
- Lead with the answer; explain why in 1–2 lines after.
- Use AED for amounts. Cite FTA terminology accurately.
- For anything fact-specific to a client's books or filing, end with: "For the exact filing, book a 30-min call with HZA."
- Never invent FTA articles or deadlines. If unsure, say so and suggest checking the FTA portal.

Contact (only mention if relevant): WhatsApp +971 50 198 0275, email mohamedbayomy1998@gmail.com, license 1320675.
Reply in the user's language (Arabic or English). Keep replies under 180 words unless the user explicitly asks for detail.`;

const SYSTEM_PROMPT_AR = `أنت المساعد الذكي لـ HZA على موقع «الهدف الذكي للمحاسبة ومسك الدفاتر ذ.م.م» — مكتب بَرّ رئيسي في محيصنة 4 بدبي. المؤسس محمد بيومي.

النطاق: المحاسبة الإماراتية، مسك الدفاتر، ضريبة القيمة المضافة (5%)، ضريبة الشركات (9%)، الرواتب وWPS، الفرق بين البَرّ الرئيسي والمناطق الحرة، التدقيق، ESR/UBO، إجراءات الهيئة الاتحادية، والقانون التجاري الإماراتي الأساسي.

الأسلوب:
- مختصر، مباشر، واثق. بلا حشو وبلا تنويهات.
- ابدأ بالجواب ثم اشرح السبب في سطر أو اثنين.
- استخدم الدرهم للمبالغ والمصطلحات الرسمية للهيئة.
- لأي تفصيل خاص بعميل، اختم بـ: «للإقرار الدقيق احجز مكالمة 30 دقيقة مع HZA».
- لا تختلق مواد قانونية أو مواعيد. عند الشك أحل المستخدم إلى بوابة الهيئة.

التواصل (عند الحاجة فقط): واتساب +971 50 198 0275 — بريد mohamedbayomy1998@gmail.com — رخصة 1320675.
أجب بلغة المستخدم. اجعل الرد أقل من 180 كلمة ما لم يُطلب التفصيل.`;

type Msg = { role: 'user' | 'assistant'; content: string };

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { 'content-type': 'application/json' } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
    const locale: 'en' | 'ar' = body?.locale === 'ar' ? 'ar' : 'en';

    const clean = messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
      .slice(-12);

    if (!clean.length) {
      return new Response(JSON.stringify({ error: 'no messages' }), { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const resp = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 800,
            system: locale === 'ar' ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN,
            messages: clean,
            stream: true,
          });

          for await (const event of resp) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'stream failed';
          controller.enqueue(encoder.encode(`\n\n[error: ${msg}]`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-accel-buffering': 'no',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'unknown';
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
