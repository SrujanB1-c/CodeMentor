import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Info, HelpCircle } from "lucide-react";
import { DataFlowStep } from "../types";

interface DataFlowDiagramProps {
  dataFlow: DataFlowStep[];
}

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: "input" | "intermediate" | "output";
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  operation: string;
  description: string;
}

export function DataFlowDiagram({ dataFlow }: DataFlowDiagramProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredLink, setHoveredLink] = useState<D3Link | null>(null);
  const [hoveredNode, setHoveredNode] = useState<D3Node | null>(null);

  useEffect(() => {
    if (!svgRef.current || !dataFlow || dataFlow.length === 0) return;

    // Clear previous drawing
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    // Parse dataFlow to create a graph (nodes and links)
    const nodeSet = new Set<string>();
    const links: D3Link[] = [];

    dataFlow.forEach((step) => {
      const src = step.source.trim();
      const dest = step.destination.trim();
      nodeSet.add(src);
      nodeSet.add(dest);

      links.push({
        source: src,
        target: dest,
        operation: step.operation,
        description: step.description,
      });
    });

    // Classify node types
    const sources = new Set(links.map((l) => (typeof l.source === "string" ? l.source : l.source.id)));
    const targets = new Set(links.map((l) => (typeof l.target === "string" ? l.target : l.target.id)));

    const nodes: D3Node[] = Array.from(nodeSet).map((name) => {
      let type: "input" | "intermediate" | "output" = "intermediate";
      if (sources.has(name) && !targets.has(name)) {
        type = "input";
      } else if (targets.has(name) && !sources.has(name)) {
        type = "output";
      }
      return { id: name, label: name, type };
    });

    // SVG container parameters
    const width = containerRef.current?.getBoundingClientRect().width || 600;
    const height = 280;

    svgElement.attr("width", width).attr("height", height);

    // Create markers for arrows
    svgElement
      .append("defs")
      .selectAll("marker")
      .data(["flow-arrow", "flow-arrow-highlight"])
      .enter()
      .append("marker")
      .attr("id", (d) => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 22) // Place arrow head at the boundary of 20px radius node
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L10,0L0,4")
      .attr("fill", (d) => (d === "flow-arrow-highlight" ? "#4f46e5" : "#94a3b8"));

    // Set up D3 Force simulation
    const simulation = d3
      .forceSimulation<D3Node>(nodes)
      .force(
        "link",
        d3
          .forceLink<D3Node, D3Link>(links)
          .id((d) => d.id)
          .distance(120)
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(35));

    // Draw link lines (paths)
    const linkGroup = svgElement.append("g").attr("class", "links");
    
    const linkElements = linkGroup
      .selectAll("g")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "link-container");

    // Background thick path for easier hovering
    linkElements
      .append("path")
      .attr("class", "hover-path")
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 14)
      .attr("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        setHoveredLink(d);
        d3.select(event.currentTarget.parentNode).select(".main-path").attr("stroke", "#4f46e5").attr("stroke-width", 2.5);
      })
      .on("mouseleave", (event, d) => {
        setHoveredLink(null);
        d3.select(event.currentTarget.parentNode).select(".main-path").attr("stroke", "#94a3b8").attr("stroke-width", 1.5);
      });

    // Main visible connection path
    const pathElements = linkElements
      .append("path")
      .attr("class", "main-path")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#flow-arrow)");

    // Glowing dot moving along paths to visualize data flow
    const flowDots = linkElements
      .append("circle")
      .attr("r", 3.5)
      .attr("fill", "#6366f1")
      .attr("class", "flow-dot")
      .style("filter", "drop-shadow(0 0 3px rgba(99, 102, 241, 0.6))");

    // Animate flow dots on connection paths
    const animateFlowDots = () => {
      flowDots.each(function (d) {
        const dot = d3.select(this);
        const parentPathNode = d3.select(this.parentNode as any).select(".main-path").node() as SVGPathElement | null;
        if (!parentPathNode) return;

        const pathLength = parentPathNode.getTotalLength();
        
        dot
          .transition()
          .duration(2500 + Math.random() * 1500)
          .ease(d3.easeLinear)
          .attrTween("transform", () => {
            return (t) => {
              const point = parentPathNode.getPointAtLength(t * pathLength);
              return `translate(${point.x},${point.y})`;
            };
          })
          .on("end", animateFlowDots);
      });
    };

    // Text labels on edges/connections
    const textElements = linkElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -6)
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("class", "edge-label")
      .text((d) => d.operation);

    // Draw node elements
    const nodeGroup = svgElement.append("g").attr("class", "nodes");

    const nodeElements = nodeGroup
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node-container")
      .attr("cursor", "pointer")
      .on("mouseenter", (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).select("circle").attr("stroke", "#4f46e5").attr("stroke-width", 2.5);
      })
      .on("mouseleave", (event, d) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).select("circle").attr("stroke", (n: any) => getNodeColor(n.type)).attr("stroke-width", 1.5);
      })
      .call(
        d3
          .drag<SVGGElement, D3Node>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded) as any
      );

    const getNodeColor = (type: "input" | "intermediate" | "output") => {
      if (type === "input") return "#059669"; // emerald
      if (type === "output") return "#db2777"; // pink
      return "#2563eb"; // blue
    };

    const getNodeFill = (type: "input" | "intermediate" | "output") => {
      if (type === "input") return "#ecfdf5"; // pale emerald
      if (type === "output") return "#fdf2f8"; // pale pink
      return "#eff6ff"; // pale blue
    };

    // Draw circle for each node
    nodeElements
      .append("circle")
      .attr("r", 20)
      .attr("fill", (d) => getNodeFill(d.type))
      .attr("stroke", (d) => getNodeColor(d.type))
      .attr("stroke-width", 1.5)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.08))");

    // Draw short variables names inside nodes
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "#1e293b")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("font-weight", "600")
      .text((d) => (d.label.length > 8 ? d.label.substring(0, 6) + ".." : d.label));

    // Force simulation tick updates
    simulation.on("tick", () => {
      // Draw bezier curves for edges instead of straight lines to make it fluid
      pathElements.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Curved paths
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      // Update flow text position
      textElements.attr("transform", (d: any) => {
        const x = (d.source.x + d.target.x) / 2;
        const y = (d.source.y + d.target.y) / 2;
        
        // Calculate tangent angle to align text with curve
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        
        // Ensure text is never upside down
        if (angle > 90 || angle < -90) angle += 180;

        // Curve shift offset
        const dr = Math.sqrt(dx * dx + dy * dy);
        const mx = x - (dy / dr) * 15;
        const my = y + (dx / dr) * 15;

        return `translate(${mx}, ${my}) rotate(${angle})`;
      });

      // Update node positions
      nodeElements.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Start flow dot transitions once simulation settles slightly
    setTimeout(animateFlowDots, 100);

    // Handle node dragging
    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [dataFlow]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-700 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Variable & Data Flow pipeline
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive, draggable directed pipeline. Trace variables, functions, and outcomes.
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-300/30" /> Inputs</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-blue-300/30" /> Helpers</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500 border border-pink-300/30" /> Outputs</span>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-[280px]">
        <svg ref={svgRef} className="block w-full select-none" />

        {/* Hover overlay explaining edges/transformations */}
        {hoveredLink && (
          <div className="absolute top-4 left-4 right-4 bg-white/95 border border-indigo-200 rounded-lg p-3 text-xs leading-relaxed animate-fade-in shadow-md">
            <div className="flex items-center gap-2 font-semibold text-indigo-700 mb-1">
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-150 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase">
                {hoveredLink.operation}
              </span>
              <span>
                {typeof hoveredLink.source === "string" ? hoveredLink.source : hoveredLink.source.id}
                {" → "}
                {typeof hoveredLink.target === "string" ? hoveredLink.target : hoveredLink.target.id}
              </span>
            </div>
            <p className="text-slate-600 text-xs">{hoveredLink.description}</p>
          </div>
        )}

        {/* Hover overlay explaining nodes */}
        {hoveredNode && !hoveredLink && (
          <div className="absolute bottom-4 left-4 bg-white/95 border border-slate-200 rounded px-2.5 py-1.5 text-[10px] font-mono shadow-sm text-slate-600 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Variable: <strong className="text-slate-800">{hoveredNode.label}</strong> (
              {hoveredNode.type === "input" ? "Input parameter/state" : hoveredNode.type === "output" ? "Final product / Return" : "Intermediate state"}
              )
            </span>
          </div>
        )}

        {(!dataFlow || dataFlow.length === 0) && (
          <div className="absolute inset-0 flex flex-col justify-center items-center text-slate-400 text-xs gap-2">
            <HelpCircle className="w-8 h-8 text-slate-300 animate-pulse" />
            <span>Pipeline rendering is preparing...</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {dataFlow.map((step, idx) => (
          <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col justify-between text-xs">
            <div className="flex justify-between items-center mb-1 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
              <span className="text-emerald-700 font-semibold max-w-[30%] truncate">{step.source}</span>
              <span className="text-indigo-600 mx-1 max-w-[40%] truncate">⚙️ {step.operation}</span>
              <span className="text-pink-700 font-semibold max-w-[30%] truncate">{step.destination}</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
