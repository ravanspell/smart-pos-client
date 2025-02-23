import { cloneElement } from "react";
import { useFormContext, ControllerRenderProps, FieldValues, ControllerFieldState } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/atoms/Form";

/**
 * Props for the CustomFormField component.
 */
export interface CustomFormFieldProps {
    name: string; // The name of the form field
    label: string; // The label to display for the form field
    children: React.ReactElement; // The child component to render as the input
}

/**
 * Props for the render function.
 */
export interface RenderOptionsProps {
    field: ControllerRenderProps<FieldValues, string>
    fieldState: ControllerFieldState;
}
/**
 * CustomFormField is a generic form field wrapper that integrates with react-hook-form.
 * It allows for easy integration of any Shadcn component as a form field.
 */
export const CustomFormField: React.FC<CustomFormFieldProps> = ({ name, label, children }) => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }: RenderOptionsProps) => (
                <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
                    <FormControl>
                        {cloneElement(children, { ...field, error: !!fieldState.error })}
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
            )}
        />
    );
};