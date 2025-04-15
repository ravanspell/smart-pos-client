'use client';

import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  /**
   * When true, the editor will be in read-only mode and users won't be able to modify the content
   * @default false
   */
  readOnly?: boolean;

  /**
   * Initial content for the editor in Quill Delta format
   * Example: { ops: [{ insert: 'Hello World' }] }
   */
  defaultValue?: any;

  /**
   * Callback function that is triggered when the editor content changes
   * @param delta - The changes made to the document
   * @param oldDelta - The previous state of the document
   * @param source - The source of the change ('user', 'api', 'silent')
   */
  onTextChange?: (delta: any, oldDelta: any, source: string) => void;

  /**
   * Callback function that is triggered when the text selection changes
   * @param range - The new selection range
   * @param oldRange - The previous selection range
   * @param source - The source of the change ('user', 'api', 'silent')
   */
  onSelectionChange?: (range: any, oldRange: any, source: string) => void;

  /**
   * Placeholder text to display when the editor is empty
   */
  placeholder?: string;

  /**
   * Additional CSS classes to apply to the editor container
   */
  className?: string;
}

// Editor is an uncontrolled React component
const Editor = forwardRef<any, EditorProps>(
  ({ readOnly = false, defaultValue, onTextChange, onSelectionChange, placeholder, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const [isClient, setIsClient] = useState(false);
    const quillInstanceRef = useRef<any>(null);

    // Set isClient to true when component mounts (client-side only)
    useEffect(() => {
      setIsClient(true);
    }, []);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (!isClient || !containerRef.current) return;

      // Dynamically import Quill only on the client side
      import('quill').then((QuillModule) => {
        const Quill = QuillModule.default;

        const container = containerRef.current;
        if (!container) return;

        // Clear any existing content
        container.innerHTML = '';

        const editorContainer = container.appendChild(
          container.ownerDocument.createElement('div'),
        );

        const quill = new Quill(editorContainer, {
          theme: 'snow',
          placeholder,
          readOnly,
        });

        quillInstanceRef.current = quill;

        if (ref && 'current' in ref) {
          ref.current = quill;
        }

        if (defaultValueRef.current) {
          quill.setContents(defaultValueRef.current);
        }

        quill.on('text-change', (...args) => {
          onTextChangeRef.current?.(...args);
        });

        quill.on('selection-change', (...args) => {
          onSelectionChangeRef.current?.(...args);
        });

        return () => {
          if (ref && 'current' in ref) {
            ref.current = null;
          }
          if (container) {
            container.innerHTML = '';
          }
        };
      });
    }, [isClient, ref, placeholder, readOnly]);

    // Update readOnly state when it changes
    useEffect(() => {
      if (isClient && quillInstanceRef.current) {
        quillInstanceRef.current.enable(!readOnly);
      }
    }, [isClient, readOnly]);

    return (
      <div className={`editor-container ${className || ''}`}>
        <div ref={containerRef} className="min-h-[200px]"></div>
      </div>
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;