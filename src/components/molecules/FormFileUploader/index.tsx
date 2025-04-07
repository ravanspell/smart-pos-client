"use client"

import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { ScrollArea } from "@/components/atoms/ScrollArea"
import { cn } from "@/lib/utils"
import FileCard from "@/components/molecules/FileCard"

export interface UploadFile extends File {
  preview?: string
  s3ObjectKey?: string
}

export interface FormFileUploaderProps {
  /**
   * The files currently selected.
   * @type UploadFile[]
   * @example files={files}
   */
  files: UploadFile[]

  /**
   * Callback when files are updated.
   * @type (files: UploadFile[] | ((prevFiles: UploadFile[]) => UploadFile[])) => void
   * @example onChange={(files) => handleFiles(files)}
   */
  onChange: (files: UploadFile[] | ((prevFiles: UploadFile[]) => UploadFile[])) => void

  /**
   * The accepted file types.
   * @type string
   * @example accept="image/*"
   * @default "image/*"
   */
  accept?: string

  /**
   * The maximum file size in bytes.
   * @type number
   * @example maxSize={5242880} // 5MB
   * @default 5242880
   */
  maxSize?: number

  /**
   * The maximum number of files that can be uploaded.
   * @type number
   * @example maxFileCount={5}
   * @default 5
   */
  maxFileCount?: number

  /**
   * Whether multiple files can be uploaded.
   * @type boolean
   * @example multiple={true}
   * @default true
   */
  multiple?: boolean

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @example disabled={true}
   * @default false
   */
  disabled?: boolean

  /**
   * Whether there is an error.
   * @type boolean
   * @example error={true}
   * @default false
   */
  error?: boolean
}

const FormFileUploader = React.forwardRef<HTMLDivElement, FormFileUploaderProps>(
  (
    {
      files,
      onChange,
      accept = "image/*",
      maxSize = 5 * 1024 * 1024, // 5MB
      maxFileCount = 5,
      multiple = true,
      disabled = false,
      error = false
    },
    ref
  ) => {
    // Create a temporary state to track files with S3 keys
    const [tempFiles, setTempFiles] = useState<UploadFile[]>(files);

    // Update the form state when all files have S3 keys
    useEffect(() => {
      if (tempFiles.length > 0) {
        // Check if all files have S3 keys
        const allFilesUploaded = tempFiles.every(file => file.s3ObjectKey);
        if (allFilesUploaded) {
          onChange(tempFiles);
        }
      }
    }, [tempFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        [accept]: [],
      },
      maxSize,
      maxFiles: maxFileCount,
      multiple,
      disabled,
      onDrop: (acceptedFiles) => {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) as UploadFile[]

        if (multiple) {
          const updatedFiles = [...files, ...newFiles].slice(0, maxFileCount);
          onChange(updatedFiles);
          setTempFiles(updatedFiles);
        } else {
          const updatedFiles = newFiles.slice(0, 1);
          onChange(updatedFiles);
          setTempFiles(updatedFiles);
        }
      },
    })

    useEffect(() => {
      // Revoke the data uris to avoid memory leaks
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview || ""))
    }, [])

    const handleRemove = (index: number) => {
      const newFiles = [...files]
      newFiles.splice(index, 1)
      onChange(newFiles)
      setTempFiles(newFiles);
    }

    return (
      <div ref={ref} className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 transition-colors hover:bg-muted/50",
            isDragActive && "bg-muted/50",
            error && "border-destructive",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">
              {isDragActive ? (
                "Drop the files here..."
              ) : (
                <>
                  Drag & drop files here, or{" "}
                  <span className="text-primary">browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {multiple
                ? `Upload up to ${maxFileCount} files`
                : "Upload a single file"}
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {files.map((file, index) => (
                <FileCard
                  key={file.name + index}
                  file={file}
                  fileIndex={index}
                  onRemove={() => handleRemove(index)}
                  setFiles={setTempFiles}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    )
  }
)

FormFileUploader.displayName = "FormFileUploader"

export default FormFileUploader 