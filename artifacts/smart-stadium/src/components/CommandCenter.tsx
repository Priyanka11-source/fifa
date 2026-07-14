import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALERTS = [
  { id: 1, time: '14:02:45', msg: 'Concourse C density reaching 85%. Rerouting Gate 4 foot traffic.', status: 'executing' },
  { id: 2, time: '14:01:12', msg: 'Temperature in Sector 7a above optimal. Adjusting HVAC flow.', status: 'resolved' },
  { id: 3, time: '13:58:30', msg: 'VIP arrival detected at South Entrance. Security dispatch confirmed.', status: 'resolved' },
  { id: 4, time: '13:55:05', msg: 'Merch Stand B inventory low on home kits. Restock drone dispatched.', status: 'executing' },
  { id: 5, time: '13:42:19', msg: 'Audio anomaly in North Stand. Recalibrating acoustic dampeners.', status: 'resolved' },
];

export default function CommandCenter() {
  const [alerts, setAlerts] = useState(ALERTS.slice(0, 3));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tick > 0) {
      const nextAlert = ALERTS[(tick + 2) % ALERTS.length];
      const newAlert = { ...nextAlert, id: Date.now(), time: new Date().toLocaleTimeString('en-US', { hour12: false }) };
      setAlerts(prev => [newAlert, ...prev].slice(0, 4));
    }
  }, [tick]);

  return (
    <section className="relative w-full py-32 overflow-hidden bg-background border-t border-primary/10">
      <div className="absolute inset-0 radial-glow opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          {/* Narrative */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <h2 className="font-serif text-3xl md:text-5xl text-foreground">
              Omniscient <br />
              <span className="text-primary italic">Control</span>
            </h2>
            <p className="text-foreground/70 font-light leading-relaxed">
              The stadium thinks before it reacts. Powered by real-time spatial awareness and predictive generative models, operational friction is resolved before fans even notice.
            </p>
            <div className="w-12 h-[1px] bg-primary/50 mt-4" />
          </div>

          {/* Visualization UI */}
          <div className="w-full md:w-2/3 glass-panel rounded-lg p-6 relative overflow-hidden flex flex-col md:flex-row gap-8 min-h-[450px]">
            
            {/* Heatmap Pitch */}
            <div className="flex-1 relative flex items-center justify-center border border-primary/20 bg-black/40 rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjEyLCAxNzUsIDU1LCAwLjE1KSIvPjwvc3ZnPg==')] opacity-30" />
              
              {/* Stylized Pitch Lines */}
              <div className="w-[80%] h-[60%] border border-primary/30 relative flex items-center justify-center">
                <div className="w-[1px] h-full bg-primary/30 absolute left-1/2 -translate-x-1/2" />
                <div className="w-16 h-16 rounded-full border border-primary/30 absolute" />
                <div className="w-12 h-full border-r border-primary/30 absolute left-0" />
                <div className="w-12 h-full border-l border-primary/30 absolute right-0" />
              </div>

              {/* Heat Blobs */}
              <div className="absolute top-[20%] left-[30%] w-24 h-24 bg-red-500 rounded-full mix-blend-screen heat-blob" style={{ animationDelay: '0s' }} />
              <div className="absolute bottom-[30%] right-[25%] w-32 h-32 bg-orange-500 rounded-full mix-blend-screen heat-blob" style={{ animationDelay: '1s' }} />
              <div className="absolute top-[40%] right-[40%] w-20 h-20 bg-yellow-500 rounded-full mix-blend-screen heat-blob" style={{ animationDelay: '2s' }} />
              
              {/* Scanline */}
              <motion.div 
                className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              
              <div className="absolute top-3 left-3 flex gap-2 items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-foreground/50 tracking-wider">LIVE THERMAL</span>
              </div>
            </div>

            {/* Directive Feed */}
            <div className="w-full md:w-[320px] flex flex-col">
              <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-2">
                <span className="font-mono text-xs text-primary uppercase tracking-widest">Active Directives</span>
                <span className="font-mono text-xs text-foreground/40">SYS.OP.902</span>
              </div>
              
              <div className="flex-1 flex flex-col gap-3 relative">
                <AnimatePresence>
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      layout
                      className="p-3 border border-primary/10 bg-background/50 rounded flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-foreground/50">{alert.time}</span>
                        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                          alert.status === 'executing' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground border border-primary/20'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/90 font-light leading-relaxed">
                        {alert.msg}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
