# FIFA 2026 World Cup - GenAI Smart Stadium

A visionary, cinematic, and GenAI-powered Smart Stadium Operations & Fan Assistance platform built for the 2026 FIFA World Cup. This application fuses cutting-edge generative AI capabilities with a breathtaking "Golden Era" cinematic sports aesthetic.

## 🏆 Chosen Vertical
* **Vertical**: **Sports Tech, Venue Management, & Fan Hospitality**
* **Project Title**: **FIFA 2026 GenAI Smart Stadium Platform**
* **Target Audience**: Tournament Directors, Stadium Operators (B2B Command Center), and Global Football Fans (B2C Hospitality).

---

## 🎨 Approach & Logic

### 1. The "Golden Era Cinematic" Aesthetic
Rather than building a standard corporate dashboard, the UI is treated like a high-budget film production to evoke the nostalgic feel of 90s sports cinema:
- **Obsidian & Emerald Palette**: Backgrounds feature Obsidian Black (`#0A0A0A`) with subtle, warm radial gradients of Emerald Pitch Green (`#0F291E`).
- **Metallic Gold Accents**: Highlights, borders, and interactive elements leverage Vintage Gold (`#D4AF37`) and brushed brass.
- **Volumetric Tungsten Glow**: Warm, tungsten-like glows (`box-shadow`) sit behind active cards, mimicking stadium floodlights.
- **Film Grain Overlay**: A global, subtle fixed SVG noise filter overlay runs across the viewport.
- **Nostalgic Typography**: Primary headings use a heavy serif font (*Playfair Display*) mimicking historic matchday posters, while body text uses a crisp sans-serif (*Space Grotesk*) for clean readouts of AI logs.

### 2. GenAI & Telemetry Integration
- **Cognitive Operations Brief**: Dynamically synthesizes real-time sensor streams (weather, energy, gate queues, transit lines) to emit prioritized operational directives.
- **Incident Command Simulator**: Allows operators to trigger simulated emergencies (Storms, Transit Outages, Grid Failures, Crowd Surges) to observe the AI co-pilot rerouting fan transit lines and concourse signage in real-time.
- **Bespoke Vision Scanner**: Emulates Gemini Vision capabilities to verify matchday ticket QR codes or perform biometric face entry scans via the fan's webcam.
- **Multilingual Concierge Assistant**: Classifies fan intents (navigation, accessibility, transportation, ticketing, general) across English, Spanish, French, Portuguese, Japanese, and Arabic, responding in the fan's native language with real-time translation sweep scans.

---

## ⚙️ How the Solution Works

### 1. Frontend Architecture (React + Vite + Tailwind CSS + Framer Motion)
- **Cinematic Hero**: Autoplays and loops a background video overlaid with a warm radial vignette. Headline text staggers in letter-by-letter, moving from a camera-lens blur to sharp focus. Features a custom glassmorphic toggle switch CTA.
- **Interactive 3D Tactical Pitch Map**: Projects 2D stadium coordinate boundaries into a flat 3D isometric perspective. Features gold-lined pitch decals, click-interactive hotspots, and dynamic, breathing red and orange heatmap overlays to highlight crowd bottlenecks.
- **VIP Hospitality Hub**: Features cursor-spotlight tracking and 3D parallax tilting cards. Incorporates custom SVGs (a soccer ball morphing into a globe, and a ticket stub emitting a QR code). Displays a gold-scanning laser sweep animation when translation results are loaded.
- **Accessibility Integration**: Built with WCAG AA compliance (Skip-to-Content bypass link, keyboard focus-visible rings, Large Text toggle, and High Contrast mode).

### 2. Backend Architecture (Express 5 + TypeScript)
- **Live Telemetry Stream**: Serves simulated stadium state parameters, drifting telemetry values on each request to mimic real-world IoT sensors.
- **Intent Classifier & Translator**: Heuristically classifies languages, translates requests, generates context-grounded concierge answers, and translates the output.
- **Gemini Vision Gate Integration**: Supports a webcam image upload endpoint to authenticate biometric access or ticket QR passes.

---

## 💡 Assumptions Made
1. **Telemetry Drift**: Sensory inputs (energy draw, transit wait times) drift in-memory to emulate active matchday traffic. No persistent SQL writes are required for this telemetry.
2. **Vision Fallback**: If no `GEMINI_API_KEY` environment variable is defined, the webcam scan endpoint gracefully falls back to a simulated image analysis result.
3. **Reduced Motion**: Respects user browser preferences (`prefers-reduced-motion: reduce`) by disabling transition scales and staggered letter animations.

---

## 🚀 Local Installation & Running

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
2. **Build Packages**:
   ```bash
   pnpm run build
   ```
3. **Run API Server (Port 5000)**:
   ```bash
   pnpm --filter @workspace/api-server run start
   ```
4. **Run Vite Frontend (Port 3000)**:
   ```bash
   pnpm --filter @workspace/smart-stadium run dev
   ```
5. **Typecheck Code**:
   ```bash
   pnpm run typecheck
   ```

---

## ⚡ Vercel Deployment

Since this project is managed as a `pnpm` monorepo, follow these steps to host the frontend on **Vercel**:

1. Log in to the [Vercel Dashboard](https://vercel.com) and click **Add New > Project**.
2. Import the public GitHub repository: **`Priyanka11-source/fifa`**.
3. In the project configure settings:
   - **Framework Preset**: Select **`Vite`**.
   - **Root Directory**: Select **`artifacts/smart-stadium`**.
   - **Build Command**: Set to `pnpm run build` (or leave as default, Vercel automatically runs the build).
   - **Output Directory**: Vercel will build into `dist/public` based on the Vite config. Set the output directory override to **`dist/public`** if prompted.
4. Add any required environment variables (e.g. `GEMINI_API_KEY` for vision scanning and translation support).
5. Click **Deploy**!

