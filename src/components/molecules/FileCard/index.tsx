import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { Progress } from "@/components/atoms/Progress";
import { Icons } from "@/lib/icons";
import { formatBytes } from "@/lib/utils";
import { useUpload } from "@/hooks/useUpload";
import { UploadFile } from "@/components/organisms/FileUploader";

interface FileCardProps {
    file: UploadFile;
    onRemove: () => void;
    setFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
    fileIndex: number;
}

const UPLOAD_COMPLETED = 100; // 100%

function FileCard({ file, onRemove, setFiles, fileIndex }: FileCardProps) {
    const { uploadFile, progress, isUploading, error } = useUpload({
        onError: (error) => {
            console.error('Upload error:', error);
        },
        onSuccess: (fileKey: string) => {
            // Handle successful upload
            console.log('Upload completed successfully');
            // Update the file object with the s3ObjectKey
            setFiles((prevFiles: UploadFile[]) => {
                const updatedFiles = [...prevFiles];
                // Create a new UploadFile object with the s3ObjectKey
                const updatedFile: UploadFile = Object.assign(file, { s3ObjectKey: fileKey });
                updatedFiles[fileIndex] = updatedFile;
                return updatedFiles;
            });
        },
    });

    useEffect(() => {
        uploadFile(file).catch(console.error);
    }, [file]);

    return (
        <div className="relative flex items-center gap-2.5">
            <div className="flex flex-1 gap-2.5">
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                        </p>
                    </div>
                    {isUploading && progress !== UPLOAD_COMPLETED && (
                        <Progress className="h-1" value={progress} />
                    )}
                    {error && (
                        <p className="text-xs text-destructive">
                            Upload failed: {error.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={onRemove}
                    disabled={isUploading}
                >
                    <Icons.close className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    );
}

export default FileCard;