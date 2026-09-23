import React, { useState } from 'react';
import { PHOTOGRAPHY_TERMS, PHOTOGRAPHY_CATEGORIES } from '../photographyData';
import { PhotoTerm } from '../types';
import { Search, Info, Sliders, Play, Copy, Check, Lightbulb } from 'lucide-react';

const REAL_WORLD_IMAGES: Record<string, { url: string; annotations: string[] }> = {
  "lens-anamorphic": {
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    annotations: ["Horizontal blue/cyan stretch flare lines", "Elliptical (oval) bokeh shapes", "Aesthetic 2.39:1 widescreen frame"]
  },
  "lens-wide-14mm": {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    annotations: ["Exaggerated spatial perspective", "Distortion near marginal boundaries", "Boundless feeling of vertical scale"]
  },
  "lens-portrait-85mm": {
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    annotations: ["Creamy, melted background blur", "Extremely sharp focal plane on eyes", "Zero facial geometry distortion"]
  },
  "lens-telephoto-200mm": {
    url: "https://images.unsplash.com/photo-1472214222541-d510753a4979?auto=format&fit=crop&w=800&q=80",
    annotations: ["Compressed spatial representation", "Background elements look gigantic", "Isolating narrow slice of depth"]
  },
  "lens-macro-100mm": {
    url: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    annotations: ["Razor-thin slice of crisp focus", "Hyper-detailed surface textures", "Microscopic dust/moisture highlights"]
  },
  "angle-dutch": {
    url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    annotations: ["Canted camera roll (tilted axis)", "Diagonal lines heighten mental anxiety", "Highly off-balance visual framing"]
  },
  "angle-low-hero": {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    annotations: ["Camera positioned below standard eye-line", "Exaggerates dominance/majesty of form", "Evokes psychological sense of power"]
  },
  "angle-high-bird": {
    url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80",
    annotations: ["Omniscient overhead drone perspective", "Geometric patterns emerge in scenery", "Evokes vulnerability & scope"]
  },
  "angle-ots": {
    url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    annotations: ["Foreground player silhouettes outline", "Grounded depth within 3D speaking grid", "Shallow focus shifts between actors"]
  },
  "framing-extreme-closeup": {
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    annotations: ["Hyper-focused crop on eyes", "Maximized emotional empathy/gravity", "Intricate skin & iris fiber details"]
  },
  "framing-medium-shot": {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    annotations: ["Balanced waist-up standard framing", "Clear body language and posture cues", "Preserves contextual backdrop story"]
  },
  "framing-cowboy-american": {
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    annotations: ["Mid-thigh action-ready boundary", "Displays clothing details & hand tools", "Maintains powerful core eye expressions"]
  },
  "framing-extreme-wide": {
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    annotations: ["Microscopic human scale in the wild", "Colossal landscape setting dominates", "Sets the global tone of the chapter"]
  },
  "lighting-rembrandt": {
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    annotations: ["Chiaroscuro shadow models form", "Distinct triangle of exposure on shadow cheek", "Sharp dramatic catchlight inside iris"]
  },
  "lighting-highkey": {
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    annotations: ["Bright, evenly wrap-around illumination", "Soft, flat shadows convey optimism", "Clean minimalist high-contrast feel"]
  },
  "lighting-lowkey": {
    url: "https://images.unsplash.com/photo-1481137344492-d41fc22b3045?auto=format&fit=crop&w=800&q=80",
    annotations: ["Deep impenetrable blacks engulf frame", "Single harsh point source molds subject", "Intense, dramatic silhouette layout"]
  },
  "lighting-rim-edge": {
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    annotations: ["Strong back-directional beam", "Luminous glowing halo outlines hair/edges", "Crisp separation from absolute dark"]
  },
  "lighting-three-point": {
    url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    annotations: ["Dominant Key light molds volume", "Soft Fill light gently brings out shadows", "Rim light crafts deep background separation"]
  },
  "movement-dolly-zoom": {
    url: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=800&q=80",
    annotations: ["Dynamic background compression", "Foreground subject size stays rigid", "Unsettling psychological vertigo aura"]
  },
  "movement-steadicam-tracking": {
    url: "https://images.unsplash.com/photo-1473116763269-255415bab89d?auto=format&fit=crop&w=800&q=80",
    annotations: ["Kinetic motion blur in background", "Camera moves seamlessly with the run", "Tighter, fluid, immersive connection"]
  },
  "movement-crane-jib-reveal": {
    url: "https://images.unsplash.com/photo-1508847154043-be12a2653a9b?auto=format&fit=crop&w=800&q=80",
    annotations: ["Sweeping elevation reveal of valley", "Transitions from human perspective to global", "Majestic cinematic overview scale"]
  },
  "color-kodachrome-vintage": {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    annotations: ["Warm saturated yellows and deep reds", "Rich high contrast nostalgic tint", "Authentic fine analog grain texture"]
  },
  "color-cinestill-800t": {
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    annotations: ["Vibrant glowing red light halation", "Industrial cyan-green shadows", "Gritty street night neon essence"]
  },
  "color-teal-orange": {
    url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    annotations: ["Highly polished blockbuster gloss", "Opplementary contrasts in grade", "Actors stand out cleanly from setting"]
  },
  "color-film-noir-blackwhite": {
    url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    annotations: ["Stark monochrome black-and-white", "Dynamic, sharp diagonal shadows", "Glistening rain slicked concrete streets"]
  }
};

interface InteractiveGlossaryProps {
  onAddTermToFormula: (category: string, value: string) => void;
}

export default function InteractiveGlossary({ onAddTermToFormula }: InteractiveGlossaryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<PhotoTerm>(PHOTOGRAPHY_TERMS[0]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Toggle between high-fidelity real photographic example and parameter-based SVG simulator
  const [activeVisualTab, setActiveVisualTab] = useState<'reference' | 'simulator'>('reference');

  // Parameter states for Interactive SVG simulators
  const [focalLength, setFocalLength] = useState<number>(50); // 14 to 200
  const [aperture, setAperture] = useState<number>(2.8); // 1.4 to 16
  const [cantedAngle, setCantedAngle] = useState<number>(0); // -45 to 45
  const [activeLights, setActiveLights] = useState({ key: true, fill: true, rim: true });

  const filteredTerms = PHOTOGRAPHY_TERMS.filter((term) => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesSearch = term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(type);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleSelectTerm = (term: PhotoTerm) => {
    setSelectedTerm(term);
    if (term.id === 'lens-wide-14mm') {
      setFocalLength(14);
      setAperture(8.0);
    } else if (term.id === 'lens-portrait-85mm') {
      setFocalLength(85);
      setAperture(1.8);
    } else if (term.id === 'lens-telephoto-200mm') {
      setFocalLength(200);
      setAperture(2.8);
    } else if (term.id === 'lens-macro-100mm') {
      setFocalLength(100);
      setAperture(2.8);
    } else if (term.id === 'lens-anamorphic') {
      setFocalLength(50);
      setAperture(2.0);
    } else if (term.id === 'angle-dutch') {
      setCantedAngle(20);
    } else if (term.id === 'lighting-rembrandt') {
      setActiveLights({ key: true, fill: false, rim: true });
    } else if (term.id === 'lighting-highkey') {
      setActiveLights({ key: true, fill: true, rim: true });
    } else if (term.id === 'lighting-lowkey') {
      setActiveLights({ key: true, fill: false, rim: false });
    } else if (term.id === 'lighting-rim-edge') {
      setActiveLights({ key: false, fill: false, rim: true });
    }
  };

  const getFocalLabel = (val: number) => {
    if (val <= 24) return `${val}mm (Ultra-Wide Angle - Distortion Frame)`;
    if (val <= 55) return `${val}mm (Normal Standard/Perspective)`;
    if (val <= 100) return `${val}mm (Portrait Compression - Shallow Bokeh)`;
    return `${val}mm (Telephoto Frame - extreme Flattening)`;
  };

  // Render Interactive Visual Simulator based on Selected Term/Type
  const renderInteractiveSimulator = () => {
    switch (selectedTerm.category) {
      case 'lenses':
        const isWide = focalLength <= 24;
        const isTele = focalLength >= 85;
        const isShallow = aperture <= 2.8;
        const isDeep = aperture >= 8;
        const blurPx = Math.max(0, (11 - aperture) * 1.5);
        const bgScale = 0.7 + (focalLength - 14) / 110;

        return (
          <div className="bg-[#050505] p-5 rounded-none border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/40 font-mono">
              <span>Simulation Platform: Camera Lens Laboratory</span>
              <span className={`font-mono text-[9px] px-2 py-0.5 border font-bold ${
                isShallow ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' :
                isDeep ? 'bg-sky-950/60 text-sky-300 border-sky-500/40' :
                'bg-white/5 text-white/70 border-white/15'
              }`}>
                {isShallow ? 'CREAMY BOKEH (SHALLOW DOF)' : isDeep ? 'DEEP FOCUS (SHARP HORIZON)' : 'BALANCED DEPTH'}
              </span>
            </div>

            {/* Simulated Optical Viewport */}
            <div className="relative h-48 bg-black rounded-none border border-white/10 flex items-center justify-center overflow-hidden">
              {/* Background Status Tag */}
              <div className="absolute top-2 left-2 z-20 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-black/80 border border-white/15 text-white/60">
                BACKGROUND: {isShallow ? 'BLURRED BOKEH' : isDeep ? 'SHARP & CLEAR' : 'SOFT FOCUS'}
              </div>

              {/* Angle of View Tag */}
              <div className="absolute top-2 right-2 z-20 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-black/80 border border-white/15 text-[#F27D26]">
                FOV: {isWide ? '114° ULTRA-WIDE' : isTele ? '12° COMPRESSED' : '47° NORMAL'}
              </div>

              {/* BACKGROUND LAYER: Stylized City Skyline + Bokeh Lights */}
              <div 
                className="absolute inset-0 transition-all duration-300 flex items-end justify-center pointer-events-none"
                style={{
                  filter: `blur(${blurPx}px)`,
                  transform: `scale(${bgScale})`,
                  transformOrigin: 'bottom center'
                }}
              >
                {/* Vector Cityscape Backdrop */}
                <div className="w-full h-36 flex items-end justify-around px-2 opacity-50">
                  <div className="w-9 h-28 bg-white/20 border-t border-white/40 flex flex-col justify-around items-center p-1">
                    <div className="w-full h-1 bg-amber-400/80"></div>
                    <div className="w-full h-1 bg-amber-400/80"></div>
                    <div className="w-full h-1 bg-amber-400/80"></div>
                  </div>
                  <div className="w-14 h-36 bg-white/15 border-t border-white/30 flex flex-col justify-around items-center p-1">
                    <div className="w-full h-1 bg-cyan-400/80"></div>
                    <div className="w-full h-1 bg-cyan-400/80"></div>
                    <div className="w-full h-1 bg-cyan-400/80"></div>
                  </div>
                  <div className="w-11 h-24 bg-white/25 border-t border-white/50 flex flex-col justify-around items-center p-1">
                    <div className="w-full h-1 bg-amber-300/80"></div>
                    <div className="w-full h-1 bg-amber-300/80"></div>
                  </div>
                  <div className="w-16 h-32 bg-white/10 border-t border-white/20 flex flex-col justify-around items-center p-1">
                    <div className="w-full h-1 bg-rose-400/80"></div>
                    <div className="w-full h-1 bg-rose-400/80"></div>
                  </div>
                </div>

                {/* Bokeh Light Discs that expand into circles when aperture is wide */}
                <div className="absolute inset-0 flex justify-around items-center px-4">
                  <div 
                    className="rounded-full bg-amber-400/90 shadow-[0_0_12px_rgba(251,191,36,0.8)] transition-all duration-300"
                    style={{
                      width: `${isShallow ? 24 : 6}px`,
                      height: `${isShallow ? 24 : 6}px`,
                      opacity: isShallow ? 0.85 : 0.4
                    }}
                  />
                  <div 
                    className="rounded-full bg-cyan-400/90 shadow-[0_0_14px_rgba(34,211,238,0.8)] transition-all duration-300"
                    style={{
                      width: `${isShallow ? 30 : 7}px`,
                      height: `${isShallow ? 30 : 7}px`,
                      opacity: isShallow ? 0.9 : 0.4
                    }}
                  />
                  <div 
                    className="rounded-full bg-rose-400/90 shadow-[0_0_10px_rgba(251,113,133,0.8)] transition-all duration-300"
                    style={{
                      width: `${isShallow ? 20 : 5}px`,
                      height: `${isShallow ? 20 : 5}px`,
                      opacity: isShallow ? 0.8 : 0.4
                    }}
                  />
                  <div 
                    className="rounded-full bg-amber-300/90 shadow-[0_0_16px_rgba(252,211,77,0.8)] transition-all duration-300"
                    style={{
                      width: `${isShallow ? 26 : 6}px`,
                      height: `${isShallow ? 26 : 6}px`,
                      opacity: isShallow ? 0.85 : 0.4
                    }}
                  />
                </div>
              </div>

              {/* FOREGROUND SUBJECT (Always Tack-Sharp) */}
              <div 
                className="relative z-10 transition-transform duration-300 flex flex-col items-center"
                style={{
                  transform: `scale(${isWide ? 0.85 : isTele ? 1.25 : 1})`
                }}
              >
                <svg className="w-20 h-20 text-[#F27D26] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
                <div className="text-[8px] font-mono font-black text-black bg-[#F27D26] px-2 py-0.5 rounded-none mt-0.5 uppercase tracking-widest">
                  SHARP FOREGROUND FOCUS
                </div>
              </div>

              {/* Anamorphic Flare Line */}
              {selectedTerm.id === 'lens-anamorphic' && (
                <div className="absolute inset-x-0 h-[2px] bg-sky-400 opacity-95 shadow-[0_0_12px_rgba(56,189,248,0.9)] z-20"></div>
              )}
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono uppercase text-white/70">
                  <span>Focal Length (Field of View & Compression):</span>
                  <span className="text-[#F27D26] font-bold">{getFocalLabel(focalLength)}</span>
                </div>
                <input 
                  type="range" 
                  min="14" 
                  max="200" 
                  value={focalLength} 
                  onChange={(e) => setFocalLength(Number(e.target.value))}
                  className="w-full accent-[#F27D26] bg-[#0A0A0A] border border-white/15 h-2 appearance-none cursor-pointer rounded-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono uppercase text-white/70">
                  <span>Aperture (f-stop: Depth of Field):</span>
                  <span className="text-[#F27D26] font-bold">f/{aperture} {isShallow ? '(Wide Open → Melts Background into Bokeh)' : isDeep ? '(Small Pin-hole → Deep Focus Horizon)' : '(Moderate DOF)'}</span>
                </div>
                <input 
                  type="range" 
                  min="1.4" 
                  max="16" 
                  step="0.7" 
                  value={aperture} 
                  onChange={(e) => setAperture(Number(e.target.value))}
                  className="w-full accent-[#F27D26] bg-[#0A0A0A] border border-white/15 h-2 appearance-none cursor-pointer rounded-none"
                />
              </div>
            </div>

            {/* Live Educational Matrix: Plain English Breakdown */}
            <div className="bg-black/90 p-3.5 border border-white/10 space-y-2 text-left">
              <div className="text-[9px] font-mono text-[#F27D26] font-black uppercase tracking-wider flex items-center justify-between">
                <span>WHAT IS HAPPENING TO THE OPTICS:</span>
                <span className="text-white/40 font-normal">f/{aperture} • {focalLength}mm</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                <strong className="text-white font-mono uppercase tracking-wide">Aperture (Depth of Field): </strong>
                {isShallow 
                  ? `At f/${aperture}, the lens opening is wide open. Background streetlights bloom into glowing circular bokeh discs, blurring the skyline and isolating your subject.`
                  : isDeep 
                  ? `At f/${aperture}, the lens opening constricts into a narrow hole. Both the subject in the foreground and the distant city skyline remain sharp and clear.`
                  : `At f/${aperture}, there is moderate background separation while preserving the architecture's recognizable shape.`
                }
              </p>
              <p className="text-[11px] text-white/80 leading-relaxed font-sans">
                <strong className="text-white font-mono uppercase tracking-wide">Focal Length (Perspective): </strong>
                {isWide 
                  ? `At ${focalLength}mm, the ultra-wide field of view (114°) pushes background buildings into the distance, emphasizing vast spatial scale.`
                  : isTele 
                  ? `At ${focalLength}mm, telephoto compression magnifies the background skyline, making distant buildings look gigantic and right behind the subject.`
                  : `At ${focalLength}mm, spatial perspective mirrors the natural human eye.`
                }
              </p>
            </div>
          </div>
        );

      case 'angles':
        return (
          <div className="bg-[#050505] p-5 rounded-none border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/40 font-mono">
              <span>Simulation Platform: Axis Roll Engine</span>
              <span className="text-[#F27D26] font-bold">Tilt Matrix</span>
            </div>

            <div className="relative h-44 bg-black rounded-none border border-white/10 flex items-center justify-center">
              {/* Dynamic Rotated Box */}
              <div 
                className="transition-transform duration-300 flex flex-col items-center justify-center p-4 border border-dashed border-white/20 w-5/6 h-5/6 bg-black"
                style={{
                  transform: `rotate(${selectedTerm.id === 'angle-dutch' ? cantedAngle || 15 : (selectedTerm.id === 'angle-low-hero' ? -5 : (selectedTerm.id === 'angle-high-bird' ? 5 : 0))}deg)`
                }}
              >
                {/* Horizon Guideline */}
                <div className="absolute inset-x-0 h-[0.5px] bg-[#F27D26]/15 top-1/2"></div>
                
                {/* Subject inside rotated box */}
                <div className="relative z-10 flex flex-col items-center">
                  <svg 
                    className={`w-20 h-20 transition-all duration-300 ${selectedTerm.id === 'angle-low-hero' ? 'scale-125 text-[#F27D26] origin-bottom' : selectedTerm.id === 'angle-high-bird' ? 'scale-75 text-white/40 origin-top' : 'text-[#F27D26]/80'}`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span className="text-[8px] font-mono bg-[#0A0A0A] text-[#F27D26] border border-[#F27D26]/35 px-1.5 py-0.5 uppercase tracking-widest mt-1">
                    {selectedTerm.id === 'angle-low-hero' ? 'Towering Command' : selectedTerm.id === 'angle-high-bird' ? 'Vulnerable Vista' : 'Canted Frame'}
                  </span>
                </div>
              </div>
            </div>

            {selectedTerm.id === 'angle-dutch' && (
              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono uppercase text-white/70">
                  <span>Horizon Angle Roll:</span>
                  <span className="text-[#F27D26] font-bold">{cantedAngle || 15}° Roll</span>
                </div>
                <input 
                  type="range" 
                  min="-35" 
                  max="35" 
                  value={cantedAngle || 15} 
                  onChange={(e) => setCantedAngle(Number(e.target.value))}
                  className="w-full accent-[#F27D26] bg-[#0A0A0A] border border-white/15 h-2 appearance-none cursor-pointer rounded-none"
                />
              </div>
            )}
          </div>
        );

      case 'lighting':
        return (
          <div className="bg-[#050505] p-5 rounded-none border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/40 font-mono">
              <span>Simulation Platform: Studio Vectors</span>
              <span className="text-[#F27D26] font-bold">Rembrandt Lab</span>
            </div>

            {/* Interactive Portrait rendering setup */}
            <div className="grid grid-cols-3 gap-3 items-center">
              {/* Left Column: Key Light Switch */}
              <button 
                onClick={() => setActiveLights(prev => ({ ...prev, key: !prev.key }))}
                className={`py-3 px-2 rounded-none text-[10px] font-mono border uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1.5 ${activeLights.key ? 'bg-amber-950/40 text-amber-300 border-[#F27D26]' : 'bg-black text-white/30 border-white/10'}`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>KEY LIGHT</span>
                <span className="text-[8px] opacity-65">{activeLights.key ? '45° Left [ON]' : '[OFF]'}</span>
              </button>

              {/* Center Column: Interactive Dynamic Portrait SVG */}
              <div className="relative h-28 bg-black rounded-none border border-white/10 flex items-center justify-center overflow-hidden">
                <svg className="w-16 h-16 transition-all duration-300" viewBox="0 0 100 100">
                  <defs>
                    <radialGradient id="face-base" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2e2e2e" />
                      <stop offset="100%" stopColor="#080808" />
                    </radialGradient>
                  </defs>

                  {/* Pitch black backdrop */}
                  <rect width="100" height="100" fill="#000000" />

                  {/* Rim Light / Back Glow Behind Head */}
                  {activeLights.rim && (
                    <circle cx="50" cy="45" r="30" fill="none" stroke="#F27D26" strokeWidth="2.5" className="animate-pulse opacity-85" style={{ filter: 'blur(3px)' }} />
                  )}

                  {/* Core Head silhouette structure */}
                  <circle cx="50" cy="45" r="26" fill="url(#face-base)" />
                  <path d="M50 70 C35 70 30 90 30 100 L70 100 C70 90 65 70 50 70" fill="#080808" />

                  {/* Dynamically Lit Highlights based on selected light vectors */}
                  {activeLights.key && (
                    <path d="M50 19 C37 19 33 34 33 45 C33 55 38 65 47 69 C41 60 40 45 42 35 C44 27 46 22 50 19" fill="#FFC39E" opacity="0.7" />
                  )}

                  {activeLights.fill && (
                    <path d="M50 19 C63 19 67 34 67 45 C67 55 62 65 53 69 C59 60 60 45 58 35 C56 27 54 22 50 19" fill="#FFFFFF" opacity="0.3" />
                  )}

                  {activeLights.key && !activeLights.fill && (
                    <polygon points="56,42 62,47 55,51" fill="#FFC39E" opacity="0.65" />
                  )}

                  <circle cx="43" cy="41" r="2" fill="#555555" />
                  <circle cx="57" cy="41" r="2" fill="#555555" />
                </svg>
              </div>

              {/* Right Column: Fill Light Switch */}
              <button 
                onClick={() => setActiveLights(prev => ({ ...prev, fill: !prev.fill }))}
                className={`py-3 px-2 rounded-none text-[10px] font-mono border uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1.5 ${activeLights.fill ? 'bg-[#0A0A0A] text-white/80 border-[#F27D26]/40' : 'bg-black text-white/30 border-white/10'}`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>FILL LIGHT</span>
                <span className="text-[8px] opacity-65">{activeLights.fill ? '45° Right [ON]' : '[OFF]'}</span>
              </button>

              {/* Bottom Row centering the Rim Light Toggle */}
              <div className="col-span-3 flex justify-center mt-1">
                <button 
                  onClick={() => setActiveLights(prev => ({ ...prev, rim: !prev.rim }))}
                  className={`w-full py-2 rounded-none text-[9px] font-mono border transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${activeLights.rim ? 'bg-amber-950/40 text-amber-300 border-[#F27D26]' : 'bg-black text-white/30 border-white/10'}`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>RIM BACKGROUND BACKLIGHT (separation vector)</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'movements':
        return (
          <div className="bg-[#050505] p-5 rounded-none border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/40 font-mono">
              <span>Simulation Platform: Motion Pathing</span>
              <span className="text-[#F27D26] font-bold">Vector Path</span>
            </div>

            <div className="relative h-44 bg-black rounded-none border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-[0.05]">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-white"></div>
                ))}
              </div>

              {/* Camera Icon sweeping across */}
              <div 
                className={`absolute flex flex-col items-center justify-center text-white p-3 rounded-none bg-black border border-[#F27D26]/40 ${
                  selectedTerm.id === 'movement-dolly-zoom' ? 'animate-pulse scale-110' : 'animate-bounce'
                }`}
              >
                <Play className="w-7 h-7 text-[#F27D26] fill-[#F27D26]/10" />
                <span className="text-[9px] font-mono mt-1.5 uppercase font-black tracking-widest text-[#F27D26]">
                  {selectedTerm.name}
                </span>
                <span className="text-[8px] font-mono text-white/50 tracking-tighter uppercase mt-0.5">
                  {selectedTerm.id === 'movement-dolly-zoom' ? 'BKG WARP ACTIVE' : 'STEADY CAM BLOCKING'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'color-film':
        return (
          <div className="bg-[#050505] p-5 rounded-none border border-white/10 space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/40 font-mono">
              <span>Simulation Platform: LUT Space Color science</span>
              <span className="text-[#F27D26] font-bold">Chemical Profile</span>
            </div>

            {/* Grid showing comparison between Raw and Graded */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-28 bg-black rounded-none border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-[8px] font-mono text-white/30 absolute top-1.5 left-2 uppercase tracking-widest">LOG CAMERA BASE</span>
                <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                <div className="text-[9px] text-[#F2F2F2]/40 font-mono tracking-tighter uppercase mt-1.5">Unsaturated RAW</div>
              </div>

              <div className={`h-28 rounded-none border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                selectedTerm.id === 'color-kodachrome-vintage' ? 'bg-amber-950/20 text-amber-200 border-[#F27D26]' :
                selectedTerm.id === 'color-cinestill-800t' ? 'bg-cyan-950/20 text-cyan-200 border-cyan-700' :
                selectedTerm.id === 'color-teal-orange' ? 'bg-[#0A0A0A] text-white border-[#F27D26]' :
                'bg-black text-white grayscale contrast-150 border-white/30'
              }`}>
                <span className="text-[8px] font-mono text-[#F27D26] absolute top-1.5 left-2 uppercase tracking-widest">
                  {selectedTerm.name}
                </span>

                <div className={`w-10 h-10 rounded-full shadow-md ${
                  selectedTerm.id === 'color-kodachrome-vintage' ? 'bg-amber-400' :
                  selectedTerm.id === 'color-cinestill-800t' ? 'bg-cyan-400 border border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                  selectedTerm.id === 'color-teal-orange' ? 'bg-[#F27D26]' :
                  'bg-white'
                }`}></div>

                <div className="text-[9px] font-mono tracking-tighter uppercase mt-1.5">
                  {selectedTerm.id === 'color-kodachrome-vintage' ? 'Warm grain film' :
                   selectedTerm.id === 'color-cinestill-800t' ? 'Neon halation' :
                   selectedTerm.id === 'color-teal-orange' ? 'Hollywood contrast' :
                   'Strict shadow block'}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-[#050505] p-5 rounded-none border border-white/10 text-center text-white/40 text-xs font-mono py-10 uppercase">
            No dynamic simulations active for custom categories.
          </div>
        );
    }
  };

  const renderRealWorldFrame = () => {
    const imgInfo = REAL_WORLD_IMAGES[selectedTerm.id] || {
      url: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80",
      annotations: ["Default visual baseline frame", "Cinematic contrast composition", "Click list item to load specific reference"]
    };

    return (
      <div className="bg-[#050505] p-5 rounded-none border border-white/10 space-y-4 text-left">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/40 font-mono">
          <span>Camera Output: High-Fidelity Lens Frame</span>
          <span className="text-[#F27D26] font-bold">100% Optical Glass</span>
        </div>

        {/* Cinematic frame container */}
        <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden border border-white/10 group">
          <img 
            src={imgInfo.url} 
            alt={selectedTerm.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Dark gradient overlay for a true Hollywood masterclass look */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

          {/* Crop marks overlay to emphasize cinematic feel */}
          <div className="absolute inset-x-0 top-0 h-[6.5%] bg-black pointer-events-none opacity-85"></div>
          <div className="absolute inset-x-0 bottom-0 h-[6.5%] bg-black pointer-events-none opacity-85"></div>

          {/* Golden lens corners overlay */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/20 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20 pointer-events-none"></div>

          {/* Frame information overlay */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div className="bg-black/80 px-2 py-0.5 border border-white/10">
              <span className="text-[8px] font-mono font-black text-[#F27D26] uppercase tracking-widest">{selectedTerm.name}</span>
            </div>
            <div className="bg-black/80 px-1.5 py-0.5 border border-[#F27D26]/30">
              <span className="text-[7px] font-mono text-white/90 uppercase">1/48s • ISO 400 • F/2.0</span>
            </div>
          </div>
        </div>

        {/* Analytical layout breakdown / annotation chips */}
        <div className="space-y-2.5">
          <span className="text-[8px] font-mono font-black text-white/40 uppercase tracking-[0.15em] block">
            Core Visual Identifiers:
          </span>
          <div className="space-y-2">
            {imgInfo.annotations.map((ann, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-white/85 font-sans leading-relaxed">
                <span className="text-[#F27D26] font-mono font-bold shrink-0">[{idx + 1}]</span>
                <span>{ann}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Glossary search and grid (Col span 7) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Search header & Quick Filters */}
        <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-lg space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
            <input 
              type="text" 
              placeholder="Query parameters, focus models, studio setups..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black hover:bg-white-[0.02] text-white text-xs font-mono tracking-wide rounded-none border border-white/15 focus:border-[#F27D26]/70 focus:outline-none transition-all placeholder:text-white/20 uppercase"
              id="glossary-search-input"
            />
          </div>

          {/* Tab Categories in Editorial Aesthetic */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-[10px] uppercase font-mono font-bold tracking-widest rounded-none cursor-pointer transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-[#F27D26] text-black font-black' 
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              All Lectures
            </button>
            {Object.entries(PHOTOGRAPHY_CATEGORIES).map(([key, value]) => (
              <button 
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 text-[10px] uppercase font-mono font-bold tracking-widest rounded-none cursor-pointer transition-all border ${
                  selectedCategory === key 
                    ? 'bg-[#F27D26] text-black border-[#F27D26] font-black' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {value.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Categories / Term list in Dark Masterclass Grid */}
        <div className="space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 bg-[#0A0A0A] rounded-none border border-white/10 p-6">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest">No matching cinematography parameters found.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-3 text-[#F27D26] text-xs font-mono font-bold uppercase tracking-widest hover:underline">
                [ RESET LECTURE FILTERS ]
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((term) => {
                const isSelected = selectedTerm.id === term.id;
                const catInfo = PHOTOGRAPHY_CATEGORIES[term.category];
                return (
                  <div 
                    key={term.id}
                    onClick={() => handleSelectTerm(term)}
                    className={`p-6 rounded-none border cursor-pointer transition-all text-left flex flex-col justify-between h-48 relative overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-br from-[#0c0c0c] to-[#121212] text-white border-2 border-[#F27D26] shadow-xl' 
                        : 'bg-[#0A0A0A] hover:bg-white/[0.02] border-white/10 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-none font-mono uppercase tracking-widest ${
                          isSelected ? 'bg-[#F27D26] text-black' : 'bg-white/10 text-white/80 border border-white/10'
                        }`}>
                          {catInfo.title.split(' ')[0]}
                        </span>
                        <Info className={`w-4 h-4 ${isSelected ? 'text-[#F27D26]' : 'text-white/20'}`} />
                      </div>
                      <h3 className="font-display font-black text-white text-lg uppercase tracking-tight leading-none mb-1">
                        {term.name}
                      </h3>
                      <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${
                        isSelected ? 'text-white/70 font-sans' : 'text-white/40 font-sans'
                      }`}>
                        {term.definition}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#F27D26]">
                        {isSelected ? '● ACTIVE VECTOR' : 'INSPECT LAB'}
                      </span>
                      <span className="text-xs font-mono font-black uppercase text-white/50 hover:text-white flex items-center gap-1">
                        SELECT →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Details Examiner (Col span 5) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-2xl space-y-6 text-left sticky top-24">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#F27D26] uppercase font-bold">
                Cinematographer Master Inspector
              </span>
              <span className="text-[10px] font-mono text-white/30 uppercase">ID: {selectedTerm.id}</span>
            </div>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tighter">
              {selectedTerm.name}
            </h2>
            <div className="border-l-2 border-[#F27D26] pl-4 mt-3">
              <p className="text-white/70 text-sm leading-relaxed font-serif italic">
                {selectedTerm.definition}
              </p>
            </div>
          </div>

          {/* Visualization Platform Selector */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1 p-1 bg-black border border-white/10 select-none">
              <button 
                onClick={() => setActiveVisualTab('reference')} 
                className={`py-2 px-3 text-[9px] font-mono font-black uppercase tracking-widest text-center transition-all cursor-pointer ${
                  activeVisualTab === 'reference' 
                    ? 'bg-[#F27D26] text-black font-black' 
                    : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                📸 Real-World Frame
              </button>
              <button 
                onClick={() => setActiveVisualTab('simulator')} 
                className={`py-2 px-3 text-[9px] font-mono font-black uppercase tracking-widest text-center transition-all cursor-pointer ${
                  activeVisualTab === 'simulator' 
                    ? 'bg-[#F27D26] text-black font-black' 
                    : 'bg-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                🧪 Axis Simulator
              </button>
            </div>
            <p className="text-[9px] font-mono text-white/40 uppercase tracking-wider text-center">
              {activeVisualTab === 'reference' 
                ? '• Authentic reference photograph showing real optical behavior'
                : '• Interactive vector schematic: click lights/sliders below to test light vectors'}
            </p>
          </div>

          {/* Render selected representation */}
          {activeVisualTab === 'simulator' ? (
            renderInteractiveSimulator()
          ) : (
            renderRealWorldFrame()
          )}

          {/* Bullet specifications */}
          <div className="space-y-4 pt-1">
            <div className="bg-black p-4 rounded-none border border-white/10">
              <h4 className="text-[10px] uppercase tracking-widest font-black text-[#F27D26] font-mono flex items-center gap-2 mb-2">
                <Sliders className="w-3.5 h-3.5 text-[#F27D26]" />
                PROMPTING KEY TOKEN (IMAGE MODEL)
              </h4>
              <p className="text-xs font-mono text-white/80 bg-white/5 p-3 rounded-none border border-white/5 break-words leading-relaxed select-all">
                {selectedTerm.promptSnippets.image}
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <button 
                  onClick={() => handleCopy(selectedTerm.promptSnippets.image, 'img')}
                  className="px-3 py-1.5 text-[9px] uppercase font-mono font-bold tracking-widest rounded-none cursor-pointer border border-white/10 bg-black hover:bg-white/10 text-white flex items-center gap-1.5"
                >
                  {copiedField === 'img' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'img' ? 'COPIED' : 'COPY'}</span>
                </button>
                <button 
                  onClick={() => onAddTermToFormula(selectedTerm.category, selectedTerm.id)}
                  className="px-3.5 py-1.5 text-[9px] uppercase font-mono font-black tracking-widest rounded-none cursor-pointer bg-[#F27D26] hover:bg-white text-black flex items-center gap-1.5 transition-colors"
                >
                  <span>+ ADD PARAMETER</span>
                </button>
              </div>
            </div>

            {selectedTerm.promptSnippets.video && (
              <div className="bg-black p-4 rounded-none border border-white/10">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-[#F27D26] font-mono flex items-center gap-2 mb-2">
                  <Play className="w-3.5 h-3.5 text-[#F27D26]" />
                  CHOREOGRAPHY VECTOR (VIDEO GENERATOR)
                </h4>
                <p className="text-xs font-mono text-white/80 bg-white/5 p-3 rounded-none border border-white/5 break-words leading-relaxed select-all">
                  {selectedTerm.promptSnippets.video}
                </p>
                <div className="flex justify-end gap-2 mt-3">
                  <button 
                    onClick={() => handleCopy(selectedTerm.promptSnippets.video || '', 'video')}
                    className="px-3 py-1.5 text-[9px] uppercase font-mono font-bold tracking-widest rounded-none cursor-pointer border border-white/10 bg-black hover:bg-white/10 text-white flex items-center gap-1.5"
                  >
                    {copiedField === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'video' ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="border-l-2 border-[#F27D26] pl-3 leading-relaxed">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F27D26] block font-mono">Masterclass Rule of Thumbs</span>
              <p className="text-white/60 text-xs mt-1 font-serif italic">{selectedTerm.tip}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-none border border-white/5 text-xs text-white/70">
              <span className="font-extrabold uppercase tracking-widest text-[#F27D26] flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4 text-[#F27D26]" />
                Director Of Photography's (DP) Lesson
              </span>
              <p className="leading-relaxed text-white/60 font-sans">{selectedTerm.expertInsight}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
