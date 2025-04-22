"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/TextArea';
import { CustomFormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Form } from '@/components/atoms/Form';
import { toast } from 'sonner';
import { useCreatePermissionCategoryMutation } from '@/redux/api/permissionsAPI';
import { useErrorHandler } from '@/hooks/useErrorHandler';

/**
 * Form field names for the permission category form
 */
const FORM_FIELDS = {
  NAME: 'name',
  CATEGORY_KEY: 'categoryKey',
  DESCRIPTION: 'description',
} as const;

// Define the validation schema with zod
const permissionCategorySchema = z.object({
  [FORM_FIELDS.NAME]: z.string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters'),
  [FORM_FIELDS.CATEGORY_KEY]: z.string(),
  [FORM_FIELDS.DESCRIPTION]: z.string()
    .max(200, 'Description must be less than 200 characters')
    .min(1, 'Description is required'),
});

// Infer the type from the schema
type PermissionCategoryFormValues = z.infer<typeof permissionCategorySchema>;

interface PermissionCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Generates a category key from a given name
 * @param name - The name of the category
 * @returns The generated category key
 */
const generateCategoryKey = (name: string): string => {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * PermissionCategoryForm component
 * @param {PermissionCategoryFormProps} props - The component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {() => void} props.onClose - The function to call when the modal is closed
 */
const PermissionCategoryForm: React.FC<PermissionCategoryFormProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();
  const [createPermissionCategory] = useCreatePermissionCategoryMutation();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<PermissionCategoryFormValues>({
    resolver: zodResolver(permissionCategorySchema),
    defaultValues: {
      [FORM_FIELDS.NAME]: '',
      [FORM_FIELDS.CATEGORY_KEY]: '',
      [FORM_FIELDS.DESCRIPTION]: '',
    },
  });

  const onSubmit = async (data: PermissionCategoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Call the API to create the permission category
      await createPermissionCategory({
        [FORM_FIELDS.NAME]: data[FORM_FIELDS.NAME],
        [FORM_FIELDS.CATEGORY_KEY]: data[FORM_FIELDS.CATEGORY_KEY],
        [FORM_FIELDS.DESCRIPTION]: data[FORM_FIELDS.DESCRIPTION],
      }).unwrap();
      // Show success message
      toast.success('Permission category created successfully');
      // Reset form and close modal
      form.reset();
      onClose();
    } catch (error) {
      handleError(error);
      toast.error('Failed to create permission category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Permission Category"
      description="Create a new permission category to organize permissions"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            name={FORM_FIELDS.NAME}
            label="Name"
          >
            <Input 
              {...form.register(FORM_FIELDS.NAME, {
                onChange: (e) => {
                  const newName = e.target.value;
                  form.setValue(FORM_FIELDS.CATEGORY_KEY, generateCategoryKey(newName));
                }
              })}
              placeholder="Enter category name" 
            />
          </CustomFormField>

          <CustomFormField
            name={FORM_FIELDS.CATEGORY_KEY}
            label="Category Key"
          >
            <Input 
              {...form.register(FORM_FIELDS.CATEGORY_KEY)}
              placeholder="Category key will auto-generate" 
              readOnly 
              disabled
              title="Category key is automatically generated from the name"
            />
          </CustomFormField>
          
          <CustomFormField
            name={FORM_FIELDS.DESCRIPTION}
            label="Description"
          >
            <Textarea placeholder="Enter category description" rows={4} />
          </CustomFormField>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default PermissionCategoryForm; 