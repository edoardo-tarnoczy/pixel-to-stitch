// components/PatternText.tsx
"use client";

import React from "react";
import { PatternRow } from "@/types";
import { FileText } from "lucide-react";

interface PatternTextProps {
  pattern: PatternRow[];
}

export const PatternText: React.FC<PatternTextProps> = ({ pattern }) => {
  if (!pattern || pattern.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Istruzioni Scritte (Riga per Riga)
      </h2>

      <div className="max-h-96 overflow-y-auto space-y-2 pr-2 font-mono text-sm">
        {pattern.map((row) => (
          <div
            key={row.rowNumber}
            className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-3"
          >
            <span className="font-semibold text-slate-500 min-w-20">
              Riga {row.rowNumber} ({row.direction}):
            </span>

            <div className="flex flex-wrap gap-2 items-center">
              {row.instructions.map((inst, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-slate-300"
                    style={{ backgroundColor: inst.color.hex }}
                  />
                  {inst.count}x {inst.color.hex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
