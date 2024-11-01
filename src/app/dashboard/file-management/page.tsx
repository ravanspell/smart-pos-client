"use client";

import React, { useState } from "react";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu";
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
    EllipsisVerticalIcon,
    FolderIcon,
    PlusIcon,
    ShareIcon,
    TrashIcon
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
    useGetFolderContentsQuery
} from "@/redux/api/fileManagmentAPI";
import { useRouter, useSearchParams } from "next/navigation";
import { FileOrFolder } from "@/redux/api/types/file-mgt";
import { formatBytes } from "@/lib/utils";
import BreadcrumbComponent from "@/components/molecules/Breadcrumb";
import CreateFolderModal from "@/components/organisams/CreateFolderModal";
import { Icons } from "@/lib/icons";
import FileIcon from "@/components/molecules/FileIcons";

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
    } = useGetBreadcrumbQuery(folderId, { skip: !folderId });

    const {
        data: filesAndFolders,
        error: filesAndFoldersError,
        isLoading: filesAndFoldersIsLoading
    } = useGetFolderContentsQuery({
        folderId,
        page: 1,
        pageSize: 10
    })

    const [files, setFiles] = useState<FileItem[]>([
        { id: "1", name: "Unicode", isFolder: true, date: "Sep 13, 2013", user: "by ireshan madawa", size: "1 File" },
        { id: "2", name: "Sinhala Fonts", isFolder: true, date: "Sep 26, 2013", user: "by ireshan madawa", size: "33 Files" },
        { id: "3", name: "python for Android", isFolder: true, date: "Nov 9, 2013", user: "by ireshan madawa", size: "1 File" },
        { id: "4", name: "SL4A", isFolder: true, date: "Nov 9, 2013", user: "by ireshan madawa", size: "1 File" },
        { id: "5", name: "diskdigger", isFolder: true, date: "Nov 26, 2013", user: "by ireshan madawa", size: "1 File" },
        { id: "6", name: "AL ICT (ireshan)", isFolder: true, date: "Nov 26, 2013", user: "by ireshan madawa", size: "3 Files" },
        { id: "7", name: "pythonCGIex", isFolder: true, date: "Dec 5, 2013", user: "by ireshan madawa", size: "2 Files" },
        { id: "8", name: "Miniclip.com", isFolder: true, date: "Jan 21, 2014", user: "by ireshan madawa", size: "1 File" },
        { id: "9", name: "SmartDustbin", isFolder: true, date: "Feb 2, 2018", user: "by ireshan madawa", size: "1 File" },
    ]);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [isGridView, setIsGridView] = useState(false); // State to toggle between grid and list view
    const [sortColumn, setSortColumn] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [isOpenCreateFolderModal, setIsOpenCreateFolderModal] = useState<boolean>(false);

    const handleCheckboxChange = (id: string) => {
        setSelectedFiles((prev) =>
            prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]
        );
    };

    const handleDownload = (item) => {
    };

    const handleDelete = (item) => {
        // setFiles((prev) => prev.filter((file) => file.id !== item.id));
    };

    const handleRename = (item) => {
        const newName = prompt(`Rename ${item.name} to:`, item.name);
        if (newName) {
            setFiles((prev) =>
                prev.map((file) => (file.id === item.id ? { ...file, name: newName } : file))
            );
        }
    };

    const isItemSelected = (id: string) => selectedFiles.includes(id);

    // Sorting logic
    const handleSort = (column: string) => {
        const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(newDirection);

        const sortedFiles = [...files].sort((a, b) => {
            if (newDirection === "asc") {
                return a[column as keyof FileItem] > b[column as keyof FileItem] ? 1 : -1;
            } else {
                return a[column as keyof FileItem] < b[column as keyof FileItem] ? 1 : -1;
            }
        });

        setFiles(sortedFiles);
    };

    const goToFolder = (entity: FileOrFolder) => {
        if (entity.folder) {
            router.push(`/dashboard/file-management?folderId=${entity.id}`);
        }
    };

    const bc = (breadcrumbs?.data?.parentFolderIds || []).map((breadcrumb) => ({ label: breadcrumb.name, href: `/dashboard/file-management?folderId=${breadcrumb.id}` })) as [];

    return (
        <div className="p-4 relative">
            {/* Switch between grid and list view */}
            {selectedFiles.length === 0 && (
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <BreadcrumbComponent
                            items={[
                                { label: "My files", href: "/dashboard/file-management" },
                                ...bc,
                            ]}
                        />
                    </div>
                    <div className="space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button >
                                    New <PlusIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => { }}>
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
                        <Button className="p-2">
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

            {/* Render table view if not grid view */}
            {!isGridView && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                                NAME {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                                UPDATED {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                            </TableHead>
                            <TableHead >
                                SIZE
                            </TableHead>
                            <TableHead className="text-center" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filesAndFolders?.data.filesAndFolders.map((file) => (
                            <TableRow key={file.id} className="cursor-pointer hover:bg-gray-100" onClick={() => goToFolder(file)}>
                                {/* File/Folder name */}
                                <TableCell>
                                    <div className="flex items-center space-x-4">
                                        <FileIcon fileName={file.name} />
                                    </div>
                                </TableCell>
                                {/* Updated date */}
                                <TableCell>{file.updatedAt} By {file.updatedBy}</TableCell>
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
            )}

            {/* Render grid view if enabled */}
            {isGridView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filesAndFolders?.data.filesAndFolders.map((file) => (
                        <ContextMenu key={file.id}>
                            <ContextMenuTrigger>
                                <div
                                    className={`relative group border rounded-lg p-4 bg-white shadow-sm hover:shadow-md cursor-pointer ${isItemSelected(file.id) ? "border-blue-500" : ""
                                        }`}
                                >
                                    {/* Checkbox for selection (only shown on hover) */}
                                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                        <Checkbox
                                            checked={isItemSelected(file.id)}
                                            onCheckedChange={() => handleCheckboxChange(file.id)}
                                        />
                                    </div>

                                    {/* 3-dot button using DropdownMenu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                <Button className="p-1">
                                                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                                                </Button>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleDownload(file)}>Download</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(file)}>Delete</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRename(file)}>Rename</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    {/* File/Folder Icon and Details */}
                                    <div className="flex flex-col items-center">
                                        <FolderIcon className="h-16 w-16 text-yellow-400 mb-4" />
                                        <p className="font-medium text-center">{file.name}</p>
                                        <p className="text-sm text-gray-500">{file.createdAt}</p>
                                        <p className="text-sm text-gray-500">Ireshan</p>
                                    </div>
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => handleDownload(file)}>Download</ContextMenuItem>
                                <ContextMenuItem onClick={() => handleDelete(file)}>Delete</ContextMenuItem>
                                <ContextMenuItem onClick={() => handleRename(file)}>Rename</ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    ))}
                </div>
            )}
            {isOpenCreateFolderModal &&
                <CreateFolderModal
                    isOpen={isOpenCreateFolderModal}
                    onClose={() => setIsOpenCreateFolderModal(false)}
                />
            }
        </div>
    );
};

export default FileFolderGrid;