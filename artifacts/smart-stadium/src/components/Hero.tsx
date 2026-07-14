import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="object-cover w-full h-full scale-105"
        >
          <source src="/videos/stadium-hero-1.mp4" type="video/mp4" />
        </video>
        {/* Cinematic Vignette & Warm Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <div className="animate-pull-focus">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 border border-primary/30 rounded-full bg-background/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Operation Alpha</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold leading-none tracking-tight text-foreground drop-shadow-2xl">
            Symphony of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ffdf73] to-primary">
              The Pitch
            </span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-light tracking-wide drop-shadow-md">
            The 2026 World Cup demands more than concrete and steel. 
            Experience the GenAI Smart Stadium — where operations meet intuition, 
            and every fan feels the heartbeat of the game.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="group relative px-8 py-4 bg-primary text-primary-foreground font-medium uppercase tracking-widest text-sm overflow-hidden rounded-sm transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Deploy Command
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </button>
            
            <button className="px-8 py-4 border border-primary/40 text-primary font-medium uppercase tracking-widest text-sm rounded-sm transition-all hover:bg-primary/10 hover:border-primary">
              View Directives
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/50">Initialize</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </div>
  );
}
