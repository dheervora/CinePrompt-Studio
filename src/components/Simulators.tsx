import React, { useEffect, useId, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { PhotoTerm } from '../types';
import { Chip, cx } from './ui';

// Interactive, deliberately simplified diagrams. Each one teaches the cause-and-effect behind a term.

const svgId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '');

function Frame({ children, caption }: { children: React.ReactNode; caption?: React.ReactNode }) {
  return (
    <figure className="space-y-2">
      <div className="rounded-md overflow-hidden border border-line bg-black">{children}</div>
      {caption && <figcaption className="text-sm text-muted leading-relaxed">{caption}</figcaption>}
    </figure>
  );
}

function Slider({ id, label, value, min, max, step = 1, onChange, display }: { id: string; label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; display: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-3 text-sm">
        <label htmlFor={id} className="text-muted">{label}</label>
        <span className="text-ink font-medium tabular-nums">{display}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#F27D26] cursor-pointer" />
    </div>
  );
}

function Stops<T extends number | string>({ label, values, value, onChange, format }: { label: string; values: T[]; value: T; onChange: (v: T) => void; format: (v: T) => string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {values.map((v) => (
          <Chip key={String(v)} selected={v === value} onClick={() => onChange(v)} role="radio" aria-checked={v === value} className="px-2.5 py-1 text-xs">
            {format(v)}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const F_STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];

function Person({ x, y, h, fill = '#F27D26' }: { x: number; y: number; h: number; fill?: string }) {
  // A simple standing figure whose feet sit at (x, y) and whose height is h.
  const s = h / 100;
  return (
    <g transform={`translate(${x - 20 * s}, ${y - h}) scale(${s})`} fill={fill}>
      <circle cx="20" cy="11" r="10" />
      <path d="M6 26 Q20 20 34 26 L36 62 L30 62 L29 100 L22 100 L20 66 L18 100 L11 100 L10 62 L4 62 Z" />
    </g>
  );
}

// ---------------------------------------------------------------- Lenses
function LensSimulator({ term }: { term: PhotoTerm }) {
  const uid = svgId(useId());
  const preset: Record<string, [number, number]> = {
    'lens-standard-50mm': [50, 2.8], 'lens-wide-14mm': [14, 8], 'lens-portrait-85mm': [85, 2], 'lens-telephoto-200mm': [200, 2.8], 'lens-macro-100mm': [100, 2.8], 'lens-anamorphic': [50, 2],
  };
  const [focal, setFocal] = useState(50);
  const [aperture, setAperture] = useState(2.8);
  useEffect(() => {
    const p = preset[term.id];
    if (p) { setFocal(p[0]); setAperture(p[1]); }
  }, [term.id]);

  const anamorphic = term.id === 'lens-anamorphic';
  const fov = Math.round((2 * Math.atan(36 / (2 * focal)) * 180) / Math.PI);
  const bgScale = Math.min(3.2, Math.max(0.3, focal / 50));
  const blur = Math.min(12, (focal / 50) ** 2 * (2.8 / aperture) * 2.2);
  const bokehR = 2 + blur * 1.6;
  const lights = [[60, 70, '#FBBF24'], [120, 50, '#67E8F9'], [210, 64, '#FB7185'], [300, 46, '#FCD34D'], [360, 72, '#67E8F9'], [165, 88, '#FBBF24'], [260, 92, '#FB7185']] as const;

  return (
    <div className="space-y-4">
      <Frame
        caption={
          <>
            The person stays the same size because the photographer steps back as the focal length grows. At <b className="text-ink">{focal}mm</b> the view is about <b className="text-ink">{fov}°</b> wide:{' '}
            {focal <= 24 ? 'the background shrinks and recedes, so depth looks exaggerated.' : focal < 70 ? 'perspective looks natural.' : 'the background looks bigger and closer ("compression").'}{' '}
            At <b className="text-ink">f/{aperture}</b>{' '}
            {blur > 5 ? 'the background melts into blur and lights turn into bokeh discs.' : blur > 1.5 ? 'the background is softly out of focus.' : 'almost everything is sharp.'}
            {anamorphic && ' Anamorphic glass makes bokeh oval and stretches flares sideways.'}
          </>
        }
      >
        <svg viewBox="0 0 400 220" className="w-full h-auto block" role="img" aria-label={`Lens simulation at ${focal}mm, f/${aperture}`}>
          <defs>
            <filter id={`${uid}b`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={blur} /></filter>
            <filter id={`${uid}d`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={Math.min(1.2, blur * 0.2)} /></filter>
            <linearGradient id={`${uid}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B2440" /><stop offset="1" stopColor="#3A2A3A" /></linearGradient>
          </defs>
          <rect width="400" height="220" fill={`url(#${uid}sky)`} />
          <g filter={`url(#${uid}b)`}>
            <g transform={`translate(200 175) scale(${bgScale}) translate(-200 -175)`}>
              <path d="M0 175 L0 120 L40 120 L40 90 L75 90 L75 130 L110 130 L110 70 L150 70 L150 110 L190 110 L190 60 L230 60 L230 100 L270 100 L270 80 L310 80 L310 125 L350 125 L350 95 L400 95 L400 175 Z" fill="#5B6478" />
            </g>
          </g>
          {/* Out-of-focus lights become discs with fairly defined edges, so they get only a light blur. */}
          <g filter={`url(#${uid}d)`}>
            {lights.map(([lx, ly, c], i) => {
              const x = 200 + (lx - 200) * bgScale;
              const y = 175 + (ly - 175) * bgScale;
              return anamorphic
                ? <ellipse key={i} cx={x} cy={y} rx={bokehR} ry={bokehR * 1.7} fill={c} opacity={blur > 1.5 ? 0.55 : 0.9} />
                : <circle key={i} cx={x} cy={y} r={bokehR} fill={c} opacity={blur > 1.5 ? 0.55 : 0.9} />;
            })}
          </g>
          <rect x="0" y="175" width="400" height="45" fill="#2A2A30" />
          {anamorphic && <rect x="0" y="96" width="400" height="3" fill="#7DD3FC" opacity="0.8" style={{ filter: 'blur(1.5px)' }} />}
          <Person x={200} y={196} h={110} />
        </svg>
      </Frame>
      <Slider id="sim-focal" label="Focal length" value={focal} min={14} max={200} onChange={setFocal} display={`${focal}mm · ${fov}° view`} />
      <Stops<number> label="Aperture (real f-stops: each step halves the light)" values={F_STOPS} value={aperture} onChange={setAperture} format={(v) => `f/${v}`} />
    </div>
  );
}

// ---------------------------------------------------------------- Exposure
const SHUTTERS = [1 / 2000, 1 / 500, 1 / 125, 1 / 30, 1 / 8, 1 / 2, 2];
const ISOS = [100, 400, 1600, 6400];
const fmtShutter = (t: number) => (t >= 1 ? `${t}s` : `1/${Math.round(1 / t)}s`);

function ExposureSimulator({ term }: { term: PhotoTerm }) {
  const uid = svgId(useId());
  const [aperture, setAperture] = useState(4);
  const [shutter, setShutter] = useState(1 / 125);
  const [iso, setIso] = useState(400);
  useEffect(() => {
    if (term.id === 'exp-aperture') { setAperture(1.4); setShutter(1 / 500); setIso(100); }
    if (term.id === 'exp-shutter') { setAperture(2.8); setShutter(1 / 2000); setIso(1600); }
    if (term.id === 'exp-long-exposure') { setAperture(16); setShutter(1 / 2); setIso(100); }
    if (term.id === 'exp-iso') { setAperture(2.8); setShutter(1 / 500); setIso(6400); }
  }, [term.id]);

  // Exposure relative to f/4, 1/125s, ISO 400 (0 = correctly exposed), in stops.
  const ev = Math.log2(((shutter / (1 / 125)) * (iso / 400)) / (aperture / 4) ** 2);
  const brightness = Math.pow(2, Math.max(-3, Math.min(3, ev)) * 0.45);
  const bgBlur = Math.min(10, (2.8 / aperture) * 3.2);
  const motion = Math.min(60, shutter * 1400);
  const grain = Math.min(0.55, Math.max(0, Math.log2(iso / 100) * 0.09));
  const verdict = ev < -1 ? 'too dark' : ev > 1 ? 'too bright' : 'well exposed';

  return (
    <div className="space-y-4">
      <Frame
        caption={
          <>
            Exposure is <b className={cx(verdict === 'well exposed' ? 'text-good' : 'text-warn')}>{verdict}</b> ({ev >= 0 ? '+' : ''}{ev.toFixed(1)} stops). Each setting brightens the image but costs something:
            wide aperture blurs the background, slow shutter blurs the runner, high ISO adds grain. Photographers balance all three.
          </>
        }
      >
        <svg viewBox="0 0 400 220" className="w-full h-auto block" role="img" aria-label={`Exposure: f/${aperture}, ${fmtShutter(shutter)}, ISO ${iso}`}>
          <defs>
            <filter id={`${uid}bg`}><feGaussianBlur stdDeviation={bgBlur} /></filter>
            <filter id={`${uid}mo`} x="-50%" width="200%"><feGaussianBlur stdDeviation={`${motion / 3} 0`} /></filter>
            <filter id={`${uid}gr`}><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="3" /><feColorMatrix type="saturate" values="0" /></filter>
          </defs>
          <g style={{ filter: `brightness(${brightness})` }}>
            <rect width="400" height="220" fill="#7AA7C7" />
            <g filter={`url(#${uid}bg)`}>
              <rect y="110" width="400" height="110" fill="#6B8F5E" />
              {[40, 110, 180, 300, 360].map((x, i) => (
                <g key={i}><rect x={x - 4} y="80" width="8" height="40" fill="#5A4632" /><circle cx={x} cy="72" r="24" fill="#3F6B3A" /></g>
              ))}
            </g>
            <rect y="170" width="400" height="50" fill="#B9A58A" />
            <g filter={motion > 1 ? `url(#${uid}mo)` : undefined} opacity={shutter >= 1 ? 0.55 : 1}>
              <Person x={200} y={200} h={96} fill="#E0663A" />
            </g>
          </g>
          <rect width="400" height="220" filter={`url(#${uid}gr)`} opacity={grain} style={{ mixBlendMode: 'overlay' }} />
        </svg>
      </Frame>
      <Stops<number> label="Aperture" values={F_STOPS} value={aperture} onChange={setAperture} format={(v) => `f/${v}`} />
      <Stops<number> label="Shutter speed" values={SHUTTERS} value={shutter} onChange={setShutter} format={fmtShutter} />
      <Stops<number> label="ISO" values={ISOS} value={iso} onChange={setIso} format={(v) => String(v)} />
    </div>
  );
}

// ---------------------------------------------------------------- Lighting
interface LightSetup { key: boolean; angle: number; softness: number; fill: number; rim: boolean; bg: string; warmth: number }
const LIGHT_PRESETS: Record<string, LightSetup> = {
  'light-soft': { key: true, angle: 45, softness: 0.9, fill: 0.3, rim: false, bg: '#3A3A40', warmth: 0 },
  'light-hard': { key: true, angle: 50, softness: 0.05, fill: 0.08, rim: false, bg: '#3A3A40', warmth: 0 },
  'light-golden-hour': { key: true, angle: 70, softness: 0.4, fill: 0.25, rim: true, bg: '#8A5A33', warmth: 1 },
  'light-blue-hour': { key: true, angle: 30, softness: 1, fill: 0.55, rim: false, bg: '#1E3A6B', warmth: -1 },
  'light-side-window': { key: true, angle: 88, softness: 0.7, fill: 0.05, rim: false, bg: '#2E2E33', warmth: 0.2 },
  'lighting-three-point': { key: true, angle: 40, softness: 0.6, fill: 0.45, rim: true, bg: '#26262B', warmth: 0 },
  'lighting-rembrandt': { key: true, angle: 45, softness: 0.35, fill: 0.04, rim: false, bg: '#141416', warmth: 0.2 },
  'lighting-highkey': { key: true, angle: 20, softness: 0.95, fill: 0.85, rim: false, bg: '#F2F2F2', warmth: 0 },
  'lighting-lowkey': { key: true, angle: 72, softness: 0.15, fill: 0, rim: false, bg: '#050505', warmth: 0 },
  'lighting-rim-edge': { key: false, angle: 45, softness: 0.3, fill: 0, rim: true, bg: '#050505', warmth: 0 },
};

function LightingSimulator({ term }: { term: PhotoTerm }) {
  const uid = svgId(useId());
  const [s, setS] = useState<LightSetup>(LIGHT_PRESETS['lighting-rembrandt']);
  useEffect(() => setS(LIGHT_PRESETS[term.id] ?? LIGHT_PRESETS['lighting-rembrandt']), [term.id]);
  const set = (patch: Partial<LightSetup>) => setS((p) => ({ ...p, ...patch }));

  const skin = s.warmth > 0.5 ? '#F0B27A' : s.warmth < -0.5 ? '#B9B6C9' : '#E8B996';
  const lightTint = s.warmth > 0.5 ? '#FFD28A' : s.warmth < -0.5 ? '#AFC6FF' : '#FFFFFF';
  // Where the shadow edge falls across the face: front light pushes it to the far edge, side light to the middle.
  const edge = s.angle <= 45 ? 152 - (40 * s.angle) / 45 : 112 - (12 * (s.angle - 45)) / 45;
  const blur = 1 + s.softness * 13;
  const shadowOpacity = s.key ? 0.9 * (1 - s.fill) : 0.93;
  const rembrandt = s.key && s.fill < 0.25 && edge > 104 && edge < 124;
  const noseLen = 6 + s.angle / 5;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_150px] gap-3">
        <Frame>
          <svg viewBox="0 0 200 220" className="w-full h-auto block max-h-[320px] mx-auto" role="img" aria-label="Portrait lighting simulation">
            <defs>
              <clipPath id={`${uid}head`}><ellipse cx="100" cy="100" rx="52" ry="66" /></clipPath>
              <filter id={`${uid}soft`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={blur} /></filter>
              <filter id={`${uid}glow`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5" /></filter>
              <filter id={`${uid}tri`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={Math.min(blur, 2.5)} /></filter>
            </defs>
            <rect width="200" height="220" fill={s.bg} />
            <path d="M40 220 Q45 172 100 166 Q155 172 160 220 Z" fill={skin} opacity="0.85" />
            <ellipse cx="100" cy="100" rx="52" ry="66" fill={skin} />
            <g clipPath={`url(#${uid}head)`}>
              <rect x="0" y="0" width="200" height="220" fill={lightTint} opacity={s.key ? 0.12 : 0} />
              <g filter={`url(#${uid}soft)`} opacity={shadowOpacity}>
                <path d={s.key ? `M${edge} 20 C${edge - 6} 70 ${edge + 4} 130 ${edge - 4} 180 L200 180 L200 20 Z` : 'M0 0 H200 V220 H0 Z'} fill="#0B0B0D" />
                {s.key && <path d={`M100 98 L${100 + noseLen} ${114 + noseLen / 3} L100 118 Z`} fill="#0B0B0D" />}
              </g>
              {rembrandt && (
                <g filter={`url(#${uid}tri)`}>
                  <path d={`M${edge - 2} 103 L${edge + 20} 105 L${edge + 2} 130 Z`} fill={skin} />
                </g>
              )}
            </g>
            <ellipse cx="80" cy="92" rx="6" ry="3.5" fill="#2A1C14" opacity="0.85" />
            <ellipse cx="120" cy="92" rx="6" ry="3.5" fill="#2A1C14" opacity="0.85" />
            {s.key && <circle cx={80 - s.angle / 30} cy="91" r="1.3" fill="#FFF" />}
            <path d="M88 138 Q100 144 112 138" stroke="#7A4A3A" strokeWidth="2" fill="none" opacity="0.7" />
            {s.rim && (
              <g filter={`url(#${uid}glow)`} opacity="0.95">
                <path d="M100 34 A52 66 0 0 1 152 100" stroke={lightTint} strokeWidth="3" fill="none" />
                <path d="M100 34 A52 66 0 0 0 48 100" stroke={lightTint} strokeWidth="3" fill="none" />
                <path d="M40 220 Q45 172 100 166 Q155 172 160 220" stroke={lightTint} strokeWidth="2.5" fill="none" />
              </g>
            )}
            {rembrandt && (
              <g>
                <line x1={edge + 22} y1="116" x2="178" y2="150" stroke="#F27D26" strokeWidth="1" />
                <text x="182" y="162" fontSize="11" fill="#F27D26" textAnchor="end">triangle</text>
              </g>
            )}
          </svg>
        </Frame>
        <svg viewBox="0 0 150 150" className="w-full max-w-[200px] h-auto mx-auto border border-line rounded-md bg-bg" role="img" aria-label="Top-down view of light positions">
          <text x="75" y="13" fontSize="11" fill="#95959C" textAnchor="middle">seen from above</text>
          <circle cx="75" cy="70" r="11" fill="#E8B996" />
          <rect x="66" y="128" width="18" height="12" rx="2" fill="#B8B8BE" />
          <text x="75" y="148" fontSize="10" fill="#95959C" textAnchor="middle">camera</text>
          {s.key && (() => {
            // 0° = beside the camera (front light), 90° = directly to the subject's side, on camera-left.
            const a = (s.angle * Math.PI) / 180;
            const x = 75 - Math.sin(a) * 48;
            const y = 70 + Math.cos(a) * 48;
            return (<g><circle cx={x} cy={y} r={4 + s.softness * 6} fill="#F7C04A" opacity="0.9" /><text x={x} y={y - 12} fontSize="10" fill="#F7C04A" textAnchor="middle">key</text></g>);
          })()}
          {s.fill > 0.05 && (<g opacity={0.4 + s.fill * 0.6}><circle cx="122" cy="96" r="7" fill="#F2F2F2" /><text x="122" y="84" fontSize="10" fill="#F2F2F2" textAnchor="middle">fill</text></g>)}
          {s.rim && (<g><circle cx="100" cy="30" r="5" fill="#FF9D55" /><text x="112" y="24" fontSize="10" fill="#FF9D55">rim</text></g>)}
        </svg>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Slider id="sim-angle" label="Key light direction" value={s.angle} min={0} max={90} onChange={(v) => set({ angle: v })} display={s.angle < 15 ? 'From the front' : s.angle > 75 ? 'From the side' : `${s.angle}° to the side`} />
        <Slider id="sim-soft" label="Light quality" value={Math.round(s.softness * 100)} min={0} max={100} onChange={(v) => set({ softness: v / 100 })} display={s.softness < 0.3 ? 'Hard (small source)' : s.softness > 0.7 ? 'Soft (large source)' : 'In between'} />
        <Slider id="sim-fill" label="Fill light (lifts shadows)" value={Math.round(s.fill * 100)} min={0} max={100} onChange={(v) => set({ fill: v / 100 })} display={s.fill < 0.1 ? 'None' : `${Math.round(s.fill * 100)}%`} />
        <div className="flex flex-wrap gap-2 items-end">
          <Chip selected={s.key} onClick={() => set({ key: !s.key })}>Key light {s.key ? 'on' : 'off'}</Chip>
          <Chip selected={s.rim} onClick={() => set({ rim: !s.rim })}>Rim light {s.rim ? 'on' : 'off'}</Chip>
        </div>
      </div>
      <p className="text-sm text-muted">
        {rembrandt
          ? 'Key light high at about 45° with no fill: the nose shadow meets the cheek shadow, leaving the Rembrandt triangle.'
          : !s.key && s.rim
            ? 'With only a light from behind, the subject becomes a silhouette outlined in light.'
            : s.fill > 0.6
              ? 'Strong fill keeps shadows light and contrast low: the high-key look.'
              : 'Move the key light toward the side for more shape; drag light quality to see shadow edges go crisp or soft.'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- Composition
function CompositionSimulator({ term }: { term: PhotoTerm }) {
  const [guides, setGuides] = useState(true);
  const g = guides ? 1 : 0;
  const guide = '#F27D26';
  const scenes: Record<string, React.ReactNode> = {
    'comp-rule-of-thirds': (
      <>
        <rect width="320" height="200" fill="#9BB7D4" />
        <rect y="133" width="320" height="67" fill="#6E8B5B" />
        <Person x={107} y={150} h={70} fill="#2B2B2B" />
        <g opacity={g} stroke={guide} strokeWidth="1" strokeDasharray="4 3">
          <line x1="107" y1="0" x2="107" y2="200" /><line x1="213" y1="0" x2="213" y2="200" />
          <line x1="0" y1="67" x2="320" y2="67" /><line x1="0" y1="133" x2="320" y2="133" />
          <circle cx="107" cy="67" r="5" fill={guide} />
        </g>
      </>
    ),
    'comp-leading-lines': (
      <>
        <rect width="320" height="200" fill="#C9D6E3" />
        <rect y="90" width="320" height="110" fill="#8A9A6A" />
        <path d="M60 200 L155 90 L165 90 L260 200 Z" fill="#4A4A4F" />
        <path d="M158 200 L159 90 L161 90 L162 200 Z" fill="#F7E08A" />
        <Person x={160} y={96} h={22} fill="#1E1E1E" />
        <g opacity={g} stroke={guide} strokeWidth="1.5"><line x1="60" y1="200" x2="160" y2="86" /><line x1="260" y1="200" x2="160" y2="86" /></g>
      </>
    ),
    'comp-negative-space': (
      <>
        <rect width="320" height="200" fill="#E6E1D8" />
        <rect y="176" width="320" height="24" fill="#C8BFAF" />
        <Person x={262} y={182} h={18} fill="#2B2B2B" />
        {guides && <text x="120" y="90" fontSize="11" fill={guide} textAnchor="middle">empty space gives the subject room</text>}
      </>
    ),
    'comp-symmetry': (
      <>
        <rect width="320" height="200" fill="#2C2C34" />
        <path d="M0 0 L120 70 L120 150 L0 200 Z" fill="#4A4A55" /><path d="M320 0 L200 70 L200 150 L320 200 Z" fill="#4A4A55" />
        <rect x="120" y="70" width="80" height="80" fill="#C9B89A" />
        <Person x={160} y={148} h={50} fill="#8B2E2E" />
        <line x1="160" y1="0" x2="160" y2="200" stroke={guide} strokeWidth="1" strokeDasharray="4 3" opacity={g} />
      </>
    ),
    'comp-frame-within-frame': (
      <>
        <rect width="320" height="200" fill="#1A1A1D" />
        <rect x="100" y="30" width="120" height="170" fill="#D7C9A8" rx="60" ry="0" />
        <rect x="100" y="90" width="120" height="110" fill="#A89878" />
        <Person x={160} y={170} h={70} fill="#2E3A55" />
        <rect x="100" y="30" width="120" height="170" fill="none" stroke={guide} strokeWidth="1.5" strokeDasharray="4 3" opacity={g} />
      </>
    ),
    'comp-foreground-layers': (
      <>
        <rect width="320" height="200" fill="#BFD2E6" />
        <path d="M0 120 Q80 70 160 110 T320 100 L320 200 L0 200 Z" fill="#94A9BF" />
        <rect y="150" width="320" height="50" fill="#7C8F63" />
        <Person x={180} y={168} h={60} fill="#3A2A20" />
        <g style={{ filter: 'blur(4px)' }}><ellipse cx="30" cy="170" rx="70" ry="45" fill="#2F4A26" /><ellipse cx="300" cy="30" rx="60" ry="40" fill="#2F4A26" /></g>
        {guides && (
          <g fontSize="10" fill={guide}><text x="12" y="192">foreground</text><text x="196" y="140">subject</text><text x="12" y="96">background</text></g>
        )}
      </>
    ),
  };
  return (
    <div className="space-y-3">
      <Frame caption={term.lookFor}>
        <svg viewBox="0 0 320 200" className="w-full h-auto block" role="img" aria-label={`${term.name} example layout`}>
          {scenes[term.id]}
        </svg>
      </Frame>
      <Chip selected={guides} onClick={() => setGuides(!guides)}>{guides ? 'Hide guides' : 'Show guides'}</Chip>
    </div>
  );
}

// ---------------------------------------------------------------- Shot size
// Each shot size is defined by where the frame's top and bottom edges cut the figure (feet at y=150).
const SHOTS = [
  { id: 'framing-extreme-closeup', label: 'Extreme close-up', top: 12, bottom: 25 },
  { id: 'framing-closeup', label: 'Close-up', top: 1, bottom: 44 },
  { id: 'framing-medium-shot', label: 'Medium', top: -3, bottom: 88 },
  { id: 'framing-cowboy-american', label: 'Cowboy', top: -5, bottom: 116 },
  { id: 'framing-full-shot', label: 'Full', top: -10, bottom: 160 },
  { id: 'framing-extreme-wide', label: 'Extreme wide', top: -110, bottom: 240 },
] as const;

function FramingSimulator({ term }: { term: PhotoTerm }) {
  const [shot, setShot] = useState<string>(term.id);
  useEffect(() => setShot(term.id), [term.id]);
  const current = SHOTS.find((s) => s.id === shot) ?? SHOTS[2];
  const y = current.top;
  const h = current.bottom - current.top;
  const w = (h * 16) / 9;
  const x = 41 - w / 2;
  const body = (
    <g>
      <rect x="-400" y="-300" width="900" height="700" fill="#6E8BA8" />
      <rect x="-400" y="150" width="900" height="300" fill="#5E7A4E" />
      <path d="M-400 150 L-250 60 L-120 150 Z M180 150 L320 40 L480 150 Z" fill="#4E6272" />
      <circle cx="41" cy="20" r="14" fill="#E8B996" />
      <circle cx="36" cy="18" r="1.6" fill="#222" /><circle cx="46" cy="18" r="1.6" fill="#222" />
      <path d="M24 38 Q41 30 58 38 L62 90 L54 90 L52 150 L44 150 L41 96 L38 150 L30 150 L28 90 L20 90 Z" fill="#2F4F7F" />
      <rect x="26" y="84" width="30" height="5" fill="#5A3A22" />
    </g>
  );
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_96px] gap-3 items-start">
        <Frame caption={shot === term.id ? term.lookFor : `${current.label}, for comparison with ${term.name}.`}>
          <svg viewBox={`${x} ${y} ${w} ${h}`} className="w-full h-auto block aspect-video" role="img" aria-label={`${current.label} of a standing person`}>{body}</svg>
        </Frame>
        <svg viewBox="-20 -10 120 175" className="w-full h-auto border border-line rounded-md bg-bg" role="img" aria-label="Where the frame cuts the body">
          <circle cx="41" cy="20" r="14" fill="#6B6B72" />
          <path d="M24 38 Q41 30 58 38 L62 90 L54 90 L52 150 L44 150 L41 96 L38 150 L30 150 L28 90 L20 90 Z" fill="#6B6B72" />
          <rect x={Math.max(-18, x)} y={Math.max(-8, y)} width={Math.min(116, w)} height={Math.min(171, h)} fill="none" stroke="#F27D26" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SHOTS.map((s) => <Chip key={s.id} selected={s.id === shot} onClick={() => setShot(s.id)} className="text-xs px-2.5 py-1">{s.label}</Chip>)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Angles
function AngleSimulator({ term }: { term: PhotoTerm }) {
  const [roll, setRoll] = useState(15);
  useEffect(() => { if (term.id === 'angle-dutch') setRoll(15); }, [term.id]);
  const cam = { 'angle-eye-level': [40, 58], 'angle-low-hero': [48, 128], 'angle-high-bird': [70, 8], 'angle-over-the-shoulder': [58, 58], 'angle-dutch': [40, 58] }[term.id] ?? [40, 58];
  const preview: Record<string, React.ReactNode> = {
    'angle-eye-level': (<><rect width="200" height="120" fill="#8FA9C4" /><rect y="80" width="200" height="40" fill="#6C8457" /><Person x={100} y={112} h={80} fill="#2F4F7F" /></>),
    'angle-low-hero': (<><rect width="200" height="120" fill="#6F9BD1" /><path d="M70 120 L85 18 L115 18 L130 120 Z" fill="#2F4F7F" /><circle cx="100" cy="14" r="8" fill="#E8B996" /></>),
    'angle-high-bird': (<><rect width="200" height="120" fill="#6C8457" /><Person x={100} y={80} h={36} fill="#2F4F7F" /><ellipse cx="100" cy="82" rx="14" ry="4" fill="#000" opacity="0.25" /></>),
    'angle-over-the-shoulder': (<><rect width="200" height="120" fill="#5A5048" /><Person x={125} y={118} h={80} fill="#7F3F2F" /><g style={{ filter: 'blur(3px)' }}><ellipse cx="40" cy="120" rx="55" ry="45" fill="#1C1C1C" /><circle cx="48" cy="46" r="24" fill="#1C1C1C" /></g></>),
    'angle-dutch': (<g transform={`rotate(${roll} 100 60)`}><rect x="-60" y="-60" width="320" height="240" fill="#8FA9C4" /><rect x="-60" y="80" width="320" height="120" fill="#6C8457" /><rect x="30" y="20" width="18" height="62" fill="#555" /><rect x="150" y="10" width="22" height="72" fill="#555" /><Person x={100} y={112} h={80} fill="#2F4F7F" /></g>),
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <figure className="space-y-1">
          <svg viewBox="0 0 160 150" className="w-full h-auto border border-line rounded-md bg-bg" role="img" aria-label="Side view of camera position">
            <rect y="136" width="160" height="14" fill="#2A2A30" />
            <Person x={110} y={136} h={100} fill="#5B5B63" />
            <line x1={cam[0] + 8} y1={cam[1] + 5} x2="110" y2="48" stroke="#F27D26" strokeWidth="1" strokeDasharray="3 3" />
            <rect x={cam[0]} y={cam[1]} width="16" height="11" rx="2" fill="#F27D26" />
            <text x="6" y="15" fontSize="11" fill="#95959C">side view: camera position</text>
          </svg>
        </figure>
        <Frame>
          <svg viewBox="0 0 200 120" className="w-full h-auto block" role="img" aria-label="What the camera sees">{preview[term.id]}</svg>
        </Frame>
      </div>
      {term.id === 'angle-dutch' && <Slider id="sim-roll" label="Camera roll" value={roll} min={-35} max={35} onChange={setRoll} display={roll === 0 ? '0° (level)' : `${roll}°`} />}
      <p className="text-sm text-muted">{term.lookFor}</p>
    </div>
  );
}

// ---------------------------------------------------------------- Movement
function MovementSimulator({ term }: { term: PhotoTerm }) {
  const [playing, setPlaying] = useState(true);
  const state = { animationPlayState: playing ? 'running' : 'paused' } as React.CSSProperties;
  const notes: Record<string, string> = {
    'move-static': 'camera stays put; the subject moves',
    'move-pan-tilt': 'camera rotates in place',
    'move-handheld': 'the frame drifts and shakes slightly',
    'movement-steadicam-tracking': 'camera travels with the subject',
    'movement-crane-jib-reveal': 'camera rises over the wall to reveal the mountain',
    'movement-dolly-zoom': 'camera pulls back while the zoom narrows: subject size stays, background grows',
  };
  const scenes: Record<string, React.ReactNode> = {
    'move-static': (
      <>
        <text x="8" y="16" fontSize="13" fill="#95959C">top view</text>
        <g transform="translate(40 110)"><path d="M0 0 L90 -34 L90 34 Z" fill="#F27D26" opacity="0.2" /><rect x="-14" y="-8" width="16" height="16" rx="2" fill="#F27D26" /></g>
        <g className="cp-anim" style={{ ...state, animationName: 'cp-track', transformBox: 'fill-box' }}><circle cx="170" cy="110" r="8" fill="#E8B996" /></g>
      </>
    ),
    'move-pan-tilt': (
      <>
        <text x="8" y="16" fontSize="13" fill="#95959C">top view</text>
        <g transform="translate(80 110)"><g className="cp-anim" style={{ ...state, animationName: 'cp-pan', transformOrigin: '0 0' }}><path d="M0 0 L150 -45 L150 45 Z" fill="#F27D26" opacity="0.25" /></g><rect x="-10" y="-8" width="16" height="16" rx="2" fill="#F27D26" /></g>
        {[60, 110, 160].map((y, i) => <circle key={i} cx="260" cy={y} r="9" fill="#6B8F5E" />)}
      </>
    ),
    'move-handheld': (
      <>
        <g className="cp-anim-loop" style={{ ...state, animationName: 'cp-shake', animationDuration: '0.6s' }}>
          <rect x="90" y="40" width="220" height="130" fill="none" stroke="#F27D26" strokeWidth="2" />
          <Person x={200} y={160} h={100} fill="#5B5B63" />
        </g>
      </>
    ),
    'movement-steadicam-tracking': (
      <>
        <text x="8" y="16" fontSize="13" fill="#95959C">top view</text>
        {[70, 140, 210, 280, 350].map((x, i) => <circle key={i} cx={x} cy="50" r="10" fill="#3F6B3A" />)}
        <g className="cp-anim" style={{ ...state, animationName: 'cp-track' }}>
          <circle cx="220" cy="110" r="8" fill="#E8B996" />
          <g transform="translate(160 110)"><path d="M0 0 L60 -22 L60 22 Z" fill="#F27D26" opacity="0.25" /><rect x="-14" y="-8" width="16" height="16" rx="2" fill="#F27D26" /></g>
        </g>
      </>
    ),
    'movement-crane-jib-reveal': (
      <>
        <text x="8" y="16" fontSize="13" fill="#95959C">side view</text>
        <rect y="170" width="400" height="40" fill="#2A2A30" />
        <rect x="170" y="110" width="20" height="60" fill="#5B5B63" />
        <path d="M230 170 L300 60 L370 170 Z" fill="#4E6272" />
        <g className="cp-anim" style={{ ...state, animationName: 'cp-rise' }}>
          <g transform="translate(110 150)"><path d="M0 0 L100 -20 L100 20 Z" fill="#F27D26" opacity="0.25" /><rect x="-14" y="-8" width="16" height="16" rx="2" fill="#F27D26" /></g>
        </g>
        <line x1="80" y1="170" x2="110" y2="150" stroke="#95959C" strokeWidth="3" />
      </>
    ),
    'movement-dolly-zoom': (
      <>
        <text x="8" y="16" fontSize="13" fill="#95959C">top view</text>
        <circle cx="230" cy="100" r="9" fill="#E8B996" />
        <rect x="330" y="40" width="14" height="120" fill="#4E6272" />
        <g className="cp-anim" style={{ ...state, animationName: 'cp-dolly' }}>
          <g transform="translate(150 100)">
            <g className="cp-anim" style={{ ...state, animationName: 'cp-dolly-cone', transformOrigin: '0 0' }}><path d="M0 0 L200 -60 L200 60 Z" fill="#F27D26" opacity="0.22" /></g>
            <rect x="-14" y="-8" width="16" height="16" rx="2" fill="#F27D26" />
          </g>
        </g>
      </>
    ),
  };
  return (
    <div className="space-y-3">
      <Frame caption={<><b className="text-ink">Diagram:</b> {notes[term.id]}. <b className="text-ink">On screen:</b> {term.lookFor}</>}>
        <svg viewBox="0 0 400 210" className="w-full h-auto block bg-bg" role="img" aria-label={`${term.name} diagram`}>{scenes[term.id]}</svg>
      </Frame>
      <button type="button" onClick={() => setPlaying(!playing)} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink cursor-pointer">
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {playing ? 'Pause animation' : 'Play animation'}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- Color
function ColorSimulator({ term }: { term: PhotoTerm }) {
  const uid = svgId(useId());
  const [graded, setGraded] = useState(true);
  const [warmth, setWarmth] = useState(40);
  useEffect(() => setGraded(true), [term.id]);
  const matrices: Record<string, string> = {
    'color-kodachrome-vintage': '1.25 0.05 0 0 0.02  0.02 1.05 0 0 0  0 0.05 0.9 0 0  0 0 0 1 0',
    'color-cinestill-800t': '0.85 0.05 0.1 0 0  0.05 0.95 0.1 0 0.02  0.05 0.15 1.15 0 0.05  0 0 0 1 0',
    'color-teal-orange': '1.15 0.05 0 0 0.02  0 0.95 0.1 0 0  0 0.25 0.85 0 0.04  0 0 0 1 0',
    'color-film-noir-blackwhite': '0.45 0.45 0.2 0 -0.06  0.45 0.45 0.2 0 -0.06  0.45 0.45 0.2 0 -0.06  0 0 0 1 0',
  };
  const w = (warmth - 50) / 50;
  const temp = `${1 + w * 0.25} 0 0 0 0  0 ${1 + w * 0.05} 0 0 0  0 0 ${1 - w * 0.3} 0 0  0 0 0 1 0`;
  const matrix = term.id === 'color-temperature' ? temp : matrices[term.id];
  const noir = term.id === 'color-film-noir-blackwhite';
  return (
    <div className="space-y-3">
      <Frame caption={graded ? term.lookFor : 'The same scene before grading, for comparison.'}>
        <svg viewBox="0 0 320 200" className="w-full h-auto block" role="img" aria-label={`${term.name} color example`}>
          <defs>
            <filter id={`${uid}g`}><feColorMatrix type="matrix" values={graded ? matrix : '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'} />{graded && noir && <feComponentTransfer><feFuncR type="linear" slope="1.5" intercept="-0.2" /><feFuncG type="linear" slope="1.5" intercept="-0.2" /><feFuncB type="linear" slope="1.5" intercept="-0.2" /></feComponentTransfer>}</filter>
            <filter id={`${uid}h`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" /></filter>
          </defs>
          <g filter={`url(#${uid}g)`}>
            <rect width="320" height="200" fill="#2E4A66" />
            <rect y="130" width="320" height="70" fill="#3A3A40" />
            <rect x="20" y="40" width="70" height="90" fill="#4A5A6A" /><rect x="230" y="30" width="80" height="100" fill="#4A5A6A" />
            {[[55, 60], [270, 55], [150, 36]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="#FFE9B0" />)}
            <circle cx="160" cy="92" r="17" fill="#E0A77C" />
            <path d="M135 200 L138 118 Q160 108 182 118 L185 200 Z" fill="#8C2F2F" />
            <rect x="0" y="150" width="320" height="4" fill="#C8B070" opacity="0.5" />
            {graded && noir && [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x="0" y={30 + i * 26} width="320" height="10" fill="#000" opacity="0.45" transform="skewY(-8)" />)}
          </g>
          {graded && term.id === 'color-cinestill-800t' && [[55, 60], [270, 55], [150, 36]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="11" fill="#FF3B1F" opacity="0.6" filter={`url(#${uid}h)`} />)}
        </svg>
      </Frame>
      <div className="flex flex-wrap items-center gap-2">
        <Chip selected={!graded} onClick={() => setGraded(false)}>Before</Chip>
        <Chip selected={graded} onClick={() => setGraded(true)}>After: {term.name.replace(/ \(.*\)/, '')}</Chip>
      </div>
      {term.id === 'color-temperature' && <Slider id="sim-warmth" label="Color temperature" value={warmth} min={0} max={100} onChange={setWarmth} display={warmth < 40 ? 'Cool (≈7000K+)' : warmth > 60 ? 'Warm (≈3000K)' : 'Neutral (≈5600K)'} />}
    </div>
  );
}

export default function Simulator({ term }: { term: PhotoTerm }) {
  switch (term.category) {
    case 'lenses': return <LensSimulator term={term} />;
    case 'exposure': return <ExposureSimulator term={term} />;
    case 'lighting': return <LightingSimulator term={term} />;
    case 'composition': return <CompositionSimulator term={term} />;
    case 'framing': return <FramingSimulator term={term} />;
    case 'angles': return <AngleSimulator term={term} />;
    case 'movements': return <MovementSimulator term={term} />;
    case 'color-film': return <ColorSimulator term={term} />;
  }
}
