import React, { useState, useEffect } from 'react';
import { PHOTOGRAPHY_TERMS } from '../photographyData';
import { PromptFormula } from '../types';
import { Sliders, Camera, Minimize2, Eye, Compass, Copy, Check, Sparkles } from 'lucide-react';

interface PromptBuilderProps {
  initialFormula: PromptFormula;
  setFormula: React.Dispatch<React.SetStateAction<PromptFormula>>;
  onTriggerOptimization: () => void;
}

const ASPECT_RATIOS = [
  { label: "16:9 Cinema Widescreen", value: "--ar 16:9" },
  { label: "2.39:1 Anamorphic Scope", value: "--ar 2.39:1" },
  { label: "9:16 Tiktok / Vertical Video", value: "--ar 9:16" },
  { label: "1:1 Instagram Square", value: "--ar 1:1" },
  { label: "4:3 Classic Television", value: "--ar 4:3" }
];

const CAMERA_GEAR_PRESETS = [
  { label: "ARRI Alexa LF, Zeiss Master Prime", value: "shot on ARRI ALEXA LF, legendary Zeiss Master Prime optics" },
  { label: "Hasselblad H6D-100c Medium Format", value: "Hasselblad H6D-100c medium format camera, phase-one detail rendering" },
  { label: "35mm Panavision Millennium XL2 film", value: "shot on 35mm film using Panavision Millennium XL2 cameras" },
  { label: "IMAX 70mm Large Format System", value: "captured on breathtaking IMAX 70mm film cameras, cinematic resolution" },
  { label: "Red V-Raptor 8K Cinema Setup", value: "filmed on Red V-Raptor 8K digital cinema cameras" }
];

export default function PromptBuilder({ initialFormula, setFormula, onTriggerOptimization }: PromptBuilderProps) {
  const [copiedType, setCopiedType] = useState<'img' | 'video' | null>(null);
  const [compiledImagePrompt, setCompiledImagePrompt] = useState('');
  const [compiledVideoPrompt, setCompiledVideoPrompt] = useState('');

  // Extract terms for lists
  const lensesList = PHOTOGRAPHY_TERMS.filter(t => t.category === 'lenses');
  const anglesList = PHOTOGRAPHY_TERMS.filter(t => t.category === 'angles');
  const framingList = PHOTOGRAPHY_TERMS.filter(t => t.category === 'framing');
  const lightingList = PHOTOGRAPHY_TERMS.filter(t => t.category === 'lighting');
  const movementsList = PHOTOGRAPHY_TERMS.filter(t => t.category === 'movements');
  const colorList = PHOTOGRAPHY_TERMS.filter(t => t.category === 'color-film');

  // Trigger prompt compiling loop
  useEffect(() => {
    const lensObj = PHOTOGRAPHY_TERMS.find(t => t.id === initialFormula.lensId);
    const angleObj = PHOTOGRAPHY_TERMS.find(t => t.id === initialFormula.angleId);
    const framingObj = PHOTOGRAPHY_TERMS.find(t => t.id === initialFormula.framingId);
    const lightingObj = PHOTOGRAPHY_TERMS.find(t => t.id === initialFormula.lightingId);
    const movementObj = PHOTOGRAPHY_TERMS.find(t => t.id === initialFormula.movementId);
    const colorObj = PHOTOGRAPHY_TERMS.find(t => t.id === initialFormula.colorGradeId);

    // Build Image Prompt
    const imgChunks: string[] = [];
    if (framingObj) imgChunks.push(framingObj.name + " framing");
    if (angleObj) imgChunks.push(angleObj.name + " perspective");
    
    // Core Subject
    const cleanedSubject = initialFormula.subject.trim() || "[Insert Subject Here]";
    imgChunks.push(cleanedSubject);

    if (lensObj) imgChunks.push(lensObj.promptSnippets.image);
    if (lightingObj) imgChunks.push(lightingObj.promptSnippets.image);
    if (colorObj) imgChunks.push(colorObj.promptSnippets.image);
    
    if (initialFormula.filmStock) {
      imgChunks.push(initialFormula.filmStock);
    }
    if (initialFormula.customNotes.trim()) {
      imgChunks.push(initialFormula.customNotes.trim());
    }
    
    // Join with aspect ratio
    const imgText = imgChunks.join(', ') + `, high fidelity cinematic capture, cinematic composition ${initialFormula.aspectRatio}`;
    setCompiledImagePrompt(imgText);

    // Build Video Prompt focusing on motion and choreography
    const vidChunks: string[] = [];
    if (movementObj) {
      vidChunks.push(movementObj.promptSnippets.video || `high speed panoramic camera move`);
    } else {
      vidChunks.push("Slow, cinematic forward camera tracking shot");
    }

    vidChunks.push(`capturing ${cleanedSubject}`);

    if (framingObj) vidChunks.push(`framed in a ${framingObj.name}`);
    if (angleObj) vidChunks.push(`from a ${angleObj.name}`);
    if (lensObj) vidChunks.push(`with ${lensObj.name} optics`);
    if (lightingObj) {
      vidChunks.push(`illuminated by ${lightingObj.promptSnippets.video || lightingObj.name}`);
    }
    if (colorObj) {
      vidChunks.push(`graded in ${colorObj.name} film emulation style`);
    }
    if (initialFormula.filmStock) {
      vidChunks.push(`giving a look of ${initialFormula.filmStock}`);
    }

    setCompiledVideoPrompt(vidChunks.join(', ') + '. Smooth pacing, photorealistic spatial lighting transitions.');

  }, [initialFormula]);

  const handleCopy = (text: string, type: 'img' | 'video') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const updateField = (field: keyof PromptFormula, value: string) => {
    setFormula(prev => ({ ...prev, [field]: value }));
  };

  const fillExamplePreset = (presetName: string) => {
    if (presetName === 'cyber') {
      setFormula({
        subject: "A solitary female cyber-hacker surrounded by green computer terminals inside a subterranean safehouse",
        lensId: "lens-anamorphic",
        angleId: "angle-over-the-shoulder",
        framingId: "framing-medium-shot",
        lightingId: "lighting-lowkey",
        movementId: "movement-steadicam-tracking",
        colorGradeId: "color-cinestill-800t",
        filmStock: "Red V-Raptor 8K Cinema Setup",
        aspectRatio: "--ar 2.39:1",
        customNotes: "rain drops sliding down background reinforced security glass, neon cyan glowing indicators"
      });
    } else if (presetName === 'classic') {
      setFormula({
        subject: "An aged jazz saxophonist completely lost in a heavy solo under a single bright spotlight",
        lensId: "lens-portrait-85mm",
        angleId: "angle-low-hero",
        framingId: "framing-cowboy-american",
        lightingId: "lighting-rembrandt",
        movementId: "movement-dolly-zoom",
        colorGradeId: "color-film-noir-blackwhite",
        filmStock: "35mm Panavision Millennium XL2 film",
        aspectRatio: "--ar 16:9",
        customNotes: "puffs of smoke swirling inside the dramatic golden lightbeam, deep emotional wrinkles, brass instrument reflection"
      });
    } else {
      setFormula({
        subject: "A majestic golden eagle taking flight off a jagged rocky precipice at sunrise",
        lensId: "lens-telephoto-200mm",
        angleId: "angle-high-bird",
        framingId: "framing-extreme-wide",
        lightingId: "lighting-rim-edge",
        movementId: "movement-crane-jib-reveal",
        colorGradeId: "color-kodachrome-vintage",
        filmStock: "IMAX 70mm Large Format System",
        aspectRatio: "--ar 16:9",
        customNotes: "morning volumetric mist rising off mountain peaks, extreme detail of individual feather structures, high-contrast golden aura"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Controls (Col span 7) */}
      <div className="lg:col-span-7 bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-lg space-y-6 text-left">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/15 pb-4 gap-3">
          <h3 className="font-display font-black text-lg text-white flex items-center gap-2 uppercase tracking-tight">
            <Sliders className="w-5 h-5 text-[#F27D26]" />
            Formula Controller
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button 
              type="button" 
              onClick={() => fillExamplePreset('cyber')}
              className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest rounded-none cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-[#F2F2F2]"
            >
              Cyber Preset
            </button>
            <button 
              type="button" 
              onClick={() => fillExamplePreset('classic')}
              className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest rounded-none cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-[#F2F2F2]"
            >
              Noir Preset
            </button>
            <button 
              type="button" 
              onClick={() => fillExamplePreset('eagle')}
              className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest rounded-none cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 text-[#F2F2F2]"
            >
              Nature Preset
            </button>
          </div>
        </div>

        {/* 1. Subject Description Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-black text-[#F27D26] uppercase tracking-[0.2em] block">
            01. Core Subject Narrative
          </label>
          <textarea
            placeholder="Describe the subject, clothing, action, and focal context (e.g., A vintage Porsche driving around a dusty desert road)..."
            value={initialFormula.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            className="w-full bg-black p-4 text-white text-xs font-mono tracking-wide rounded-none border border-white/15 focus:border-[#F27D26]/70 focus:outline-none h-28 uppercase"
          />
        </div>

        {/* Grid controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 2. Lenses select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">02. Optics & Lens</label>
            <select
              value={initialFormula.lensId || ""}
              onChange={(e) => updateField('lensId', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="">No special lens (Standard/Auto)</option>
              {lensesList.map(lens => (
                <option key={lens.id} value={lens.id}>{lens.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 3. Camera angle select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">03. Camera Angle</label>
            <select
              value={initialFormula.angleId || ""}
              onChange={(e) => updateField('angleId', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="">No special angle (Eye Level)</option>
              {anglesList.map(angle => (
                <option key={angle.id} value={angle.id}>{angle.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 4. Framing scale select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">04. Shot Framing (Scale)</label>
            <select
              value={initialFormula.framingId || ""}
              onChange={(e) => updateField('framingId', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="">No special framing (Full automatic)</option>
              {framingList.map(framing => (
                <option key={framing.id} value={framing.id}>{framing.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 5. Lighting Setup select */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">05. Studio Lighting Setup</label>
            <select
              value={initialFormula.lightingId || ""}
              onChange={(e) => updateField('lightingId', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="">Standard lighting</option>
              {lightingList.map(lighting => (
                <option key={lighting.id} value={lighting.id}>{lighting.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 6. Motion vector (specifically helpful for video prompts) */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">06. Cinematic Camera Motion</label>
            <select
              value={initialFormula.movementId || ""}
              onChange={(e) => updateField('movementId', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="">Static camera framework</option>
              {movementsList.map(mov => (
                <option key={mov.id} value={mov.id}>{mov.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 7. Film color chemistry stocks */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">07. Color Grade / Film Chemistry</label>
            <select
              value={initialFormula.colorGradeId || ""}
              onChange={(e) => updateField('colorGradeId', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="">Neutral digital color grade</option>
              {colorList.map(color => (
                <option key={color.id} value={color.id}>{color.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 8. Camera system preset */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">08. Camera Gear preset</label>
            <select
              value={initialFormula.filmStock || ""}
              onChange={(e) => updateField('filmStock', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              <option value="">Standard 35mm cameras (Default)</option>
              {CAMERA_GEAR_PRESETS.map((gear, idx) => (
                <option key={idx} value={gear.value}>{gear.label.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* 9. Aspect Ratio parameter */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-mono font-bold uppercase tracking-wide text-white/50 block">09. Canvas Aspect Ratio</label>
            <select
              value={initialFormula.aspectRatio || ""}
              onChange={(e) => updateField('aspectRatio', e.target.value)}
              className="w-full bg-black p-3 rounded-none border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-[#F27D26]"
            >
              {ASPECT_RATIOS.map((ar, idx) => (
                <option key={idx} value={ar.value}>{ar.label.toUpperCase()}</option>
              ))}
            </select>
          </div>

        </div>

        {/* 10. Advanced Environment text */}
        <div className="space-y-2 pt-1">
          <label className="text-[10px] font-mono font-black text-[#F27D26] uppercase tracking-[0.2em] block">
            10. Custom Atmospheric Particles / Secondary Notes
          </label>
          <input
            type="text"
            placeholder="Mist, rain-swept highway, steam from manholes, dust motes floating in spotlight lens flares..."
            value={initialFormula.customNotes}
            onChange={(e) => updateField('customNotes', e.target.value)}
            className="w-full bg-black p-4 text-white text-xs font-mono tracking-wide rounded-none border border-white/15 focus:border-[#F27D26]/70 focus:outline-none uppercase"
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Output Preview & Trigger Optimization (Col span 5) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 text-white space-y-6 text-left shadow-2xl relative">
          
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h4 className="font-sans font-extrabold text-sm tracking-wide text-[#F27D26] flex items-center gap-1.5 uppercase leading-none">
              <Camera className="w-4 h-4" />
              Formula Draftboard
            </h4>
            <span className="text-[9px] bg-[#F27D26] text-black px-2 py-0.5 rounded-none font-mono font-black tracking-widest leading-none">LIVE COMPILE</span>
          </div>

          {/* Image generation prompt */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60 font-mono font-bold flex items-center gap-1 uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#F27D26]" />
                01. Midjourney Diffusion Vector
              </span>
              <button 
                onClick={() => handleCopy(compiledImagePrompt, 'img')}
                className="text-[10px] font-mono font-black uppercase tracking-wider text-[#F27D26] hover:text-white transition-colors flex items-center gap-1 outline-none"
              >
                {copiedType === 'img' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'img' ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
            <div className="bg-black border border-white/10 p-4 rounded-none text-xs font-mono text-white/80 break-words leading-relaxed select-all">
              {compiledImagePrompt}
            </div>
          </div>

          {/* Video generation prompt */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60 font-mono font-bold flex items-center gap-1 uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-[#F27D26]" />
                02. Sora Dynamic Video Vector
              </span>
              <button 
                onClick={() => handleCopy(compiledVideoPrompt, 'video')}
                className="text-[10px] font-mono font-black uppercase tracking-wider text-[#F27D26] hover:text-white transition-colors flex items-center gap-1 outline-none"
              >
                {copiedType === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'video' ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>
            <div className="bg-black border border-white/10 p-4 rounded-none text-xs font-mono text-white/80 break-words leading-relaxed select-all">
              {compiledVideoPrompt}
            </div>
          </div>

          {/* Gemini Direct Action */}
          <div className="pt-2">
            <button
              onClick={onTriggerOptimization}
              className="w-full bg-[#F27D26] hover:bg-white text-black font-black py-4 px-4 rounded-none text-xs tracking-[0.16em] uppercase transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
              <span>SUPERCHARGE DRAFT WITH GEMINI</span>
            </button>
            <p className="text-[10px] text-white/40 leading-normal text-center mt-3 font-mono uppercase tracking-wider">
              ⚡ triggers our server-side <span className="text-[#F27D26]">gemini-3.5-flash</span> cinematographer engine to evaluate and expand syntax.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
