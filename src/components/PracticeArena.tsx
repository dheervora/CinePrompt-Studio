import React, { useState } from 'react';
import { MOCK_CHALLENGES } from '../photographyData';
import { QuizChallenge, QuizGrade } from '../types';
import { Award, Trophy, Sparkles, BookOpen, CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

export default function PracticeArena() {
  const [selectedChallenge, setSelectedChallenge] = useState<QuizChallenge>(MOCK_CHALLENGES[0]);
  const [userPromptAnswer, setUserPromptAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorString, setErrorString] = useState<string | null>(null);
  const [gradeResult, setGradeResult] = useState<QuizGrade | null>(null);

  const handleSelectChallenge = (challenge: QuizChallenge) => {
    setSelectedChallenge(challenge);
    setUserPromptAnswer('');
    setGradeResult(null);
    setErrorString(null);
  };

  const handleSubmitQuiz = async () => {
    if (!userPromptAnswer.trim()) return;

    setLoading(true);
    setErrorString(null);
    setGradeResult(null);

    try {
      const response = await fetch('/api/grade-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeTitle: selectedChallenge.title,
          challengeDesc: selectedChallenge.description,
          requiredElements: selectedChallenge.requiredElements,
          userPrompt: userPromptAnswer
        })
      });

      if (!response.ok) {
        throw new Error(`Server graded failure state: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGradeResult(data);
    } catch (err: any) {
      console.error("Grading failed:", err);
      setErrorString(err.message || "Unable to submit prompt for grading. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  // Helper styling for overall scores
  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-950/20" };
    if (score >= 75) return { text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-950/20" };
    return { text: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-950/20" };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Challenges selector & input block (Col span 7) */}
      <div className="lg:col-span-7 bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-lg space-y-6 text-left">
        <div>
          <h3 className="font-display font-black text-lg text-white flex items-center gap-2 uppercase tracking-tight">
            <Trophy className="w-5 h-5 text-[#F27D26]" />
            Chamber Arena: Technical Arena
          </h3>
          <p className="text-xs text-white/50 font-sans mt-0.5 uppercase tracking-wide">
            Test your cinematographic eye. Write a prompt to match the target scene and score high marks!
          </p>
        </div>

        {/* Challenge Selection Tabs */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-black text-[#F27D26] uppercase tracking-[0.2em] block">
            Select Practice Challenge Matrix
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            {MOCK_CHALLENGES.map((challenge) => {
              const isActive = selectedChallenge.id === challenge.id;
              return (
                <button
                  key={challenge.id}
                  onClick={() => handleSelectChallenge(challenge)}
                  className={`p-3.5 rounded-none border text-left cursor-pointer transition-all flex-1 ${
                    isActive 
                      ? 'bg-white text-black border-white shadow-md' 
                      : 'bg-black hover:bg-white/5 border-white/10 text-white/70'
                  }`}
                >
                  <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-none tracking-widest ${
                    isActive ? 'bg-[#F27D26] text-black' : 'bg-white/10 text-white/95'
                  }`}>
                    {challenge.category}
                  </span>
                  <p className="font-display font-black text-xs mt-2.5 tracking-tight uppercase leading-tight">{challenge.title}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Challenge Detail Cards */}
        <div className="bg-black border border-white/10 p-5 rounded-none space-y-4">
          <div className="space-y-1">
            <h4 className="font-mono text-[10px] font-black uppercase tracking-widest text-[#F27D26]">
              Active Objective: <span className="text-white font-display font-black">{selectedChallenge.title.toUpperCase()}</span>
            </h4>
            <p className="text-xs text-white/70 leading-relaxed font-sans mt-2">{selectedChallenge.description}</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[9px] font-black text-white/40 uppercase font-mono tracking-widest block">
              Required Cinematic Vocals:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedChallenge.requiredElements.map((el, i) => (
                <span key={i} className="text-[10px] font-mono text-white bg-white/5 border border-white/10 rounded-none px-2.5 py-1 uppercase tracking-wider">
                  ⭐ {el}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider leading-relaxed pt-1.5">
              Note: You do not have to match words exactly. Director AI evaluates conceptual alignment.
            </p>
          </div>
        </div>

        {/* User Input Block */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono font-black text-[#F27D26] uppercase tracking-[0.2em] block">
              Draft your Photographic Prompt Answer
            </label>
            {selectedChallenge.sampleSolution && (
              <button
                type="button"
                onClick={() => setUserPromptAnswer(selectedChallenge.sampleSolution)}
                className="text-[9px] font-mono text-white/60 hover:text-[#F27D26] transition-colors uppercase underline cursor-pointer"
              >
                Load Sample Draft
              </button>
            )}
          </div>
          <textarea
            placeholder="A low-key portrait of a boxer sitting on a..."
            value={userPromptAnswer}
            onChange={(e) => setUserPromptAnswer(e.target.value)}
            className="w-full bg-black hover:bg-neutral-900/50 p-4 font-mono text-xs text-white rounded-none border border-white/15 focus:border-[#F27D26] focus:outline-none h-36 border-dashed uppercase"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          {gradeResult && (
            <button
              onClick={() => { setUserPromptAnswer(''); setGradeResult(null); }}
              className="px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black font-mono tracking-widest text-[9px] rounded-none cursor-pointer transition-colors uppercase"
            >
              CLEAR ANSWER
            </button>
          )}

          <button
            onClick={handleSubmitQuiz}
            disabled={loading || !userPromptAnswer.trim()}
            className="px-6 py-3 bg-[#F27D26] hover:bg-white disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-black font-black font-mono tracking-widest text-[10px] rounded-none cursor-pointer shadow-md transition-all flex items-center gap-2 uppercase"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>EVALUATING SOLUTION...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>SUBMIT FOR EVALUATION</span>
              </>
            )}
          </button>
        </div>

        {/* Error Notification */}
        {errorString && (
          <div className="bg-[#1A0B0E] border border-red-900 p-4 rounded-none text-red-100 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 leading-normal font-sans">
                <span className="font-bold uppercase tracking-wider text-red-400">Gemini Grading Notice:</span>
                <p className="text-white/80">{errorString}</p>
                <p className="text-[9px] text-red-400 font-mono uppercase tracking-wider mt-1">
                  Tip: Rate limits or momentary server spikes pass quickly. Click retry to re-evaluate.
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmitQuiz}
              className="px-3.5 py-1.5 bg-red-950/80 hover:bg-white hover:text-black border border-red-500/40 text-red-200 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Grade Card & Suggested prompt (Col span 5) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-[#0A0A0A] p-6 rounded-none border border-white/10 shadow-lg text-left space-y-6 sticky top-4">
          <div className="border-b border-white/10 pb-3 flex justify-between items-center text-[9px] text-white/50 font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <span>EXAM REVIEW BOARD</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2">3.8 Flash</span>
            </span>
            <span className="text-[#F27D26] font-black">Dean of Photography</span>
          </div>

          {!loading && !gradeResult && !errorString && (
            <div className="py-16 text-center space-y-3 p-4">
              <BookOpen className="w-10 h-10 text-white/10 mx-auto" />
              <h4 className="font-mono text-white/40 text-xs uppercase tracking-widest">Grading Portal Dormant</h4>
              <p className="text-white/60 text-xs leading-relaxed max-w-xs mx-auto font-sans">
                Review the target scenario, check your required elements, draft your prompt, and click <span className="font-semibold text-white">"SUBMIT"</span> to receive score breakdown.
              </p>
            </div>
          )}

          {loading && (
            <div className="py-16 text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-10 h-10 text-[#F27D26] animate-spin" />
              </div>
              <p className="text-white font-bold font-mono text-xs uppercase tracking-widest animate-pulse">
                Evaluating structural camera vocabulary...
              </p>
              <p className="text-[9px] text-white/40 font-mono uppercase tracking-wider">
                Director AI is examining focal points, illumination ratios, and keyword robustness.
              </p>
            </div>
          )}

          {/* Grading Output Result */}
          {gradeResult && !loading && (
            <div className="space-y-6">
              
              {/* Score visual metric */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-none border-2 flex items-center justify-center font-display font-black text-2xl shadow-xl ${
                  getScoreColor(gradeResult.score).text
                } ${
                  getScoreColor(gradeResult.score).border
                } ${
                  getScoreColor(gradeResult.score).bg
                }`}>
                  {gradeResult.score}
                </div>
                <div>
                  <h4 className="text-xs font-mono font-black text-white leading-tight uppercase tracking-widest">
                    Score: {gradeResult.score}/100
                  </h4>
                  <p className="text-[11px] text-white/60 font-sans mt-0.5 leading-tight">
                    {gradeResult.score >= 90 ? "🌟 Cinematographer Excellence rank!" : gradeResult.score >= 75 ? "👍 Balanced configuration" : "⚠️ Needs tighter optical definitions"}
                  </p>
                </div>
              </div>

              {/* Matches & Missing list chips */}
              <div className="space-y-3">
                {gradeResult.technicalMatch && gradeResult.technicalMatch.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono font-black text-[#F27D26] uppercase tracking-wider flex items-center gap-1 leading-none">
                      <CheckCircle className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
                      INTEGRATED CONCEPT MATCHES
                    </span>
                    <div className="flex flex-wrap gap-1.5 pl-4">
                      {gradeResult.technicalMatch.map((m, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-[#F2F2F2] bg-white/5 rounded-none px-2 py-0.5 border border-white/10 uppercase">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {gradeResult.omissions && gradeResult.omissions.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono font-black text-white/40 uppercase tracking-wider flex items-center gap-1 leading-none">
                      <XCircle className="w-3.5 h-3.5 text-white/30 shrink-0" />
                      UNLOCKING OPPORTUNITIES
                    </span>
                    <div className="flex flex-wrap gap-1.5 pl-4">
                      {gradeResult.omissions.map((o, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-white/70 bg-white/5 rounded-none px-2 py-0.5 border border-white/5 uppercase">
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Summary critique */}
              <div className="bg-black border border-white/10 p-4 rounded-none text-xs text-white/80 leading-relaxed font-sans">
                <span className="font-mono font-black text-[9px] uppercase tracking-widest text-[#F27D26] flex items-center gap-1 mb-1.5 leading-none">
                  <AlertCircle className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
                  Dean's Critique:
                </span>
                <p className="mt-1">{gradeResult.critique}</p>
                {gradeResult.grammarFeedback && (
                  <p className="mt-2.5 text-[9px] text-[#F27D26] font-mono uppercase tracking-wider select-none pt-1.5 border-t border-white/5">
                    Structure: {gradeResult.grammarFeedback}
                  </p>
                )}
              </div>

              {/* Model optimal answer sheet */}
              <div className="bg-black border border-[#F27D26]/20 p-4 rounded-none text-white space-y-2">
                <span className="text-[9px] font-bold text-[#F27D26] font-mono uppercase tracking-widest block">
                  Dean's Optimal Blueprint Answer:
                </span>
                <p className="text-xs font-mono text-white/90 leading-relaxed select-all">
                  {gradeResult.suggestedPrompt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSelectChallenge(selectedChallenge)}
                className="w-full text-center py-2.5 border border-[#F27D26]/25 hover:border-white text-[#F27D26] hover:text-white bg-transparent text-[9px] font-bold font-mono tracking-widest rounded-none hover:bg-white/5 transition-colors flex items-center justify-center gap-1 cursor-pointer uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RETRY CONFLICT MATRIX</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
