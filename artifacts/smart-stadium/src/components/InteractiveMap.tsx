import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Battery,
  Compass,
  ShieldAlert,
  Award,
} from "lucide-react";
import type { GateStatus, TransportLine } from "@workspace/api-client-react";

interface InteractiveMapProps {
  gates?: GateStatus[];
  transport?: TransportLine[];
  weather?: string;
  activeIncident?: string;
}

type MapLayer =
  "crowd" | "transit" | "accessibility" | "sustainability" | "match3d";

interface Hotspot {
  id: string;
  name: string;
  x: number;
  y: number;
  layers: MapLayer[];
  info: string;
  status: "nominal" | "warning" | "critical";
  aiRec: string;
}

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  team: "red" | "blue";
  role: "striker" | "midfielder" | "keeper";
  number: number;
  name: string;
}

interface Ball {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

function Match3DGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ blue: 0, red: 0 });
  const [goalText, setGoalText] = useState<string | null>(null);
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const pWidth = 460;
    const pHeight = 260;

    let ball = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 };
    let players: Player[] = [
      {
        x: -210,
        y: 0,
        vx: 0,
        vy: 0,
        team: "blue",
        role: "keeper",
        number: 1,
        name: "AI Keeper",
      },
      {
        x: -90,
        y: -40,
        vx: 0,
        vy: 0,
        team: "blue",
        role: "midfielder",
        number: 8,
        name: "AI Mid",
      },
      {
        x: -30,
        y: 30,
        vx: 0,
        vy: 0,
        team: "blue",
        role: "striker",
        number: 10,
        name: "You (Striker)",
      },

      {
        x: 210,
        y: 0,
        vx: 0,
        vy: 0,
        team: "red",
        role: "keeper",
        number: 1,
        name: "Red Keeper",
      },
      {
        x: 90,
        y: 40,
        vx: 0,
        vy: 0,
        team: "red",
        role: "midfielder",
        number: 6,
        name: "Red Mid",
      },
      {
        x: 30,
        y: -30,
        vx: 0,
        vy: 0,
        team: "red",
        role: "striker",
        number: 9,
        name: "Red Striker",
      },
    ];

    let resetTimer = 0;

    function resetPositions() {
      ball = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 };
      players[0].x = -210;
      players[0].y = 0;
      players[1].x = -90;
      players[1].y = -40;
      players[2].x = -30;
      players[2].y = 30;
      players[3].x = 210;
      players[3].y = 0;
      players[4].x = 90;
      players[4].y = 40;
      players[5].x = 30;
      players[5].y = -30;
      for (const p of players) {
        p.vx = 0;
        p.vy = 0;
      }
    }

    function project(x: number, y: number, z: number) {
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2 + 10;
      const isoX = (x - y) * 0.866;
      const isoY = (x + y) * 0.5;
      return {
        x: cx + isoX,
        y: cy + isoY * 0.6 - z,
      };
    }

    function update() {
      if (resetTimer > 0) {
        resetTimer--;
        if (resetTimer === 0) {
          setGoalText(null);
          resetPositions();
        }
      }

      const user = players[2];
      const speed = 3.5;
      user.vx = 0;
      user.vy = 0;
      if (keysPressed.current["ArrowUp"] || keysPressed.current["w"])
        user.vy = -speed;
      if (keysPressed.current["ArrowDown"] || keysPressed.current["s"])
        user.vy = speed;
      if (keysPressed.current["ArrowLeft"] || keysPressed.current["a"])
        user.vx = -speed;
      if (keysPressed.current["ArrowRight"] || keysPressed.current["d"])
        user.vx = speed;

      if (keysPressed.current[" "] && resetTimer === 0) {
        const dx = ball.x - user.x;
        const dy = ball.y - user.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 18 && ball.z < 15) {
          const angle = Math.atan2(0 - ball.y, 220 - ball.x);
          const kickForce = 8.5;
          ball.vx = Math.cos(angle) * kickForce + (Math.random() - 0.5) * 2;
          ball.vy = Math.sin(angle) * kickForce;
          ball.vz = 5.5 + Math.random() * 2.5;
          keysPressed.current[" "] = false;
        }
      }

      players.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.max(-pWidth / 2, Math.min(pWidth / 2, p.x));
        p.y = Math.max(-pHeight / 2, Math.min(pHeight / 2, p.y));

        if (resetTimer > 0) return;
        if (idx === 2) return;

        if (p.role === "keeper") {
          const targetY = Math.max(-30, Math.min(30, ball.y));
          p.vy = (targetY - p.y) * 0.1;
          p.vx = 0;
          return;
        }

        const dx = ball.x - p.x;
        const dy = ball.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) {
          const angle = Math.atan2(dy, dx);
          const aiSpeed = p.team === "blue" ? 2.2 : 2.0;
          p.vx = Math.cos(angle) * aiSpeed;
          p.vy = Math.sin(angle) * aiSpeed;
        } else {
          p.vx = 0;
          p.vy = 0;
          if (ball.z < 12) {
            if (p.team === "red") {
              const angle = Math.atan2(0 - ball.y, -220 - ball.x);
              ball.vx = Math.cos(angle) * 7.5;
              ball.vy = Math.sin(angle) * 7.5;
              ball.vz = 4 + Math.random() * 2;
            } else {
              const angle = Math.atan2(
                players[2].y - ball.y,
                players[2].x - ball.x,
              );
              ball.vx = Math.cos(angle) * 6.5;
              ball.vy = Math.sin(angle) * 6.5;
              ball.vz = 2;
            }
          }
        }
      });

      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.z += ball.vz;

      if (ball.z <= 0) {
        ball.vx *= 0.98;
        ball.vy *= 0.98;
      } else {
        ball.vx *= 0.99;
        ball.vy *= 0.99;
        ball.vz -= 0.35;
      }

      if (ball.z < 0) {
        ball.z = 0;
        ball.vz = -ball.vz * 0.55;
        if (Math.abs(ball.vz) < 1.0) ball.vz = 0;
      }

      if (Math.abs(ball.y) > pHeight / 2 + 10) {
        ball.vy = -ball.vy * 0.8;
      }

      if (resetTimer === 0) {
        if (ball.x > pWidth / 2) {
          if (ball.y > -35 && ball.y < 35 && ball.z < 30) {
            setScore((prev) => ({ ...prev, blue: prev.blue + 1 }));
            setGoalText("GOAL!!! BLUE SCORES!");
            resetTimer = 120;
            ball.vx = 1;
            ball.vy = 0;
            ball.vz = 0;
          } else {
            ball.x = pWidth / 2;
            ball.vx = -ball.vx * 0.7;
          }
        } else if (ball.x < -pWidth / 2) {
          if (ball.y > -35 && ball.y < 35 && ball.z < 30) {
            setScore((prev) => ({ ...prev, red: prev.red + 1 }));
            setGoalText("GOAL!!! RED SCORES!");
            resetTimer = 120;
            ball.vx = -1;
            ball.vy = 0;
            ball.vz = 0;
          } else {
            ball.x = -pWidth / 2;
            ball.vx = -ball.vx * 0.7;
          }
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = "#061a06";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      const pTL = project(-pWidth / 2, -pHeight / 2, 0);
      const pTR = project(pWidth / 2, -pHeight / 2, 0);
      const pBR = project(pWidth / 2, pHeight / 2, 0);
      const pBL = project(-pWidth / 2, pHeight / 2, 0);

      ctx!.beginPath();
      ctx!.moveTo(pTL.x, pTL.y);
      ctx!.lineTo(pTR.x, pTR.y);
      ctx!.lineTo(pBR.x, pBR.y);
      ctx!.lineTo(pBL.x, pBL.y);
      ctx!.closePath();
      ctx!.fillStyle = "#0c380c";
      ctx!.fill();
      ctx!.strokeStyle = "rgba(255,255,255,0.4)";
      ctx!.lineWidth = 2;
      ctx!.stroke();

      for (let x = -pWidth / 2 + 40; x < pWidth / 2; x += 80) {
        const sTL = project(x, -pHeight / 2, 0);
        const sTR = project(x + 40, -pHeight / 2, 0);
        const sBR = project(x + 40, pHeight / 2, 0);
        const sBL = project(x, pHeight / 2, 0);

        ctx!.beginPath();
        ctx!.moveTo(sTL.x, sTL.y);
        ctx!.lineTo(sTR.x, sTR.y);
        ctx!.lineTo(sBR.x, sBR.y);
        ctx!.lineTo(sBL.x, sBL.y);
        ctx!.closePath();
        ctx!.fillStyle = "#0e400e";
        ctx!.fill();
      }

      const cMidT = project(0, -pHeight / 2, 0);
      const cMidB = project(0, pHeight / 2, 0);
      ctx!.beginPath();
      ctx!.moveTo(cMidT.x, cMidT.y);
      ctx!.lineTo(cMidB.x, cMidB.y);
      ctx!.stroke();

      ctx!.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.2) {
        const cx = Math.cos(a) * 45;
        const cy = Math.sin(a) * 45;
        const pt = project(cx, cy, 0);
        if (a === 0) ctx!.moveTo(pt.x, pt.y);
        else ctx!.lineTo(pt.x, pt.y);
      }
      ctx!.closePath();
      ctx!.stroke();

      const l1 = project(-pWidth / 2, -60, 0);
      const l2 = project(-pWidth / 2 + 70, -60, 0);
      const l3 = project(-pWidth / 2 + 70, 60, 0);
      const l4 = project(-pWidth / 2, 60, 0);
      ctx!.beginPath();
      ctx!.moveTo(l1.x, l1.y);
      ctx!.lineTo(l2.x, l2.y);
      ctx!.lineTo(l3.x, l3.y);
      ctx!.lineTo(l4.x, l4.y);
      ctx!.stroke();

      const r1 = project(pWidth / 2, -60, 0);
      const r2 = project(pWidth / 2 - 70, -60, 0);
      const r3 = project(pWidth / 2 - 70, 60, 0);
      const r4 = project(pWidth / 2, 60, 0);
      ctx!.beginPath();
      ctx!.moveTo(r1.x, r1.y);
      ctx!.lineTo(r2.x, r2.y);
      ctx!.lineTo(r3.x, r3.y);
      ctx!.lineTo(r4.x, r4.y);
      ctx!.stroke();

      players.forEach((p) => {
        const pt = project(p.x, p.y, 0);
        ctx!.beginPath();
        ctx!.ellipse(pt.x, pt.y, 8, 4, 0, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(0,0,0,0.35)";
        ctx!.fill();
      });

      const bShadow = project(ball.x, ball.y, 0);
      const shadowRadius = Math.max(2, 6 - ball.z * 0.1);
      ctx!.beginPath();
      ctx!.ellipse(
        bShadow.x,
        bShadow.y,
        shadowRadius * 1.5,
        shadowRadius * 0.8,
        0,
        0,
        Math.PI * 2,
      );
      ctx!.fillStyle = "rgba(0,0,0,0.45)";
      ctx!.fill();

      const glB1 = project(-pWidth / 2, -35, 0);
      const glB2 = project(-pWidth / 2, 35, 0);
      const glT1 = project(-pWidth / 2, -35, 25);
      const glT2 = project(-pWidth / 2, 35, 25);
      ctx!.strokeStyle = "rgba(255,255,255,0.75)";
      ctx!.lineWidth = 3;
      ctx!.beginPath();
      ctx!.moveTo(glB1.x, glB1.y);
      ctx!.lineTo(glT1.x, glT1.y);
      ctx!.lineTo(glT2.x, glT2.y);
      ctx!.lineTo(glB2.x, glB2.y);
      ctx!.stroke();

      const grB1 = project(pWidth / 2, -35, 0);
      const grB2 = project(pWidth / 2, 35, 0);
      const grT1 = project(pWidth / 2, -35, 25);
      const grT2 = project(pWidth / 2, 35, 25);
      ctx!.beginPath();
      ctx!.moveTo(grB1.x, grB1.y);
      ctx!.lineTo(grT1.x, grT1.y);
      ctx!.lineTo(grT2.x, grT2.y);
      ctx!.lineTo(grB2.x, grB2.y);
      ctx!.stroke();

      const entities = [
        ...players.map((p, idx) => ({
          type: "player",
          y: p.y,
          data: p,
          key: idx,
        })),
        { type: "ball", y: ball.y, data: ball, key: 99 },
      ].sort((a, b) => a.y - b.y);

      entities.forEach((ent) => {
        if (ent.type === "player") {
          const p = ent.data as Player;
          const pt = project(p.x, p.y, 0);

          ctx!.beginPath();
          ctx!.moveTo(pt.x - 5, pt.y);
          ctx!.lineTo(pt.x - 4, pt.y - 20);
          ctx!.lineTo(pt.x + 4, pt.y - 20);
          ctx!.lineTo(pt.x + 5, pt.y);
          ctx!.closePath();
          ctx!.fillStyle = p.team === "blue" ? "#3b82f6" : "#ef4444";
          ctx!.fill();
          ctx!.strokeStyle = "#fff";
          ctx!.lineWidth = 1.5;
          ctx!.stroke();

          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y - 24, 4.5, 0, Math.PI * 2);
          ctx!.fillStyle = "#fbcfe8";
          ctx!.fill();
          ctx!.stroke();

          if (p.number === 10 && p.team === "blue") {
            ctx!.beginPath();
            ctx!.arc(pt.x, pt.y - 34, 3, 0, Math.PI * 2);
            ctx!.fillStyle = "#f5b041";
            ctx!.fill();
          }

          ctx!.fillStyle = "#fff";
          ctx!.font = "bold 7px sans-serif";
          ctx!.textAlign = "center";
          ctx!.fillText(p.number.toString(), pt.x, pt.y - 7);
        } else {
          const b = ent.data as Ball;
          const pt = project(b.x, b.y, b.z);
          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx!.fillStyle = "#fff";
          ctx!.fill();
          ctx!.strokeStyle = "#000";
          ctx!.lineWidth = 1.2;
          ctx!.stroke();

          ctx!.beginPath();
          ctx!.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx!.fillStyle = "#000";
          ctx!.fill();
        }
      });
    }

    function tick() {
      update();
      draw();
      animationId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(animationId);
  }, [score.blue, score.red, goalText]);

  return (
    <div className="w-full h-full flex flex-col gap-4 relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/85 border border-[#f5b041]/40 px-6 py-2.5 rounded-sm flex items-center justify-between gap-6 z-30 font-mono shadow-[0_0_15px_rgba(245,176,65,0.15)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-[10px] text-foreground/80 uppercase font-bold tracking-widest">
            BLUE TEAM
          </span>
        </div>
        <span className="text-xl text-[#f5b041] font-bold">
          {score.blue} - {score.red}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground/80 uppercase font-bold tracking-widest">
            RED TEAM
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        </div>
      </div>

      {goalText && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-40 animate-pulse">
          <div className="text-center">
            <h2 className="text-4xl font-serif text-[#f5b041] text-gold-glow uppercase tracking-[0.1em] font-extrabold animate-bounce mb-2">
              {goalText}
            </h2>
            <p className="text-[10px] font-mono text-white/60 tracking-wider">
              RESETTING BALL POSITIONS...
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 bg-black/60 rounded-sm overflow-hidden min-h-[440px] relative border border-white/5 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={640}
          height={440}
          className="w-full h-full object-contain"
        />

        <div className="absolute bottom-4 left-4 bg-black/85 border border-white/10 px-4 py-2.5 rounded-sm font-mono text-[9px] text-foreground/70 flex flex-col gap-1 z-30 leading-relaxed shadow-lg">
          <div className="flex gap-2">
            <span className="text-[#00f5d4] font-bold">
              🎮 INTERACTIVE 3D PLAYGROUND
            </span>
          </div>
          <div>
            · Move Blue Striker (10):{" "}
            <span className="text-white font-semibold">Arrow Keys</span> or{" "}
            <span className="text-white font-semibold">WASD</span>
          </div>
          <div>
            · Shoot / Kick ball:{" "}
            <span className="text-white font-semibold">Spacebar</span>
          </div>
          <div className="text-[8px] text-[#f5b041] mt-1 font-semibold animate-pulse">
            👉 KICK THE BALL INTO THE RED GOAL!
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveMap({
  gates = [],
  transport = [],
  weather = "Clear",
  activeIncident = "none",
}: InteractiveMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>("crowd");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [egressSimActive, setEgressSimActive] = useState(false);

  // Helper for isometric projection (3D football pitch lines)
  const projectSVG = (px: number, py: number) => {
    const isoX = (px - py) * 0.866;
    const isoY = (px + py) * 0.5 * 0.65;
    return `${350 + isoX},${260 + isoY}`;
  };

  // Generate path points for center circle
  const getCenterCirclePath = () => {
    const points = [];
    for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.25) {
      const cx = Math.cos(a) * 16;
      const cy = Math.sin(a) * 16;
      points.push(projectSVG(cx, cy));
    }
    return `M ${points.join(" L ")}`;
  };

  // Core Map Hotspots
  const hotspots: Hotspot[] = [
    {
      id: "gate-1",
      name: "Gate 1 — North Concourse",
      x: 350,
      y: 100,
      layers: ["crowd", "accessibility"],
      info: "Current flow: 420 fans/min. Wait time: ~3 mins.",
      status: "nominal",
      aiRec: "Optimal entry point. Directing northern shuttle arrivals here.",
    },
    {
      id: "gate-4",
      name: "Gate 4 — West Plaza",
      x: 120,
      y: 280,
      layers: ["crowd", "transit"],
      info:
        activeIncident === "storm"
          ? "Heavy bottleneck due to wind. Ingress: 890 fans/min."
          : activeIncident === "crowd_surge"
            ? "CRITICAL PRESSURE POINT: Ingress exceeds 95% threshold!"
            : "Current flow: 680 fans/min. Wait time: ~12 mins.",
      status:
        activeIncident === "crowd_surge"
          ? "critical"
          : activeIncident === "storm"
            ? "warning"
            : "warning",
      aiRec:
        activeIncident === "crowd_surge"
          ? "AI Action: Emergency Overflow Gate 4B opened. Rerouting arriving parking shuttles to Gate 6."
          : "Monitor queuing. Digital screens redirecting to Gate 6.",
    },
    {
      id: "gate-6",
      name: "Gate 6 — Family Entrance",
      x: 220,
      y: 430,
      layers: ["crowd", "accessibility"],
      info: "Current flow: 150 fans/min. Wait time: ~1 min.",
      status: "nominal",
      aiRec:
        "Nominal operations. Displaying family mascot greetings on screens.",
    },
    {
      id: "gate-9",
      name: "Gate 9 — VIP South",
      x: 580,
      y: 430,
      layers: ["crowd", "sustainability"],
      info: "Current flow: 110 fans/min. Solar energy battery hub located here.",
      status: "nominal",
      aiRec: "Optimized VIP scan lane active. Energy storage at 85%.",
    },
    {
      id: "gate-12",
      name: "Gate 12 — Accessible Entrance",
      x: 580,
      y: 180,
      layers: ["crowd", "accessibility"],
      info: "Equipped with step-free elevators, tactile paths, and low-counter ticketing desks.",
      status: "nominal",
      aiRec: "Direct path to accessible tiers 104-108 confirmed clear.",
    },
    {
      id: "gate-14",
      name: "Gate 14 — East Concourse",
      x: 480,
      y: 350,
      layers: ["crowd", "transit"],
      info:
        activeIncident === "crowd_surge"
          ? "CRITICAL PRESSURE POINT: Queue overflow."
          : "Current flow: 520 fans/min. Wait time: ~8 mins.",
      status: activeIncident === "crowd_surge" ? "critical" : "nominal",
      aiRec:
        activeIncident === "crowd_surge"
          ? "AI Action: Kiosk Desk 6 opened. Sending safety stewards for lane guidance."
          : "Flow balanced. Commending transit shuttle loop for timely dropoffs.",
    },
    {
      id: "transit-metro",
      name: "Gold Line Subway Station",
      x: 80,
      y: 120,
      layers: ["transit"],
      info:
        activeIncident === "transit_disruption"
          ? "Metro Gold Line service SUSPENDED. Signal failure."
          : "Intervals: 4 mins. Operating at nominal capacity.",
      status: activeIncident === "transit_disruption" ? "critical" : "nominal",
      aiRec:
        activeIncident === "transit_disruption"
          ? "AI Action: Dispatched 12 extra buses. Routing fans via Rideshare Zone B."
          : "Train capacity nominal. Digital display synchronized.",
    },
    {
      id: "solar-roof",
      name: "Solar Panel Array Roof",
      x: 350,
      y: 280,
      layers: ["sustainability"],
      info:
        activeIncident === "grid_failure"
          ? "Primary grid down. Solar array exporting 100% output to backup batteries."
          : "Generating 1.2MW. Supplying 34% of active stadium lighting.",
      status: activeIncident === "grid_failure" ? "warning" : "nominal",
      aiRec: "Optimizing solar angle. Battery reserve checks pass.",
    },
    {
      id: "water-reclaim",
      name: "Water Reclamation Storage",
      x: 350,
      y: 470,
      layers: ["sustainability"],
      info:
        activeIncident === "storm"
          ? "Storm collector running at peak capacity. Rain filtration active."
          : "Holding 850k liters. Supplying zero-potable flush water to all tiers.",
      status: "nominal",
      aiRec: "Reclaimed water levels nominal. Savings of 42k liters today.",
    },
    {
      id: "elevator-west",
      name: "Concierge Elevator Block West",
      x: 180,
      y: 220,
      layers: ["accessibility"],
      info: "Four dual-platform elevators serving tiers 1 to 4.",
      status: "nominal",
      aiRec:
        "Elevator sensors report 100% uptime. Braille and voice guides functional.",
    },
  ];

  const filteredHotspots = hotspots.filter((h) =>
    h.layers.includes(activeLayer),
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
      {/* Map Control Board */}
      <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
        <div>
          <span className="text-[10px] font-mono text-secondary uppercase tracking-[0.2em] mb-1 block font-semibold">
            Telemetry Data Layer
          </span>
          <h3 className="font-serif text-2xl text-foreground">
            Spatial Analysis Mapping
          </h3>
          <p className="text-xs text-foreground/60 mt-1 font-light leading-relaxed">
            Select telemetry overlays to analyze real-time spatial logistics,
            egress channels, and GenAI resource dispatch coordinates.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-col gap-2.5">
          {(
            [
              "crowd",
              "transit",
              "accessibility",
              "sustainability",
              "match3d",
            ] as MapLayer[]
          ).map((layer) => (
            <button
              key={layer}
              onClick={() => {
                setActiveLayer(layer);
                setSelectedHotspot(null);
              }}
              className={`w-full p-4 border rounded-sm flex items-center justify-between text-left transition-all ${
                activeLayer === layer
                  ? "bg-secondary/15 border-secondary text-foreground font-medium"
                  : "bg-card/45 border-white/10 text-foreground/60 hover:text-secondary hover:border-secondary/40"
              }`}
            >
              <span className="text-xs uppercase tracking-wider font-mono">
                {layer === "crowd" && "📊 Crowd Density"}
                {layer === "transit" && "🚇 Transit Logistics"}
                {layer === "accessibility" && "♿ ADA Accessibility"}
                {layer === "sustainability" && "🌱 Solar Power Matrix"}
                {layer === "match3d" && "⚽ Interactive 3D Match"}
              </span>
              <div
                className={`w-1.5 h-1.5 rounded-full ${activeLayer === layer ? "bg-secondary animate-pulse" : "bg-foreground/20"}`}
              />
            </button>
          ))}
        </div>

        {/* Simulation Controls */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-foreground/45 uppercase tracking-[0.2em] mb-1 block font-medium">
            Logistics Simulation
          </span>
          <button
            onClick={() => setEgressSimActive(!egressSimActive)}
            className={`w-full p-4 border rounded-sm flex items-center justify-between text-left transition-all ${
              egressSimActive
                ? "bg-secondary/15 border-secondary text-secondary shadow-[0_0_12px_rgba(46,204,113,0.15)] font-bold"
                : "bg-card/40 border-white/10 text-foreground/60 hover:text-secondary hover:border-secondary/40"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider font-mono">
              🏃 Egress Flow Simulation
            </span>
            <span
              className={`w-2 h-2 rounded-full ${egressSimActive ? "bg-secondary animate-ping" : "bg-foreground/20"}`}
            />
          </button>
        </div>

        {/* Selected Point Info Panel */}
        <div className="flex-1 glass-panel p-5 rounded-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none rounded-bl-full" />
          <AnimatePresence mode="wait">
            {selectedHotspot ? (
              <motion.div
                key={selectedHotspot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {selectedHotspot.name}
                  </h4>
                  <span
                    className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border ${
                      selectedHotspot.status === "critical"
                        ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                        : selectedHotspot.status === "warning"
                          ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                    }`}
                  >
                    {selectedHotspot.status}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 font-light leading-relaxed">
                  {selectedHotspot.info}
                </p>
                <div className="border-t border-primary/10 pt-3 mt-1 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-primary uppercase font-mono tracking-wider">
                    <Battery className="w-3.5 h-3.5 shrink-0" />
                    <span>GenAI Recommendation</span>
                  </div>
                  <p className="text-[11px] text-foreground/75 leading-relaxed font-light italic">
                    {selectedHotspot.aiRec}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-4 gap-2"
              >
                <Info className="w-6 h-6 text-foreground/20" />
                <span className="text-xs text-foreground/40 font-mono uppercase tracking-wider">
                  Select coordinate node
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Map Graphics Canvas */}
      <div className="flex-1 glass-panel p-6 rounded-sm min-h-[480px] flex items-center justify-center relative overflow-hidden bg-black/40">
        {activeLayer === "match3d" ? (
          <Match3DGame />
        ) : (
          <>
            {/* Layer Active Indicator Badge */}
            <div className="absolute top-4 left-4 bg-black/60 border border-white/10 px-3 py-1.5 rounded-sm flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-foreground/60">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span>Overlay: {activeLayer}</span>
            </div>

            {/* Live Weather Indicator */}
            <div className="absolute top-4 right-4 bg-black/60 border border-white/10 px-3 py-1.5 rounded-sm flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-foreground/60">
              <span>Weather: {weather}</span>
            </div>

            <svg
              viewBox="0 0 700 520"
              className="w-full max-w-[620px] aspect-[70/52] text-foreground select-none"
            >
              <defs>
                <radialGradient id="stadiumGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(46, 204, 113, 0.05)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </radialGradient>
                <radialGradient id="fieldGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(46, 204, 113, 0.15)" />
                  <stop offset="100%" stopColor="rgba(46, 204, 113, 0)" />
                </radialGradient>
                <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.55)" />
                  <stop offset="60%" stopColor="rgba(239, 68, 68, 0.2)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
                </radialGradient>
                <radialGradient id="heatWarning" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(245, 120, 65, 0.55)" />
                  <stop offset="60%" stopColor="rgba(245, 120, 65, 0.2)" />
                  <stop offset="100%" stopColor="rgba(245, 120, 65, 0)" />
                </radialGradient>
              </defs>

              {/* Outer glow aura */}
              <ellipse
                cx="350"
                cy="260"
                rx="300"
                ry="210"
                fill="url(#stadiumGlow)"
              />

              {/* Outer Transit Routes (Roads / Tracks) */}
              <AnimatePresence>
                {activeLayer === "transit" && (
                  <motion.g
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Metro Line Track */}
                    <path
                      d="M 50,50 L 50,450"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="10 6"
                      className={
                        activeIncident === "transit_disruption"
                          ? "text-red-500 stroke-red-500"
                          : ""
                      }
                    />
                    {/* Shuttle Bus Loop */}
                    <rect
                      x="70"
                      y="60"
                      width="560"
                      height="380"
                      rx="60"
                      stroke="rgba(46, 204, 113, 0.25)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="12 8"
                    />
                    {/* Shuttle animation blobs */}
                    <circle
                      cx="200"
                      cy="60"
                      r="4"
                      fill="var(--color-secondary)"
                      className="animate-pulse"
                    />
                    <circle
                      cx="500"
                      cy="440"
                      r="4"
                      fill="var(--color-secondary)"
                      className="animate-pulse"
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Outer Stadium Wall */}
              <ellipse
                cx="350"
                cy="260"
                rx="240"
                ry="170"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="2"
              />

              {/* Concourse Walkways */}
              <ellipse
                cx="350"
                cy="260"
                rx="210"
                ry="145"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="15"
                strokeDasharray="20 10"
              />

              {/* Accessibility Ramp Indicators */}
              <AnimatePresence>
                {activeLayer === "accessibility" && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Ramps highlight path */}
                    <path
                      d="M 120,280 L 160,260 L 220,430"
                      stroke="rgba(46, 204, 113, 0.4)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5 5"
                    />
                    <path
                      d="M 580,180 L 520,230 L 480,350"
                      stroke="rgba(46, 204, 113, 0.4)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5 5"
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Stadium Inner Bowl Tier 1 */}
              <ellipse
                cx="350"
                cy="260"
                rx="180"
                ry="120"
                fill="#030403"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="3"
              />

              {/* Stadium Seating Sections Lines */}
              <line
                x1="350"
                y1="140"
                x2="350"
                y2="90"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
              <line
                x1="350"
                y1="380"
                x2="350"
                y2="430"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
              <line
                x1="170"
                y1="260"
                x2="110"
                y2="260"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
              <line
                x1="530"
                y1="260"
                x2="590"
                y2="260"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />

              {/* Inner Bowl Tier 2 */}
              <ellipse
                cx="350"
                cy="260"
                rx="140"
                ry="90"
                fill="#050705"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
              />

              {/* Field Glow Area */}
              <ellipse
                cx="350"
                cy="260"
                rx="90"
                ry="55"
                fill="url(#fieldGlow)"
              />

              {/* Sleek Isometric 3D Pitch Map in glowing gold lines */}
              <path
                d={`M ${projectSVG(-80, -45)} L ${projectSVG(80, -45)} L ${projectSVG(80, 45)} L ${projectSVG(-80, 45)} Z`}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              />
              {/* Mid Line */}
              <path
                d={`M ${projectSVG(0, -45)} L ${projectSVG(0, 45)}`}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              />
              {/* Center Circle */}
              <path
                d={getCenterCirclePath()}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              />
              {/* Left Goal Area */}
              <path
                d={`M ${projectSVG(-80, -20)} L ${projectSVG(-65, -20)} L ${projectSVG(-65, 20)} L ${projectSVG(-80, 20)}`}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.2"
                className="drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]"
              />
              {/* Right Goal Area */}
              <path
                d={`M ${projectSVG(80, -20)} L ${projectSVG(65, -20)} L ${projectSVG(65, 20)} L ${projectSVG(80, 20)}`}
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.2"
                className="drop-shadow-[0_0_6px_rgba(212,175,55,0.3)]"
              />

              {/* Dynamic GenAI Heatmap Overlay */}
              {activeLayer === "crowd" && (
                <g className="pointer-events-none">
                  {/* Heat blobs near congested gates */}
                  <circle
                    cx="120"
                    cy="280"
                    r="45"
                    fill="url(#heatCritical)"
                    className="heat-blob"
                  />
                  <circle
                    cx="480"
                    cy="350"
                    r="40"
                    fill="url(#heatWarning)"
                    className="heat-blob"
                    style={{ animationDelay: "1s" }}
                  />
                  {/* Heat blobs on the pitch itself */}
                  <circle
                    cx="350"
                    cy="260"
                    r="50"
                    fill="url(#heatCritical)"
                    className="heat-blob"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <circle
                    cx={350 + 40 * 0.866}
                    cy={260 + 40 * 0.5 * 0.65}
                    r="35"
                    fill="url(#heatWarning)"
                    className="heat-blob"
                    style={{ animationDelay: "1.5s" }}
                  />
                  <circle
                    cx={350 - 40 * 0.866}
                    cy={260 - 40 * 0.5 * 0.65}
                    r="35"
                    fill="url(#heatWarning)"
                    className="heat-blob"
                    style={{ animationDelay: "2.5s" }}
                  />
                </g>
              )}

              {/* Outward Egress Simulation Pathways */}
              <AnimatePresence>
                {egressSimActive && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Outward Egress paths to Gate 1, 4, 9, 14 */}
                    <path
                      d="M 350,260 L 350,110"
                      stroke="var(--color-secondary)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeDasharray="8 6"
                      className="animate-map-dash"
                    />
                    <path
                      d="M 350,260 L 130,280"
                      stroke="var(--color-secondary)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeDasharray="8 6"
                      className="animate-map-dash"
                    />
                    <path
                      d="M 350,260 L 580,280"
                      stroke="var(--color-secondary)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeDasharray="8 6"
                      className="animate-map-dash"
                    />
                    <path
                      d="M 350,260 L 350,420"
                      stroke="var(--color-secondary)"
                      strokeWidth="3.5"
                      fill="none"
                      strokeDasharray="8 6"
                      className="animate-map-dash"
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Sustainability solar generation indicators */}
              <AnimatePresence>
                {activeLayer === "sustainability" && (
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Highlight Solar Panel Arrays on Stadium Roof */}
                    <path
                      d="M 230,110 A 150,90 0 0,1 470,110"
                      fill="none"
                      stroke="rgba(255, 145, 0, 0.4)"
                      strokeWidth="6"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M 230,410 A 150,90 0 0,0 470,410"
                      fill="none"
                      stroke="rgba(255, 145, 0, 0.4)"
                      strokeWidth="6"
                      strokeDasharray="3 3"
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              {/* Interactive Hotspot Node Markers */}
              {filteredHotspots.map((hotspot) => {
                const isSelected = selectedHotspot?.id === hotspot.id;

                // Choose color depending on status
                let color = "text-primary border-primary";
                let bgFill = "rgba(212, 175, 55, 0.2)";
                let coreColor = "bg-primary";

                if (hotspot.status === "critical") {
                  color = "text-red-500 border-red-500";
                  bgFill = "rgba(255, 23, 68, 0.3)";
                  coreColor = "bg-red-500";
                } else if (hotspot.status === "warning") {
                  color = "text-orange-500 border-orange-500";
                  bgFill = "rgba(255, 145, 0, 0.3)";
                  coreColor = "bg-orange-500";
                } else if (activeLayer === "accessibility") {
                  color = "text-secondary border-secondary";
                  bgFill = "rgba(0, 230, 118, 0.2)";
                  coreColor = "bg-secondary";
                }

                return (
                  <g
                    key={hotspot.id}
                    transform={`translate(${hotspot.x}, ${hotspot.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedHotspot(hotspot)}
                  >
                    {/* Ripple ring for active/congested nodes */}
                    {(hotspot.status === "critical" ||
                      hotspot.status === "warning" ||
                      isSelected) && (
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? "16" : "12"}
                        fill="none"
                        stroke={
                          hotspot.status === "critical"
                            ? "#ff1744"
                            : hotspot.status === "warning"
                              ? "#ff9100"
                              : "var(--color-primary)"
                        }
                        strokeWidth="1.5"
                        className="animate-ping"
                        style={{ animationDuration: "2s" }}
                      />
                    )}

                    {/* Outer Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? "9" : "7"}
                      fill="#020403"
                      stroke={
                        hotspot.status === "critical"
                          ? "#ff1744"
                          : hotspot.status === "warning"
                            ? "#ff9100"
                            : activeLayer === "accessibility"
                              ? "var(--color-secondary)"
                              : "var(--color-primary)"
                      }
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      className="transition-all duration-300 group-hover:scale-125"
                    />

                    {/* Inner Core */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? "4.5" : "3.5"}
                      className={`transition-all ${coreColor}`}
                    />

                    {/* Text Label on Hover */}
                    <rect
                      x="-60"
                      y="-26"
                      width="120"
                      height="16"
                      fill="rgba(0,0,0,0.85)"
                      stroke="rgba(212,175,55,0.3)"
                      strokeWidth="0.5"
                      rx="2"
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    />
                    <text
                      x="0"
                      y="-15"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="7.5"
                      fontFamily="monospace"
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      {hotspot.id.replace("gate-", "Gate ").toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Compass decal in corner */}
            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 items-center font-mono text-[9px] text-foreground/30">
              <Compass className="w-6 h-6 text-foreground/20 animate-spin-slow" />
              <span>STAD.N 52°</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
