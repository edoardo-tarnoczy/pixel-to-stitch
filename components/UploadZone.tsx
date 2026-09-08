"use client";

import { DragEvent, useCallback } from "react";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onImageSelected: (imageSrc: string) => void;
}

export function UploadZone({ onImageSelected }: UploadZoneProps) {
  function handleFile(file: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onImageSelected(e.target?.result as string);
    reader.readAsDataURL(file);
  }
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer?.files[0]);
    }
  }, []);

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors rounded-xl p-12 text-center cursor-pointer bg-white text-gray-800"
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <Upload className="w-12 h-12 text-indigo-500 mb-4" />
        <span className="font-semibold text-lg text-gray-700">
          Upload an image to test
        </span>
        <span className="text-sm text-gray-500 mt-1">
          PNG, JPG, SVG or WEBP
        </span>
      </label>
    </div>
  );
}
