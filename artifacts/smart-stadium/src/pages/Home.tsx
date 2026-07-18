import React, { useState } from 'react';
import Hero from '@/components/Hero';
import CommandCenter from '@/components/CommandCenter';
import FanExperience from '@/components/FanExperience';
import Metrics from '@/components/Metrics';
import InteractiveMap from '@/components/InteractiveMap';
import TransitBoard from '@/components/TransitBoard';
import SustainabilityPanel from '@/components/SustainabilityPanel';
import AudienceExperience from '@/components/AudienceExperience';
import { useGetOperationsState, getGetOperationsStateQueryKey } from '@workspace/api-client-react';
import { Eye, Type, Settings, ShieldAlert, Award, Compass, Trophy, Zap, Map, MessageCircle, ScanLine, Train, Leaf, BarChart3 } from 'lucide-react';

// Section wrapper with consistent styling and beautiful divider
function SectionWrapper({ 
  id, 
  children, 
  borderColor, 
  shadowClass, 
  hoverClass,
  icon: Icon,
  label,
  title,
}: { 
  id?: string; 
  children: React.ReactNode; 
  borderColor: string;
  shadowClass: string;
  hoverClass: string;
  icon?: React.ElementType;
  label?: string;
  title?: string;
}) {
  return (
    <section id={id} className="w-full max-w-7xl mx-auto px-6 py-5 relative z-10 scroll-mt-24">
      <div className={`glass-panel p-6 md:p-8 rounded-sm border-t-2 ${borderColor} ${shadowClass} ${hoverClass} transition-all duration-500`}>
        {(label || title) && (
          <div className="mb-6">
            {label && (
              <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
                <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-semibold opacity-80`}>{label}</span>
              </div>
            )}
            {title && <h2 className="font-serif text-3xl md:text-4xl text-foreground">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const [portalMode, setPortalMode] = useState<'fan' | 'staff'>('fan');
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
  });

  const { data: state } = useGetOperationsState({
    query: { queryKey: getGetOperationsStateQueryKey(), refetchInterval: 4000 },
  });

  const mainClasses = [
    "w-full min-h-screen bg-background text-foreground flex flex-col transition-all duration-300 relative",
    accessibility.largeText ? "large-text" : "",
    accessibility.highContrast ? "high-contrast" : ""
  ].join(" ");

  const activeIncident = state?.activeIncident ?? 'none';

  return (
    <main className={mainClasses} role="main" id="main-content">
      {/* Skip Navigation Link (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-sm focus:text-sm focus:font-mono"
      >
        Skip to main content
      </a>

      {/* Film grain effect overlay */}
      <div className="film-grain pointer-events-none" aria-hidden="true" />

      {/* Ambient background colorful nebula spheres — decorative */}
      <div aria-hidden="true" className="absolute top-[5%] left-[5%] w-[400px] h-[400px] rounded-full bg-neon-cyan/15 pointer-events-none filter blur-[100px] z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div aria-hidden="true" className="absolute top-[25%] right-[5%] w-[500px] h-[500px] rounded-full bg-neon-purple/15 pointer-events-none filter blur-[130px] z-0 animate-pulse" style={{ animationDuration: '12s' }} />
      <div aria-hidden="true" className="absolute top-[55%] left-[12%] w-[450px] h-[450px] rounded-full bg-neon-pink/12 pointer-events-none filter blur-[110px] z-0 animate-pulse" style={{ animationDuration: '10s' }} />
      <div aria-hidden="true" className="absolute top-[80%] right-[10%] w-[550px] h-[550px] rounded-full bg-neon-orange/12 pointer-events-none filter blur-[140px] z-0 animate-pulse" style={{ animationDuration: '14s' }} />

      {/* Global Glowing Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0818]/90 backdrop-blur-md relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.6)]" role="banner">
        {/* Pulsing gradient bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan via-neon-gold to-neon-pink" />
        
        {/* Black and White Soccer Ball SVG Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0" aria-hidden="true">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="football-hex-grid" width="40" height="69.28" patternUnits="userSpaceOnUse">
                {/* Outlines of Soccer Hexagons */}
                <path d="M 0 0 L 20 11.54 L 40 0 M 20 11.54 L 20 34.64 L 0 46.18 M 20 34.64 L 40 46.18 M 0 46.18 L 20 57.73 L 40 46.18 M 20 57.73 L 20 69.28" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                {/* Black Pentagon patches in center */}
                <polygon points="20,23.09 30,28.86 30,40.41 20,46.18 10,40.41 10,28.86" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                {/* White hexagon highlight fill */}
                <polygon points="0,0 20,11.54 20,23.09 0,11.54" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#football-hex-grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4 relative z-10">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm border border-primary/45 flex items-center justify-center bg-black/60 shadow-[0_0_12px_rgba(245,176,65,0.25)]">
              <Trophy className="w-5 h-5 text-primary text-gold-glow animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-primary uppercase tracking-[0.25em] font-medium">FIFA 2026 World Cup</span>
              <span className="font-serif text-sm tracking-wide text-foreground font-semibold text-gold-glow">SMART STADIUM</span>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <nav aria-label="Portal mode navigation" className="flex items-center bg-black/50 border border-primary/10 p-1 rounded-sm gap-1" role="tablist">
            <button
              onClick={() => setPortalMode('fan')}
              role="tab"
              aria-selected={portalMode === 'fan'}
              aria-controls="fan-panel"
              id="fan-tab"
              className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-sm ${
                portalMode === 'fan'
                  ? 'bg-neon-cyan/15 border border-neon-cyan/35 text-neon-cyan shadow-[0_0_12px_rgba(0,245,212,0.2)] font-bold'
                  : 'border border-transparent text-foreground/45 hover:text-foreground'
              }`}
            >
              Fan Experience
            </button>
            <button
              onClick={() => setPortalMode('staff')}
              role="tab"
              aria-selected={portalMode === 'staff'}
              aria-controls="staff-panel"
              id="staff-tab"
              className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all rounded-sm ${
                portalMode === 'staff'
                  ? 'bg-neon-purple/15 border border-neon-purple/35 text-neon-purple shadow-[0_0_12px_rgba(131,56,236,0.2)] font-bold'
                  : 'border border-transparent text-foreground/45 hover:text-foreground'
              }`}
            >
              Staff Command
            </button>
          </nav>

          {/* Accessibility Settings */}
          <div className="flex items-center gap-2">
            {/* Text Size Scale Toggle */}
            <button
              onClick={() => setAccessibility(prev => ({ ...prev, largeText: !prev.largeText }))}
              title="Toggle Large Text"
              className={`p-2.5 border rounded-sm transition-all ${
                accessibility.largeText
                  ? 'bg-primary/15 border-primary text-primary shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                  : 'border-primary/10 text-foreground/40 hover:text-foreground/75'
              }`}
            >
              <Type className="w-4 h-4" />
            </button>

            {/* High Contrast Color Toggle */}
            <button
              onClick={() => setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }))}
              title="Toggle High Contrast"
              className={`p-2.5 border rounded-sm transition-all ${
                accessibility.highContrast
                  ? 'bg-primary/15 border-primary text-primary shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                  : 'border-primary/10 text-foreground/40 hover:text-foreground/75'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main View Modes Layout */}
      {portalMode === 'fan' ? (
        /* ==================== FAN EXPERIENCE MODE ==================== */
        <div className="flex-1 flex flex-col" role="tabpanel" aria-labelledby="fan-tab" id="fan-panel">
          {/* Fan-centric Welcome Hero */}
          <Hero 
            onDeployCommand={() => {
              setPortalMode('staff');
              setTimeout(() => {
                document.getElementById('command-center-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onViewDirectives={() => {
              document.getElementById('stadium-map-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Interactive Stadium Map Section */}
          <SectionWrapper
            id="stadium-map-section"
            borderColor="border-t-neon-cyan"
            shadowClass="shadow-neon-cyan"
            hoverClass="shadow-neon-cyan-hover"
          >
            <InteractiveMap 
              gates={state?.gates} 
              transport={state?.transport} 
              weather={state?.weatherCondition} 
              activeIncident={activeIncident} 
            />
          </SectionWrapper>

          {/* Multilingual AI Concierge assistant */}
          <SectionWrapper
            borderColor="border-t-neon-purple"
            shadowClass="shadow-neon-purple"
            hoverClass="shadow-neon-purple-hover"
          >
            <FanExperience />
          </SectionWrapper>

          {/* Interactive Fan Experience Utilities */}
          <SectionWrapper
            borderColor="border-t-neon-pink"
            shadowClass="shadow-neon-pink"
            hoverClass="shadow-neon-pink-hover"
          >
            <AudienceExperience />
          </SectionWrapper>

          {/* Transit departure schedules */}
          <SectionWrapper
            borderColor="border-t-neon-orange"
            shadowClass="shadow-neon-orange"
            hoverClass="shadow-neon-orange-hover"
          >
            <TransitBoard 
              transport={state?.transport} 
              activeIncident={activeIncident} 
            />
          </SectionWrapper>
        </div>
      ) : (
        /* ==================== STAFF COMMAND MODE ==================== */
        <div className="flex-1 flex flex-col" role="tabpanel" aria-labelledby="staff-tab" id="staff-panel">
          
          {/* CommandCenter simulator panel + Directives Feed */}
          <SectionWrapper
            id="command-center-section"
            borderColor="border-t-neon-purple"
            shadowClass="shadow-neon-purple"
            hoverClass="shadow-neon-purple-hover"
            icon={ShieldAlert}
            label="Live Operations Center"
            title="Stadium CommandCenter"
          >
            <CommandCenter />
          </SectionWrapper>

          {/* Interactive Map (Staff thermal/grid visualizer) */}
          <SectionWrapper
            borderColor="border-t-neon-cyan"
            shadowClass="shadow-neon-cyan"
            hoverClass="shadow-neon-cyan-hover"
          >
            <InteractiveMap 
              gates={state?.gates} 
              transport={state?.transport} 
              weather={state?.weatherCondition} 
              activeIncident={activeIncident} 
            />
          </SectionWrapper>

          {/* Sustainability solar generation telemetry */}
          <SectionWrapper
            borderColor="border-t-neon-emerald"
            shadowClass="shadow-neon-emerald"
            hoverClass="shadow-neon-emerald-hover"
          >
            <SustainabilityPanel 
              energyLoad={state?.energyLoadPct} 
              activeIncident={activeIncident} 
            />
          </SectionWrapper>

          {/* Telemetry quick indicators grid */}
          <SectionWrapper
            borderColor="border-t-neon-gold"
            shadowClass="shadow-neon-gold"
            hoverClass="shadow-neon-gold-hover"
            icon={BarChart3}
            label="Raw Telemetry Grid"
            title="Sensory Metric Logs"
          >
            <Metrics />
          </SectionWrapper>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-16 border-t border-primary/20 bg-[#020403] text-center relative z-10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="w-9 h-9 rounded-sm border border-primary/30 flex items-center justify-center bg-black mb-4 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
            <Trophy className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <h3 className="font-serif text-xl text-foreground">GenAI Smart Stadium</h3>
          <p className="text-xs tracking-[0.2em] uppercase font-mono text-foreground/40">Pitch Demo • 2026 World Cup</p>
          <div className="flex items-center gap-4 mt-2 text-[9px] font-mono text-foreground/25 uppercase tracking-wider">
            <span>Gemini AI Powered</span>
            <span className="w-1 h-1 rounded-full bg-primary/30" />
            <span>Real-Time Telemetry</span>
            <span className="w-1 h-1 rounded-full bg-primary/30" />
            <span>WCAG AA Accessible</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
