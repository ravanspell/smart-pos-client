import type { Meta, StoryObj } from '@storybook/react';
import { ComboBox } from './index';

const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

const meta: Meta<typeof ComboBox> = {
  title: 'Components/ComboBox',
  component: ComboBox,
  argTypes: {
    status: {
      control: {
        type: 'select',
        options: ['default', 'error', 'success'],
      },
    },
    searchEnabled: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {
  args: {
    label: 'Choose a framework',
    helperText: 'Select your preferred framework.',
    frameworks: frameworks,
    searchEnabled: true,
    status: 'default',
  },
};

export const WithError: Story = {
  args: {
    label: 'Choose a framework',
    helperText: 'You must select a framework.',
    frameworks: frameworks,
    searchEnabled: true,
    status: 'error',
  },
};

export const WithSuccess: Story = {
  args: {
    label: 'Choose a framework',
    helperText: 'Framework selected successfully!',
    frameworks: frameworks,
    searchEnabled: true,
    status: 'success',
  },
};

export const WithoutSearch: Story = {
  args: {
    label: 'Choose a framework',
    helperText: 'Search is disabled.',
    frameworks: frameworks,
    searchEnabled: false,
    status: 'default',
  },
};