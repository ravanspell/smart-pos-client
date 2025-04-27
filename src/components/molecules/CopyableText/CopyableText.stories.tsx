import type { Meta, StoryObj } from '@storybook/react';
import { CopyableText } from './CopyableText';

const meta: Meta<typeof CopyableText> = {
  title: 'Molecules/CopyableText',
  component: CopyableText,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
    },
    copyable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CopyableText>;

export const Default: Story = {
  args: {
    children: 'This is a default paragraph text',
    variant: 'p',
    copyable: false,
  },
};

export const Copyable: Story = {
  args: {
    children: 'This text can be copied to clipboard',
    variant: 'p',
    copyable: true,
  },
};

export const Heading1: Story = {
  args: {
    children: 'This is a Heading 1',
    variant: 'h1',
    copyable: true,
  },
};

export const Heading2: Story = {
  args: {
    children: 'This is a Heading 2',
    variant: 'h2',
    copyable: true,
  },
};

export const CustomStyle: Story = {
  args: {
    children: 'This text has custom styling',
    variant: 'p',
    copyable: true,
    className: 'text-blue-500 font-bold',
  },
}; 