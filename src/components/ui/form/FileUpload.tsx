import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = '.pdf,.doc,.docx',
  maxSizeMB = 5,
  value,
  onChange,
  error: customError,
  hint = 'Accepted formats: PDF, DOC, DOCX up to 5MB.',
  required = false,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = customError || internalError;

  const validateAndSetFile = (file: File) => {
    setInternalError(null);

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setInternalError(`File size exceeds maximum permitted limit (${maxSizeMB}MB).`);
      return;
    }

    // Validate format extension
    const allowedExtensions = accept.split(',').map((ext) => ext.trim().toLowerCase());
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedExtensions.includes(fileExt)) {
      setInternalError(`Invalid file format. Please upload ${accept}.`);
      return;
    }

    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs uppercase tracking-wider font-semibold text-ink font-sans">
            {label}
            {required && <span className="text-status-danger ml-1">*</span>}
          </label>
          <span className="text-[11px] text-ink-muted uppercase tracking-wider">
            Max {maxSizeMB}MB
          </span>
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
          }
        }}
      />

      {!value ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border border-dashed border-border p-6 text-center cursor-pointer transition-all bg-white hover:border-ink hover:bg-canvas/50',
            isDragging && 'border-accent bg-accent/5',
            displayError && 'border-status-danger bg-status-danger-bg/20'
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-canvas-surface flex items-center justify-center text-ink-muted">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink font-sans">
                Drag and drop your file here, or{' '}
                <span className="text-accent underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-ink-muted mt-1 font-sans">{hint}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border border-border p-3.5 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-canvas-surface flex items-center justify-center shrink-0 text-ink">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ink truncate font-sans">
                  {value.name}
                </span>
                <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
              </div>
              <span className="text-xs text-ink-muted font-sans">
                {formatFileSize(value.size)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="p-1.5 text-ink-muted hover:text-status-danger hover:bg-canvas-surface transition-colors"
            title="Remove document"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {displayError && (
        <p className="text-xs text-status-danger font-medium leading-relaxed font-sans">
          {displayError}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
