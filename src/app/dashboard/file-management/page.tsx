"use client";

import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/atoms/DropdownMenu";
import {
    CopyIcon,
    DownloadIcon,
    PlusIcon,
    ShareIcon,
    TrashIcon,
    HardDrive
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Checkbox } from "@/components/atoms/CheckBox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/atoms/Table";
import {
    useGetBreadcrumbQuery,
    useGetFolderContentsQuery,
    useGetStorageInfoQuery
} from "@/redux/api/fileManagmentAPI";
import { useRouter, useSearchParams } from "next/navigation";
import { FileOrFolder } from "@/redux/api/types/file-mgt";
import { formatBytes, formatDate } from "@/lib/utils";
import CreateFolderModal from "@/components/organisms/CreateFolderModal";
import { Icons } from "@/lib/icons";
import FileIcon from "@/components/molecules/FileIcons";
import FileUploadModal from "@/components/organisms/FileUploadModal";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { FILE_MANAGEMENT_ROUTE } from "@/constants/routes";
import { Progress } from "@/components/atoms/Progress";
interface FileItem {
    id: string;
    name: string;
    isFolder: boolean;
    date: string;
    user: string;
    size: string;
}

const FileFolderGrid: React.FC = () => {
    const router = useRouter();
    const params = useSearchParams()
    const folderId = params.get('folderId') || '';

    const {
        data: breadcrumbs,
        error,
        isLoading
    } = useGetBreadcrumbQuery(folderId);
    
    const {
        data: storageInfo,
        isLoading: storageInfoIsLoading
    } = useGetStorageInfoQuery();
    
    // map the breadcrumb list items
    const breadCrumbLinks = (breadcrumbs?.data?.parentFolderIds || []).map((breadcrumb) => ({
        label: breadcrumb.name,
        href: `/dashboard/file-management?folderId=${breadcrumb.id}`
    })) as [];
    // set the breadcrumb items into main breadcrumb component
    useBreadcrumb([{
        label: 'File management',
        href: '/dashboard/file-management'
    },
    ...breadCrumbLinks
    ]);

    const {
        data: filesAndFolders,
        error: filesAndFoldersError,
        isLoading: filesAndFoldersIsLoading
    } = useGetFolderContentsQuery({
        folderId,
        page: 1,
        pageSize: 10
    })

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [isOpenCreateFolderModal, setIsOpenCreateFolderModal] = useState<boolean>(false);
    const [isOpenFileUploaderModal, setIsOpenFileUploaderModal] = useState<boolean>(false);

    const handleCheckboxChange = (id: string) => {
        setSelectedFiles((prev) =>
            prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
        );
    };

    const handleDownload = async (ids: string[]) => {
        try {
            console.log("log --->", ids);

            const link = document.createElement('a');
            link.href = `${process.env.NEXT_PUBLIC_API_URL}/api/file-management/download?ids=${ids.join(',')}`;
            link.style.display = 'none';
            // Set the target to _blank to avoid navigating away from the current page
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click(); // Programmatically trigger the download
            document.body.removeChild(link); // Clean up
        } catch (error) {
            console.error('Error downloading files:', error);
        }
    };

    const isItemSelected = (id: string) => selectedFiles.includes(id);

    // Sorting logic
    const handleSort = (column: string) => {};

    const goToFolder = (entity: FileOrFolder) => {
        if (entity.folder) {
            router.push(`${FILE_MANAGEMENT_ROUTE}?folderId=${entity.id}`);
        }
    };

    return (
        <div className="p-4 relative">
            {/* Switch between grid and list view */}
            {selectedFiles.length === 0 && (
                <div className="flex justify-between items-center mb-4">
                    <div >
                        <div className="flex items-center gap-2">
                            <HardDrive size={15} />
                            <span className="text-sm">{storageInfo?.data?.usedStorageFormatted || '0 MB'} of {storageInfo?.data?.allocatedStorageFormatted || '0 MB'} used</span>
                        </div>
                        <div className="w-64">
                            <Progress className="h-2 w-full" value={storageInfo?.data?.usagePercentage || 0} />
                        </div>
                    </div>
                    <div className="space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button >
                                    New <PlusIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setIsOpenFileUploaderModal(true)}>
                                    <div className="flex items-center gap-1">
                                        <Icons.Upload size={16} />
                                        <span>File upload</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setIsOpenCreateFolderModal(true)}>
                                    <div className="flex items-center gap-1">
                                        <Icons.FolderIcon size={16} />
                                        <span>Folder</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
            {/* Selection Toolbar */}
            {selectedFiles.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                    <p>{selectedFiles.length} item(s) selected</p>
                    <div className="space-x-4">
                        <Button onClick={() => handleDownload(selectedFiles)} className="p-2">
                            <DownloadIcon className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Button className="p-2">
                            <TrashIcon className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Button className="p-2">
                            <CopyIcon className="h-5 w-5 text-gray-500" />
                        </Button>
                        <Button className="p-2">
                            <ShareIcon className="h-5 w-5 text-gray-500" />
                        </Button>
                    </div>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                            NAME
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                            UPDATED
                        </TableHead>
                        <TableHead >
                            SIZE
                        </TableHead>
                        <TableHead className="text-center" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filesAndFolders?.data.filesAndFolders.map((file) => (
                        <TableRow key={file.id} className="cursor-pointer" onClick={() => goToFolder(file)}>
                            {/* File/Folder name */}
                            <TableCell>
                                <div className="flex items-center space-x-4">
                                    <FileIcon fileName={file.name} />
                                </div>
                            </TableCell>
                            {/* Updated date */}
                            <TableCell>{formatDate(file?.updatedAt || '')} By {file.updatedBy}</TableCell>
                            {/* File size */}
                            <TableCell>{file.folder ? `${file.fileCount} Files` : formatBytes(file.size as number)}</TableCell>
                            {/* Checkbox for selection */}
                            <TableCell className="text-center">
                                <Checkbox
                                    checked={isItemSelected(file.id)}
                                    onCheckedChange={() => handleCheckboxChange(file.id)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {isOpenCreateFolderModal &&
                <CreateFolderModal
                    isOpen={isOpenCreateFolderModal}
                    onClose={() => setIsOpenCreateFolderModal(false)}
                />
            }
            {isOpenFileUploaderModal &&
                <FileUploadModal
                    isOpen={isOpenFileUploaderModal}
                    onClose={() => setIsOpenFileUploaderModal(false)}
                    parentId={folderId}
                />
            }
        </div>
    );
};

export default FileFolderGrid;