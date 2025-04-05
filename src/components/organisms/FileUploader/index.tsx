"use client"

import Dropzone, {
    type DropzoneProps,
    type FileRejection,
} from "react-dropzone"
import { cn, formatBytes } from "@/lib/utils"
import { ScrollArea } from "@/components/atoms/ScrollArea"
import { Icons } from "@/lib/icons"
import { toast } from "sonner"
import FileCard from "../../molecules/FileCard"
import { useCallback, useEffect, useState } from "react"
import ModalActionButtons from "@/components/molecules/ModalActionButtons"
import { useConfirmFileUploadMutation } from "@/redux/api/fileManagmentAPI"

export function isFileWithPreview(file: File): file is File & { preview: string } {
    return "preview" in file && typeof file.preview === "string"
}

export interface UploadFile extends File {
    s3ObjectKey?: string;
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Function to be called when the value changes.
     * @type (files: File[]) => void
     * @default undefined
     * @example onValueChange={(files) => setFiles(files)}
     */
    onValueChange?: (files: File[]) => void

    /**
     * Function to be called when files are uploaded.
     * @type (files: File[]) => Promise<void>
     * @default undefined
     * @example onUpload={(files) => uploadFiles(files)}
     */
    onUpload?: (files: File[]) => Promise<void>

    /**
     * Progress of the uploaded files.
     * @type Record<string, number> | undefined
     * @default undefined
     * @example progresses={{ "file1.png": 50 }}
     */
    progresses?: Record<string, number>

    /**
     * Accepted file types for the uploader.
     * @type { [key: string]: string[]}
     * @default
     * ```ts
     * { "image/*": [] }
     * ```
     * @example accept={["image/png", "image/jpeg"]}
     */
    accept?: DropzoneProps["accept"]

    /**
     * Maximum file size for the uploader.
     * @type number | undefined
     * @default 1024 * 1024 * 2 // 2MB
     * @example maxSize={1024 * 1024 * 2} // 2MB
     */
    maxSize?: DropzoneProps["maxSize"]

    /**
     * Maximum number of files for the uploader.
     * @type number | undefined
     * @default 1
     * @example maxFileCount={4}
     */
    maxFileCount?: DropzoneProps["maxFiles"]

    /**
     * Whether the uploader should accept multiple files.
     * @type boolean
     * @default false
     * @example multiple
     */
    multiple?: boolean

    /**
     * Whether the uploader is disabled.
     * @type boolean
     * @default false
     * @example disabled
     */
    disabled?: boolean

    /**
     * Function to be called when the cancel button is clicked.
     * @type () => void
     * @default undefined
     * @example onCancel={() => {}}
     */
    onCancel: () => void

    /**
     * The parent folder ID where the file will be uploaded.
     * @type string
     * @default "root"
     * @example parentId="folder-123"
     */
    parentId?: string

    /**
     * The S3 object key for the file.
     * @type string
     * @default undefined
     * @example s3ObjectKey="temp/uuid/document.pdf"
     */
    s3ObjectKey?: string
}

function FileUploader(props: FileUploaderProps) {
    const {
        onValueChange,
        onUpload,
        progresses,
        accept = {
            "image/*": [],
        },
        maxSize = 1024 * 1024 * 2,
        maxFileCount = 1,
        multiple = false,
        disabled = false,
        className,
        onCancel,
        parentId = null,
        s3ObjectKey,
        ...dropzoneProps
    } = props
    const [files, setFiles] = useState<UploadFile[]>([]);
    console.log("files--->", files);
    
    const [confirmFileUpload, { isLoading }] = useConfirmFileUploadMutation()

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
                toast.error(`Cannot upload more than 1 file at a time`)
                return
            }

            if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
                toast.error(`Cannot upload more than ${maxFileCount} files`)
                return
            }

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )

            const updatedFiles = files ? [...files, ...newFiles] : newFiles

            setFiles(updatedFiles)
            console.log("updatedFiles--->", updatedFiles);

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file }) => {
                    toast.error(`File ${file.name} was rejected`)
                })
            }
        },

        [files, maxFileCount, multiple]
    )

    function onRemove(index: number) {
        if (!files) return
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onValueChange?.(newFiles)
    }

    // Revoke preview url when component unmounts
    useEffect(() => {
        return () => {
            if (!files) return
            files.forEach((file) => {
                if (isFileWithPreview(file)) {
                    URL.revokeObjectURL(file.preview)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount

    const handleConfirmUpload = async () => {
        if (!files || files.length === 0) {
            toast.error("No files to upload")
            return
        }

        try {
            // Prepare the files array for the API request
            const filesToUpload = files.map(file => ({
                fileName: file.name,
                parentId: parentId,
                s3ObjectKey: file.s3ObjectKey || `temp/${Date.now()}/${file.name}`, // Use the s3ObjectKey from the file if available
                fileSize: file.size
            }))
            
            // Call the confirmFileUpload mutation with all files
            await confirmFileUpload({
                files: filesToUpload
            }).unwrap()
            
            onCancel()
        } catch (error) {
            console.error("Error confirming file upload:", error)
            toast.error("Failed to upload files")
        }
    }

    return (
        <div className="relative flex flex-col gap-6 overflow-hidden">
            <Dropzone
                onDrop={onDrop}
                accept={accept}
                maxSize={maxSize}
                maxFiles={maxFileCount}
                multiple={maxFileCount > 1 || multiple}
                disabled={isDisabled}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isDragActive && "border-muted-foreground/50",
                            isDisabled && "pointer-events-none opacity-60",
                            className
                        )}
                        {...dropzoneProps}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <Icons.Upload
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <p className="font-medium text-muted-foreground">
                                    Drop the files here
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <Icons.Upload
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="flex flex-col gap-px">
                                    <p className="font-medium text-muted-foreground">
                                        Drag {`'n'`} drop files here, or click to select files
                                    </p>
                                    <p className="text-sm text-muted-foreground/70">
                                        You can upload
                                        {maxFileCount > 1
                                            ? ` ${maxFileCount === Infinity ? "multiple" : maxFileCount}
                      files (up to ${formatBytes(maxSize)} each)`
                                            : ` a file with ${formatBytes(maxSize)}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Dropzone>
            {files?.length ? (
                <ScrollArea className="h-fit w-full">
                    <div className="flex max-h-48 flex-col gap-4">
                        {files?.map((file, index) => (
                            <FileCard
                                key={index}
                                fileIndex={index}
                                file={file}
                                onRemove={() => onRemove(index)}
                                setFiles={setFiles}
                            />
                        ))}
                    </div>
                </ScrollArea>
            ) : null}
            <ModalActionButtons
                secondaryAction={onCancel}
                primaryAction={handleConfirmUpload}
                primaryId="create-folder-submit-btn"
                secondaryId="create-folder-cancel-btn"
                isLoading={isLoading}
                primaryLabel='Confirm'
                secondaryLabel='Cancel'
            />
        </div>
    )
}

export default FileUploader;