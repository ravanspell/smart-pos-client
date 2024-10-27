export interface ApiResponse<T> {
    statusCode: number;
    msg: string | null;
    success: boolean;
    data: T;
  }
  
  export interface Pagination {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  
  export interface FileOrFolder {
    id: string;
    name: string;
    folder: boolean;
    // Common properties
    // Folder-specific properties
    createdAt?: string;
    fileCount?: number;
    folderCount?: number;
    // File-specific properties
    size?: number;
    key?: string;
    uploadedAt?: string;
    // this property for optimistic updates
    isTemporary?: true,
  }
  
  export interface GetFolderContentsResponse {
    filesAndFolders: FileOrFolder[];
    pagination: Pagination;
  }
  