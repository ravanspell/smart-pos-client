"use client"

import React, { useEffect, useRef, useState } from "react"
import { Icons } from "@/lib/icons"
import { formatBytes } from "@/lib/utils"
import { UploadFile } from "@/components/molecules/FormFileUploader"
import { useUpload } from "@/hooks/useUpload"
import { Progress } from "@/components/atoms/Progress"
import { Button } from "@/components/atoms/Button"

interface FileCardProps {
  /**
   * The file to display.
   * @type UploadFile
   * @example file={file}
   */
  file: UploadFile

  /**
   * The index of the file in the list.
   * @type number
   * @example fileIndex={0}
   */
  fileIndex: number

  /**
   * Callback when the file is removed.
   * @type () => void
   * @example onRemove={() => handleRemove(0)}
   */
  onRemove: () => void

  /**
   * Callback when files are updated.
   * @type (files: UploadFile[] | ((prevFiles: UploadFile[]) => UploadFile[])) => void
   * @example setFiles={(files) => handleFiles(files)}
   */
  setFiles: (files: UploadFile[] | ((prevFiles: UploadFile[]) => UploadFile[])) => void
}

const UPLOAD_COMPLETED = 100 // 100%

const FileCard = ({ file, fileIndex, onRemove, setFiles }: FileCardProps) => {
  // Use a ref to track whether we've already started the upload for this file
  const uploadStartedRef = useRef(false);
  // Track if the file has an error
  const [hasError, setHasError] = useState(false);

  const { uploadFile, progress, isUploading, error } = useUpload({
    onError: (error) => {
      setHasError(true);
    },
    onSuccess: (fileKey: string) => {
      // Handle successful upload
      setHasError(false);

      // Update the temporary state with the new S3 object key
      // We use a functional update to ensure we're working with the latest state
      setFiles((prevFiles) => {
        // Create a deep copy of the files array
        return prevFiles.map((f, index) => {
          if (index === fileIndex) {
            // For the current file, create a new UploadFile with the s3ObjectKey
            return Object.assign(new File([f], f.name, { type: f.type }), {
              preview: f.preview,
              s3ObjectKey: fileKey
            }) as UploadFile;
          } else {
            // For other files, keep them as they are
            return f;
          }
        });
      });
    },
  })

  useEffect(() => {
    // Start upload when component mounts, but only if we haven't started it yet
    if (!file.s3ObjectKey && !uploadStartedRef.current) {
      uploadStartedRef.current = true;
      uploadFile(file).catch(console.error);
    }
  }, []);

  // Function to retry the upload
  const handleRetry = () => {
    setHasError(false);
    uploadStartedRef.current = false;
    uploadFile(file).catch(console.error);
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium truncate max-w-[300px] cursor-default" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
        {isUploading && progress !== UPLOAD_COMPLETED && (
          <Progress className="h-1" value={progress} />
        )}
        {hasError && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-destructive">
              Upload failed: {error?.message || "Unknown error"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="h-6 px-2 text-xs"
            >
              <Icons.spinner className="mr-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1.5 text-muted-foreground/80 transition-colors hover:bg-muted hover:text-muted-foreground"
        disabled={isUploading}
      >
        <Icons.close className="size-4" />
      </button>
    </div>
  )
}

export default FileCard