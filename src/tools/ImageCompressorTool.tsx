import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  Download,
  RotateCcw,
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  FileCheck,
} from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const { showToast } = useToast();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'original' | 'compressed'>('split');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const compressImage = useCallback((file: File, q: number) => {
    setIsCompressing(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setIsCompressing(false);
          setErrorMessage('Could not initialize image processing canvas.');
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Compress using JPEG or PNG with quality param
        // For PNG, canvas.toBlob ignores quality, but converting to JPEG or WebP reduces size dramatically
        const targetMime = file.type === 'image/png' ? 'image/jpeg' : file.type;
        const qualityFraction = Math.max(0.05, Math.min(1, q / 100));

        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (compressedUrl) {
                URL.revokeObjectURL(compressedUrl);
              }
              const newUrl = URL.createObjectURL(blob);
              setCompressedBlob(blob);
              setCompressedUrl(newUrl);
            } else {
              setErrorMessage('Image compression encountered an error.');
            }
            setIsCompressing(false);
          },
          targetMime,
          qualityFraction
        );
      };

      img.onerror = () => {
        setIsCompressing(false);
        setErrorMessage('Failed to decode image file.');
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setIsCompressing(false);
      setErrorMessage('Failed to read image file.');
    };

    reader.readAsDataURL(file);
  }, [compressedUrl]);

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('This file type is not supported. Please upload a JPG, JPEG, or PNG.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('This file is too large. Please choose an image under 20MB.');
      return;
    }

    setErrorMessage(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);

    const url = URL.createObjectURL(file);
    setOriginalFile(file);
    setOriginalUrl(url);
    compressImage(file, quality);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalFile) {
      compressImage(originalFile, newQ);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setErrorMessage(null);
    setQuality(75);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Reset complete', 'Image compressor cleared.', 'info');
  };

  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(compressedBlob);
    const ext = originalFile.type === 'image/png' ? 'jpg' : originalFile.name.split('.').pop() || 'jpg';
    const baseName = originalFile.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}-compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Image compressed successfully.', `Downloaded ${baseName}-compressed.${ext}`);
  };

  // Calculations
  const originalBytes = originalFile?.size || 0;
  const compressedBytes = compressedBlob?.size || 0;
  const reductionPercent =
    originalBytes > 0 && compressedBytes > 0
      ? Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100))
      : 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Upload Box if no file */}
      {!originalFile ? (
        <div
          id="image-drop-zone"
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 sm:p-12 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
              : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-indigo-400 dark:hover:border-indigo-600'
          }`}
        >
          <input
            ref={fileInputRef}
            id="image-file-input"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />
          <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Drag & drop your image here
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Supports JPG, JPEG, and PNG up to 20MB
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800"
            >
              Select an Image
            </button>
          </div>
        </div>
      ) : (
        /* Image Processing & Metrics Card */
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6">
          {/* Top Bar with file name and reset */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 truncate max-w-xs sm:max-w-md">
                  {originalFile.name}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Original: {formatFileSize(originalBytes)}
                </p>
              </div>
            </div>
            <button
              id="image-reset-btn"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Stat Metrics Grid (Original, Compressed, Reduced) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Original
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
                {formatFileSize(originalBytes)}
              </div>
            </div>
            <div className="text-center sm:text-left border-x border-neutral-200 dark:border-neutral-700 px-2 sm:px-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Compressed
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                {formatFileSize(compressedBytes)}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                <TrendingDown className="w-3 h-3" /> Reduced
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {reductionPercent}%
              </div>
            </div>
          </div>

          {/* Quality Slider Control */}
          <div className="space-y-2 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Compression Quality
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                {quality}%
              </span>
            </div>
            <input
              id="image-quality-slider"
              type="range"
              min="10"
              max="95"
              step="5"
              value={quality}
              onChange={(e) => handleQualityChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Smaller Size (More compressed)</span>
              <span>Balanced (75%)</span>
              <span>Maximum Quality</span>
            </div>
          </div>

          {/* Visual Previews (Side-by-side or tabs) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              <span>Visual Comparison</span>
              <div className="flex gap-1 p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'split'
                      ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setViewMode('compressed')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'compressed'
                      ? 'bg-white dark:bg-neutral-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Compressed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(viewMode === 'split' || viewMode === 'original') && originalUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center">
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md bg-black/60 text-white backdrop-blur-xs">
                    Original ({formatFileSize(originalBytes)})
                  </span>
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-h-60 w-full object-contain p-2"
                  />
                </div>
              )}

              {(viewMode === 'split' || viewMode === 'compressed') && compressedUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 flex flex-col items-center">
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-600 text-white backdrop-blur-xs">
                    Compressed ({formatFileSize(compressedBytes)})
                  </span>
                  <img
                    src={compressedUrl}
                    alt="Compressed"
                    className="max-h-60 w-full object-contain p-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Download and Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              id="image-download-btn"
              onClick={handleDownload}
              disabled={isCompressing || !compressedBlob}
              className="flex-1 min-h-[48px] px-6 py-3 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Compressed Image ({formatFileSize(compressedBytes)})</span>
            </button>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
