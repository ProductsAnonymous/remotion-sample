# AI Skill Tutor — Marketing Reel (Remotion)

A 30-second vertical reel-style video for promoting Halight's **AI Skill Tutor** feature. Built with [Remotion](https://remotion.dev) and `@remotion/transitions`.

---

## Quick Start

```bash
npm install
npx remotion studio     # Preview in browser
npx remotion render src/index.tsx AITutorReel out/reel.mp4   # Render to MP4
```

### Render as GIF (for social preview)

```bash
npx remotion render src/index.tsx AITutorReel out/reel.gif --image-format=png
```

---

## Video Specs

| Property       | Value              |
| -------------- | ------------------ |
| Resolution     | 1080 × 1920 (9:16) |
| FPS            | 30                 |
| Duration       | 30 seconds         |
| Total Frames   | 900                |
| Format         | Vertical reel      |

---

## Scene Breakdown

| #   | Scene              | Duration | Frames    | Transition In        | Description                                       |
| --- | ------------------ | -------- | --------- | -------------------- | ------------------------------------------------- |
| 1   | **Hook**           | 5s       | 0–150     | —                    | "Corporate learning is broken." → strikethrough → "Let's fix that." |
| 2   | **Problem**        | 7s       | 150–360   | Slide (from bottom)  | Three pain-point cards animate in: static courses, seat-time metrics, no adaptation |
| 3   | **Product Intro**  | 6s       | 360–540   | Fade                 | Logo reveal + "AI Skill Tutor by Halight" + tagline |
| 4   | **Features**       | 7s       | 540–750   | Wipe (from left)     | Four feature cards: Dynamic Lessons, Adaptive Mastery, Voice-First, Personalized Paths |
| 5   | **Skill Graph**    | 4s       | 750–870   | Slide (from right)   | Animated node graph showing Skill → Topics → Lessons |
| 6   | **CTA**            | 4s       | 870–990   | Fade                 | "Stop teaching. Start assuring." + demo button |

---

## Design System

- **Aesthetic**: Dark, cinematic with glowing accents — inspired by product marketing reels from Figma, Linear, and Vercel
- **Primary accent**: `#00E5A0` (vibrant mint green)
- **Secondary**: `#7B61FF` (purple), `#FF6B6B` (coral)
- **Typography**: SF Pro Display system stack
- **Effects**: Animated mesh gradient backgrounds, grain overlay, floating particles, spring-based text reveals

---

## Transitions Used (`@remotion/transitions`)

- `slide({ direction: "from-bottom" })` — Scene 1 → 2
- `fade()` — Scene 2 → 3, Scene 5 → 6
- `wipe({ direction: "from-left" })` — Scene 3 → 4
- `slide({ direction: "from-right" })` — Scene 4 → 5

---

## Customization

### Change duration
Edit `durationInFrames` per `TransitionSeries.Sequence` in `AITutorReel.tsx`. Total composition duration in `index.tsx`.

### Change colors
Edit the `COLORS` object at the top of `AITutorReel.tsx`.

### Add audio
```tsx
import { Audio } from "remotion";
// Add inside AITutorReel component:
<Audio src={staticFile("music.mp3")} volume={0.3} />
```

### Add voiceover
Drop an MP3 into `public/` and add a second `<Audio>` element with volume 1.0.

---

## File Structure

```
ai-tutor-video/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.tsx          # Remotion composition root
    └── AITutorReel.tsx    # All scenes, transitions, and animations
```
