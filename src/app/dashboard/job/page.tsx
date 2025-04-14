"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import 'react-quill/dist/quill.snow.css';
import Editor from '@/components/molecules/RichTextEditor/Editor';
import Quill from 'quill';

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
}

const JobDashboard = () => {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
  });

  const descriptionEditorRef = useRef<Quill>(null);
  const requirementsEditorRef = useRef<Quill>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you would typically send the data to your API
  };

  const handleDescriptionChange = (delta: any, oldDelta: any, source: string) => {
    if (source === 'user' && descriptionEditorRef.current) {
      const content = descriptionEditorRef.current.root.innerHTML;
      setFormData({ ...formData, description: content });
    }
  };

  const handleRequirementsChange = (delta: any, oldDelta: any, source: string) => {
    if (source === 'user' && requirementsEditorRef.current) {
      const content = requirementsEditorRef.current.root.innerHTML;
      setFormData({ ...formData, requirements: content });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Job Posting</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Job Description
          </label>
          <div className="mb-4">
            <Editor
              ref={descriptionEditorRef}
              defaultValue={formData.description ? { ops: [{ insert: formData.description }] } : undefined}
              onTextChange={handleDescriptionChange}
              placeholder="Enter job description..."
              className="min-h-[200px]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium mb-2">
            Requirements
          </label>
          <div className="mb-4">
            <Editor
              ref={requirementsEditorRef}
              defaultValue={formData.requirements ? { ops: [{ insert: formData.requirements }] } : undefined}
              onTextChange={handleRequirementsChange}
              placeholder="Enter job requirements..."
              className="min-h-[200px]"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Job Posting
        </Button>
      </form>
    </div>
  );
};

export default JobDashboard; 