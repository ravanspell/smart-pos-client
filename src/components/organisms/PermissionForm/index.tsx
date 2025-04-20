"use client";

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/TextArea';
import FormSelectDropdown from '@/components/molecules/FormSelectDropdown';
import { useCreatePermissionMutation } from '@/redux/api/permissionsAPI';
import { useGetPermissionCategoriesQuery } from '@/redux/api/permissionsAPI';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import { CustomFormField } from '@/components/molecules/FormField';
import { Switch } from '@/components/atoms/Switch';

// Define the form schema with Zod
const permissionFormSchema = z.object({
    displayName: z.string().min(1, 'Display name is required'),
    permissionKey: z.string().min(1, 'Permission key is required'),
    description: z.string().min(1, 'Description is required'),
    categoryId: z.string().min(1, 'Permission category is required'),
    resource: z.string().min(1, 'Resource is required'),
    isBasePermission: z.boolean().default(false),
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

    const methods = useForm<PermissionFormValues>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: {
            displayName: '',
            permissionKey: '',
            description: '',
            categoryId: '',
            resource: 'permission',
            isBasePermission: false,
        },
    });

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

    // Transform categories to FormSelectDropdown options
    const categoryOptions = categories.map(category => ({
        label: category.name,
        value: category.id
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Permission"
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                    <CustomFormField
                        name="displayName"
                        label="Display Name"
                    >
                        <Input placeholder="Enter display name" />
                    </CustomFormField>

                    <CustomFormField
                        name="permissionKey"
                        label="Permission Key"
                    >
                        <Input placeholder="Enter permission key" />
                    </CustomFormField>

                    <CustomFormField
                        name="categoryId"
                        label="Permission Category"
                    >
                        <FormSelectDropdown
                            id="categoryId"
                            name="categoryId"
                            label="Permission Category"
                            placeholder="Select a category"
                            options={categoryOptions}
                            value={methods.watch('categoryId')}
                            onChange={(value) => methods.setValue('categoryId', value)}
                        />
                    </CustomFormField>

                    <CustomFormField
                        name="resource"
                        label="Resource"
                    >
                        <Input placeholder="Enter resource" />
                    </CustomFormField>

                    <CustomFormField
                        name="isBasePermission"
                        label="Base Permission"
                    >
                        <Switch
                            checked={methods.watch('isBasePermission')}
                            onCheckedChange={(checked) => methods.setValue('isBasePermission', checked)}
                        />
                    </CustomFormField>

                    <CustomFormField
                        name="description"
                        label="Description"
                    >
                        <Textarea
                            placeholder="Enter permission description"
                            className="min-h-[100px]"
                        />
                    </CustomFormField>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Permission'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};

export default PermissionForm; 