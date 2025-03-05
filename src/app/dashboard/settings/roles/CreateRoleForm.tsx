import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/atoms/Input";
import { CustomFormField } from "@/components/molecules/FormField";
import { Textarea } from "@/components/atoms/TextArea";
import ModalActionButtons from "@/components/molecules/ModalActionButtons";


const roleFormSchema = z.object({
    roleName: z
        .string()
        .min(1, "Role name is required")
        .max(50, "Role name must be 50 characters or less")
        .regex(/^[a-zA-Z0-9\s]+$/, "Only alphanumeric characters are allowed"),
    description: z
        .string()
        .min(1, "Description is required")
        .max(100, "Description must be 100 characters or less"),
});

// TypeScript type for the form values
type RoleFormValues = z.infer<typeof roleFormSchema>;

export default function CreateRoleForm({ onClose }: { onClose: () => void }) {
    // Initialize form with react-hook-form and zod resolver
    const methods = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            roleName: "",
            description: "",
        },
    });

    // Handle form submission
    function onSubmit(values: RoleFormValues) {
        console.log("Form submitted with values:", values);
        // Here you would typically send the data to your API
    }

    return (
        <div>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                    <CustomFormField
                        name="roleName"
                        label="Role Name"
                    >
                        <Input
                            placeholder="Enter role name"
                            className="w-full"
                        />
                    </CustomFormField>
                    <CustomFormField
                        name="description"
                        label="Description"
                    >
                        <Textarea
                            placeholder="Enter role description"
                            className="resize-none"
                        />
                    </CustomFormField>
                    <ModalActionButtons
                        secondaryAction={onClose}
                        primaryAction={() => { }}
                        primaryId="create-role-submit-btn"
                        secondaryId="create-role-cancel-btn"
                        isLoading={false}
                        primaryLabel="Save"
                        secondaryLabel="Cancel"
                    />
                </form>
            </FormProvider>
        </div>
    );
}