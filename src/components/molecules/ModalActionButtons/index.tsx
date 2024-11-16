import React from 'react';
import { Button } from '@/components/atoms/Button';
import { SubmitButton } from '@/components/molecules/SubmitButton';

interface ModalActionButtonsProps {
    primaryAction?: () => void;
    secondaryAction?: () => void;
    isLoading?: boolean;
    primaryLabel?: string;
    secondaryLabel?: string;
    primaryId?: string;
    secondaryId?: string;
}

const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
    primaryAction = () => {},
    secondaryAction = () => {},
    isLoading = false,
    primaryLabel = 'Primary',
    secondaryLabel = 'Secondary',
    primaryId = 'primary-button',
    secondaryId = 'secondary-button',
}) => {
    return (
        <div className="flex justify-end gap-2 mt-4">
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
