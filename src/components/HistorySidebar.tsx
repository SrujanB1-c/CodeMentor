import { FileCode, History, Trash2, Calendar } from "lucide-react";
import { HistoryItem } from "../types";

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  activeId?: string;
}

export function HistorySidebar({
  history,
  onSelect,
  onDelete,
  onClearAll,
  activeId,
}: HistorySidebarProps) {
  const formatTime = (timeStr: string) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-700 shadow-sm h-full flex flex-col max-h-[500px]">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Review Archive
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Saved locally ({history.length})
            </span>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[10px] text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded transition-all border border-rose-200"
          >
            Clear All
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[120px]">
        {history.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-4 text-slate-400 space-y-1">
            <History className="w-8 h-8 text-slate-300 mb-1" />
            <span className="text-xs font-semibold text-slate-500">Archive is empty</span>
            <p className="text-[10px] text-slate-400 max-w-[180px] leading-relaxed">
              When you submit a snippet, the audit results are saved here automatically.
            </p>
          </div>
        ) : (
          history.map((item) => {
            const isActive = item.id === activeId;
            return (
              <div
                key={item.id}
                className={`group relative flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  isActive
                    ? "bg-indigo-50 border-indigo-300"
                    : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {/* Select button click target */}
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="flex-1 text-left min-w-0 pr-2"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <FileCode className={`w-3.5 h-3.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    <span className={`text-xs font-semibold truncate block ${isActive ? "text-indigo-900" : "text-slate-700"}`}>
                      {item.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                    <span className="uppercase bg-slate-50 border border-slate-200 px-1 py-0.2 rounded text-[8px] text-slate-500">
                      {item.language}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all hover:bg-slate-100"
                  title="Remove from history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
