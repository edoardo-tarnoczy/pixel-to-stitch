// types/index.ts

export interface ColorRGB {
    r: number;
    g: number;
    b: number;
    hex: string;
}

export interface StitchCell {
    x: number;
    y: number;
    color: ColorRGB;
    symbol?: string;
}

export interface ProcessingOptions {
    gridWidth: number;   // Number of stitches wide (e.g., 30)
    gridHeight: number;  // Calculated height maintaining aspect ratio
    maxColors: number;   // Color palette reduction limit (e.g., 2 to 16)
    technique: 'single-crochet' | 'c2c';
}

export interface PatternRow {
    rowNumber: number;
    direction: 'L-to-R' | 'R-to-L';
    instructions: { color: ColorRGB; count: number }[];
}
