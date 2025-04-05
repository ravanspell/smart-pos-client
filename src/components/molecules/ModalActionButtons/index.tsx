import React from 'react';
import { Button } from '@/components/atoms/Button';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { cn } from '@/lib/utils';

interface ModalActionButtonsProps {
    primaryAction?: () => void;
    secondaryAction?: () => void;
    isLoading?: boolean;
    primaryLabel?: string;
    secondaryLabel?: string;
    primaryId?: string;
    secondaryId?: string;
    className?: string;
}

const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
    primaryAction = () => {},
    secondaryAction = () => {},
    isLoading = false,
    primaryLabel = 'Primary',
    secondaryLabel = 'Secondary',
    primaryId = 'primary-button',
    secondaryId = 'secondary-button',
    className = '',
}) => {
    return (
        <div className={cn("flex justify-end gap-2", className)}>
            <Button
                type="button"
                variant="outline"
                onClick={secondaryAction}
                id={secondaryId}
            >
                {secondaryLabel}
            </Button>
            <SubmitButton
                id={primaryId}
                label={primaryLabel}
                onClick={primaryAction}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ModalActionButtons;
