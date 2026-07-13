import { BookOpen, Bug, Award, Cpu, Sparkles, GraduationCap } from "lucide-react";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (lang: string) => void;
  style: string;
  setStyle: (style: string) => void;
  mode: string;
  setMode: (mode: string) => void;
}

export const LANGUAGES = [
  { value: "auto", label: "Auto-Detect Language" },
  { value: "javascript", label: "JavaScript (JS)" },
  { value: "typescript", label: "TypeScript (TS)" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go (Golang)" },
  { value: "rust", label: "Rust" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
];

export const TEACHING_STYLES = [
  {
    value: "standard",
    label: "Professional Standard",
    icon: <Cpu className="w-4 h-4 text-slate-400" />,
    description: "Elegant, balanced explanations designed for engineering teams.",
  },
  {
    value: "professor",
    label: "University Professor",
    icon: <GraduationCap className="w-4 h-4 text-indigo-400" />,
    description: "Gentle, concept-oriented explanations utilizing intuitive analogies.",
  },
  {
    value: "guru",
    label: "Technical Guru",
    icon: <Award className="w-4 h-4 text-emerald-400" />,
    description: "Deep dive into garbage collection, profiling, and micro-optimizations.",
  },
];

export const FOCUS_MODES = [
  {
    value: "explain",
    label: "Explain Step-by-Step",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    description: "Break the program down line-by-line into logical sections.",
  },
  {
    value: "debug",
    label: "Bug & Vuln Audit",
    icon: <Bug className="w-3.5 h-3.5" />,
    description: "Audit syntax, locate memory leaks, and evaluate crash scenarios.",
  },
  {
    value: "optimize",
    label: "Optimize & Refactor",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    description: "Review Big-O complexities and inspect fully optimized refactored code.",
  },
  {
    value: "interview",
    label: "Interview Prep Q&A",
    icon: <Cpu className="w-3.5 h-3.5" />,
    description: "Generate structured technical interview questions based on the code.",
  },
];

export function LanguageSelector({
  language,
  setLanguage,
  style,
  setStyle,
  mode,
  setMode,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-slate-700">
      
      {/* Programming Language Selector */}
      <div>
        <label className="block text-xs font-bold font-mono uppercase text-slate-400 tracking-wider mb-2">
          Source Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Focus Mode Selector */}
      <div>
        <label className="block text-xs font-bold font-mono uppercase text-slate-400 tracking-wider mb-2">
          Analysis Focus
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FOCUS_MODES.map((fMode) => {
            const isSelected = fMode.value === mode;
            return (
              <button
                key={fMode.value}
                type="button"
                onClick={() => setMode(fMode.value)}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs flex gap-2.5 items-start ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm shadow-indigo-100"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-800"
                }`}
              >
                <span className={`p-1.5 rounded-md mt-0.5 ${isSelected ? "bg-indigo-100 text-indigo-600 border border-indigo-200" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                  {fMode.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`font-semibold block ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                    {fMode.label}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">
                    {fMode.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Teaching Style Selector */}
      <div>
        <label className="block text-xs font-bold font-mono uppercase text-slate-400 tracking-wider mb-2">
          Mentor Persona & Style
        </label>
        <div className="space-y-2">
          {TEACHING_STYLES.map((tStyle) => {
            const isSelected = tStyle.value === style;
            return (
              <button
                key={tStyle.value}
                type="button"
                onClick={() => setStyle(tStyle.value)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex gap-3 items-start ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-300 text-indigo-950 shadow-sm shadow-indigo-100"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-850"
                }`}
              >
                <span className={`p-1.5 rounded-lg ${isSelected ? "bg-indigo-100 border border-indigo-200 text-indigo-600" : "bg-slate-100 text-slate-500 border border-slate-200"}`}>
                  {tStyle.icon}
                </span>
                <div className="flex-1 min-w-0 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                      {tStyle.label}
                    </span>
                    {isSelected && (
                      <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">
                    {tStyle.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
