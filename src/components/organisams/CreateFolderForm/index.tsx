import { FC } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/atoms/Form';
import { Input } from '@/components/atoms/Input';
import { useCreateFolderMutation } from '@/redux/api/fileManagmentAPI';
import { useSearchParams } from 'next/navigation';
import ModalActionButtons from '@/components/molecules/ModalActionButtons';

// Define the validation schema with zod
const createFolderSchema = z.object({
    folderName: z.string().min(1, 'Folder name is required'),
});

// Type for the form values based on the zod schema
type CreateFolderFormValues = z.infer<typeof createFolderSchema>;

type CreateFolderFormProps = {
    onClose: () => void;
};

const CreateFolderForm: FC<CreateFolderFormProps> = ({ onClose }) => {
    const params = useSearchParams()
    const parentFolderId = params.get('folderId') || '';

    const [createFolder, { isLoading }] = useCreateFolderMutation();

    const form = useForm<CreateFolderFormValues>({
        resolver: zodResolver(createFolderSchema),
    });

    /**
     * Create th folder
     * @param data CreateFolderFormValues
     */
    const onSubmit = async (data: CreateFolderFormValues) => {
        try {
            await createFolder({
                parentId: parentFolderId,
                name: data.folderName
            }).unwrap();
            onClose(); // Close modal after submission
        } catch (error) {
            console.log("error---->", error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="folderName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Folder Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="My New Folder"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ModalActionButtons
                    secondaryAction={onClose}
                    primaryAction={() => { }}
                    primaryId="create-folder-submit-btn"
                    secondaryId="create-folder-cancel-btn"
                    isLoading={isLoading}
                />
            </form>
        </Form>
    );
};

export default CreateFolderForm;
