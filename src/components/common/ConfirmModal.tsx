import { type ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/Button';
import { AlertCircleIcon } from '@/components/icons';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: ReactNode;
    message: ReactNode;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    variant?: 'destructive' | 'primary' | 'warning';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    variant = 'destructive'
}: ConfirmModalProps) {
    const getVariantColor = () => {
        switch (variant) {
            case 'destructive': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'warning': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
            default: return 'text-primary bg-primary/10';
        }
    };

    const getButtonVariant = () => {
        switch (variant) {
            case 'destructive': return 'destructive';
            case 'warning': return 'secondary';
            default: return 'primary';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getVariantColor()}`}>
                        <AlertCircleIcon size={20} />
                    </div>
                    <span>{title}</span>
                </div>
            }
            size="sm"
            footer={
                <>
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        variant={getButtonVariant() as any} 
                        onClick={onConfirm} 
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>

                </>
            }
        >
            <div className="py-2">
                <p className="text-muted-foreground text-sm">
                    {message}
                </p>
            </div>
        </Modal>
    );
}

export default ConfirmModal;
