import { useState } from 'react';
import { useGetPresignedUrlMutation } from '@/redux/api/fileManagmentAPI';

interface UseUploadOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onProgress?: (progress: number) => void;
}

interface UseUploadReturn {
    uploadFile: (file: File) => Promise<void>;
    progress: number;
    isUploading: boolean;
    error: Error | null;
}

/**
 * Custom hook for handling file uploads with presigned URLs
 * @param options Configuration options for the upload process
 * @returns Object containing upload function, progress, loading state, and error state
 */
export const useUpload = (options: UseUploadOptions = {}): UseUploadReturn => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [getPresignedUrl] = useGetPresignedUrlMutation();

    /**
     * Upload a file to the presigned URL
     * 
     * @param file The file to upload
     * @param url The presigned URL to upload the file to
     * @returns A promise that resolves when the file is uploaded
     */
    const uploadToPresignedUrl = (file: File, url: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', file.type);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    setProgress(percentCompleted);
                    options.onProgress?.(percentCompleted);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve();
                } else {
                    reject(new Error(`Upload failed with status: ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.send(file);
        });
    };

    /**
     * Upload a file to the presigned URL
     * 
     * @param file The file to upload
     * @returns A promise that resolves when the file is uploaded
     */
    const uploadFile = async (file: File): Promise<void> => {
        try {
            setIsUploading(true);
            setError(null);
            setProgress(0);

            // Get presigned URL
            const response = await getPresignedUrl({ fileName: file.name }).unwrap();
            if (!response.data?.uploadUrl) {
                throw new Error('Failed to get presigned URL');
            }

            // Upload file
            await uploadToPresignedUrl(file, response.data.uploadUrl);
            
            options.onSuccess?.();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Upload failed');
            setError(error);
            options.onError?.(error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadFile,
        progress,
        isUploading,
        error,
    };
}; 