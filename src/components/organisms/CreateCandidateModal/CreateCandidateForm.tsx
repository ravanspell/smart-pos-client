'use client';

import { useState } from 'react';
import FormFileUploader, { UploadFile } from '@/components/molecules/FormFileUploader';
import ModalActionButtons from '@/components/molecules/ModalActionButtons';
import { UploadCVRequest, useUploadCVMutation } from '@/redux/api/candidatesApi';
import { toast } from 'sonner';

interface CreateCandidateFormProps {
  onClose: () => void;
}

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_FILE_TYPES = '.pdf,.doc,.docx,.rtf,.txt';
const MAX_FILES = 50;

export function CreateCandidateForm({ onClose }: CreateCandidateFormProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadCV] = useUploadCVMutation();

  const handleFileChange = (selectedFiles: UploadFile[] | ((prevFiles: UploadFile[]) => UploadFile[])) => {
    if (typeof selectedFiles === 'function') {
      setFiles(selectedFiles(files));
    } else {
      setFiles(selectedFiles);
    }
  };

  /**
   * Handles the upload of files to the server.
   * @returns {Promise<void>}
   */
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }
    try {
      const uploadCVRequests: UploadCVRequest[] = files.map((file) => (  
        {
          fileName: file.name,
          s3ObjectKey: file.s3ObjectKey || '',
          fileSize: file.size,
        }
      ));
      console.log("uploadCVRequests", uploadCVRequests);
      await uploadCV(uploadCVRequests).unwrap();
      toast.success('Files uploaded successfully', {
        position: 'top-center',
        description: 'Candidates will be reviewed shortly',
        duration: 5000,
      });
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files. Please try again.');
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
        primaryLabel="Upload"
        secondaryLabel="Cancel"
      />
    </div>
  );
} 