import { useState } from "react";
import { ChevronRight, Code, ListPlus, Terminal } from "lucide-react";
import { CodeSection } from "../types";

interface StepByStepExplanationProps {
  sections: CodeSection[];
}

export function StepByStepExplanation({ sections }: StepByStepExplanationProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-700 shadow-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
        <Code className="w-5 h-5 text-indigo-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Structural Code Walkthrough
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            The code has been parsed into logical execution blocks. Click on a block to inspect it in detail.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: List of Logical Blocks */}
        <div className="lg:col-span-5 flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
          {sections.map((section, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 group relative overflow-hidden ${
                  isActive
                    ? "bg-indigo-50 border-indigo-300 shadow-sm shadow-indigo-100"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {/* Visual Active Marker */}
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r" />
                )}

                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold mt-0.5 ${
                  isActive ? "bg-indigo-100 text-indigo-700 border border-indigo-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className={`font-semibold text-xs truncate ${isActive ? "text-indigo-900" : "text-slate-700"}`}>
                      {section.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1 py-0.5 rounded">
                      Lines {section.lines}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-550 line-clamp-2 leading-relaxed">
                    {section.explanation}
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 mt-1 transition-transform flex-shrink-0 ${
                  isActive ? "text-indigo-600 translate-x-0.5" : "text-slate-450 group-hover:text-slate-750"
                }`} />
              </button>
            );
          })}
        </div>

        {/* Right column: Inspected Section Code and Detailed Bullets */}
        <div className="lg:col-span-7 flex flex-col gap-4 bg-[#1e293b] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          {sections[activeIndex] ? (
            <>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-slate-200 text-sm">
                    {sections[activeIndex].title}
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded">
                  Lines {sections[activeIndex].lines}
                </span>
              </div>

              {/* Code Snippet for active block */}
              <div className="rounded-lg overflow-hidden border border-slate-800/80 bg-[#0f172a]">
                <pre className="p-4 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed max-h-[180px]">
                  <code>{sections[activeIndex].codeBlock}</code>
                </pre>
              </div>

              {/* Step Summary */}
              <div>
                <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase block mb-1.5">
                  Core Concept Summary
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800/80 p-3 rounded-lg">
                  {sections[activeIndex].explanation}
                </p>
              </div>

              {/* Technical Detail Bullets */}
              <div>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block mb-2 flex items-center gap-1">
                  <ListPlus className="w-3.5 h-3.5" /> Logical Details & Identifiers
                </span>
                <ul className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {sections[activeIndex].details.map((detail, dIdx) => (
                    <li key={dIdx} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-slate-500 text-xs">
              <span>Select a block to inspect logical walk</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
