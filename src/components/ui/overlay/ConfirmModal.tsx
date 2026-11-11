import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/Button';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-start gap-4">
        {isDestructive && (
          <div className="w-10 h-10 rounded-full bg-status-danger-bg text-status-danger flex items-center justify-center shrink-0 border border-status-danger-border">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-base font-serif font-medium text-ink">{title}</h3>
          <div className="text-xs text-ink-muted leading-relaxed font-sans">
            {message}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border/60">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? 'primary' : 'primary'}
          size="sm"
          onClick={onConfirm}
          className={isDestructive ? 'bg-status-danger hover:bg-status-danger/90 border-transparent text-white' : ''}
        >
          {isLoading ? 'Processing...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
