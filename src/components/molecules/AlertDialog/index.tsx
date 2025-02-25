import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/atoms/AlertDialog";

export interface AlertDialogCustomProps {
  /**
   * Dialog open state
   */
  open?: boolean;
  /**
   * Dialog title
   */
  title: string;
  /**
   * Dialog description
   */
  description: string;
  /**
   * Text for cancel button
   */
  cancelText?: string;
  /**
   * Text for confirm button
   */
  confirmText?: string;
  /**
   * Optional trigger element. If not provided, dialog must be controlled via open prop
   */
  trigger?: React.ReactNode;
  /**
   * Callback when dialog open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback when confirm button is clicked
   */
  onConfirm?: () => void;
  /**
   * Callback when cancel button is clicked
   */
  onCancel?: () => void;
  /**
   * Variant for confirm button
   */
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function AlertDialogCustom({
  open,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Continue",
  trigger,
  onOpenChange,
  onConfirm,
  onCancel,
  confirmVariant = "default"
}: AlertDialogCustomProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const content = (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
        <AlertDialogAction onClick={handleConfirm} className={confirmVariant}>
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );

  // If trigger is provided, use uncontrolled version
  if (trigger) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        {content}
      </AlertDialog>
    );
  }

  // Otherwise use controlled version
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {content}
    </AlertDialog>
  );
}