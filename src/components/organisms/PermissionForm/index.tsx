"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/TextArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { useCreatePermissionMutation } from '@/redux/api/permissionsAPI';
import { useGetPermissionCategoriesQuery } from '@/redux/api/permissionsAPI';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';

// Define the form schema with Zod
const permissionFormSchema = z.object({
    displayName: z.string().min(1, 'Display name is required'),
    permissionKey: z.string().min(1, 'Permission key is required'),
    description: z.string().min(1, 'Description is required'),
    categoryId: z.string().min(1, 'Permission category is required'),
});

// Infer the type from the schema
type PermissionFormValues = z.infer<typeof permissionFormSchema>;

interface PermissionFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ isOpen, onClose }) => {
    const { handleError } = useErrorHandler();
    const [createPermission, { isLoading }] = useCreatePermissionMutation();
    const { data: categories = [] } = useGetPermissionCategoriesQuery();

    // Initialize form with react-hook-form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<PermissionFormValues>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: {
            displayName: '',
            permissionKey: '',
            description: '',
            categoryId: '',
        },
    });

    // Reset form when modal is opened
    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    // Handle form submission
    const onSubmit = async (data: PermissionFormValues) => {
        try {
            await createPermission(data).unwrap();
            toast.success('Permission created successfully');
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Permission"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="displayName" className="text-sm font-medium">
                        Display Name
                    </label>
                    <Input
                        id="displayName"
                        {...register('displayName')}
                        error={!!errors.displayName}
                        placeholder="Enter display name"
                    />
                    {errors.displayName && (
                        <p className="text-sm text-red-500">{errors.displayName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="permissionKey" className="text-sm font-medium">
                        Permission Key
                    </label>
                    <Input
                        id="permissionKey"
                        {...register('permissionKey')}
                        error={!!errors.permissionKey}
                        placeholder="Enter permission key"
                    />
                    {errors.permissionKey && (
                        <p className="text-sm text-red-500">{errors.permissionKey.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label htmlFor="categoryId" className="text-sm font-medium">
                        Permission Category
                    </label>
                    <Select
                        onValueChange={(value) => setValue('categoryId', value)}
                        value={watch('categoryId')}
                    >
                        <SelectTrigger id="categoryId" className="w-full">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && (
                        <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        placeholder="Enter permission description"
                        className="min-h-[100px]"
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Permission'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default PermissionForm; 