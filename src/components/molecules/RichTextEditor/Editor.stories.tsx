import React, { useRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Editor from './Editor';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';

// Define types for Quill events
type DeltaStatic = any;
type RangeStatic = any; 

const meta: Meta<typeof Editor> = {
  title: 'Molecules/RichTextEditor',
  component: Editor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
        A rich text editor component built with Quill.js. This component provides a controlled interface for rich text editing with the following features:

        - Text formatting (bold, italic, underline, etc.)
        - Lists (ordered and unordered)
        - Headers
        - Text color and background color
        - Links
        - Read-only mode
        - Placeholder text
        - Custom styling via className

        ## Usage

        \`\`\`jsx
        import Editor from '@/components/molecules/RichTextEditor/Editor';
        import { useRef } from 'react';
        import Quill from 'quill';

        const MyComponent = () => {
          const editorRef = useRef<Quill>(null);
          
          const handleTextChange = (delta, oldDelta, source) => {
            if (source === 'user' && editorRef.current) {
              const content = editorRef.current.root.innerHTML;
              console.log('Editor content:', content);
            }
          };
          
          return (
            <Editor
              ref={editorRef}
              placeholder="Start typing..."
              onTextChange={handleTextChange}
            />
          );
        };`,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Editor>;

// Basic editor with placeholder
export const Default: Story = {
  args: {
    placeholder: 'Start typing...',
  },
};

// Editor with default content
export const WithDefaultContent: Story = {
  args: {
    defaultValue: {
      ops: [
        { insert: 'This is some default content with ' },
        { insert: 'bold', attributes: { bold: true } },
        { insert: ' and ' },
        { insert: 'italic', attributes: { italic: true } },
        { insert: ' text.\n\n' },
        { insert: '• ', attributes: { list: 'bullet' } },
        { insert: 'First bullet point\n' },
        { insert: '• ', attributes: { list: 'bullet' } },
        { insert: 'Second bullet point\n' },
      ],
    },
  },
};

// Read-only editor
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: {
      ops: [
        { insert: 'This is read-only content that cannot be edited.\n\n' },
        { insert: 'You can still select and copy the text, but you cannot modify it.' },
      ],
    },
  },
};

// Editor with custom styling
export const CustomStyling: Story = {
  args: {
    placeholder: 'Custom styled editor...',
    className: 'border-2 border-blue-500 rounded-lg p-4 bg-blue-50',
  },
};

// Editor with text change handler
export const WithTextChangeHandler: Story = {
  render: (args) => {
    const editorRef = useRef<Quill>(null);

    const handleTextChange = (delta: DeltaStatic, oldDelta: DeltaStatic, source: string) => {
      if (source === 'user' && editorRef.current) {
        const content = editorRef.current.root.innerHTML;
        console.log('Editor content changed:', content);
      }
    };

    return (
      <div>
        <Editor
          ref={editorRef}
          {...args}
          onTextChange={handleTextChange}
        />
        <div className="mt-4 text-sm text-gray-500">
          Check the console to see the editor content changes
        </div>
      </div>
    );
  },
  args: {
    placeholder: 'Type something and check the console...',
  },
};

// Editor with selection change handler
export const WithSelectionChangeHandler: Story = {
  render: (args) => {
    const editorRef = useRef<Quill>(null);

    const handleSelectionChange = (range: RangeStatic, oldRange: RangeStatic, source: string) => {
      if (source === 'user' && range) {
        console.log('Selection changed:', range);
      }
    };

    return (
      <div>
        <Editor
          ref={editorRef}
          {...args}
          onSelectionChange={handleSelectionChange}
        />
        <div className="mt-4 text-sm text-gray-500">
          Select some text and check the console to see selection changes
        </div>
      </div>
    );
  },
  args: {
    defaultValue: {
      ops: [
        { insert: 'Select some text in this editor to see selection changes in the console.' },
      ],
    },
  },
}; 