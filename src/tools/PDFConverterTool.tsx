import React, { useState, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { jsPDF } from 'jspdf';
import {
  FileText,
  UploadCloud,
  X,
  Download,
  RotateCcw,
  CheckCircle2,
  FileImage,
  Loader2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

export const PDFConverterTool: React.FC = () => {
  const { showToast } = useToast();
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState<'idle' | 'processing' | 'ready' | 'error'>('idle');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] = useState('converted-document.pdf');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const processFiles = (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const newItems: UploadedFileItem[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    Array.from(fileList).forEach((file) => {
      // Validate file size (< 25MB)
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage('This file is too large. Please choose files smaller than 25MB.');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('This file type is not supported. Please upload JPG, PNG, or WEBP images.');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        previewUrl,
      });
    });

    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
      setConversionStatus('idle');
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
    setConversionStatus('idle');
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  const handleReset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setFiles([]);
    setIsConverting(false);
    setProgress(0);
    setConversionStatus('idle');
    setPdfBlobUrl(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Reset complete', 'File queue cleared.', 'info');
  };

  // Convert queued images to a multi-page PDF document
  const handleConvertToPdf = async () => {
    if (files.length === 0) {
      setErrorMessage('Please add at least one image file first.');
      return;
    }

    setIsConverting(true);
    setConversionStatus('processing');
    setProgress(15);
    setErrorMessage(null);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const margin = 10;
      const maxW = pageWidth - margin * 2;
      const maxH = pageHeight - margin * 2;

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        if (i > 0) {
          doc.addPage();
        }

        // Load image data
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve) => {
          if (img.complete) resolve(null);
          else img.onload = () => resolve(null);
        });

        // Compute aspect fit
        const imgAspect = img.width / img.height;
        const pageAspect = maxW / maxH;

        let renderW = maxW;
        let renderH = maxH;
        if (imgAspect > pageAspect) {
          renderH = maxW / imgAspect;
        } else {
          renderW = maxH * imgAspect;
        }

        const posX = (pageWidth - renderW) / 2;
        const posY = (pageHeight - renderH) / 2;

        const imgType = item.file.type.includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(img, imgType, posX, posY, renderW, renderH);

        const currentPct = Math.round(((i + 1) / files.length) * 85) + 10;
        setProgress(currentPct);
      }

      setProgress(100);
      const outputBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(outputBlob);
      setPdfBlobUrl(blobUrl);

      const generatedName =
        files.length === 1
          ? files[0].name.replace(/\.[^/.]+$/, '') + '.pdf'
          : `document-collection-${files.length}-pages.pdf`;
      setDownloadFileName(generatedName);

      setConversionStatus('ready');
      setIsConverting(false);
      showToast('File converted successfully.', `${generatedName} is ready to download.`);
    } catch (err) {
      console.error(err);
      setIsConverting(false);
      setConversionStatus('error');
      setErrorMessage('Failed to generate PDF document. Please try again with valid images.');
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement('a');
    a.href = pdfBlobUrl;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Download started', `Downloading ${downloadFileName}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Upload Box */}
      <div
        id="pdf-drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
            : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-indigo-400 dark:hover:border-indigo-600'
        }`}
      >
        <input
          ref={fileInputRef}
          id="pdf-file-input"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFiles(e.target.files);
            }
          }}
        />

        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
              Drag & drop images to convert to PDF
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Supports JPG, JPEG, PNG, WEBP • Multiple images merge into one document
            </p>
          </div>
          <button
            type="button"
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800"
          >
            Browse files
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Queue of files */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                Selected Images ({files.length})
              </h4>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>

          {/* Files grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/70 dark:border-neutral-800 group"
              >
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                    <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {formatFileSize(item.size)}
                  </p>
                </div>
                <button
                  id={`remove-pdf-file-${item.id}`}
                  onClick={() => removeFile(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          {isConverting && (
            <div className="space-y-2 pt-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  Processing your file...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status Ready banner */}
          {conversionStatus === 'ready' && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Your file is ready.
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400">
                    {downloadFileName} • Multi-page PDF ready
                  </div>
                </div>
              </div>
              <button
                id="pdf-download-btn"
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          )}

          {/* Primary Action Button */}
          {conversionStatus !== 'ready' && (
            <div className="pt-2">
              <button
                id="pdf-convert-btn"
                onClick={handleConvertToPdf}
                disabled={isConverting || files.length === 0}
                className="w-full min-h-[48px] px-6 py-3 rounded-2xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5" />
                    <span>Convert {files.length} {files.length === 1 ? 'Image' : 'Images'} to PDF</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
