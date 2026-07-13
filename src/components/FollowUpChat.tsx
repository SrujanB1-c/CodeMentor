import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, MessageSquare, RefreshCw, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

interface FollowUpChatProps {
  code: string;
  style: string;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const DEFAULT_SUGGESTIONS = [
  "Can you explain the main logic with another analogy?",
  "How can I write unit tests for this code snippet?",
  "What edge cases could cause this code to break?",
  "How would you rewrite this to be more memory-efficient?",
];

export function FollowUpChat({ code, style, chatHistory, setChatHistory }: FollowUpChatProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom of the chat on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      message: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // Prepare conversation history in simple role-message turns for Express API
      const conversationHistory = chatHistory.map((turn) => ({
        role: turn.role,
        message: turn.message,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          conversationHistory,
          message: textToSend,
          style,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to contact CodeMentor server.");
      }

      const data = await res.json();

      const mentorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        message: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, mentorMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong sending your message.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-slate-750 shadow-sm flex flex-col h-[540px]">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Interactive Mentor Chat
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ask clarifying questions, ask to rewrite sections, or request testing guidelines.
            </p>
          </div>
        </div>

        <button
          onClick={() => setChatHistory([])}
          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1.5 hover:bg-slate-50 px-2.5 py-1.5 rounded transition-all border border-slate-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-4 bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[100px]">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 text-slate-400 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 animate-pulse" />
            <h4 className="font-semibold text-slate-500 text-sm">Conversation is ready</h4>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              CodeMentor AI has loaded your snippet code signature. Choose one of the suggested topics below or enter your own query.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`flex flex-col ${chat.role === "user" ? "items-end" : "items-start"}`}
              >
                {/* Sender badge */}
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase px-1 mb-1">
                  {chat.role === "user" ? "You" : "CodeMentor AI"} • {chat.timestamp}
                </span>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 leading-relaxed text-xs shadow-sm ${
                    chat.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {chat.role === "user" ? (
                    <p className="whitespace-pre-wrap">{chat.message}</p>
                  ) : (
                    <div className="markdown-body">
                      <ReactMarkdown>{chat.message}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase px-1 mb-1 animate-pulse">
                  CodeMentor AI is typing...
                </span>
                <div className="bg-white border border-slate-200 rounded-xl rounded-tl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-sm animate-pulse">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>Evaluating code layers...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Suggested Follow-ups */}
      {chatHistory.length === 0 && (
        <div className="mb-4">
          <span className="text-[10px] font-bold font-mono text-slate-450 uppercase tracking-wider block mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Suggested queries
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEFAULT_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(sug)}
                className="text-left text-xs bg-white border border-slate-200 hover:border-slate-300 text-slate-700 p-2.5 rounded-lg hover:bg-slate-50/80 transition-all truncate"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-xl">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={loading ? "Analyzing request..." : "Ask your coding instructor..."}
          disabled={loading}
          className="flex-1 bg-transparent text-slate-800 outline-none text-xs px-3 py-2 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg p-2.5 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
