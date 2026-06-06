import React, { useState } from 'react';
import { PHOTOGRAPHY_TERMS } from '../photographyData';
import { Copy, Check, Download, ShieldCheck, Terminal, Compass, Cpu } from 'lucide-react';

export default function AgentExporter() {
  const [copied, setCopied] = useState(false);
  const [agentType, setAgentType] = useState<'markdown' | 'system' | 'json'>('markdown');

  // Dynamically assemble the system instruction markdown block
  const generateSkillMarkdown = () => {
    const listLenses = PHOTOGRAPHY_TERMS.filter(t => t.category === 'lenses').map(t => `- **${t.name}**: ${t.definition} (Use in prompt as: "${t.promptTemplate}")`).join('\n');
    const listAngles = PHOTOGRAPHY_TERMS.filter(t => t.category === 'angles').map(t => `- **${t.name}**: ${t.definition} (Use in prompt as: "${t.promptTemplate}")`).join('\n');
    const listLighting = PHOTOGRAPHY_TERMS.filter(t => t.category === 'lighting').map(t => `- **${t.name}**: ${t.definition} (Use in prompt as: "${t.promptTemplate}")`).join('\n');
    const listMovements = PHOTOGRAPHY_TERMS.filter(t => t.category === 'movements').map(t => `- **${t.name}**: ${t.definition} (Use in prompt as: "${t.promptTemplate}")`).join('\n');
    const listStocks = PHOTOGRAPHY_TERMS.filter(t => t.category === 'color-film').map(t => `- **${t.name}**: ${t.definition} (Use in prompt as: "${t.promptTemplate}")`).join('\n');

    if (agentType === 'system') {
      return `# SYSTEM INSTRUCTIONS: CINEMATOGRAPHY & VISUAL PROMPTING AGENT
You are a highly specialized AI director of photography (DP) and a master image/video prompting agent.
Your core skill is translating abstract human scene descriptions into technically precise prompts for systems like Midjourney, DALL-E, Sora, and Veo.

## CORE DIRECTIVES:
1. NEVER output generic visual descriptors. Instead of "realistic", "high quality", "epic", "cinematic", ALWAYS specify concrete physical and camera-chemical parameters.
2. Structure all output image prompts using this exact formula:
   "[Shot Framing] [Camera Angle] of [Subject Description], shot on [Lens Focal Length], illuminated by [Lighting Setup], with [Color Grade/Film Stock] atmosphere, shot on [Camera Body] --ar [Aspect Ratio]"

## PHOTOGRAPHIC VOCABULARY KNOWLEDGE-BASE:

### 1. Optic Lenses Selection:
${listLenses}

### 2. Shot Scale & Framing:
${listLighting}

### 3. Studio Lighting & Shadows:
${listLighting}

### 4. Color Grading LUTs & Film Stocks:
${listStocks}

## TRANSLATION PIPELINE WORKFLOW:
- Read User Raw Input.
- Identify core physical actors, clothing, actions.
- Apply high-contrast 3-point lighting or chiaroscuro models if mood is dark, or high-key diffused if cheerful.
- Select focal length (e.g., 85mm for portrait isolation; 14mm for vast architecture exaggerating margins).
- Format and append precise aspect ratio selectors.
- Output ONLY the compiled prompt block inside code highlights without pre-commentary.`;
    }

    if (agentType === 'json') {
      const jsonStructure = {
        name: "Cinematography Lexicon Assistant",
        version: "2.1.0",
        author: "CinePrompt Studio",
        description: "Bespoke prompting assistant specification designed to parse flat human speech and inject cinematic optics coordinates",
        capabilities: ["EXPERT_OPTICAL_LENS_CALIBRATION", "STUDIO_3POINT_LIGHT_VECTORING", "ANALOG_KODACHROME_FILM_STOCK_EMULATION"],
        promptFormulaSchema: "[Framing] [Angle] [Subject], shot on [Lens], [Lighting], [Color], --ar [Aspect]",
        exemplarTerms: PHOTOGRAPHY_TERMS.map(t => ({
          termId: t.id,
          name: t.name,
          category: t.category,
          tokenSnippet: t.promptSnippets.image
        }))
      };
      return JSON.stringify(jsonStructure, null, 2);
    }

    // Default: Markdown skill block
    return `### Photography Director Skill Spec for AI Agents
\`\`\`markdown
# SKILL SPECIFICATION: Cinematography & Director of Photography (DP)
# PURPOSE: Instruct external language models on advanced scene-reconstruction keywords to boost AI generator robustness.

## 1. Optic Lens Parameters:
${listLenses}

## 2. Dynamic Shot Heights & Angles:
${listAngles}

## 3. Light Modeling & Chiaroscuro Setups:
${listLighting}

## 4. Camera Movement Vectoring (For Sora / Veo / Gen-3):
${listMovements}

## 5. Film Emulation & Grading LUTs:
${listStocks}

## 6. Prompt Engineering Formula Formulation:
When generating a prompt, map keys directly:
\`[Shot Framing] [Camera Angle] of [Detailed Subject], shot with [Lens Scale], lit by [Lighting Setup], color grade: [LUT Color/Film stock], high fidelity render, --ar [Aspect_Ratio]\`

## 7. Execution Example:
- Raw: "A cozy log cabin in the woods at night."
- Cinematic Supercharged: "Wide shot, low angle of a cozy wooden log cabin settled inside a snow-laden pine forest at night, shot with a 14mm ultra-wide lens, lit by warm volcanic interior key lights spilling through window glass, high contrast low-key chiaroscuro shadows, graded in warm Tungsten-balanced film look, high-fidelity photorealistic composition --ar 16:9"
\`\`\``;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSkillMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generateSkillMarkdown()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = agentType === 'json' ? "cinematography_skill_specs.json" : "visual_prompting_skill_specs.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Descriptive instruction and selector cards (Col span 5) */}
      <div className="lg:col-span-5 bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-lg space-y-6 text-left">
        <div>
          <h3 className="font-display font-black text-lg text-white flex items-center gap-2 uppercase tracking-tight">
            <Cpu className="w-5 h-5 text-[#F27D26] animate-pulse" />
            AI Agent Skill Exporter
          </h3>
          <p className="text-xs text-white/50 font-sans mt-0.5 uppercase tracking-wide">
            Convert CinePrompt data directly into custom instructions or schemas for programmatic LLM prompt assistants.
          </p>
        </div>

        {/* Format Selectors */}
        <div className="space-y-3">
          <label className="text-[10px] font-mono font-black text-[#F27D26] uppercase tracking-[0.2em] block">
            Select Export Spec Framework
          </label>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setAgentType('markdown')}
              className={`p-4 rounded-none border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                agentType === 'markdown' 
                  ? 'bg-white text-black border-white shadow-md' 
                  : 'bg-black hover:bg-white/5 border-white/10 text-white/80'
              }`}
            >
              <Terminal className={`w-5 h-5 mt-0.5 ${agentType === 'markdown' ? 'text-black' : 'text-[#F27D26]'}`} />
              <div>
                <span className="font-mono font-black text-xs uppercase tracking-wider block">Markdown Skill Block</span>
                <p className="text-[11px] opacity-75 leading-relaxed mt-0.5 font-sans">
                  A condensed photography cheatsheet formatted to plug directly into LLM dynamic skills systems.
                </p>
              </div>
            </button>

            <button
              onClick={() => setAgentType('system')}
              className={`p-4 rounded-none border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                agentType === 'system' 
                  ? 'bg-white text-black border-white shadow-md' 
                  : 'bg-black hover:bg-white/5 border-white/10 text-white/80'
              }`}
            >
              <Compass className={`w-5 h-5 mt-0.5 ${agentType === 'system' ? 'text-black' : 'text-[#F27D26]'}`} />
              <div>
                <span className="font-mono font-black text-xs uppercase tracking-wider block">System Instruction File</span>
                <p className="text-[11px] opacity-75 leading-relaxed mt-0.5 font-sans">
                  Comprehensive custom guidelines config intended for custom ChatGPT agents or custom developer prompts.
                </p>
              </div>
            </button>

            <button
              onClick={() => setAgentType('json')}
              className={`p-4 rounded-none border text-left cursor-pointer transition-all flex items-start gap-3.5 ${
                agentType === 'json' 
                  ? 'bg-white text-black border-white shadow-md' 
                  : 'bg-black hover:bg-white/5 border-white/10 text-white/80'
              }`}
            >
              <Cpu className={`w-5 h-5 mt-0.5 ${agentType === 'json' ? 'text-black' : 'text-[#F27D26]'}`} />
              <div>
                <span className="font-mono font-black text-xs uppercase tracking-wider block">JSON Glossary Schema</span>
                <p className="text-[11px] opacity-75 leading-relaxed mt-0.5 font-sans">
                  Structured programmatic JSON data representation, perfect for database-integration or app backend models.
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-black border border-white/10 p-4 rounded-none flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#F27D26] shrink-0 mt-0.5" />
          <div className="text-xs text-white/80 font-sans leading-relaxed">
            <span className="font-mono font-black text-[9px] uppercase tracking-wider text-[#F27D26] block mb-1">Integrating into LLMs</span>
            Configure a Custom System Guideline or insert inside prompt workspaces, then paste this spec. The target model instantly inherits cinematic optic parameters!
          </div>
        </div>
      </div>

      {/* Right Column: Code block scroll & actions (Col span 7) */}
      <div className="lg:col-span-7 bg-[#0A0A0A] p-6 rounded-none border border-white/10 text-white flex flex-col justify-between h-[510px] shadow-2xl">
        <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center text-[10px] font-mono border-b border-white/10 pb-2.5 flex-none uppercase tracking-wide">
            <span className="text-white/60">specs / visual_prompt_model.{agentType === 'json' ? 'json' : 'md'}</span>
            <span className="text-[#F27D26] font-black">FORMAT: {agentType.toUpperCase()}</span>
          </div>

          <div className="flex-1 overflow-y-auto bg-black p-4 rounded-none text-xs font-mono leading-relaxed select-all border border-white/5 scrollbar-thin">
            <pre className="whitespace-pre-wrap break-all text-white/80">
              {generateSkillMarkdown()}
            </pre>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10 flex-none bg-[#0A0A0A]">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black font-mono text-[10px] tracking-widest rounded-none cursor-pointer transition-colors uppercase"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED SPECS!' : 'COPY SPECS'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-3 bg-[#F27D26] hover:bg-white text-black font-black font-mono text-[10px] tracking-widest rounded-none cursor-pointer transition-colors flex items-center justify-center gap-1.5 uppercase"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD SPEC</span>
          </button>
        </div>
      </div>
    </div>
  );
}
