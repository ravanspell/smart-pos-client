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

// Define the validation schema with zod
const permissionCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
});

// Infer the type from the schema
type PermissionCategoryFormValues = z.infer<typeof permissionCategorySchema>;

interface PermissionCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const PermissionCategoryForm: React.FC<PermissionCategoryFormProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();
  const [createPermissionCategory] = useCreatePermissionCategoryMutation();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<PermissionCategoryFormValues>({
    resolver: zodResolver(permissionCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: PermissionCategoryFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Call the API to create the permission category
      await createPermissionCategory({
        name: data.name,
        description: data.description || '',
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
      title="Add Permission Category"
      description="Create a new permission category to organize permissions"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            name="name"
            label="Category Name"
          >
            <Input placeholder="Enter category name" />
          </CustomFormField>
          
          <CustomFormField
            name="description"
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