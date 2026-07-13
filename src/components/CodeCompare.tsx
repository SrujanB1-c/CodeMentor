import { useState } from "react";
import { Check, Copy, FileCode, Sparkles } from "lucide-react";

interface CodeCompareProps {
  originalCode: string;
  improvedCode: string;
  explanation: string;
  language: string;
}

export function CodeCompare({ originalCode, improvedCode, explanation, language }: CodeCompareProps) {
  const [activeTab, setActiveTab] = useState<"side-by-side" | "improved">("side-by-side");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-700 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Refactored & Optimized Code
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare your original snippet with CodeMentor's fully annotated and optimized version.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab("side-by-side")}
            className={`px-3 py-1.5 rounded-md transition-all font-medium ${
              activeTab === "side-by-side"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Compare Side-by-Side
          </button>
          <button
            onClick={() => setActiveTab("improved")}
            className={`px-3 py-1.5 rounded-md transition-all font-medium ${
              activeTab === "improved"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Improved Code Only
          </button>
        </div>
      </div>

      {/* Comparisons */}
      {activeTab === "side-by-side" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left panel: Original */}
          <div className="border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[380px] bg-slate-950/40">
            <div className="bg-[#0f172a] px-4 py-2 flex justify-between items-center border-b border-slate-800">
              <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
                Original Code
              </span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase">
                {language}
              </span>
            </div>
            <pre className="p-4 overflow-auto font-mono text-xs text-slate-400 leading-relaxed flex-1 bg-slate-900/10">
              <code>{originalCode}</code>
            </pre>
          </div>

          {/* Right panel: Improved */}
          <div className="border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[380px] bg-slate-950">
            <div className="bg-[#0f172a] px-4 py-2 flex justify-between items-center border-b border-slate-800">
              <span className="text-[10px] font-mono tracking-wider font-semibold text-emerald-400 uppercase flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" /> CodeMentor Improved
              </span>
              <button
                onClick={handleCopy}
                className="text-[10px] text-slate-400 hover:text-slate-250 flex items-center gap-1 hover:bg-[#0f172a] px-2 py-1 rounded transition-all border border-slate-800"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-4 overflow-auto font-mono text-xs text-emerald-350 leading-relaxed flex-1 bg-slate-950/40">
              <code>{improvedCode}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[400px] bg-[#0f172a]">
          <div className="bg-[#0f172a] px-4 py-3.5 flex justify-between items-center border-b border-slate-800">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-400" /> Clean, Documented & Refactored Version
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-slate-250 flex items-center gap-1.5 hover:bg-slate-900 px-3 py-1.5 rounded transition-all border border-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copy Improved Code" : "Copy"}</span>
            </button>
          </div>
          <pre className="p-5 overflow-auto font-mono text-xs text-emerald-350 leading-relaxed flex-1">
            <code>{improvedCode}</code>
          </pre>
        </div>
      )}

      {/* Improvement Explanations */}
      {explanation && (
        <div className="mt-4 bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-1.5">
            Key Refactoring Decisions
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
