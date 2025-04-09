'use client';

import { useState } from 'react';
import FormFileUploader, { UploadFile } from '@/components/molecules/FormFileUploader';
import ModalActionButtons from '@/components/molecules/ModalActionButtons';

interface CreateCandidateFormProps {
  onClose: () => void;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_FILE_TYPES = '.pdf,.doc,.docx,.rtf,.txt';
const MAX_FILES = 50;

export function CreateCandidateForm({ onClose }: CreateCandidateFormProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (selectedFiles: UploadFile[] | ((prevFiles: UploadFile[]) => UploadFile[])) => {
    if (typeof selectedFiles === 'function') {
      setFiles(selectedFiles(files));
    } else {
      setFiles(selectedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      // Show error message
      return;
    }

    setIsUploading(true);
    try {
      // TODO: Implement file upload logic
      // const formData = new FormData();
      // files.forEach(file => formData.append('files', file));
      // await fetch('/api/candidates/upload', {
      //   method: 'POST',
      //   body: formData,
      // });

      // Show success message
      onClose();
    } catch (error) {
      // Show error message
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormFileUploader
        files={files}
        onChange={handleFileChange}
        accept={ALLOWED_FILE_TYPES}
        maxSize={MAX_FILE_SIZE}
        maxFileCount={MAX_FILES}
        multiple={true}
      />
      
      <ModalActionButtons
        primaryAction={handleUpload}
        secondaryAction={onClose}
        primaryLabel={isUploading ? 'Uploading...' : 'Upload'}
        secondaryLabel="Cancel"
        isLoading={isUploading}
      />
    </div>
  );
} 