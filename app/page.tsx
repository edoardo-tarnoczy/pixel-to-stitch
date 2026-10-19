"use client";

import { useEffect, useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { processImageToGrid } from "@/lib/imageProcessor";
import { PatternRow, ProcessingOptions, StitchCell } from "@/types";
import { Controls } from "@/components/Controls";
import { generateWrittenPattern } from "@/lib/patternGenerator";
import { PatternText } from "@/components/PatternText";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [grid, setGrid] = useState<StitchCell[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<ProcessingOptions>({
    gridWidth: 30,
    gridHeight: 30,
    maxColors: 12,
    technique: "single-crochet",
  });
  const [pattern, setPattern] = useState<PatternRow[]>([]);

  useEffect(() => {
    if (!imageSrc) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await processImageToGrid(imageSrc, options);
        setGrid(result.grid);
        const writtenPattern = generateWrittenPattern(result.grid);
        setPattern(writtenPattern);
      } catch (err) {
        console.error("Failed to process image:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [imageSrc, options]);

  const handleImageSelected = (src: string) => {
    setImageSrc(src);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Crochet Pixel-to-Stitch Generator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-6">
            <UploadZone onImageSelected={handleImageSelected} />

            {imageSrc && grid.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-medium text-slate-500">
                  Stitch Grid Preview ({grid[0].length} x {grid.length}{" "}
                  stitches)
                </h3>
                <div
                  className="grid gap-px border border-slate-300 p-1 bg-slate-100 rounded h-auto overflow-auto"
                  style={{
                    gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                  }}
                >
                  {grid.flat().map((cell, idx) => (
                    <div
                      key={idx}
                      className="aspect-square w-full"
                      style={{ backgroundColor: cell.color.hex }}
                      title={`(${cell.x}, ${cell.y}) - ${cell.color.hex}`}
                    />
                  ))}
                </div>
              </div>
            )}
            <PatternText pattern={pattern} />
          </div>

          <div className="md:col-span-1">
            <Controls
              options={options}
              onChange={setOptions}
              disabled={!imageSrc || loading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
