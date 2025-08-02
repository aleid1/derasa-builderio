import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center justify-start mb-4" dir="rtl">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">د</span>
        </div>

        {/* Typing bubble */}
        <div className="bg-white border border-neutral-200 rounded-2xl rounded-br-md px-4 py-3 shadow-sm max-w-xs">
          <div className="flex items-center justify-center gap-1">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
