import { NextRequest } from 'next/server';
import { answer, type Locale } from '@/lib/ai-knowledge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Msg = { role: 'user' | 'assistant'; content: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages: Msg[] = Array.isArray(body?.messages) ? body.messages : [];
    const locale: Locale = body?.locale === 'ar' ? 'ar' : 'en';

    const lastUser = [...messages].reverse().find(
      (m) => m.role === 'user' && typeof m.content === 'string' && m.content.trim(),
    );

    if (!lastUser) {
      return new Response(JSON.stringify({ error: 'no messages' }), { status: 400 });
    }

    const reply = answer(lastUser.content.slice(0, 2000), locale);

    const encoder = new TextEncoder();
    const chunks = reply.split(/(\s+)/);

    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 16));
        }
        controller.close();
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
