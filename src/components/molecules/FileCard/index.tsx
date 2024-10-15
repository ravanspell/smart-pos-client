import { Button } from "@/components/atoms/Button";
import { Progress } from "@/components/atoms/Progress";
import { Icons } from "@/lib/icons";
import { formatBytes } from "@/lib/utils";
import { useEffect, useState } from "react";
import FilePreview from "../FilePreview";
import { isFileWithPreview } from "../../organisams/FileUploader";

interface FileCardProps {
    file: File
    onRemove: () => void
}

function FileCard({ file, onRemove }: FileCardProps) {
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const getPresignedUrl = async (file: File) => {
        try {
            const response = await fetch('http://localhost:3001/api/file-management/upload/init', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: file.name,
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to get pre-signed URL mmmm');
            }

            const {data} = await response.json();
            console.log("response--->", data);
            return data.uploadUrl;
        } catch (error) {
            console.error("the error--->", error);
            return null;
        }
    };

    const uploadFile = (file: File, url: string) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', file.type);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    setUploadPercentage(percentCompleted);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve('File uploaded successfully');
                } else {
                    reject('Error uploading file');
                }
            };

            xhr.onerror = () => reject('Error uploading file');
            xhr.send(file);
        });
    };

    const handleFileInput = async (file: File) => {
        if (!file) return;
        try {
            // Step 1: Get pre-signed URL from backend
            const url = await getPresignedUrl(file);
            if (!url) {
                alert('Could not get pre-signed URL');
                return;
            }
            // Step 2: Upload the file
            await uploadFile(file, url);
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    useEffect(() => {
        handleFileInput(file)
    }, []);

    return (
        <div className="relative flex items-center gap-2.5">
            <div className="flex flex-1 gap-2.5">
                {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                        </p>
                    </div>
                    {uploadPercentage ? <Progress value={uploadPercentage} /> : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={onRemove}
                >
                    <Icons.close className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    )
}

export default FileCard;