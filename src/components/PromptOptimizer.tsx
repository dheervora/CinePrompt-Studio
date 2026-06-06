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
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [copiedType, setCopiedType] = useState<'img' | 'video' | null>(null);

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
    if (!draftedPrompt.trim()) return;

    setLoading(true);
    setErrorString(null);
    setResult(null);
    setLoadingMsgIdx(0);

    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: draftedPrompt })
      });

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
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

  return (
    <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-lg text-left space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/15 pb-4">
        <div>
          <h3 className="font-display font-black text-lg text-white flex items-center gap-2 uppercase tracking-tight">
            <Sparkles className="w-5 h-5 text-[#F27D26] animate-pulse" />
            Gemini Director of Photography AI
          </h3>
          <p className="text-xs text-white/50 font-sans mt-0.5 uppercase tracking-wide">
            Evaluate, test, and adapt prompts into highly articulate cinematic statements.
          </p>
        </div>

        <button
          onClick={handleOptimize}
          disabled={loading || !draftedPrompt.trim()}
          className="px-6 py-3 bg-[#F27D26] hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-black text-xs font-black font-mono tracking-widest rounded-none cursor-pointer shadow-md transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>SUPERCHARGING...</span>
            </>
          ) : (
            <>
              <span>LAUNCH AI CRITIQUE</span>
            </>
          )}
        </button>
      </div>

      {/* Drafted Source Reference */}
      <div className="bg-black p-4 rounded-none border border-white/10 space-y-1">
        <span className="text-[9px] font-bold text-[#F27D26] uppercase font-mono tracking-wider">ACTIVE SELECTION SOURCE:</span>
        <p className="text-xs text-white/80 font-sans italic leading-relaxed line-clamp-2">
          "{draftedPrompt || "No prompt draft has been fed yet. Go to Formula Lab to assemble a draft or type directly in custom subjects."}"
        </p>
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
        <div className="bg-[#1A0B0E] border border-red-900 p-4 rounded-none text-red-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 leading-normal font-sans">
            <span className="font-bold uppercase tracking-wider text-red-400">Gemini API Connection Problem:</span>
            <p className="text-white/80">{errorString}</p>
            <p className="text-[9px] text-red-400 font-mono uppercase tracking-wider mt-1.5">
              Check that your Secrets are verified in settings. Running local simulations fallback if key unavailable.
            </p>
          </div>
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
