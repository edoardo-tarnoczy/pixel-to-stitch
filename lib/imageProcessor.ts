// lib/imageProcessor.ts
import { ColorRGB, ProcessingOptions, StitchCell } from "@/types";

export function getClosestColor(
  color: ColorRGB,
  palette: ColorRGB[],
): ColorRGB {
  let minDistance = Infinity;
  let closestColor: ColorRGB = color;

  palette.forEach((paletteColor) => {
    const currentMinDistance = Math.sqrt(
      Math.pow(color.r - paletteColor.r, 2) +
        Math.pow(color.g - paletteColor.g, 2) +
        Math.pow(color.b - paletteColor.b, 2),
    );
    if (currentMinDistance < minDistance) {
      minDistance = currentMinDistance;
      closestColor = paletteColor;
    }
  });
  return closestColor;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

export function generatePalette(
  colors: ColorRGB[],
  maxColors: number,
): ColorRGB[] {
  if (colors.length === 0) return [];

  // 1. Group similar shades into frequency buckets (rounding by 16)
  const colorCounts: { [key: string]: { color: ColorRGB; count: number } } = {};

  for (const color of colors) {
    const qR = Math.min(255, Math.max(0, Math.round(color.r / 16) * 16));
    const qG = Math.min(255, Math.max(0, Math.round(color.g / 16) * 16));
    const qB = Math.min(255, Math.max(0, Math.round(color.b / 16) * 16));

    const hex = rgbToHex(qR, qG, qB);

    if (colorCounts[hex]) {
      colorCounts[hex].count += 1;
    } else {
      colorCounts[hex] = {
        color: { r: qR, g: qG, b: qB, hex },
        count: 1,
      };
    }
  }

  // 2. Sort all buckets by popularity (pixel count)
  const sortedCandidates = Object.values(colorCounts)
    .sort((a, b) => b.count - a.count)
    .map((item) => item.color);

  // 3. Distance-based selection: filter out duplicate shades
  const palette: ColorRGB[] = [];
  // Distance threshold in RGB space (adjust between 30 and 60 to control strictness)
  const MIN_DISTANCE_THRESHOLD = 45;

  for (const candidate of sortedCandidates) {
    if (palette.length >= maxColors) break;

    // Check if candidate is distinct enough from all colors already accepted
    const isDistinct = palette.every((selectedColor) => {
      const distance = Math.sqrt(
        Math.pow(candidate.r - selectedColor.r, 2) +
          Math.pow(candidate.g - selectedColor.g, 2) +
          Math.pow(candidate.b - selectedColor.b, 2),
      );
      return distance >= MIN_DISTANCE_THRESHOLD;
    });

    // Always accept the very first (most dominant) color, or any distinct color after
    if (palette.length === 0 || isDistinct) {
      palette.push(candidate);
    }
  }

  // Fallback: If threshold was too strict and palette isn't full, fill remaining with top candidates
  if (palette.length < maxColors) {
    for (const candidate of sortedCandidates) {
      if (palette.length >= maxColors) break;
      if (!palette.some((p) => p.hex === candidate.hex)) {
        palette.push(candidate);
      }
    }
  }

  return palette;
}

export async function processImageToGrid(
  imageSrc: string,
  options: ProcessingOptions,
): Promise<{ grid: StitchCell[][]; palette: ColorRGB[]; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const { gridWidth, maxColors } = options;
      // 1. Calculate gridHeight using options.gridWidth and image aspect ratio.
      const gridHeight = Math.round(gridWidth * (img.height / img.width));
      // 2. Create an offscreen canvas element and set its width & height.
      const canvas = document.createElement("canvas");
      canvas.width = gridWidth;
      canvas.height = gridHeight;
      // 3. Get the 2D rendering context ('2d').
      const ctx = canvas.getContext("2d");
      // 4. Draw the image onto the canvas at (0, 0) with dimensions (gridWidth, gridHeight).
      ctx?.drawImage(img, 0, 0, gridWidth, gridHeight);
      // 5. Read pixel data using ctx.getImageData(0, 0, gridWidth, gridHeight).
      const pixelData = ctx?.getImageData(0, 0, gridWidth, gridHeight).data;
      const rawGridColors: StitchCell[][] = [];
      const allExtractedColors: ColorRGB[] = [];
      // 6. Loop through rows (y) and columns (x) to extract R, G, B for each pixel.
      // 7. For now, construct a 2D array of StitchCell objects using raw colors and resolve the Promise.
      if (!pixelData) throw Error("Error retrieving pixel data");

      for (let y = 0; y < gridHeight; y++) {
        const row: StitchCell[] = [];

        for (let x = 0; x < gridWidth; x++) {
          const index = (y * gridWidth + x) * 4;
          const r = pixelData[index];
          const g = pixelData[index + 1];
          const b = pixelData[index + 2];

          const color: ColorRGB = {
            r,
            g,
            b,
            hex: rgbToHex(r, g, b),
          };

          row.push({ x, y, color });
          allExtractedColors.push(color);
        }
        rawGridColors.push(row);
      }

      const palette = generatePalette(allExtractedColors, maxColors);
      const quantizedGrid: StitchCell[][] = [];

      for (let y = 0; y < gridHeight; y++) {
        const row: StitchCell[] = [];
        for (let x = 0; x < gridWidth; x++) {
          const rawColor = rawGridColors[y][x].color;
          // Map raw pixel color to closest palette yarn color
          const quantizedColor = getClosestColor(rawColor, palette);

          row.push({
            x,
            y,
            color: quantizedColor,
          });
        }
        quantizedGrid.push(row);
      }

      resolve({ grid: quantizedGrid, palette, height: gridHeight });
    };

    img.onerror = (err) => reject(err);
  });
}
