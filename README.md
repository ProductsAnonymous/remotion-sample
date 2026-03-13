# AI Skill Tutor — Marketing Reel (Remotion)

A ~30-second vertical reel-style video for promoting Halight's **AI Skill Tutor** feature.
Built with [Remotion](https://remotion.dev) v4 and `@remotion/transitions`.

---

## Prerequisites

- **Node.js** ≥ 18 (22 recommended)
- **npm** or **bun**
- **Chrome/Chromium** (Remotion uses headless Chrome to render frames)

---

## Setup & Render

```bash
# 1. Install dependencies
npm install        # or: bun install

# 2. Preview in browser (interactive studio)
npm run studio

# 3. Render to MP4
npm run render
# → outputs to out/reel.mp4

# 4. Render as GIF (optional, for previews)
npm run render:gif
# → outputs to out/reel.gif
```

The final MP4 at `out/reel.mp4` is ready to upload to Instagram Reels, TikTok, YouTube Shorts, or LinkedIn.

---

## Video Specs

| Property       | Value              |
| -------------- | ------------------ |
| Resolution     | 1080 × 1920 (9:16) |
| FPS            | 30                 |
| Duration       | ~30.5 seconds      |
| Total Frames   | 915                |
| Format         | Vertical reel      |

---

## Scene Breakdown

| #   | Scene              | Duration | Transition In        | Description                                       |
| --- | ------------------ | -------- | -------------------- | ------------------------------------------------- |
| 1   | **Hook**           | 5s       | —                    | "Corporate learning is broken." → strikethrough → "Let's fix that." |
| 2   | **Problem**        | 7s       | Slide (from bottom)  | Three pain-point cards: static courses, seat-time metrics, no adaptation |
| 3   | **Product Intro**  | 6s       | Fade                 | Logo reveal + "AI Skill Tutor by Halight" + tagline |
| 4   | **Features**       | 7s       | Wipe (from left)     | Four feature cards: Dynamic Lessons, Adaptive Mastery, Voice-First, Personalized Paths |
| 5   | **Skill Graph**    | 4s       | Slide (from right)   | Animated node graph: Skill → Topics → Lessons |
| 6   | **CTA**            | 4s       | Fade                 | "Stop teaching. Start assuring." + demo button |

---

## Customization

### Colors
Edit the `COLORS` object at the top of `src/AITutorReel.tsx`.

### Scene duration
Adjust `durationInFrames` on each `TransitionSeries.Sequence` in `AITutorReel.tsx`.
Then update `durationInFrames` in `src/index.tsx` to match the new total:
**total = sum of all sequence frames − sum of all transition frames**.

### Add background music
Place an MP3 in `public/` and add to `AITutorReel`:
```tsx
import { Audio, staticFile } from "remotion";
// Inside the component:
<Audio src={staticFile("music.mp3")} volume={0.3} />
```

### Add voiceover
Same approach — drop an MP3 and add a second `<Audio>` at full volume.

---

## File Structure

```
ai-tutor-video/
├── package.json
├── tsconfig.json
├── remotion.config.ts     ← CLI entry point config
├── README.md
└── src/
    ├── index.tsx           ← Composition registry (RemotionRoot)
    └── AITutorReel.tsx     ← All scenes, transitions, animations
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Could not find composition" | Make sure `remotion.config.ts` exists and points to `src/index.tsx` |
| Chrome not found | Install Chromium: `npx remotion browser ensure` |
| Slow render | Add `--concurrency=4` (or higher) to the render command |
| Black frames at end | Ensure `durationInFrames` in `index.tsx` matches TransitionSeries math |
