// lib/imageProcessor.ts
import {ColorRGB, ProcessingOptions, StitchCell} from '@/types';

export function getClosestColor(color: ColorRGB, palette: ColorRGB[]): ColorRGB {
    let minDistance = Infinity;
    let closestColor: ColorRGB = color;

    palette.forEach(paletteColor => {
        const currentMinDistance = Math.sqrt(
            Math.pow(color.r - paletteColor.r,2) +
            Math.pow(color.g - paletteColor.g,2) +
            Math.pow(color.b - paletteColor.b,2)
        );
        if (currentMinDistance < minDistance) {
            minDistance = currentMinDistance;
            closestColor = paletteColor
        }
    })
    return closestColor;
}

export function rgbToHex(r: number, g: number, b: number): string {
    const hexR = r.toString(16).padStart(2, '0')
    const hexG = g.toString(16).padStart(2, '0')
    const hexB = b.toString(16).padStart(2, '0')

    return `#${hexR}${hexG}${hexB}`
}

export async function processImageToGrid(
    imageSrc: string,
    options: ProcessingOptions
): Promise<{ grid: StitchCell[][]; palette: ColorRGB[]; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;

        img.onload = () => {
            const {gridWidth} = options
            // 1. Calculate gridHeight using options.gridWidth and image aspect ratio.
            const gridHeight = Math.round(gridWidth * (img.height/img.width))
            // 2. Create an offscreen canvas element and set its width & height.
            const canvas = document.createElement('canvas');
            canvas.width = gridWidth;
            canvas.height = gridHeight;
            // 3. Get the 2D rendering context ('2d').
            const ctx = canvas.getContext('2d')
            // 4. Draw the image onto the canvas at (0, 0) with dimensions (gridWidth, gridHeight).
            ctx?.drawImage(img, 0, 0, gridWidth, gridHeight)
            // 5. Read pixel data using ctx.getImageData(0, 0, gridWidth, gridHeight).
            const pixelData = ctx?.getImageData(0,0,gridWidth, gridHeight).data
            const grid: StitchCell[][] = [];
            // 6. Loop through rows (y) and columns (x) to extract R, G, B for each pixel.
            // 7. For now, construct a 2D array of StitchCell objects using raw colors and resolve the Promise.
            if (!pixelData) throw Error('Error retrieving pixel data')

            for (let y = 0; y < gridHeight; y++) {
                const row: StitchCell[] = []

                for (let x = 0; x < gridWidth; x++) {
                    const index = (y * gridWidth + x) * 4;
                    const r = pixelData[index]
                    const g = pixelData[index + 1]
                    const b = pixelData[index + 2]

                    const color: ColorRGB = {
                        r,
                        g,
                        b,
                        hex: rgbToHex(r,g,b)
                    }

                    row.push({x, y, color})
                }
                grid.push(row)
            }
            resolve({ grid, palette:[], height: gridHeight })

        };

        img.onerror = (err) => reject(err);
    });
}
