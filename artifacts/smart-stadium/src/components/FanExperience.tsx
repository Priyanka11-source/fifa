import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSendConciergeMessage } from '@workspace/api-client-react';

const TranslationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
    <path d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4ZM12 4V20M4.5 9H19.5M4.5 15H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
    <path d="M12 4C14.5 6.5 15.5 9 15.5 12C15.5 15 14.5 17.5 12 20C9.5 17.5 8.5 15 8.5 12C8.5 9 9.5 6.5 12 4Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const TicketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 10C4.65685 10 6 10.8954 6 12C6 13.1046 4.65685 14 3 14" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M21 10C19.3431 10 18 10.8954 18 12C18 13.1046 19.3431 14 21 14" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6V18M14 6V18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
  </svg>
);

interface ChatMessage {
  id: number;
  role: 'fan' | 'concierge';
  text: string;
  translation?: string;
  showTranslation?: boolean;
  meta?: string;
}

const SUGGESTIONS = [
  { label: 'Español · Puerta rápida', text: '¿Dónde está la entrada más rápida para la Sección 104?' },
  { label: '日本語 · 車椅子', text: '車椅子でアクセスできる入口はどこですか？' },
  { label: 'Français · Navette', text: 'Où est la navette la plus rapide pour rentrer ?' },
  { label: 'العربية · تذكرة', text: 'لقد فقدت تذكرتي، ماذا أفعل؟' },
];

let messageId = 0;
function nextMessageId(): number {
  messageId += 1;
  return messageId;
}

export default function FanExperience() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextMessageId(), role: 'fan', text: '¿Dónde está la entrada más rápida para la Sección 104?' },
    {
      id: nextMessageId(),
      role: 'concierge',
      text: "Gate 4 has the shortest wait currently. I've routed it to your ticket.",
      meta: 'Spanish · navigation',
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending } = useSendConciergeMessage();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const fanMsg: ChatMessage = { id: nextMessageId(), role: 'fan', text: trimmed };
    setMessages((prev) => [...prev, fanMsg]);
    setInput('');

    sendMessage(
      { data: { message: trimmed } },
      {
        onSuccess: (res) => {
          setMessages((prev) => [
            ...prev,
            {
              id: nextMessageId(),
              role: 'concierge',
              text: res.reply,
              translation: res.replyTranslation,
              meta: `${res.detectedLanguage} · ${res.category}`,
            },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              id: nextMessageId(),
              role: 'concierge',
              text: "I'm having trouble reaching the concierge system right now — please try again in a moment.",
              meta: 'error',
            },
          ]);
        },
      },
    );
  }

  function toggleTranslation(id: number) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, showTranslation: !m.showTranslation } : m)),
    );
  }

  return (
    <section className="relative w-full py-32 bg-card border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="flex flex-col-reverse md:flex-row gap-16 items-center">

          {/* Live Concierge UI */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[320px] h-[600px] border border-primary/20 bg-background rounded-[2.5rem] p-2 shadow-2xl gold-glow">
              <div className="w-full h-full border border-primary/10 rounded-[2rem] overflow-hidden bg-[#080b09] relative flex flex-col">

                {/* Header */}
                <div className="pt-10 pb-4 px-6 border-b border-primary/10 bg-background/80 backdrop-blur flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10">
                      <span className="font-serif text-primary italic text-sm">V</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Concierge</h4>
                      <p className="text-[10px] text-primary/70">{isPending ? 'Thinking…' : 'Always Listening'}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto relative">

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="self-center text-[10px] uppercase tracking-widest text-foreground/40 bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
                  >
                    Matchday Initiated
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {messages.map((m) =>
                      m.role === 'fan' ? (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="self-start max-w-[85%] p-3 rounded-2xl rounded-tl-sm bg-muted border border-primary/5 text-sm font-light relative"
                        >
                          <p className="text-foreground/90">{m.text}</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="self-end max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-primary/10 border border-primary/20 text-sm font-light relative flex flex-col gap-1.5"
                        >
                          <p className={m.showTranslation ? 'text-primary animate-scan' : 'text-foreground/90'}>
                            {m.showTranslation && m.translation ? m.translation : m.text}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            {m.meta && (
                              <span className="text-[9px] text-foreground/40 uppercase tracking-wide">{m.meta}</span>
                            )}
                            {m.translation && (
                              <button
                                onClick={() => toggleTranslation(m.id)}
                                className="flex items-center gap-1 text-[9px] text-primary uppercase hover:text-primary/70 transition-colors"
                              >
                                <TranslationIcon />
                                {m.showTranslation ? 'Original' : 'Auto-Translate'}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ),
                    )}
                  </AnimatePresence>

                  {isPending && (
                    <div className="self-end flex gap-1 px-3 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:0.3s]" />
                    </div>
                  )}

                  {/* Ticket Widget */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="self-end w-[85%] mt-1 p-4 rounded-xl border border-primary/30 bg-background/50 backdrop-blur flex flex-col gap-3 group hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <TicketIcon />
                      <span className="text-[10px] font-mono text-primary border border-primary/30 px-2 py-0.5 rounded-sm">SEC 104</span>
                    </div>
                    <div className="w-full h-16 bg-white/5 rounded flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                       <div className="w-10 h-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGg1djVIMHptNyAwaDN2NUg3em00IDBoNHY1aC00em01IDBoNHY1aC00ek0wIDdoNHY1SDB6bTYgMGgzdjVINnptNSAwaDd2NWgtN3pNMCAxNGg1djVIMHptNyAwaDR2NWgtNHptNiAwaDd2NWgtN3oiIGZpbGw9InJnYmEoMjEyLCAxNzUsIDU1LCAwLjcpIi8+PC9zdmc+')] bg-repeat" />
                    </div>
                  </motion.div>

                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-primary/10 bg-background flex flex-col gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleSend(s.text)}
                        disabled={isPending}
                        className="text-[9px] px-2 py-1 rounded-full border border-primary/20 text-foreground/50 hover:text-primary hover:border-primary/50 transition-colors disabled:opacity-40"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                      placeholder="Ask anything, in any language…"
                      disabled={isPending}
                      className="flex-1 h-10 rounded-full border border-primary/20 bg-muted/50 px-4 flex items-center text-xs text-foreground focus:outline-none focus:border-primary/60 placeholder:text-foreground/40 font-light disabled:opacity-50"
                    />
                    <button
                      onClick={() => handleSend(input)}
                      disabled={isPending || !input.trim()}
                      className="w-10 h-10 shrink-0 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Narrative */}
          <div className="w-full md:w-1/2 flex flex-col gap-6">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground">
              Universal <br />
              <span className="text-primary italic">Hospitality</span>
            </h2>
            <p className="text-foreground/70 font-light leading-relaxed text-lg">
              Language is no longer a barrier. The Concierge AI understands context and necessity across languages—dynamically rerouting fans, delivering localized guidance, and upgrading the matchday experience for the global citizen. Try it yourself, in any language.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex flex-col gap-2">
                <TranslationIcon />
                <h5 className="text-foreground font-medium mt-2">Live Multilingual Concierge</h5>
                <p className="text-sm text-foreground/50 font-light">Real questions get real, data-grounded answers — try Spanish, French, Portuguese, Japanese, or Arabic.</p>
              </div>
              <div className="flex flex-col gap-2">
                <TicketIcon />
                <h5 className="text-foreground font-medium mt-2">Dynamic Routing</h5>
                <p className="text-sm text-foreground/50 font-light">Answers are grounded in the same live gate and transport telemetry powering the Command Center.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
