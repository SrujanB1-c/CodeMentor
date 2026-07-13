import { useState } from "react";
import { AlertTriangle, Bug, CheckCircle, ChevronDown, ChevronUp, ShieldAlert, Sparkles } from "lucide-react";
import { CodeIssue } from "../types";

interface IssuesTrackerProps {
  issues: CodeIssue[];
  bestPractices: string[];
}

export function IssuesTracker({ issues, bestPractices }: IssuesTrackerProps) {
  const [expandedIssueIdx, setExpandedIssueIdx] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    if (expandedIssueIdx === idx) {
      setExpandedIssueIdx(null);
    } else {
      setExpandedIssueIdx(idx);
    }
  };

  const getSeverityStyles = (severity: string) => {
    const s = severity.toLowerCase();
    if (s === "critical") {
      return {
        bg: "bg-rose-50 border-rose-200",
        text: "text-rose-800",
        badge: "bg-rose-100 text-rose-800 border-rose-200",
        icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      };
    }
    if (s === "warning") {
      return {
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-800",
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      };
    }
    return {
      bg: "bg-indigo-50 border-indigo-200",
      text: "text-indigo-800",
      badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
      icon: <Bug className="w-4 h-4 text-indigo-600" />,
    };
  };

  const criticalCount = issues.filter((i) => i.severity.toLowerCase() === "critical").length;
  const warningCount = issues.filter((i) => i.severity.toLowerCase() === "warning").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left side: Code Issues list */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 text-slate-700 shadow-sm">
        <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              Issues & Code Quality Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated code audit highlighting bugs, logical gaps, and performance concerns.
            </p>
          </div>

          <div className="flex gap-2">
            {criticalCount > 0 && (
              <span className="text-[10px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-[10px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                {warningCount} Warning
              </span>
            )}
            {issues.length === 0 && (
              <span className="text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Clean Bill
              </span>
            )}
          </div>
        </div>

        {issues.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h4 className="font-semibold text-emerald-800 text-sm mb-1">No vulnerabilities or bugs detected!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Your code signature looks highly coherent and free of obvious execution risks or memory leaks. Check best practices for minor structural polish.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {issues.map((issue, idx) => {
              const styles = getSeverityStyles(issue.severity);
              const isExpanded = expandedIssueIdx === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-lg transition-all ${styles.bg} ${
                    isExpanded ? "ring-1 ring-indigo-500/35" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full text-left p-3 flex items-start gap-3 justify-between"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-1">{styles.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <span className={`text-xs font-bold uppercase tracking-wider ${styles.badge} border px-1.5 py-0.2 rounded text-[9px]`}>
                            {issue.severity}
                          </span>
                          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-250 px-1.5 py-0.5 rounded">
                            {issue.type}
                          </span>
                          {issue.location && (
                            <span className="text-[10px] font-mono text-slate-500">
                              @{issue.location}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {issue.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-slate-400 hover:text-slate-600 ml-2 mt-0.5">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-200 text-xs">
                      <div className="mb-3 text-slate-700 leading-relaxed">
                        <strong className="text-slate-500 block mb-0.5 font-mono text-[10px] uppercase">Problem details:</strong>
                        {issue.description}
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-emerald-950 leading-relaxed font-mono text-[11px]">
                        <strong className="text-emerald-800 block mb-1 font-sans text-[10px] font-bold uppercase tracking-wider">Suggested Correction:</strong>
                        {issue.suggestion}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right side: Best Practices & Guidelines */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 text-slate-700 shadow-sm flex flex-col">
        <div className="border-b border-slate-200 pb-3 mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" /> Best Practices & Refactor Tips
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key optimization, styling, and structural patterns suggested by CodeMentor.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
          {bestPractices.map((tip, idx) => (
            <div key={idx} className="bg-slate-50/50 border border-slate-200 p-3.5 rounded-lg flex gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                {tip}
              </p>
            </div>
          ))}

          {bestPractices.length === 0 && (
            <div className="text-center text-slate-400 text-xs py-10">
              No specific refactor guidelines available for this snippet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
