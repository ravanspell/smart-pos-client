import { FC, ReactNode, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/atoms/Dialog';
import { Icons } from '@/lib/icons';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    isLoading?: boolean;
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, description, children, footer, isLoading = false }) => {

    const renderLoadingSpinner = (): ReactNode => {
        return (
            <div className="flex justify-center items-center p-4">
                <Icons.spinner color="black" className="mr-2 h-4 w-4 animate-spin" />
            </div>
        )
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <Suspense fallback={renderLoadingSpinner()}>
                    {children}
                </Suspense>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
