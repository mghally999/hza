'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function AIChat() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('greeting') }]);
    }
  }, [open, messages.length, t]);

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streaming]);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setError(null);
    const next: Msg[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setInput('');
    setStreaming(true);

    // Add an empty assistant placeholder we'll stream into.
    setMessages((m) => [...m, { role: 'assistant', content: '' }]);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          locale,
          messages: next.filter((m) => m.content.trim()).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: 'assistant', content: acc };
          return copy;
        });
      }
    } catch {
      setError(t('error'));
      setMessages((m) => m.slice(0, -1)); // remove failed placeholder
    } finally {
      setStreaming(false);
    }
  }

  const examples = [t('examples.0'), t('examples.1'), t('examples.2')];

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('close') : t('open')}
        className="fixed z-[60] bottom-6 right-6 rtl:right-auto rtl:left-6 inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-semibold text-[13px] glow-ring"
        style={{
          background: 'var(--navy)',
          color: 'var(--cream)',
          letterSpacing: '0.04em',
        }}
      >
        <span className="relative inline-flex items-center justify-center w-5 h-5">
          <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60" />
          <span className="relative inline-block w-2.5 h-2.5 rounded-full bg-gold" />
        </span>
        {open ? t('close') : t('open')}
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M21 11.5a8.38 8.38 0 0 1-9 8.5 9.5 9.5 0 0 1-4-1L3 21l1-5-1-1A8.38 8.38 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z'} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Panel */}
      <div
        className={`fixed z-[59] bottom-24 right-6 rtl:right-auto rtl:left-6 w-[calc(100vw-3rem)] max-w-[420px] h-[600px] max-h-[calc(100vh-8rem)] rounded-3xl flex flex-col transition-all duration-500 chat-bubble glass ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
        style={{ background: 'color-mix(in srgb, var(--surface) 92%, transparent)' }}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        {/* Header */}
        <div
          className="rounded-t-3xl px-5 py-4 flex items-start justify-between"
          style={{ background: 'var(--navy)', color: 'var(--cream)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] tracking-[0.22em] uppercase font-bold text-gold">
                HZA · AI Assistant
              </span>
            </div>
            <h3 className="font-display font-black text-2xl uppercase tracking-tight mt-1">
              {t('title')}
            </h3>
            <p className="text-[11px] text-cream/70 mt-0.5">{t('subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('close')}
            className="w-7 h-7 rounded-full grid place-items-center hover:bg-cream/10"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          style={{ background: 'color-mix(in srgb, var(--bg) 85%, transparent)' }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'ml-auto rtl:ml-0 rtl:mr-auto bg-navy text-cream'
                  : 'mr-auto rtl:mr-0 rtl:ml-auto bg-cream-warm text-ink border border-navy/10'
              }`}
              style={
                m.role === 'user'
                  ? { background: 'var(--navy)', color: 'var(--cream)' }
                  : { background: 'var(--bg-soft)', color: 'var(--fg)', borderColor: 'var(--border)' }
              }
            >
              {m.content || (streaming && i === messages.length - 1 ? '…' : '')}
            </div>
          ))}
          {error && (
            <div className="text-[12px] text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</div>
          )}
        </div>

        {/* Suggestion chips */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {examples.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="text-[11.5px] rounded-full border px-3 py-1.5 hover:bg-gold/15 transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--fg-soft)' }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="px-3 pb-3 pt-2"
        >
          <div
            className="flex items-center gap-2 rounded-full border px-3 py-2"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeholder')}
              disabled={streaming}
              className="flex-1 bg-transparent outline-none text-[14px] disabled:opacity-50"
              style={{ color: 'var(--fg)' }}
              autoFocus={open}
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              aria-label={t('send')}
              className="w-9 h-9 rounded-full grid place-items-center transition-all disabled:opacity-40"
              style={{ background: 'var(--gold)', color: 'var(--navy)' }}
            >
              {streaming ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-[10.5px] mt-2 px-2" style={{ color: 'var(--fg-soft)' }}>
            {t('disclaimer')}
          </p>
        </form>
      </div>
    </>
  );
}
