'use client';

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
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
const Editor = forwardRef<Quill, EditorProps>(
  ({ readOnly = false, defaultValue, onTextChange, onSelectionChange, placeholder, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.enable(!readOnly);
      }
    }, [ref, readOnly]);

    useEffect(() => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        placeholder,
        readOnly,
      });

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
    }, [ref, placeholder, readOnly]);

    return (
      <div className={`editor-container ${className || ''}`}>
        <div ref={containerRef} className="min-h-[200px]"></div>
      </div>
    );
  }
);

Editor.displayName = 'Editor';

export default Editor;