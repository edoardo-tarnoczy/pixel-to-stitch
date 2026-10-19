// lib/patternGenerator.ts
import { StitchCell, PatternRow, ColorRGB } from "@/types";

export function generateWrittenPattern(grid: StitchCell[][]): PatternRow[] {
  if (!grid || grid.length === 0) return [];

  const height = grid.length;
  const width = grid[0].length;
  const pattern: PatternRow[] = [];

  let rowCounter = 1;

  // 1. Traverse bottom-to-top
  for (let y = height - 1; y >= 0; y--) {
    const isOddRow = rowCounter % 2 !== 0;
    const direction = isOddRow ? "R-to-L" : "L-to-R";

    // Get ordered array of cells for this row based on direction
    const rowCells: StitchCell[] = [];
    if (isOddRow) {
      // Right to Left: x goes from width - 1 down to 0
      for (let x = width - 1; x >= 0; x--) {
        rowCells.push(grid[y][x]);
      }
    } else {
      // Left to Right: x goes from 0 up to width - 1
      for (let x = 0; x < width; x++) {
        rowCells.push(grid[y][x]);
      }
    }

    // 2. TODO: Run-Length Encoding (RLE)
    // Group consecutive stitches with matching color.hex values
    const instructions: { color: ColorRGB; count: number }[] = [];

    // Hint for the loop:
    // Keep track of the current color and a running count.
    // Loop through rowCells:
    //   - If cell.color.hex matches current color, increment count.
    //   - If cell.color.hex changes, push { color: currentColor, count } to instructions,
    //     and reset count to 1 for the new color.
    //   - After the loop, don't forget to push the final color group!
    for (let i = 0; i < rowCells.length; i++) {
      const currentCell = rowCells[i];
      const currentColor = currentCell.color;
      let count = 1;

      // Count consecutive cells with the same color
      while (
        i + 1 < rowCells.length &&
        rowCells[i + 1].color.hex === currentColor.hex
      ) {
        count++;
        i++;
      }

      instructions.push({ color: currentColor, count });
    }

    pattern.push({
      rowNumber: rowCounter,
      direction,
      instructions,
    });

    rowCounter++;
  }

  return pattern;
}
