import React, { useState, useEffect } from 'react';
import { OptimizationResult } from '../types';
import { Sparkles, Compass, Film, ListFilter, AlertCircle, Copy, Check, Eye, HelpCircle, Loader2 } from 'lucide-react';

interface PromptOptimizerProps {
  draftedPrompt: string;
}

const LOADING_MESSAGES = [
  "POSITIONING VIRTUAL STUDIO KEY LIGHTS...",
  "CALIBRATING ANAMORPHIC OPTIC STRUCTURES...",
  "SIMULATING CINESTILL 800T CHEMISTRY CURVES...",
  "CHOREOGRAPHING FLUID TRACKING MOTION PATHS...",
  "DRAFTING PROFESSIONAL CINEMATOGRAPHER GUIDELINES...",
  "SYNTHESIZING HIGH CONTRAST CHIAROSCURO RATIOS..."
];

export default function PromptOptimizer({ draftedPrompt }: PromptOptimizerProps) {
  const [activePrompt, setActivePrompt] = useState(draftedPrompt || '');
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [copiedType, setCopiedType] = useState<'img' | 'video' | null>(null);

  // Sync if draftedPrompt changes from Formula Lab
  useEffect(() => {
    if (draftedPrompt && !activePrompt) {
      setActivePrompt(draftedPrompt);
    }
  }, [draftedPrompt]);

  // Cycling loading message effect
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleOptimize = async () => {
    const promptToSend = activePrompt.trim() || draftedPrompt.trim();
    if (!promptToSend) return;

    setLoading(true);
    setErrorString(null);
    setResult(null);
    setLoadingMsgIdx(0);

    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToSend })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (err: any) {
      console.error("Optimization failed:", err);
      setErrorString(err.message || "An unexpected error occurred while communicating with the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'img' | 'video') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const QUICK_PRESETS = [
    { label: "NEON DETECTIVE", prompt: "A brooding cybernetic detective smoking a cigarette under pouring rain in a narrow neon-drenched alleyway." },
    { label: "AMALFI COAST", prompt: "A vintage 1965 convertible speeding along the dramatic sun-drenched Amalfi cliffside road at sunset." },
    { label: "MACRO WATCHMAKER", prompt: "Extreme macro detail of delicate brass gears, rubies, and moving balance wheel inside a Swiss mechanical wristwatch." },
    { label: "SAHARA NOMAD", prompt: "A solitary Tuareg nomad and camel standing atop a wind-sculpted sand dune during golden hour." }
  ];

  return (
    <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-lg text-left space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/15 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display font-black text-lg text-white flex items-center gap-2 uppercase tracking-tight">
              <Sparkles className="w-5 h-5 text-[#F27D26] animate-pulse" />
              Gemini Director of Photography AI
            </h3>
            <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              gemini-3.8-flash
            </span>
          </div>
          <p className="text-xs text-white/50 font-sans mt-0.5 uppercase tracking-wide">
            Powered by the latest Gemini 3.8 Flash model. Transforms raw concepts into high-end cinematic prompts with lenses, lighting ratios, and camera movement.
          </p>
        </div>

        <button
          onClick={handleOptimize}
          disabled={loading || !activePrompt.trim()}
          className="px-6 py-3 bg-[#F27D26] hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-black text-xs font-black font-mono tracking-widest rounded-none cursor-pointer shadow-md transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>OPTIMIZING PROMPT...</span>
            </>
          ) : (
            <>
              <span>LAUNCH GEMINI 3.8 FLASH</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Prompt Input & Preset Bar */}
      <div className="bg-black p-5 rounded-none border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <label className="text-[10px] font-mono font-bold text-[#F27D26] uppercase tracking-wider flex items-center gap-2">
            <span>INPUT PROMPT DRAFT</span>
            <span className="text-white/30 text-[9px] font-normal">(Type custom or click a preset below)</span>
          </label>
          {draftedPrompt && draftedPrompt !== activePrompt && (
            <button
              onClick={() => setActivePrompt(draftedPrompt)}
              className="text-[9px] font-mono text-white/60 hover:text-[#F27D26] transition-colors underline uppercase cursor-pointer"
            >
              Load from Formula Lab
            </button>
          )}
        </div>

        <textarea
          value={activePrompt}
          onChange={(e) => setActivePrompt(e.target.value)}
          placeholder="Enter a raw concept (e.g., A weary detective standing in the rain under streetlights...)"
          className="w-full bg-neutral-950 p-3.5 text-xs font-mono text-white/90 border border-white/15 focus:border-[#F27D26] focus:outline-none rounded-none leading-relaxed h-20 resize-y"
        />

        {/* Quick test presets */}
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest mr-1">TEST PRESETS:</span>
          {QUICK_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => setActivePrompt(preset.prompt)}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:border-[#F27D26]/40 border border-white/10 text-white/80 font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state rendering */}
      {loading && (
        <div className="py-16 text-center space-y-4">
          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 text-[#F27D26] animate-spin" />
          </div>
          <p className="text-white font-bold font-mono text-xs animate-pulse tracking-widest">
            {LOADING_MESSAGES[loadingMsgIdx]}
          </p>
          <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
            Sending raw configurations to Server-Side Gemini and loading expert cinematographer matrices...
          </p>
        </div>
      )}

      {/* Error State */}
      {errorString && (
        <div className="bg-[#1A0B0E] border border-red-900 p-4 rounded-none text-red-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 leading-normal font-sans">
              <span className="font-bold uppercase tracking-wider text-red-400">Gemini Notice:</span>
              <p className="text-white/80">{errorString}</p>
              <p className="text-[9px] text-red-400 font-mono uppercase tracking-wider mt-1.5">
                Tip: Spikes in model demand or rate limits clear quickly. Click retry below to query Gemini again.
              </p>
            </div>
          </div>
          <button
            onClick={handleOptimize}
            className="px-3.5 py-1.5 bg-red-950/80 hover:bg-white hover:text-black border border-red-500/40 text-red-200 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors shrink-0 cursor-pointer"
          >
            Retry Now
          </button>
        </div>
      )}

      {/* Welcome Blank State */}
      {!loading && !result && !errorString && (
        <div className="py-12 border border-dashed border-white/10 bg-black/40 rounded-none text-center p-6 space-y-3">
          <Sparkles className="w-8 h-8 text-[#F27D26] mx-auto animate-pulse" />
          <h4 className="font-mono text-white text-xs uppercase tracking-widest">Waiting for Cinematographer's Lens...</h4>
          <p className="text-white/60 text-xs leading-relaxed max-w-md mx-auto font-sans leading-relaxed">
            Draft your scenario in the <span className="font-semibold text-white">Formula Lab</span>, or load a preset, then click <span className="font-semibold text-[#F27D26]">"SUPERCHARGE DRAFT WITH GEMINI"</span> to trigger AI-directed vocabulary injection.
          </p>
        </div>
      )}

      {/* Success result view */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Aesthetic Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black p-4 rounded-none border border-white/10 text-left">
              <span className="text-[9px] font-bold text-[#F27D26] font-mono uppercase tracking-widest block">Scene Aesthetic Target</span>
              <p className="text-[#F2F2F2] font-black font-display text-sm mt-1 uppercase tracking-tight">{result.sceneAtmosphere}</p>
            </div>
            <div className="bg-black p-4 rounded-none border border-white/10 text-left">
              <span className="text-[9px] font-bold text-[#F27D26] font-mono uppercase tracking-widest block">Cinematographic Analogy</span>
              <p className="text-[#F2F2F2]/80 font-sans text-xs mt-1 leading-relaxed">
                {result.cinematicAnalogy || "Consistent with standard high-budget prestige cinematography."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-1">
            {/* Expanded Image Prompt */}
            <div className="bg-black border border-white/10 p-5 rounded-none space-y-3 text-white">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#F27D26] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  OPT_IMAGE_PROMPT (Diffusion Vector)
                </span>
                <button
                  onClick={() => handleCopy(result.optimizedImagePrompt, 'img')}
                  className="px-3 py-1.5 text-[9px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-none text-white font-mono uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedType === 'img' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'img' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-white/90 bg-neutral-950 p-4 rounded-none break-words leading-relaxed select-all border border-white/5">
                {result.optimizedImagePrompt}
              </p>
              <p className="text-[10px] text-white/50 leading-relaxed font-sans mt-2">
                💡 <span className="text-[#F27D26] font-mono font-bold">DP's Rule:</span> Paste this absolute string directly. The explicit glass, lighting ratio structures, and stock choices prevent the AI from generating generic low-contrast CG.
              </p>
            </div>

            {/* Expanded Video Prompt */}
            <div className="bg-black border border-white/10 p-5 rounded-none space-y-3 text-white">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#F27D26] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  OPT_VIDEO_PROMPT (Kinetic Vector)
                </span>
                <button
                  onClick={() => handleCopy(result.optimizedVideoPrompt, 'video')}
                  className="px-3 py-1.5 text-[9px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-none text-white font-mono uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedType === 'video' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'video' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-white/90 bg-neutral-950 p-4 rounded-none break-words leading-relaxed select-all border border-white/5">
                {result.optimizedVideoPrompt}
              </p>
              {result.pacingBreakdown && (
                <div className="bg-[#F27D26]/5 p-3 rounded-none border border-[#F27D26]/15 text-[11px] leading-relaxed">
                  <span className="font-bold flex items-center gap-1 text-[#F27D26] uppercase font-mono text-[9px] tracking-wider select-none mb-1">
                    <ListFilter className="w-3.5 h-3.5" />
                    Recommended Camera Choreography Pacing:
                  </span>
                  <p className="leading-relaxed text-white/70 font-sans">{result.pacingBreakdown}</p>
                </div>
              )}
            </div>
          </div>

          {/* Added Vocabulary breakdowns */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs font-mono font-black text-[#F27D26] uppercase tracking-[0.2em]">
              Cinematic Jargon Introduced by Gemini DP
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.addedVocabulary && result.addedVocabulary.map((item, idx) => (
                <div key={idx} className="bg-black border border-white/10 p-4 rounded-none space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                      <span className="text-xs font-display font-black text-white block uppercase tracking-wider">{item.term}</span>
                      <span className="text-[8px] bg-white/5 text-white/80 border border-white/10 font-mono rounded-none px-1.5 py-0.5 uppercase tracking-widest">
                        {item.category || "Optics"}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs mt-1.5 leading-relaxed font-sans">{item.benefit}</p>
                  </div>
                  
                  <span className="text-[9px] text-[#F27D26] block pt-1.5 border-t border-white/5 font-mono select-none uppercase tracking-widest">
                    🔑 Parsing Weight: High
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
