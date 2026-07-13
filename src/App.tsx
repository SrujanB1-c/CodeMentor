import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  Play,
  Sparkles,
  Info,
  Trash2,
  Copy,
  Check,
  BookOpen,
  Code
} from "lucide-react";
import Markdown from "react-markdown";

// Compact and polished sample snippets for quick-start testing
const SAMPLE_SNIPPETS = [
  {
    id: "bin-search",
    title: "Binary Search",
    lang: "python",
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
  },
  {
    id: "rev-str",
    title: "Reverse String",
    lang: "javascript",
    code: `function reverseString(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`
  },
  {
    id: "fibonacci",
    title: "Recursive Fibonacci",
    lang: "cpp",
    code: `int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
  }
];

interface ExplanationResult {
  language: string;
  purpose: string;
  explanation: string;
}

export default function App() {
  const [code, setCode] = useState(SAMPLE_SNIPPETS[0].code);
  const [language, setLanguage] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleSnippetSelect = (id: string) => {
    const snip = SAMPLE_SNIPPETS.find((s) => s.id === id);
    if (snip) {
      setCode(snip.code);
      setLanguage(snip.lang);
    }
  };

  const handleClear = () => {
    setCode("");
    setResult(null);
    setError(null);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleCopyResult = async () => {
    if (!result) return;
    try {
      const textToCopy = `Language: ${result.language}\nPurpose: ${result.purpose}\n\n${result.explanation}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleAnalyze = async () => {
    if (!code || !code.trim()) {
      setError("Please paste or type some code first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const responseText = await res.text();
      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonErr) {
        throw new Error(`Invalid server response (Status ${res.status}): ${responseText.substring(0, 120)}...`);
      }

      if (!res.ok) {
        throw new Error(responseData?.error || responseData?.details || "Failed to analyze code snippet.");
      }

      setResult(responseData);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="codementor-app" className="min-h-screen flex flex-col bg-slate-50 text-slate-700 font-sans antialiased">
      
      {/* Decorative clean ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-900/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Elegant Header */}
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-md py-4 px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-800">CodeMentor</h1>
              </div>
              <p className="text-xs text-slate-500">Instant beginner-friendly code explanations</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single-View Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Left Column: Code input panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-fit">
            
            {/* Input Header controls */}
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-600" /> Code Workspace
              </label>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  disabled={!code}
                  title="Copy code to clipboard"
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleClear}
                  disabled={!code}
                  title="Clear workspace"
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Custom Monospace Code Input Area */}
            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Type or paste your code snippet here..."
                className="w-full h-80 bg-transparent text-slate-100 font-mono text-xs p-4 leading-relaxed outline-none resize-none"
                spellCheck={false}
              />
            </div>

            {/* Language Selection Bar */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none text-slate-700 font-medium cursor-pointer focus:border-indigo-300"
                >
                  <option value="auto">Auto-detect</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="sql">SQL</option>
                </select>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-right">
                {code.length} characters
              </div>
            </div>

            {/* Interactive Lesson Presets */}
            <div className="mt-5">
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Try a Demo Snippet:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SNIPPETS.map((snip) => (
                  <button
                    key={snip.id}
                    onClick={() => handleSnippetSelect(snip.id)}
                    className="text-[10px] bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 px-2.5 py-1.5 rounded transition-all text-slate-600 font-medium cursor-pointer"
                  >
                    {snip.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-lg flex items-start gap-2 animate-fade-in">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !code.trim()}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold py-2.5 rounded-lg text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? "Analyzing Code..." : "Explain Code"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Display Explanation outcomes */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading state */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[500px] shadow-sm relative overflow-hidden"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                  <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                
                <h3 className="text-sm font-semibold text-slate-800 tracking-wide uppercase mb-1">
                  CodeMentor is analyzing...
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                  Parsing your code syntax and drafting a simplified step-by-step translation.
                </p>
              </motion.div>
            )}

            {/* 2. Welcome State */}
            {!loading && !result && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col justify-center items-center text-center h-full min-h-[500px] shadow-sm relative overflow-hidden"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center mb-5 text-indigo-600 shadow-inner">
                  <BookOpen className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Welcome to CodeMentor Lite
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Type or paste any programming block on the left and hit <strong>Explain Code</strong>. We'll decompose the syntax and walk you through how it operates.
                </p>
              </motion.div>
            )}

            {/* 3. Output results block */}
            {!loading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full"
              >
                {/* Result header */}
                <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full uppercase">
                        {result.language}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 font-mono uppercase">
                        <Code className="w-3.5 h-3.5" /> Mentor Output
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {result.purpose}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyResult}
                    title="Copy full explanation"
                    className="flex-shrink-0 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedResult ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Markdown text body */}
                <div className="flex-1 overflow-y-auto max-h-[580px] pr-2">
                  <div className="markdown-body text-slate-600 text-xs leading-relaxed">
                    <Markdown>{result.explanation}</Markdown>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* Modern, minimalist footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-slate-400 text-xs mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-center items-center gap-3">
          <div className="flex gap-4 font-medium text-slate-400">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
