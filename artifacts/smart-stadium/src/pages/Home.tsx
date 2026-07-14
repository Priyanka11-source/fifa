import React from 'react';
import Hero from '@/components/Hero';
import CommandCenter from '@/components/CommandCenter';
import FanExperience from '@/components/FanExperience';
import Metrics from '@/components/Metrics';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground flex flex-col">
      <Hero />
      <CommandCenter />
      <FanExperience />
      <Metrics />
      
      {/* Footer */}
      <footer className="w-full py-12 border-t border-primary/20 bg-[#020403] text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="w-8 h-8 rounded-full border border-primary/30 flex items-center justify-center mb-4">
            <span className="font-serif text-primary italic text-sm">G</span>
          </div>
          <h3 className="font-serif text-xl text-foreground">GenAI Smart Stadium</h3>
          <p className="text-xs tracking-[0.2em] uppercase font-mono text-foreground/40">Pitch Demo • 2026 World Cup</p>
        </div>
      </footer>
    </main>
  );
}
