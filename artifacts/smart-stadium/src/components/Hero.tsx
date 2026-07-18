import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onDeployCommand?: () => void;
  onViewDirectives?: () => void;
}

export default function Hero({ onDeployCommand, onViewDirectives }: HeroProps) {
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
        {/* Cinematic Vignette & Neon Background Glows */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(10,5,0,0.45) 60%, rgba(5,5,5,0.92) 100%)'
          }} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-purple/15 via-transparent to-transparent pointer-events-none" />
      </motion.div>

       {/* Content */}
       <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
         <div className="flex flex-col items-center">
           {/* Staggered focus-pull letter-by-letter headline */}
           <motion.h1 
             variants={{
               hidden: {},
               visible: {
                 transition: {
                   staggerChildren: 0.03,
                 }
               }
             }}
             initial="hidden"
             animate="visible"
             className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-foreground drop-shadow-[0_0_30px_rgba(245,176,65,0.25)] text-gold-glow text-center max-w-4xl mx-auto flex flex-col items-center"
           >
             <div className="flex flex-wrap justify-center mb-2">
               {"Symphony of the Pitch.".split(" ").map((word, wordIdx) => (
                 <span key={wordIdx} className="inline-block mr-4 whitespace-nowrap">
                   {word.split("").map((char, charIdx) => (
                     <motion.span 
                       key={charIdx} 
                       variants={{
                         hidden: { opacity: 0, filter: 'blur(12px)', y: 15 },
                         visible: { 
                           opacity: 1, 
                           filter: 'blur(0px)', 
                           y: 0,
                           transition: {
                             duration: 0.8,
                             ease: [0.19, 1, 0.22, 1]
                           }
                         }
                       }} 
                       className="inline-block"
                     >
                       {char}
                     </motion.span>
                   ))}
                 </span>
               ))}
             </div>
             <div className="flex flex-wrap justify-center text-transparent bg-clip-text bg-gradient-to-r from-neon-gold via-white to-neon-gold">
               {"Powered by GenAI.".split(" ").map((word, wordIdx) => (
                 <span key={wordIdx} className="inline-block mr-4 whitespace-nowrap">
                   {word.split("").map((char, charIdx) => (
                     <motion.span 
                       key={charIdx} 
                       variants={{
                         hidden: { opacity: 0, filter: 'blur(12px)', y: 15 },
                         visible: { 
                           opacity: 1, 
                           filter: 'blur(0px)', 
                           y: 0,
                           transition: {
                             duration: 0.8,
                             ease: [0.19, 1, 0.22, 1]
                           }
                         }
                       }} 
                       className="inline-block text-neon-gold"
                     >
                       {char}
                     </motion.span>
                   ))}
                 </span>
               ))}
             </div>
           </motion.h1>
          
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.4, duration: 1 }}
             className="mt-8 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-light tracking-wide drop-shadow-md"
           >
             The 2026 World Cup demands more than concrete and steel. 
             Experience the GenAI Smart Stadium — where operations meet intuition, 
             and every fan feels the heartbeat of the game.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1.8, duration: 0.8 }}
             className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center"
           >
             {/* Mechanical Glassmorphic Toggle Switch CTA */}
             <button 
               onClick={onDeployCommand}
               className="group relative px-10 py-5 bg-white/5 backdrop-blur-md border border-primary/45 rounded-sm font-mono text-xs uppercase tracking-widest text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(245,176,65,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:border-primary hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
             >
               {/* Bezel */}
               <div className="absolute inset-[2px] border border-primary/20 pointer-events-none rounded-sm" />
               <div className="flex items-center gap-3 relative z-10 font-bold">
                 {/* Glowing Status Indicator LED */}
                 <span className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 group-hover:bg-emerald-400"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 group-hover:bg-emerald-500 transition-colors duration-300"></span>
                 </span>
                 <span className="text-[#F3EFE7] group-hover:text-primary transition-colors">Initialize Stadium GenAI</span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
             </button>

             <button 
               onClick={onViewDirectives}
               className="px-8 py-4 bg-[#0a081c]/60 backdrop-blur-md text-foreground hover:text-neon-cyan font-mono text-xs uppercase tracking-widest rounded-sm font-bold border border-neon-cyan/40 hover:border-neon-cyan shadow-[0_0_15px_rgba(0,245,212,0.15)] hover:shadow-[0_0_25px_rgba(0,245,212,0.35)] hover:scale-105 transition-all duration-300 cursor-pointer"
             >
               Explore Live Feed
             </button>
           </motion.div>
         </div>
       </div>

      {/* Chevron scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10" 
        onClick={onViewDirectives}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45">Scroll to enter</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="text-primary text-gold-glow flex items-center justify-center"
        >
          <ChevronDown className="w-5 h-5 text-neon-gold" />
        </motion.div>
      </motion.div>
    </div>
  );
}
