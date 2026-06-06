import React, { useState } from 'react';
import InteractiveGlossary from './components/InteractiveGlossary';
import PromptBuilder from './components/PromptBuilder';
import PromptOptimizer from './components/PromptOptimizer';
import PracticeArena from './components/PracticeArena';
import AgentExporter from './components/AgentExporter';
import { PromptFormula } from './types';
import { Camera, BookOpen, Sliders, Sparkles, Cpu, Trophy, Code2, AlertCircle, RefreshCw } from 'lucide-react';

const defaultFormula: PromptFormula = {
  subject: "",
  lensId: "",
  angleId: "",
  framingId: "",
  lightingId: "",
  movementId: "",
  colorGradeId: "",
  filmStock: "",
  aspectRatio: "--ar 16:9",
  customNotes: ""
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'glossary' | 'builder' | 'optimizer' | 'practice' | 'exporter'>('glossary');
  const [formula, setFormula] = useState<PromptFormula>(defaultFormula);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddTermToFormula = (category: string, value: string) => {
    setFormula((prev) => {
      const fieldIdMap: Record<string, keyof PromptFormula> = {
        lenses: 'lensId',
        angles: 'angleId',
        framing: 'framingId',
        lighting: 'lightingId',
        movements: 'movementId',
        'color-film': 'colorGradeId'
      };

      const targetField = fieldIdMap[category];
      if (!targetField) return prev;

      return {
        ...prev,
        [targetField]: value
      };
    });

    // Provide premium reactive popup indicator
    setToastMessage(`Term compiled into ${category} formula register!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleTriggerOptimization = () => {
    // Navigates directly to prompt optimizer with our drafted string ready!
    setActiveTab('optimizer');
  };

  const compileQuickDraft = () => {
    // Simple mock of compiled state to show in toast or optimizer
    const parts = [
      formula.subject.trim() || "[Core Subject]",
      formula.lensId ? "lens: " + formula.lensId.replace('lens-', '') : "",
      formula.lightingId ? "lighting: " + formula.lightingId.replace('lighting-', '') : "",
      formula.colorGradeId ? "style: " + formula.colorGradeId.replace('color-', '') : ""
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#F2F2F2] bg-[#050505] select-none antialiased">
      {/* Dynamic Slide-in Toast Alert in Editorial theme */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#0A0A0A] border-2 border-[#F27D26] text-[#F2F2F2] font-mono text-xs py-3 px-5 rounded-none shadow-2xl transition-all">
          <Sparkles className="w-4 h-4 text-[#F27D26] animate-pulse" />
          <span className="font-extrabold uppercase tracking-wider">{toastMessage}</span>
          <button 
            onClick={() => setActiveTab('builder')}
            className="ml-3 text-[#F27D26] underline hover:text-white text-[11px] font-bold uppercase tracking-widest"
          >
            EDIT FORMULA
          </button>
        </div>
      )}

      {/* Header section in Dark Editorial masterclass style */}
      <header className="bg-[#050505] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex flex-col sm:flex-row justify-between items-center py-4 sm:py-0 gap-4">
          
          {/* Logo brand */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F27D26] text-black flex items-center justify-center font-black rounded-none shadow-md">
              <Camera className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#F27D26] font-bold block leading-none mb-1">CinePrompt MASTERCLASS v.21</span>
              <h1 className="font-display font-black text-white text-2xl tracking-tighter leading-none uppercase">
                Visual Vocabulary
              </h1>
            </div>
          </div>

          {/* Quick clinical stats strips */}
          <div className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-wider">
            <div className="text-right">
              <span className="text-white/40 block text-[9px] font-extrabold mb-0.5">LECTURE INDEX</span>
              <span className="text-white font-bold">18 Concept Blocks</span>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="text-right">
              <span className="text-white/40 block text-[9px] font-extrabold mb-0.5">EXAM BOARD</span>
              <span className="text-[#F27D26] font-bold">Active Quiz Desk</span>
            </div>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="text-right">
              <span className="text-white/40 block text-[9px] font-extrabold mb-0.5">INTELLIGENCE</span>
              <span className="text-white font-extrabold">Gemini 3.5 AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Header selector tab bar - Flat Editorial Layout */}
      <nav className="bg-[#0A0A0A] border-b border-white/10 sticky top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex overflow-x-auto gap-1 sm:gap-2 py-0 justify-start scrollbar-hide">
            
            <button
              onClick={() => setActiveTab('glossary')}
              className={`px-5 py-4 text-xs font-mono font-bold tracking-[0.16em] uppercase rounded-none transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'glossary' 
                  ? 'border-[#F27D26] text-white bg-white/5 font-extrabold' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white-[0.02]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#F27D26]" />
              <span>01. STUDY GLOSSARY</span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`px-5 py-4 text-xs font-mono font-bold tracking-[0.16em] uppercase rounded-none transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'builder' 
                  ? 'border-[#F27D26] text-white bg-white/5 font-extrabold' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white-[0.02]'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#F27D26]" />
              <span>02. FORMULA LAB</span>
              {formula.subject && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('optimizer')}
              className={`px-5 py-4 text-xs font-mono font-bold tracking-[0.16em] uppercase rounded-none transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'optimizer' 
                  ? 'border-[#F27D26] text-white bg-white/5 font-extrabold' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white-[0.02]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F27D26]" />
              <span>03. AI SUPERCHARGER</span>
            </button>

            <button
              onClick={() => setActiveTab('practice')}
              className={`px-5 py-4 text-xs font-mono font-bold tracking-[0.16em] uppercase rounded-none transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'practice' 
                  ? 'border-[#F27D26] text-white bg-white/5 font-extrabold' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white-[0.02]'
              }`}
            >
              <Trophy className="w-4 h-4 text-[#F27D26]" />
              <span>04. PRACTICE ARENA</span>
            </button>

            <button
              onClick={() => setActiveTab('exporter')}
              className={`px-5 py-4 text-xs font-mono font-bold tracking-[0.16em] uppercase rounded-none transition-all flex items-center gap-2 border-b-2 ${
                activeTab === 'exporter' 
                  ? 'border-[#F27D26] text-white bg-white/5 font-extrabold' 
                  : 'border-transparent text-white/40 hover:text-white hover:bg-white-[0.02]'
              }`}
            >
              <Cpu className="w-4 h-4 text-[#F27D26]" />
              <span>05. EXPORT SKILL</span>
            </button>

          </div>
        </div>
      </nav>

      {/* Main Core Router View Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 py-10">
        
        {/* Dynamic header description styled with serif quote parameters */}
        <div className="mb-10 text-left border-l-2 border-[#F27D26] pl-6 max-w-3xl">
          {activeTab === 'glossary' && (
            <div className="space-y-1">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#F27D26] font-extrabold block">Chapter 01: Core Parameters</span>
              <h2 className="font-display font-black text-white text-3xl tracking-tighter uppercase">Optics & Illumination Lab</h2>
              <p className="text-white/60 text-sm leading-relaxed font-serif italic mt-2">
                "Behind every beautiful shadow is a deliberate physical coordinate. Interact with physical lens standards, lighting placements, and focus ratios to frame high-contrast statements."
              </p>
            </div>
          )}

          {activeTab === 'builder' && (
            <div className="space-y-1">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#F27D26] font-extrabold block">Chapter 02: Formulation</span>
              <h2 className="font-display font-black text-white text-3xl tracking-tighter uppercase">Parameter Assembly Matrix</h2>
              <p className="text-white/60 text-sm leading-relaxed font-serif italic mt-2">
                "Writing a prompt is a technical act. Build structured specifications, balance shadow falloffs, and copy unified prompt vectors directly targeting diffusion systems."
              </p>
            </div>
          )}

          {activeTab === 'optimizer' && (
            <div className="space-y-1">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#F27D26] font-extrabold block">Chapter 03: Expert Review</span>
              <h2 className="font-display font-black text-white text-3xl tracking-tighter uppercase">Director of Photography AI</h2>
              <p className="text-white/60 text-sm leading-relaxed font-serif italic mt-2">
                "Automate vocabulary injection. Our server-side Gemini system evaluates lighting setups, identifies logic inconsistencies, and drafts multi-sentence cinematographic directives."
              </p>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-1">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#F27D26] font-extrabold block">Chapter 04: Assessment Portfolio</span>
              <h2 className="font-display font-black text-white text-3xl tracking-tighter uppercase">The Practice Promenade</h2>
              <p className="text-white/60 text-sm leading-relaxed font-serif italic mt-2">
                "Submit solution drafts matching the target visual parameters. Receive instantaneous metrics, score indexes, and professional feedback structured by the masterclass dean."
              </p>
            </div>
          )}

          {activeTab === 'exporter' && (
            <div className="space-y-1">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#F27D26] font-extrabold block">Chapter 05: Deployment Specs</span>
              <h2 className="font-display font-black text-white text-3xl tracking-tighter uppercase">Programmatic Skill Agent Specification</h2>
              <p className="text-white/60 text-sm leading-relaxed font-serif italic mt-2">
                "Translate this masterclass lexicon into clean system guidance. Package the structures into structured Markdown or JSON templates to trigger high-contrast styles natively in external LLMs."
              </p>
            </div>
          )}
        </div>

        {/* Coordinated Subviews hosting state panels */}
        <div className="space-y-8">
          {activeTab === 'glossary' && (
            <InteractiveGlossary onAddTermToFormula={handleAddTermToFormula} />
          )}

          {activeTab === 'builder' && (
            <PromptBuilder 
              initialFormula={formula} 
              setFormula={setFormula} 
              onTriggerOptimization={handleTriggerOptimization}
            />
          )}

          {activeTab === 'optimizer' && (
            <PromptOptimizer draftedPrompt={formula.subject ? formula.subject : (compileQuickDraft())} />
          )}

          {activeTab === 'practice' && (
            <PracticeArena />
          )}

          {activeTab === 'exporter' && (
            <AgentExporter />
          )}
        </div>

      </main>

      {/* Stout masterclass footer with deep orange background */}
      <footer className="bg-[#F27D26] text-black py-8 mt-20 font-bold">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm uppercase tracking-wider">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
            <div>
              <span className="text-[9px] uppercase font-black text-black/60 block leading-none">MODULE</span>
              <span className="text-xs font-black tracking-wide leading-none mt-1 block">Visual Cinematography 101</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-black/20"></div>
            <div>
              <span className="text-[9px] uppercase font-black text-black/60 block leading-none">LEXICON ASSISTANT LEVEL</span>
              <span className="text-xs font-black tracking-wide leading-none mt-1 block">Expert-Integrated Matrices</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-xs font-black">STUDIO HOST BIND: PORT 3000</span>
            <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-bold">→</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
