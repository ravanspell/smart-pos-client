import { Meta, StoryObj } from "@storybook/react";
import { CustomFormField } from './index';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { CustomFormFieldProps } from './index';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/atoms/Button";

const meta: Meta<typeof CustomFormField> = {
  title: 'Molecules/CustomFormField',
  component: CustomFormField,
  argTypes: {
    name: {
      description: "The name of the form field",
    },
    label: {
      description: "The label to display for the form field",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CustomFormField>;

// Default Story: Basic usage of CustomFormField
export const Default: Story = {
  render: (args: CustomFormFieldProps) => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(data => console.log(data))}>
          <CustomFormField {...args}>
            <Input placeholder="Enter text" />
          </CustomFormField>
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </FormProvider>
    );
  },
  args: {
    name: 'exampleField',
    label: 'Example Field',
  },
};

// Story with a different label
export const WithDifferentLabel: Story = {
  render: (args: CustomFormFieldProps) => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(data => console.log(data))}>
          <CustomFormField {...args}>
            <Input placeholder="Enter different text" />
          </CustomFormField>
          <Button className="mt-4" type="submit">Submit</Button>
        </form>
      </FormProvider>
    );
  },
  args: {
    name: 'anotherField',
    label: 'Another Example Field',
  },
};

// Story with validation error
export const WithError: Story = {
  render: (args: CustomFormFieldProps) => {
    const schema = z.object({
      [args.name]: z.string().min(1, { message: "This field is required" } ),
    });
    const form = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
        [args.name]: "",
      },
    });
    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(data => console.log(data))}>
          <CustomFormField {...args}>
            <Input name={args.name} placeholder="Enter text" />
          </CustomFormField>
          <Button className="mt-4" type="submit">
            Click here to see the error
          </Button>
        </form>
      </FormProvider>
    );
  },
  args: {
    name: 'errorField',
    label: 'Field with Error',
  },
}; 