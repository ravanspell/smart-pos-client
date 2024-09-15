// src/stories/Accordion.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import Accordion from './index';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { MouseEvent } from 'react';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
  // stop accordion collapse and expand event from Accordion header.
  console.log("Button clicked", event.stopPropagation());
};

export const Default: Story = {
  args: {
    items: [
      {
        id: "what-is-shadcn",
        title: "What is Shadcn?",
        content: (
          <div className='p-4'>
            <p>Shadcn is a set of accessible UI components built for React.</p>
            <Button className="mt-2">Learn More</Button>
          </div>
        ),
        prefix: <Badge color="green">New</Badge>,
      },
      {
        id: "how-tailwind-works",
        title: "How does Tailwind work?",
        content: (
          <div className='p-4'>
            <p>
              Tailwind is a utility-first CSS framework that provides flexibility
              and customizability.
            </p>
          </div>
        ),
      },
      {
        id: "this-is-test-accordion",
        title: "this is test accordion",
        content: (
          <div className='p-4'>
            <h2>this is sample header</h2>
            <p>this is sample paragraph</p>
          </div>
        ),
        suffix: <Button onClick={handleClick} size="sm">Details</Button>,
      },
    ],
  },
};