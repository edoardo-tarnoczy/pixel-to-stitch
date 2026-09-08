"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { processImageToGrid } from "@/lib/imageProcessor";
import { StitchCell } from "@/types";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [grid, setGrid] = useState<StitchCell[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageSelected = async (src: string) => {
    setImageSrc(src);
    setLoading(true);

    try {
      // Testing with a 30-stitch wide grid
      const result = await processImageToGrid(src, {
        gridWidth: 30,
        gridHeight: 30,
        maxColors: 12,
        technique: "single-crochet",
      });

      setGrid(result.grid);
    } catch (err) {
      console.error("Failed to process image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Crochet Pixel-to-Stitch Test
        </h1>

        <UploadZone onImageSelected={handleImageSelected} />

        {loading && (
          <p className="text-indigo-600 font-medium">Processing pixels...</p>
        )}

        {/* Side-by-side comparison once an image is uploaded */}
        {imageSrc && grid.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">
              Preview ({grid[0].length} x {grid.length} stitches)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Original Image */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Original Image
                </h3>
                <img
                  src={imageSrc}
                  alt="Original upload"
                  className="w-full max-h-80 object-contain rounded-lg"
                />
              </div>

              {/* Pixelated Stitch Grid */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Pixelated Stitch Grid
                </h3>
                <div
                  className="grid gap-0.5 border border-slate-300 p-1 bg-slate-100 rounded max-h-80 overflow-auto"
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
