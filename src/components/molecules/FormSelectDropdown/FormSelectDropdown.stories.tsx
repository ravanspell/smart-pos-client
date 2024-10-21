// components/atoms/CustomSelect.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormSelectDropdown from './index';
import Link from 'next/link';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
];

const meta: Meta<typeof FormSelectDropdown> = {
  title: 'Atoms/FormSelectDropdown',
  component: FormSelectDropdown,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    options: { control: 'object' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof FormSelectDropdown>;

export const Default: Story = {
  args: {
    label: 'Select a fruit',
    placeholder: 'Select a fruit',
    options: options,
    value: '',
  },
};

export const Preselected: Story = {
  args: {
    label: 'Select a fruit',
    placeholder: 'Select a fruit',
    options: options,
    value: 'banana',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Select a fruit',
    description: (
      <>
        Choose your favorite fruit from the list. You can manage your selections in{' '}
        <Link href="/examples/forms">your settings</Link>.
      </>
    ),
    placeholder: 'Select a fruit',
    options: options,
    value: '',
  },
};

export const CustomWidth: Story = {
  args: {
    label: 'Select a fruit',
    placeholder: 'Select a fruit',
    options: options,
    value: '',
    className: 'w-[250px]',
  },
};
