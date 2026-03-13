import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const COLORS = {
  bgDark: "#0A0A0F",
  bgDeep: "#0D0F1A",
  accent: "#00E5A0",
  accentGlow: "#00FFB2",
  accentDim: "#00B87A",
  purple: "#7B61FF",
  purpleGlow: "#9D85FF",
  coral: "#FF6B6B",
  white: "#FFFFFF",
  gray100: "#F0F0F5",
  gray400: "#8888A0",
  gray700: "#2A2A3E",
  gray900: "#12121E",
};

const FONT = {
  display: "'SF Pro Display', 'Helvetica Neue', -apple-system, sans-serif",
  mono: "'SF Mono', 'Fira Code', 'Courier New', monospace",
};

// ─── UTILITY: Animated gradient mesh background ──────────────────
const MeshBackground: React.FC<{
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
}> = ({
  color1 = COLORS.bgDark,
  color2 = "#0D1B2A",
  color3 = "#1B0D2A",
  speed = 0.5,
}) => {
  const frame = useCurrentFrame();
  const shift = frame * speed;
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at ${50 + Math.sin(shift * 0.02) * 20}% ${40 + Math.cos(shift * 0.015) * 15}%, ${color2} 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at ${60 + Math.cos(shift * 0.018) * 25}% ${65 + Math.sin(shift * 0.012) * 20}%, ${color3} 0%, transparent 70%),
          ${color1}
        `,
      }}
    />
  );
};

// ─── UTILITY: Grain overlay ──────────────────────────────────────
const GrainOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${frame % 10}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

// ─── UTILITY: Floating particles ─────────────────────────────────
const Particles: React.FC<{ count?: number; color?: string }> = ({
  count = 20,
  color = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i * 137.5) % 100,
        y: (i * 53.7) % 100,
        size: 2 + (i % 4) * 1.5,
        speed: 0.3 + (i % 5) * 0.15,
        delay: i * 7,
      })),
    [count]
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const y = (p.y + (frame + p.delay) * p.speed * 0.15) % 120 - 10;
        const opacity = interpolate(y, [0, 20, 80, 100], [0, 0.6, 0.6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: color,
              opacity,
              boxShadow: `0 0 ${p.size * 3}px ${color}40`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── UTILITY: Animated text reveal ───────────────────────────────
const TextReveal: React.FC<{
  text: string;
  startFrame: number;
  style?: React.CSSProperties;
  stagger?: number;
}> = ({ text, startFrame, style = {}, stagger = 2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 14px", ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * stagger;
        const progress = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 18, stiffness: 120 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: progress,
              transform: `translateY(${(1 - progress) * 30}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ─── UTILITY: Accent line ────────────────────────────────────────
const AccentLine: React.FC<{
  delay?: number;
  width?: string;
  color?: string;
}> = ({ delay = 0, width = "120px", color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });
  return (
    <div
      style={{
        height: 4,
        width,
        borderRadius: 2,
        background: `linear-gradient(90deg, ${color}, ${color}00)`,
        transform: `scaleX(${progress})`,
        transformOrigin: "left",
        marginTop: 16,
        marginBottom: 16,
      }}
    />
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENE 1: HOOK — "Learning is broken." (0–5s / frames 0–150)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const strikethrough = interpolate(frame, [60, 80], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fixedOpacity = spring({
    frame: frame - 85,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <MeshBackground color2="#1A0A0A" color3="#0A0A1A" />
      <Particles color={COLORS.coral} count={12} />
      <GrainOverlay />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
        }}
      >
        {/* Broken text */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <TextReveal
            text="Corporate learning is"
            startFrame={5}
            style={{
              fontFamily: FONT.display,
              fontSize: 64,
              fontWeight: 300,
              color: COLORS.gray400,
              justifyContent: "center",
              lineHeight: 1.3,
            }}
          />
          <div style={{ position: "relative", display: "inline-block", marginTop: 8 }}>
            <TextReveal
              text="broken."
              startFrame={25}
              style={{
                fontFamily: FONT.display,
                fontSize: 96,
                fontWeight: 700,
                color: COLORS.coral,
                justifyContent: "center",
              }}
            />
            {/* Strikethrough */}
            <div
              style={{
                position: "absolute",
                top: "55%",
                left: 0,
                height: 5,
                width: `${strikethrough}%`,
                background: COLORS.accentGlow,
                borderRadius: 3,
                boxShadow: `0 0 20px ${COLORS.accent}80`,
              }}
            />
          </div>
          {/* "Let's fix that" appears */}
          <div
            style={{
              opacity: fixedOpacity,
              transform: `translateY(${(1 - fixedOpacity) * 20}px)`,
              marginTop: 24,
              fontFamily: FONT.display,
              fontSize: 56,
              fontWeight: 600,
              color: COLORS.accent,
              textAlign: "center",
              textShadow: `0 0 40px ${COLORS.accent}60`,
            }}
          >
            Let's fix that.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENE 2: PROBLEM — Stats/pain points (5–12s / frames 150–360)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const painPoints = [
    { icon: "📦", label: "Static courses", desc: "One-size-fits-all" },
    { icon: "⏱", label: "Seat-time metrics", desc: "Completion ≠ competency" },
    { icon: "📉", label: "No adaptation", desc: "Linear, rigid paths" },
  ];

  return (
    <AbsoluteFill>
      <MeshBackground color2="#1A0510" color3="#100520" />
      <Particles color={COLORS.purple} count={15} />
      <GrainOverlay />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 72px",
        }}
      >
        <TextReveal
          text="The old way doesn't work"
          startFrame={5}
          style={{
            fontFamily: FONT.display,
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.white,
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 48,
          }}
        />
        <AccentLine delay={20} color={COLORS.purple} width="180px" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 36,
            marginTop: 32,
            width: "100%",
          }}
        >
          {painPoints.map((point, i) => {
            const itemDelay = 30 + i * 18;
            const progress = spring({
              frame: frame - itemDelay,
              fps,
              config: { damping: 16, stiffness: 100 },
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  opacity: progress,
                  transform: `translateX(${(1 - progress) * 60}px)`,
                  background: `linear-gradient(135deg, ${COLORS.gray700}80, ${COLORS.gray900}60)`,
                  borderRadius: 24,
                  padding: "28px 36px",
                  border: `1px solid ${COLORS.gray700}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: 48, flexShrink: 0 }}>{point.icon}</div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 32,
                      fontWeight: 600,
                      color: COLORS.white,
                      lineHeight: 1.2,
                    }}
                  >
                    {point.label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 24,
                      color: COLORS.gray400,
                      marginTop: 4,
                    }}
                  >
                    {point.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENE 3: INTRODUCE PRODUCT (12–18s / frames 360–540)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.4, 1]
  );

  return (
    <AbsoluteFill>
      <MeshBackground color2="#001A10" color3="#00100A" />
      <Particles color={COLORS.accent} count={25} />
      <GrainOverlay />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 72px",
        }}
      >
        {/* Logo / brand mark */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: 36,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 ${60 * glowPulse}px ${COLORS.accent}50, 0 20px 60px ${COLORS.bgDark}80`,
            }}
          >
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
              <path
                d="M35 8L62 22v26L35 62 8 48V22L35 8z"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="35" cy="35" r="10" fill="white" opacity="0.9" />
              <path d="M35 18v34M18 35h34" stroke="white" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>
        </div>
        {/* Product name */}
        <TextReveal
          text="AI Skill Tutor"
          startFrame={15}
          style={{
            fontFamily: FONT.display,
            fontSize: 72,
            fontWeight: 800,
            color: COLORS.white,
            justifyContent: "center",
            letterSpacing: "-2px",
          }}
        />
        <TextReveal
          text="by Halight"
          startFrame={25}
          style={{
            fontFamily: FONT.display,
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.accent,
            justifyContent: "center",
            marginTop: 8,
          }}
        />
        <AccentLine delay={30} color={COLORS.accent} width="200px" />
        <TextReveal
          text="A tutor in your pocket."
          startFrame={40}
          style={{
            fontFamily: FONT.display,
            fontSize: 40,
            fontWeight: 300,
            color: COLORS.gray100,
            justifyContent: "center",
            textAlign: "center",
            marginTop: 16,
          }}
        />
        <TextReveal
          text="Voice-first. Adaptive. Competency-assured."
          startFrame={55}
          stagger={3}
          style={{
            fontFamily: FONT.display,
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.gray400,
            justifyContent: "center",
            textAlign: "center",
            marginTop: 20,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENE 4: KEY FEATURES — Animated feature cards (18–25s)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      title: "Dynamic Lessons",
      desc: "AI generates 1–3 min micro-lessons in real time",
      gradient: `linear-gradient(135deg, ${COLORS.accent}20, ${COLORS.accent}05)`,
      border: COLORS.accent,
      icon: "⚡",
    },
    {
      title: "Adaptive Mastery",
      desc: "Deterministic rubrics confirm real understanding",
      gradient: `linear-gradient(135deg, ${COLORS.purple}20, ${COLORS.purple}05)`,
      border: COLORS.purple,
      icon: "🎯",
    },
    {
      title: "Voice-First",
      desc: "Natural conversation — interrupt, ask, explore",
      gradient: `linear-gradient(135deg, ${COLORS.coral}20, ${COLORS.coral}05)`,
      border: COLORS.coral,
      icon: "🎙",
    },
    {
      title: "Personalized Paths",
      desc: "Adapts to role, pace, modality & performance",
      gradient: `linear-gradient(135deg, #FFD60A20, #FFD60A05)`,
      border: "#FFD60A",
      icon: "🧬",
    },
  ];

  return (
    <AbsoluteFill>
      <MeshBackground color2="#0A1020" color3="#100A20" />
      <GrainOverlay />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 60px",
        }}
      >
        <TextReveal
          text="What makes it different"
          startFrame={3}
          style={{
            fontFamily: FONT.display,
            fontSize: 44,
            fontWeight: 700,
            color: COLORS.white,
            justifyContent: "center",
            marginBottom: 48,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%" }}>
          {features.map((f, i) => {
            const delay = 15 + i * 15;
            const s = spring({
              frame: frame - delay,
              fps,
              config: { damping: 16, stiffness: 100 },
            });
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateY(${(1 - s) * 40}px) scale(${0.95 + s * 0.05})`,
                  background: f.gradient,
                  borderRadius: 28,
                  padding: "32px 36px",
                  border: `1px solid ${f.border}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div style={{ fontSize: 44, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 30,
                      fontWeight: 700,
                      color: COLORS.white,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT.display,
                      fontSize: 22,
                      color: COLORS.gray400,
                      marginTop: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {f.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENE 5: HOW IT WORKS — Animated node graph (25–28s)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SceneGraph: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodes = [
    { x: 540, y: 350, label: "Skill", color: COLORS.accent, r: 60 },
    { x: 300, y: 580, label: "Topic A", color: COLORS.purple, r: 45 },
    { x: 780, y: 580, label: "Topic B", color: COLORS.purple, r: 45 },
    { x: 540, y: 750, label: "Topic C", color: COLORS.purple, r: 45 },
    { x: 200, y: 850, label: "Lesson", color: COLORS.accentDim, r: 32 },
    { x: 440, y: 920, label: "Lesson", color: COLORS.accentDim, r: 32 },
    { x: 700, y: 850, label: "Lesson", color: COLORS.accentDim, r: 32 },
    { x: 880, y: 920, label: "Lesson", color: COLORS.accentDim, r: 32 },
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3],
    [1, 4], [1, 5], [2, 6], [2, 7], [3, 5], [3, 6],
  ];

  return (
    <AbsoluteFill>
      <MeshBackground color2="#0A0A20" color3="#0A200A" />
      <GrainOverlay />
      <AbsoluteFill
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 120,
        }}
      >
        <TextReveal
          text="Living skill graphs"
          startFrame={3}
          style={{
            fontFamily: FONT.display,
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.white,
            justifyContent: "center",
          }}
        />
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 24,
            color: COLORS.gray400,
            textAlign: "center",
            marginTop: 8,
            opacity: spring({ frame: frame - 12, fps, config: { damping: 20 } }),
          }}
        >
          Not fixed decks — dynamic, adaptive paths
        </div>
      </AbsoluteFill>
      {/* Graph SVG */}
      <AbsoluteFill>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          {/* Edges */}
          {edges.map(([from, to], i) => {
            const edgeDelay = 20 + i * 4;
            const edgeProgress = interpolate(frame - edgeDelay, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const n1 = nodes[from];
            const n2 = nodes[to];
            return (
              <line
                key={`e${i}`}
                x1={n1.x}
                y1={n1.y}
                x2={n1.x + (n2.x - n1.x) * edgeProgress}
                y2={n1.y + (n2.y - n1.y) * edgeProgress}
                stroke={COLORS.gray700}
                strokeWidth={2}
                strokeDasharray="6,4"
                opacity={0.6}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map((node, i) => {
            const nodeDelay = 15 + i * 6;
            const nodeScale = spring({
              frame: frame - nodeDelay,
              fps,
              config: { damping: 12, stiffness: 100 },
            });
            const pulse = Math.sin((frame + i * 20) * 0.06) * 0.15 + 0.85;
            return (
              <g key={`n${i}`} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={node.r * 1.4}
                  fill={`${node.color}15`}
                  opacity={nodeScale * pulse}
                />
                <circle
                  r={node.r * nodeScale}
                  fill={`${node.color}30`}
                  stroke={node.color}
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  dy="6"
                  fontFamily={FONT.display}
                  fontSize={node.r > 40 ? 18 : 14}
                  fontWeight={600}
                  fill={COLORS.white}
                  opacity={nodeScale}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCENE 6: CTA — Call to action (28–30s)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.6, 1]
  );

  const badgeScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const ctaProgress = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const taglineProgress = spring({
    frame: frame - 50,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <MeshBackground color2="#001510" color3="#100520" />
      <Particles color={COLORS.accent} count={30} />
      <GrainOverlay />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 72px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${badgeScale})`,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 32,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 ${80 * glowPulse}px ${COLORS.accent}40`,
            }}
          >
            <svg width="60" height="60" viewBox="0 0 70 70" fill="none">
              <path
                d="M35 8L62 22v26L35 62 8 48V22L35 8z"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="35" cy="35" r="10" fill="white" opacity="0.9" />
            </svg>
          </div>
        </div>

        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.white,
            textAlign: "center",
            lineHeight: 1.1,
            opacity: ctaProgress,
            transform: `translateY(${(1 - ctaProgress) * 30}px)`,
            letterSpacing: "-1px",
          }}
        >
          Stop teaching.
          <br />
          <span style={{ color: COLORS.accent }}>Start assuring.</span>
        </div>

        <AccentLine delay={40} color={COLORS.accent} width="200px" />

        <div
          style={{
            opacity: taglineProgress,
            transform: `translateY(${(1 - taglineProgress) * 20}px)`,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 32,
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            AI Skill Tutor
          </div>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 24,
              color: COLORS.gray400,
              marginTop: 8,
            }}
          >
            by Halight
          </div>

          {/* CTA button */}
          <div
            style={{
              marginTop: 48,
              padding: "20px 56px",
              borderRadius: 60,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
              fontFamily: FONT.display,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.bgDark,
              boxShadow: `0 0 ${40 * glowPulse}px ${COLORS.accent}50, 0 8px 32px ${COLORS.bgDark}80`,
              display: "inline-block",
            }}
          >
            Request a Demo →
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPOSITION — TransitionSeries for smooth scene cuts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const AITutorReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDark }}>
      <TransitionSeries>
        {/* Scene 1: Hook — 5s */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <SceneHook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Problem — 7s */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <SceneProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3: Introduce Product — 6s */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* Scene 4: Features — 7s */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <SceneFeatures />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 5: Graph — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneGraph />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />

        {/* Scene 6: CTA — 4s */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
