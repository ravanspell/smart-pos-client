"use client";

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/TextArea';
import FormSelectDropdown from '@/components/molecules/FormSelectDropdown';
import { PermissionTypeEnum, useCreatePermissionMutation } from '@/redux/api/permissionsAPI';
import { useGetPermissionCategoriesQuery } from '@/redux/api/permissionsAPI';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from 'sonner';
import { CustomFormField } from '@/components/molecules/FormField';


const FORM_FIELDS = {
    DISPLAY_NAME: 'displayName',
    TYPE: 'type',
    CATEGORY_ID: 'categoryId',
    DESCRIPTION: 'description',
    IS_BASE_PERMISSION: 'isBasePermission',
} as const;


type PermissionOption = {
    label: string;
    value: PermissionTypeEnum;
};

const PERMISSION_TYPES: PermissionOption[] = [
    { label: 'Create', value: PermissionTypeEnum.CREATE },
    { label: 'Update', value: PermissionTypeEnum.UPDATE },
    { label: 'Read', value: PermissionTypeEnum.READ },
    { label: 'Delete', value: PermissionTypeEnum.DELETE },
];

// Define the form schema with Zod
const permissionFormSchema = z.object({
    [FORM_FIELDS.DISPLAY_NAME]: z.string().min(1, 'Display name is required'),
    [FORM_FIELDS.TYPE]: z.nativeEnum(PermissionTypeEnum, {
        required_error: 'Permission type is required',
    }),
    [FORM_FIELDS.CATEGORY_ID]: z.string().min(1, 'Permission category is required'),
    [FORM_FIELDS.DESCRIPTION]: z.string().min(1, 'Description is required'),
    [FORM_FIELDS.IS_BASE_PERMISSION]: z.boolean().default(false),
    resource: z.string().default('permission'),
});

// Infer the type from the schema
type PermissionFormValues = z.infer<typeof permissionFormSchema>;

interface PermissionFormProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * PermissionForm component
 * @param {PermissionFormProps} props - The component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {() => void} props.onClose - The function to call when the modal is closed
 */
const PermissionForm: React.FC<PermissionFormProps> = ({ isOpen, onClose }) => {
    const { handleError } = useErrorHandler();
    const [createPermission, { isLoading }] = useCreatePermissionMutation();
    const { data: categories = [] } = useGetPermissionCategoriesQuery();
    const [categoryOptions, setCategoryOptions] = useState<Array<{ label: string; value: string }>>([]);

    const methods = useForm<PermissionFormValues>({
        resolver: zodResolver(permissionFormSchema),
        defaultValues: {
            [FORM_FIELDS.DISPLAY_NAME]: '',
            [FORM_FIELDS.TYPE]: undefined,
            [FORM_FIELDS.DESCRIPTION]: '',
            [FORM_FIELDS.CATEGORY_ID]: '',
            [FORM_FIELDS.IS_BASE_PERMISSION]: false,
        },
    });

    useEffect(() => {
        // Transform categories to FormSelectDropdown options
        const options = categories.map(category => ({
            label: category.name,
            value: category.id
        }));
        setCategoryOptions(options);
    }, []);

    /**
     * Generates a permission key based on the type and category (preview key)
     * @returns {string} The generated permission key
     */
    const generatePermissionKey = () => {
        const type = methods.getValues(FORM_FIELDS.TYPE);
        const categoryId = methods.getValues(FORM_FIELDS.CATEGORY_ID);
        const category = categories.find(c => c.id === categoryId);
        return type && category ? `${type}:${category.key.toUpperCase()}` : '';
    };

    // Handle form submission
    const onSubmit = async (data: PermissionFormValues) => {
        try {
            const payload = {
                ...data,
                resource: 'permission',
                isBasePermission: false,
            };
            await createPermission(payload).unwrap();
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
            title="Create Permission"
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                    <CustomFormField
                        name={FORM_FIELDS.DISPLAY_NAME}
                        label="Display name"
                    >
                        <Input placeholder="Enter display name" />
                    </CustomFormField>

                    <CustomFormField
                        name={FORM_FIELDS.TYPE}
                        label="Type"
                    >
                        <FormSelectDropdown
                            id={FORM_FIELDS.TYPE}
                            name={FORM_FIELDS.TYPE}
                            label="Type"
                            placeholder="Select permission type"
                            options={PERMISSION_TYPES}
                            value={methods.watch(FORM_FIELDS.TYPE)}
                            onChange={(value) => methods.setValue(FORM_FIELDS.TYPE, value as PermissionTypeEnum)}
                        />
                    </CustomFormField>

                    <CustomFormField
                        name={FORM_FIELDS.CATEGORY_ID}
                        label="Category"
                    >
                        <FormSelectDropdown
                            id={FORM_FIELDS.CATEGORY_ID}
                            name={FORM_FIELDS.CATEGORY_ID}
                            label="Category"
                            placeholder="Select a category"
                            options={categoryOptions}
                            value={methods.watch(FORM_FIELDS.CATEGORY_ID)}
                            onChange={(value) => methods.setValue(FORM_FIELDS.CATEGORY_ID, value)}
                        />
                    </CustomFormField>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Permission Key</label>
                        <div className="flex h-10 w-full py-2 text-sm text-muted-foreground">
                            {generatePermissionKey() || 'Select type and category to generate key'}
                        </div>
                    </div>

                    <CustomFormField
                        name={FORM_FIELDS.DESCRIPTION}
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
                            Save
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </Modal>
    );
};

export default PermissionForm; 