import { motion } from "motion/react";
import { Clock, HardDrive, AlertCircle } from "lucide-react";
import { ComplexityData } from "../types";

interface ComplexityCardProps {
  complexity: ComplexityData;
}

export function ComplexityCard({ complexity }: ComplexityCardProps) {
  const {
    timeComplexity = "O(1)",
    timeExplanation = "Constant time",
    spaceComplexity = "O(1)",
    spaceExplanation = "Constant space",
    worstCaseTime,
    worstCaseTimeExplanation,
  } = complexity;

  // Determine standard categories for highlighting on our Big-O chart
  const getComplexityClass = (o: string): string => {
    const clean = o.replace(/\s+/g, "").toLowerCase();
    if (clean.includes("o(1)")) return "constant";
    if (clean.includes("logn")) return "logarithmic";
    if (clean.includes("nlogn")) return "linearithmic";
    if (clean.includes("o(n)") || clean === "on") return "linear";
    if (clean.includes("n^2") || clean.includes("nsquared") || clean.includes("n2")) return "quadratic";
    if (clean.includes("2^n") || clean.includes("2n") || clean.includes("factorial")) return "exponential";
    return "linear"; // default fallback
  };

  const highlightedClass = getComplexityClass(timeComplexity);

  // SVG dimensions for the curve chart
  const width = 360;
  const height = 180;
  const padding = 20;

  // SVG Paths for complexity curves starting from (padding, height - padding)
  // O(1) -> Flat line
  const pConstant = `M ${padding} ${height - padding} L ${width - padding} ${height - padding}`;
  // O(log N) -> Curved flat
  const pLog = `M ${padding} ${height - padding} Q ${width / 3} ${height - padding - 20}, ${width - padding} ${height - padding - 35}`;
  // O(N) -> Straight line diagonal
  const pLinear = `M ${padding} ${height - padding} L ${width - padding} ${padding + 50}`;
  // O(N log N) -> S-curve rising faster than linear
  const pLinearithmic = `M ${padding} ${height - padding} Q ${width / 2} ${height - padding - 40}, ${width - padding} ${padding + 15}`;
  // O(N^2) -> Steep quadratic curve
  const pQuadratic = `M ${padding} ${height - padding} Q ${width / 1.8} ${height - padding - 5}, ${width - padding - 40} ${padding}`;
  // O(2^N) -> Almost vertical wall
  const pExponential = `M ${padding} ${height - padding} Q ${padding + 40} ${height - padding - 5}, ${padding + 100} ${padding}`;

  const curves = [
    { name: "constant", label: "O(1)", path: pConstant, color: "stroke-emerald-400", activeColor: "stroke-emerald-500", glow: "shadow-emerald-500/20" },
    { name: "logarithmic", label: "O(log N)", path: pLog, color: "stroke-cyan-400", activeColor: "stroke-cyan-500", glow: "shadow-cyan-500/20" },
    { name: "linear", label: "O(N)", path: pLinear, color: "stroke-yellow-400", activeColor: "stroke-yellow-500", glow: "shadow-yellow-500/20" },
    { name: "linearithmic", label: "O(N log N)", path: pLinearithmic, color: "stroke-orange-400", activeColor: "stroke-orange-500", glow: "shadow-orange-500/20" },
    { name: "quadratic", label: "O(N²)", path: pQuadratic, color: "stroke-amber-500", activeColor: "stroke-amber-600", glow: "shadow-amber-500/20" },
    { name: "exponential", label: "O(2ⁿ)", path: pExponential, color: "stroke-rose-500", activeColor: "stroke-rose-600", glow: "shadow-rose-500/20" },
  ];

  return (
    <div id="complexity-card" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-xl p-6 text-slate-700 shadow-sm">
      
      {/* Left Column: Metric Details */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            Complexity Signature
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time Complexity Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50/50 border border-slate-200 rounded-lg p-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>TIME COMPLEXITY</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-indigo-950 mb-2 font-mono">
                {timeComplexity}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {timeExplanation}
              </p>
            </motion.div>

            {/* Space Complexity Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-50/50 border border-slate-200 rounded-lg p-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                <span>SPACE COMPLEXITY</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-emerald-950 mb-2 font-mono">
                {spaceComplexity}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {spaceExplanation}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Worst Case Complexity if available */}
        {worstCaseTime && worstCaseTime !== timeComplexity && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 text-xs text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-900 block mb-1">
                Worst-Case Time Complexity: {worstCaseTime}
              </span>
              <p className="leading-relaxed text-amber-700">{worstCaseTimeExplanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Visual Big-O Graph */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center bg-slate-50/50 border border-slate-200 rounded-xl p-4">
        <span className="text-xs font-mono text-slate-400 mb-2">Big-O Complexity Growth Comparison</span>
        
        <div className="relative w-full max-w-[360px]">
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Grid Axes */}
            <line x1={padding} y1={height - padding} x2={width - 5} y2={height - padding} className="stroke-slate-300 stroke-[1.5px]" />
            <line x1={padding} y1={padding - 5} x2={padding} y2={height - padding} className="stroke-slate-300 stroke-[1.5px]" />
            
            {/* Axis Labels */}
            <text x={width - 40} y={height - 5} className="fill-slate-400 text-[10px] font-mono">Elements (N)</text>
            <text x={5} y={padding} className="fill-slate-400 text-[10px] font-mono rotate-270 origin-left" style={{ transform: "rotate(-90deg) translate(-15px, -15px)" }}>Operations</text>

            {/* Plot Curves */}
            {curves.map((curve) => {
              const isActive = curve.name === highlightedClass;
              return (
                <g key={curve.name}>
                  {/* Subtle hover background path for easier activation */}
                  <path
                    d={curve.path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={16}
                    className="cursor-help"
                  />
                  {/* Glowing active outline */}
                  {isActive && (
                    <motion.path
                      d={curve.path}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={4.5}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8 }}
                      className={`${curve.color} opacity-45 blur-[3px]`}
                    />
                  )}
                  {/* Base curve line */}
                  <path
                    d={curve.path}
                    fill="none"
                    strokeWidth={isActive ? 3 : 1.5}
                    className={`${isActive ? curve.activeColor : "stroke-slate-300"} transition-all duration-300`}
                  />
                  {/* Floating badge for active complexity */}
                  {isActive && (
                    <foreignObject
                      x={curve.name === "exponential" ? padding + 60 : width - padding - 65}
                      y={curve.name === "exponential" ? padding + 20 : Math.max(padding, height - padding - 100)}
                      width={70}
                      height={24}
                    >
                      <div className="bg-white border border-indigo-300 text-[10px] font-mono text-center rounded-md px-1.5 py-0.5 text-indigo-700 font-bold shadow-sm animate-bounce">
                        Your Code
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-3 text-[9px] font-mono">
          {curves.map((c) => (
            <div key={c.name} className="flex items-center gap-1">
              <span className={`w-2.5 h-1 rounded-sm ${c.name === highlightedClass ? "bg-indigo-500" : "bg-slate-300"}`} />
              <span className={c.name === highlightedClass ? "text-indigo-600 font-bold" : "text-slate-400"}>
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
