import { ProcessingOptions } from "@/types";
import { LayoutGrid, Palette, Sliders } from "lucide-react";

interface ControlsProps {
  disabled: boolean;
  options: ProcessingOptions;
  onChange: (options: ProcessingOptions) => void;
}

export function Controls({ disabled, options, onChange }: ControlsProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Sliders className="w-5 h-5 text-indigo-600" />
        Pattern Settings
      </h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-slate-700">
          <label htmlFor="gridWidth" className="flex items-center gap-1.5">
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            Grid Width (Stitches)
          </label>
          <span className="text-indigo-600 font-semibold">
            {options.gridWidth} st
          </span>
        </div>
        <input
          id="gridWidth"
          type="range"
          min={10}
          max={100}
          value={options.gridWidth}
          disabled={disabled}
          onChange={(e) =>
            onChange({ ...options, gridWidth: parseInt(e.target.value, 10) })
          }
          className="w-full accent-indigo-600 cursor-pointer disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-slate-700">
          <label htmlFor="maxColors" className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-slate-500" />
            Max Yarn Colors
          </label>
          <span className="text-indigo-600 font-semibold">
            {options.maxColors} colors
          </span>
        </div>
        <input
          id="maxColors"
          type="range"
          min={2}
          max={16}
          value={options.maxColors}
          disabled={disabled}
          onChange={(e) =>
            onChange({ ...options, maxColors: parseInt(e.target.value, 10) })
          }
          className="w-full accent-indigo-600 cursor-pointer disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Crochet Technique
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange({ ...options, technique: "single-crochet" })
            }
            className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
              options.technique === "single-crochet"
                ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Single Crochet (Sc)
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...options, technique: "c2c" })}
            className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
              options.technique === "c2c"
                ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Corner-to-Corner (C2C)
          </button>
        </div>
      </div>
    </div>
  );
}
