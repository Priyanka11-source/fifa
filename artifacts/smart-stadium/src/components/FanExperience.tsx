import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function FanExperience() {
  const [translated, setTranslated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTranslated(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-32 bg-card border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col-reverse md:flex-row gap-16 items-center">
          
          {/* Mockup UI */}
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
                      <p className="text-[10px] text-primary/70">Always Listening</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden relative">
                  
                  {/* System MSG */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="self-center text-[10px] uppercase tracking-widest text-foreground/40 bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
                  >
                    Matchday Initiated
                  </motion.div>

                  {/* Fan MSG */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="self-start max-w-[85%] p-3 rounded-2xl rounded-tl-sm bg-muted border border-primary/5 text-sm font-light relative group"
                  >
                    <p className="text-foreground/90">¿Dónde está la entrada más rápida para la Sección 104?</p>
                    
                    {/* Translation Overlay Effect */}
                    <div className="absolute -bottom-6 left-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TranslationIcon />
                      <span className="text-[9px] text-primary uppercase">Auto-Translate</span>
                    </div>
                  </motion.div>

                  {/* AI Reply */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 }}
                    className="self-end max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-primary/10 border border-primary/20 text-sm font-light relative mt-2"
                  >
                    {translated ? (
                      <p className="text-primary animate-scan">La Puerta 4 tiene el menor tiempo de espera actual (3 mins). He enviado la ruta a su boleto.</p>
                    ) : (
                      <p className="text-foreground/90">Gate 4 has the shortest wait currently (3 mins). I've routed it to your ticket.</p>
                    )}
                  </motion.div>

                  {/* Ticket Widget */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.5 }}
                    className="self-end w-[85%] mt-1 p-4 rounded-xl border border-primary/30 bg-background/50 backdrop-blur flex flex-col gap-3 group hover:border-primary transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <TicketIcon />
                      <span className="text-[10px] font-mono text-primary border border-primary/30 px-2 py-0.5 rounded-sm">SEC 104</span>
                    </div>
                    <div className="w-full h-16 bg-white/5 rounded flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                       {/* Mock QR */}
                       <div className="w-10 h-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTAgMGg1djVIMHptNyAwaDN2NUg3em00IDBoNHY1aC00em01IDBoNHY1aC00ek0wIDdoNHY1SDB6bTYgMGgzdjVINnptNSAwaDd2NWgtN3pNMCAxNGg1djVIMHptNyAwaDR2NWgtNHptNiAwaDd2NWgtN3oiIGZpbGw9InJnYmEoMjEyLCAxNzUsIDU1LCAwLjcpIi8+PC9zdmc+')] bg-repeat" />
                    </div>
                  </motion.div>

                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-primary/10 bg-background flex gap-2 items-center">
                  <div className="flex-1 h-10 rounded-full border border-primary/20 bg-muted/50 px-4 flex items-center text-xs text-foreground/40 font-light">
                    Ask anything...
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-sm" />
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
              Language is no longer a barrier. The Concierge AI understands context, emotion, and necessity in 80+ languages—dynamically rerouting fans, delivering localized commentary, and upgrading the matchday experience for the global citizen.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex flex-col gap-2">
                <TranslationIcon />
                <h5 className="text-foreground font-medium mt-2">Zero-Latency Translation</h5>
                <p className="text-sm text-foreground/50 font-light">Neural processing ensures questions are understood and answered instantly.</p>
              </div>
              <div className="flex flex-col gap-2">
                <TicketIcon />
                <h5 className="text-foreground font-medium mt-2">Dynamic Routing</h5>
                <p className="text-sm text-foreground/50 font-light">Digital tickets update live to guide fans around bottlenecks.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
