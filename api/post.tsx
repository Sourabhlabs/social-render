// api/post.tsx
// Edge Function that renders a social/OG image.
// Example:
// /api/post?title=Start%20Your%20Health%20Coaching%20Career&subtitle=Get%20paying%20clients%20in%2090%20days&cta=Reserve%20My%20Spot%20Now&theme=blue

import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

type Params = {
  title?: string;
  subtitle?: string;
  cta?: string;
  theme?: 'blue' | 'purple' | 'orange' | 'dark';
  ratio?: '1:1' | '4:5' | '16:9';
};

const THEMES: Record<string, { bg: string; accent: string; fg: string; glow: string }> = {
  blue:   { bg: 'linear-gradient(135deg,#0A46FF,#0066FF)', accent: '#FFD600', fg: '#FFFFFF', glow: 'rgba(0,140,255,.35)' },
  purple: { bg: 'linear-gradient(135deg,#5D2BFF,#9D40FF)', accent: '#FFD35A', fg: '#FFFFFF', glow: 'rgba(157,64,255,.35)' },
  orange: { bg: 'linear-gradient(135deg,#FF6A00,#FF8A00)', accent: '#1B1B1B', fg: '#FFFFFF', glow: 'rgba(255,122,0,.35)' },
  dark:   { bg: 'linear-gradient(135deg,#0E1016,#1A1F2B)', accent: '#65D7FF', fg: '#EAF6FF', glow: 'rgba(101,215,255,.25)' },
};

function parseSearch(req: Request): Params {
  const u = new URL(req.url);
  return {
    title:    u.searchParams.get('title')     ?? 'Start Your Health Coaching Career',
    subtitle: u.searchParams.get('subtitle')  ?? 'Get paying clients in 90 days • No experience needed',
    cta:      u.searchParams.get('cta')       ?? 'Reserve My Spot Now',
    theme:   (u.searchParams.get('theme')     as Params['theme']) ?? 'blue',
    ratio:   (u.searchParams.get('ratio')     as Params['ratio']) ?? '1:1',
  };
}

function sizeFromRatio(ratio: Params['ratio']) {
  switch (ratio) {
    case '4:5':  return { width: 1080, height: 1350 };
    case '16:9': return { width: 1920, height: 1080 };
    default:     return { width: 1080, height: 1080 }; // 1:1
  }
}

export default async function handler(req: Request) {
  const { title, subtitle, cta, theme, ratio } = parseSearch(req);
  const { width, height } = sizeFromRatio(ratio);
  const t = THEMES[theme ?? 'blue'] ?? THEMES.blue;

  const Brand = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 999,
        background: 'rgba(255,255,255,.12)',
        color: t.fg,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 1.2,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 999, background: t.accent,
        boxShadow: `0 0 22px ${t.glow}`
      }} />
      YOU CAN TRANSFORM™
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'Inter, Arial, sans-serif',
          background: t.bg,
          color: t.fg,
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(600px 400px at 75% 25%, ${t.glow}, transparent 60%)`
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(500px 300px at 25% 85%, ${t.glow}, transparent 70%)`
        }} />

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: ratio === '16:9' ? '80px 140px' : '100px',
          gap: 28,
        }}>
          {Brand}

          <div style={{
            fontSize: ratio === '16:9' ? 92 : 100,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1.2,
            textShadow: '0 6px 30px rgba(0,0,0,.25)'
          }}>
            {title}
          </div>

          <div style={{
            fontSize: ratio === '16:9' ? 40 : 44,
            opacity: .96,
            lineHeight: 1.25,
            maxWidth: '90%'
          }}>
            {subtitle}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <div style={{
              background: t.accent,
              color: theme === 'orange' ? '#111' : '#121416',
              padding: '22px 34px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 38,
              boxShadow: `0 12px 40px ${t.glow}`
            }}>
              {cta}
            </div>

            <div style={{
              padding: '22px 28px',
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 34,
              border: '2px solid rgba(255,255,255,.25)'
            }}>
              DM “COACH” to Register
            </div>
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}
