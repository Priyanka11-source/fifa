import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Pizza, Users, Loader2, Check, ScanLine, ShieldCheck, Utensils, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Simulated scanner canvas - draws a high-tech grid + scanning animation
function SimulatedScannerCanvas({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 320;

    function draw() {
      if (!ctx || !canvas) return;
      frameRef.current++;
      const f = frameRef.current;

      // Clear
      ctx.fillStyle = '#040810';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.08)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Scanning laser line
      const laserY = (f * 2) % canvas.height;
      const gradient = ctx.createLinearGradient(0, laserY - 3, 0, laserY + 3);
      gradient.addColorStop(0, 'rgba(255, 94, 98, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 94, 98, 0.9)');
      gradient.addColorStop(1, 'rgba(255, 94, 98, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, laserY - 3, canvas.width, 6);

      // Glow trail behind laser
      const trailGrad = ctx.createLinearGradient(0, laserY - 40, 0, laserY);
      trailGrad.addColorStop(0, 'rgba(255, 94, 98, 0)');
      trailGrad.addColorStop(1, 'rgba(255, 94, 98, 0.06)');
      ctx.fillStyle = trailGrad;
      ctx.fillRect(0, laserY - 40, canvas.width, 40);

      // Simulated face recognition box
      const boxPulse = Math.sin(f * 0.04) * 4;
      const bx = canvas.width / 2 - 55 + boxPulse;
      const by = canvas.height / 2 - 65;
      const bw = 110;
      const bh = 130;
      
      ctx.strokeStyle = `rgba(0, 245, 212, ${0.4 + Math.sin(f * 0.06) * 0.2})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      // Corner brackets
      const cornerLen = 14;
      ctx.strokeStyle = 'rgba(255, 94, 98, 0.85)';
      ctx.lineWidth = 2;
      // Top-left
      ctx.beginPath(); ctx.moveTo(bx, by + cornerLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cornerLen, by); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(bx + bw - cornerLen, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cornerLen); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(bx, by + bh - cornerLen); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cornerLen, by + bh); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(bx + bw - cornerLen, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cornerLen); ctx.stroke();

      // Simulated biometric data points
      const dataPoints = [
        { x: bx + 25, y: by + 35 },
        { x: bx + bw - 25, y: by + 35 },
        { x: bx + bw / 2, y: by + 50 },
        { x: bx + bw / 2, y: by + 80 },
        { x: bx + 30, y: by + 70 },
        { x: bx + bw - 30, y: by + 70 },
      ];

      dataPoints.forEach((pt, i) => {
        const pulse = Math.sin(f * 0.08 + i * 1.2) * 2;
        ctx.beginPath();
        ctx.arc(pt.x + pulse, pt.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 245, 212, 0.7)';
        ctx.fill();
      });

      // Lines between points
      ctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < dataPoints.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(dataPoints[i].x, dataPoints[i].y);
        ctx.lineTo(dataPoints[i + 1].x, dataPoints[i + 1].y);
        ctx.stroke();
      }

      // HUD text overlays
      ctx.font = '9px Menlo, monospace';
      ctx.fillStyle = 'rgba(0, 245, 212, 0.5)';
      ctx.fillText(`BIOMETRIC SCAN ${f % 200 < 100 ? '▮' : '▯'}`, 12, 18);
      ctx.fillText(`RES: 640x480 · FPS: 30`, 12, canvas.height - 12);
      
      ctx.fillStyle = 'rgba(255, 94, 98, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText(`LOCK: ACQUIRING`, canvas.width - 12, 18);
      ctx.fillText(`LAT 40.8135 · LON -74.0745`, canvas.width - 12, canvas.height - 12);
      ctx.textAlign = 'left';

      // Circular scan pulse around center
      const pulseRadius = 30 + Math.sin(f * 0.03) * 15;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 94, 98, ${0.1 + Math.sin(f * 0.05) * 0.08})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full object-cover" 
      style={{ imageRendering: 'auto' }}
    />
  );
}

export default function AudienceExperience() {
  const { toast } = useToast();
  
  // Camera State
  const [isScanning, setIsScanning] = useState(false);
  const [scanLog, setScanLog] = useState<string[]>([
    "System Initialized. Position ticket or face."
  ]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [useSimulator, setUseSimulator] = useState(false);

  // Food State
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [orderStep, setOrderStep] = useState(0);

  // Crowd Log Feed (auto-rotating)
  const [crowdLogIndex, setCrowdLogIndex] = useState(0);
  const allCrowdLogs = [
    "14:20:10 — Gate 1 North: Inflow nominal. 340 fans/min.",
    "14:20:25 — Gate 4 West: Shuttle arrivals peak flow detected.",
    "14:20:45 — Concourse A: Hydration stations operating nominal.",
    "14:21:03 — Section 104: Capacity 87%. VIP corridor clear.",
    "14:21:18 — Gate 2 East: Queue buildup. Steward dispatched.",
    "14:21:32 — Parking Deck B: 92% occupied. Overflow routing active.",
    "14:21:50 — Medical Bay Alpha: Standby mode. 0 active cases.",
    "14:22:05 — Transit Hub: Metro Line 7 on schedule. ETA 4 min.",
    "14:22:22 — Security Grid: All sectors GREEN. No anomalies.",
    "14:22:40 — Concourse B: Food court queue 6 min avg wait.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCrowdLogIndex(prev => (prev + 1) % allCrowdLogs.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const visibleLogs = [
    allCrowdLogs[crowdLogIndex % allCrowdLogs.length],
    allCrowdLogs[(crowdLogIndex + 1) % allCrowdLogs.length],
    allCrowdLogs[(crowdLogIndex + 2) % allCrowdLogs.length],
    allCrowdLogs[(crowdLogIndex + 3) % allCrowdLogs.length],
    allCrowdLogs[(crowdLogIndex + 4) % allCrowdLogs.length],
  ];

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState<any>(null);

  // Stop video stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  async function handleStartScan() {
    setIsSuccess(false);
    setIsScanning(true);
    setGeminiResult(null);
    setUseSimulator(false);
    setScanLog(["Requesting camera permission...", "Initializing lens..."]);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("API not supported on this browser/context");
      }

      // Race camera permission with a 1.2s timeout to avoid hanging when permission prompt is ignored or blocked
      const permissionPromise = navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Permission request timed out")), 1200)
      );
      
      const mediaStream = await Promise.race([permissionPromise, timeoutPromise]);
      
      setStream(mediaStream);
      setIsStreaming(true);
      setScanLog(prev => [...prev, "✓ Live camera connected.", "Align ticket QR or face...", "Auto-capture in 3s..."]);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);

      setTimeout(() => {
        captureSnapshot(mediaStream);
      }, 3000);

    } catch (err: any) {
      setUseSimulator(true);
      setScanLog(prev => [
        ...prev,
        `⚠ Camera unavailable: ${err.message || err}`,
        "✓ Activating scanner simulator...",
        "✓ Simulated biometric scan initializing...",
        "Auto-capture in 3s..."
      ]);
      setIsStreaming(true);
      
      setTimeout(() => {
        captureMockSnapshot();
      }, 3000);
    }
  }

  async function captureMockSnapshot() {
    setScanLog(prev => [...prev, "Capturing simulated frame...", "⟳ Analyzing with Gemini AI Vision..."]);
    setIsLoading(true);
    setIsStreaming(false);

    try {
      const base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

      const baseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";
      const response = await fetch(`${baseUrl}/api/genai/scan-webcam`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image })
      });
      
      const data = await response.json();
      setIsLoading(false);
      setGeminiResult(data);

      if (data.success) {
        setIsSuccess(true);
        setScanLog(prev => [
          ...prev,
          `✓ Match Type: ${data.type.toUpperCase()}`,
          `✓ Gemini AI: ${data.message}`
        ]);
        toast({
          title: "✓ Access Granted",
          description: data.message,
        });
      } else {
        setIsSuccess(false);
        setScanLog(prev => [
          ...prev,
          `✗ Access Denied: ${data.message}`
        ]);
        toast({
          title: "Access Denied",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (err: any) {
      setIsLoading(false);
      setIsScanning(false);
      setScanLog(prev => [...prev, `✗ AI analysis failed: ${err.message || err}`]);
    }
  }

  async function captureSnapshot(activeStream: MediaStream) {
    const video = videoRef.current;
    if (!video) return;

    setScanLog(prev => [...prev, "Capturing snapshot...", "⟳ Analyzing with Gemini AI Vision..."]);
    setIsLoading(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL("image/jpeg");

        activeStream.getTracks().forEach(track => track.stop());
        setStream(null);
        setIsStreaming(false);

        const baseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";
        const response = await fetch(`${baseUrl}/api/genai/scan-webcam`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image })
        });
        
        const data = await response.json();
        setIsLoading(false);
        setGeminiResult(data);

        if (data.success) {
          setIsSuccess(true);
          setScanLog(prev => [
            ...prev,
            `✓ Match Type: ${data.type.toUpperCase()}`,
            `✓ Gemini AI: ${data.message}`
          ]);
          toast({
            title: "✓ Access Granted",
            description: data.message,
          });
        } else {
          setIsSuccess(false);
          setScanLog(prev => [
            ...prev,
            `✗ Access Denied: ${data.message}`
          ]);
          toast({
            title: "Access Denied",
            description: data.message,
            variant: "destructive"
          });
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setIsScanning(false);
      setScanLog(prev => [...prev, `✗ AI analysis failed: ${err.message || err}`]);
    }
  }

  // Simulated food order preparation status
  useEffect(() => {
    if (!activeOrder) return;

    setOrderStep(1);
    const timer1 = setTimeout(() => setOrderStep(2), 2000);
    const timer2 = setTimeout(() => {
      setOrderStep(3);
      toast({
        title: "🍔 Order Ready!",
        description: `Your ${activeOrder} is ready at Express Counter A!`,
      });
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activeOrder]);

  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scanLog]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ScanLine className="w-4 h-4 text-neon-pink" />
          <span className="text-[10px] font-mono text-neon-pink uppercase tracking-[0.2em] font-semibold">Interactive Fan Utilities</span>
        </div>
        <h3 className="font-serif text-3xl text-foreground">Smart Audience Experience</h3>
        <p className="text-xs text-foreground/60 mt-1.5 font-light leading-relaxed max-w-2xl">
          Access automated stadium services powered by Gemini AI. Scan matchday passes with your camera, order concourse food directly, and monitor real-time spatial telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Ticket / Face Scanning Camera */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-6 rounded-sm flex flex-col gap-4 border-t-2 border-t-neon-pink shadow-neon-pink shadow-neon-pink-hover hover:bg-white/[0.03] transition-all"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center">
                <Camera className="w-3.5 h-3.5 text-neon-pink" />
              </div>
              <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-foreground">Gate Entry Scanner</h4>
            </div>
            <span className={`text-[9px] font-mono px-2 py-0.5 border rounded flex items-center gap-1.5 ${
              isScanning 
                ? 'text-neon-pink border-neon-pink/30 bg-neon-pink/5' 
                : 'text-foreground/40 border-white/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-neon-pink animate-pulse' : 'bg-foreground/20'}`} />
              {isScanning ? 'SCANNING' : 'STANDBY'}
            </span>
          </div>

          <div className="relative aspect-video bg-black/90 border border-white/10 rounded-sm overflow-hidden flex flex-col items-center justify-center">
            {isScanning ? (
              <>
                {/* Real Video Element (hidden when using simulator) */}
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`absolute inset-0 w-full h-full object-cover z-0 ${useSimulator ? 'opacity-0' : 'opacity-70'}`}
                />

                {/* Simulated Scanner Canvas (when camera is unavailable) */}
                {useSimulator && <SimulatedScannerCanvas isActive={isStreaming} />}

                {/* Scanning Laser Overlay */}
                {isStreaming && !useSimulator && (
                  <div className="absolute inset-x-0 h-0.5 bg-neon-pink/80 shadow-[0_0_12px_rgba(255,94,98,0.8)] top-0 z-10 animate-[scanLaser_2s_ease-in-out_infinite]" />
                )}
                
                {/* Scanner View Finder Corners */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-neon-pink z-10" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-neon-pink z-10" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-neon-pink z-10" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-neon-pink z-10" />

                {/* Loading overlay */}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-3 z-20 backdrop-blur-sm"
                  >
                    <div className="relative">
                      <Loader2 className="w-10 h-10 animate-spin text-neon-pink" />
                      <div className="absolute inset-0 w-10 h-10 rounded-full border border-neon-pink/20 animate-ping" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neon-pink bg-black/60 px-3 py-1 rounded border border-neon-pink/15">Gemini Vision Analyzing...</span>
                  </motion.div>
                )}

                {/* Success State */}
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-3 z-20"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                    >
                      <ShieldCheck className="w-12 h-12 text-neon-emerald drop-shadow-[0_0_12px_rgba(112,224,0,0.5)]" />
                    </motion.div>
                    <span className="text-sm font-mono uppercase font-bold tracking-widest text-neon-emerald">Access Granted</span>
                    <span className="text-[9px] font-mono text-foreground/50">
                      {geminiResult?.type === 'ticket' ? 'QR Matchday Pass Verified' : 'Biometric Scan Authenticated'}
                    </span>
                    <button
                      onClick={handleStartScan}
                      className="mt-2 px-3 py-1.5 bg-neon-pink/15 border border-neon-pink/30 text-neon-pink font-mono text-[9px] uppercase tracking-widest rounded hover:bg-neon-pink/25 transition-all cursor-pointer"
                    >
                      Scan Again
                    </button>
                  </motion.div>
                ) : (
                  !isLoading && !isStreaming && isScanning && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 text-neon-pink z-20"
                    >
                      <span className="text-[9px] font-mono uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">Scan Complete</span>
                      <button
                        onClick={handleStartScan}
                        className="px-3 py-1.5 bg-neon-pink/15 border border-neon-pink/30 text-neon-pink font-mono text-[9px] uppercase tracking-widest rounded hover:bg-neon-pink/25 transition-all cursor-pointer"
                      >
                        Retry Scan
                      </button>
                    </motion.div>
                  )
                )}

                {isStreaming && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-foreground/70 z-10">
                    <span className="text-[8px] font-mono uppercase tracking-widest bg-black/80 px-2.5 py-1 rounded border border-white/5 animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
                      {useSimulator ? 'Simulator Active' : 'Align QR / Face'}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="w-14 h-14 rounded-full bg-neon-pink/5 border border-neon-pink/15 flex items-center justify-center relative">
                  <Camera className="w-6 h-6 text-neon-pink/50" />
                  <div className="absolute inset-0 rounded-full border border-neon-pink/10 animate-ping" style={{ animationDuration: '3s' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-wider">Gemini AI Vision Scanner</span>
                  <span className="text-[9px] text-foreground/25">Camera or simulator mode</span>
                </div>
                <button
                  onClick={handleStartScan}
                  className="px-5 py-2.5 border border-neon-pink/40 text-neon-pink font-mono text-[10px] uppercase tracking-wider rounded hover:bg-neon-pink/10 hover:border-neon-pink/60 hover:shadow-[0_0_15px_rgba(255,94,98,0.15)] transition-all cursor-pointer"
                >
                  Activate Scanner
                </button>
              </div>
            )}
          </div>

          {/* Scanner Log Terminal */}
          <div className="bg-black/90 border border-white/5 p-3 rounded-sm font-mono text-[9px] text-foreground/70 h-32 overflow-y-auto flex flex-col gap-1 leading-relaxed relative">
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-neon-pink/50" />
              <span className="text-[7px] text-foreground/25 uppercase">Terminal</span>
            </div>
            {scanLog.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-1.5"
              >
                <span className="text-neon-pink select-none">&gt;</span>
                <span className={log.startsWith('✓') ? 'text-neon-emerald/80' : log.startsWith('✗') || log.startsWith('⚠') ? 'text-neon-orange/80' : ''}>{log}</span>
              </motion.div>
            ))}
            <div ref={logEndRef} />
          </div>
        </motion.div>

        {/* 2. Food Ordering System */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-panel p-6 rounded-sm flex flex-col gap-4 border-t-2 border-t-neon-orange shadow-neon-orange shadow-neon-orange-hover hover:bg-white/[0.03] transition-all"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-neon-orange/10 border border-neon-orange/20 flex items-center justify-center">
                <Utensils className="w-3.5 h-3.5 text-neon-orange" />
              </div>
              <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-foreground">Concourse Food Service</h4>
            </div>
            <span className="text-[9px] font-mono text-neon-orange px-2 py-0.5 border border-neon-orange/20 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-orange animate-pulse" />
              GENAI ORDERING
            </span>
          </div>

          {/* Food Menu Items */}
          <div className="flex flex-col gap-2">
            {[
              { id: 'burger', name: 'Championship Beef Burger', price: '$12.50', time: '5 min', emoji: '🍔' },
              { id: 'fries', name: 'Golden Pitch Salty Fries', price: '$6.00', time: '3 min', emoji: '🍟' },
              { id: 'soda', name: 'Free-kick Hydrant Soda', price: '$4.00', time: '2 min', emoji: '🥤' },
              { id: 'nachos', name: 'World Cup Loaded Nachos', price: '$9.50', time: '4 min', emoji: '🧀' },
            ].map(item => (
              <motion.div 
                key={item.id} 
                whileHover={{ scale: 1.01 }}
                className="p-3 border border-white/5 bg-black/20 rounded-sm flex justify-between items-center hover:border-neon-orange/15 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <h5 className="text-xs font-medium text-foreground group-hover:text-neon-orange/90 transition-colors">{item.name}</h5>
                    <div className="flex gap-2 text-[9px] font-mono text-foreground/40 mt-0.5">
                      <span className="text-neon-orange/70 font-semibold">{item.price}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveOrder(item.name)}
                  disabled={!!activeOrder && orderStep < 3}
                  className="px-2.5 py-1.5 border border-neon-orange/30 text-neon-orange font-mono text-[9px] uppercase tracking-wider rounded hover:bg-neon-orange/10 hover:border-neon-orange/50 transition-all disabled:opacity-30 cursor-pointer"
                >
                  Order
                </button>
              </motion.div>
            ))}
          </div>

          {/* Food Tracker */}
          <AnimatePresence>
            {activeOrder && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-auto border-t border-white/5 pt-3 flex flex-col gap-2.5 overflow-hidden"
              >
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-foreground/50">ACTIVE ORDER:</span>
                  <span className="text-neon-orange font-bold">{activeOrder}</span>
                </div>
                
                <div className="flex justify-between items-center gap-1">
                  {[
                    { step: 1, label: 'Received' },
                    { step: 2, label: 'Preparing' },
                    { step: 3, label: 'Ready' }
                  ].map((s) => (
                    <div key={s.step} className="flex-1 flex flex-col items-center gap-1.5 text-center">
                      <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                        orderStep >= s.step 
                          ? 'bg-gradient-to-r from-neon-orange to-neon-gold shadow-[0_0_8px_rgba(245,120,65,0.3)]' 
                          : 'bg-white/8'
                      }`} />
                      <span className={`text-[8px] font-mono uppercase transition-colors ${
                        orderStep >= s.step ? 'text-neon-orange font-bold' : 'text-foreground/25'
                      }`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. Live Crowd Feed Monitor */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel p-6 rounded-sm flex flex-col gap-4 border-t-2 border-t-neon-cyan shadow-neon-cyan shadow-neon-cyan-hover hover:bg-white/[0.03] transition-all"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-neon-cyan" />
              </div>
              <h4 className="text-sm font-semibold uppercase tracking-wider font-mono text-foreground">Spatial Logistics Feed</h4>
            </div>
            <span className="text-[9px] font-mono text-neon-cyan px-2 py-0.5 border border-neon-cyan/20 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>

          <p className="text-[11px] text-foreground/55 leading-relaxed font-light">
            Central telemetry log showing real-time inflow pressure, entrance queue status, and facility operations from IoT stadium sensors.
          </p>

          {/* Live Stats Quick Glance */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'GATES OPEN', value: '8/8', color: 'text-neon-emerald' },
              { label: 'AVG WAIT', value: '2.4m', color: 'text-neon-cyan' },
              { label: 'FILL RATE', value: '87%', color: 'text-neon-gold' },
            ].map(stat => (
              <div key={stat.label} className="bg-black/40 border border-white/5 rounded-sm p-2 text-center">
                <span className={`block text-lg font-mono font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-[7px] font-mono text-foreground/30 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Scrolling Feed */}
          <div className="flex-1 bg-black/90 border border-white/5 p-3 rounded-sm font-mono text-[9px] text-foreground/60 flex flex-col gap-2 overflow-hidden max-h-[200px]">
            <AnimatePresence mode="popLayout">
              {visibleLogs.map((log, i) => (
                <motion.div 
                  key={`${crowdLogIndex}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1 - i * 0.15, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="pb-1.5 border-b border-white/3 last:border-b-0 leading-relaxed flex gap-1.5"
                >
                  <span className="text-neon-cyan/50 select-none">▸</span>
                  <span>{log}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between text-[8px] font-mono text-foreground/25">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-neon-emerald animate-pulse" />
              CONNECTED · 47 SENSORS
            </span>
            <span>REFRESH: 3000ms</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
