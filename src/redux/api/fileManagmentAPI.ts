import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { HTTPMethod } from 'http-method-enum';
import { ApiResponse, FileOrFolder, GetFolderContentsResponse } from './types/file-mgt';
import { FILE_MGT } from '@/constants/api';

interface PresignedUrlResponse {
    uploadUrl: string;
    key: string;
}

export interface BreadcrumbResponse {
    parentFolderIds: {
        id: string;
        name: string;
    }[]
}

export const fileManagementApi = createApi({
    reducerPath: 'fileManagementApi',
    baseQuery: baseQuery,
    tagTypes: ['Folder', 'File'],
    endpoints: (builder) => ({
        // ** Get Folder's and it's contents **
        getFolderContents: builder.query<
            ApiResponse<GetFolderContentsResponse>,
            { folderId?: string | null; page?: number; pageSize?: number }
        >({
            query: ({ folderId, page = 1, pageSize = 20 }) => {
                const params = new URLSearchParams();
                if (folderId) params.append('folderId', folderId);
                params.append('page', page.toString());
                params.append('pageSize', pageSize.toString());
                return `file-management?${params.toString()}`;
            },
            transformResponse: (response: ApiResponse<GetFolderContentsResponse>) => response,
            providesTags: (result, error, { folderId }) => [{ type: 'Folder', id: folderId || 'ROOT' }],
        }),
        // **Create Folder**
        createFolder: builder.mutation<
            ApiResponse<FileOrFolder>,
            { parentId: string; name: string }
        >({
            query: ({ parentId, name }) => ({
                url: '/file-management/create-folder',
                method: HTTPMethod.POST,
                body: { name, parentId },
            }),
            async onQueryStarted({ parentId }, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                // Update the cache with the new folder
                dispatch(
                    fileManagementApi.util.updateQueryData(
                        'getFolderContents',
                        { folderId: parentId, page: 1, pageSize: 10 },
                        (draft) => {
                            if (draft && draft.data) {
                                draft.data.filesAndFolders.unshift({
                                    ...data.data,
                                    folder: true,
                                    fileCount: 0,
                                    folderCount: 0,
                                });
                            }
                        }
                    )
                );
            },
        }),
        // **Rename Folder**
        renameFolder: builder.mutation<
            ApiResponse<FileOrFolder>,
            { folderId: string; newName: string; parentId: string }
        >({
            query: ({ folderId, newName }) => ({
                url: 'rename-folder',
                method: HTTPMethod.PATCH,
                body: { folderId, newName },
            }),
            async onQueryStarted({ folderId, parentId }, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                // Update the cache with the new folder name
                dispatch(
                    fileManagementApi.util.updateQueryData(
                        'getFolderContents',
                        { folderId: parentId, page: 1, pageSize: 10 },
                        (draft) => {
                            if (draft && draft.data) {
                                const item = draft.data.filesAndFolders.find(
                                    (f) => f.id === folderId && f.folder
                                );
                                if (item) {
                                    item.name = data.data.name;
                                }
                            }
                        }
                    )
                );
            },
        }),
        // **Rename File**
        renameFile: builder.mutation<
            ApiResponse<FileOrFolder>,
            { fileId: string; newName: string; parentFolderId: string }
        >({
            query: ({ fileId, newName }) => ({
                url: 'rename-file',
                method: HTTPMethod.PATCH,
                body: { fileId, newName },
            }),
            async onQueryStarted({ fileId, parentFolderId }, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                // Update the cache with the new file name
                dispatch(
                    fileManagementApi.util.updateQueryData(
                        'getFolderContents',
                        { folderId: parentFolderId, page: 1, pageSize: 10 },
                        (draft) => {
                            if (draft && draft.data) {
                                const item = draft.data.filesAndFolders.find(
                                    (f) => f.id === fileId && !f.folder
                                );
                                if (item) {
                                    item.name = data.data.name;
                                }
                            }
                        }
                    )
                );
            },
        }),
        // **Get Breadcrumb**
        getBreadcrumb: builder.query<ApiResponse<BreadcrumbResponse>, string>({
            query: (folderId): string => `${FILE_MGT.GET_BREADCRUMBS}${folderId}`,
            transformResponse: (response: ApiResponse<BreadcrumbResponse>) => response,
            // providesTags: (result, error, folderId) => [{ type: 'Breadcrumb', id: folderId }],
        }),
        // **Get Presigned URL**
        getPresignedUrl: builder.mutation<
            ApiResponse<PresignedUrlResponse>,
            { fileName: string }
        >({
            query: ({ fileName }) => ({
                url: FILE_MGT.INITIATE_UPLOAD,
                method: HTTPMethod.POST,
                body: { fileName },
            }),
            transformResponse: (response: ApiResponse<PresignedUrlResponse>) => response,
        }),
        // **Confirm File Upload**
        confirmFileUpload: builder.mutation<
            ApiResponse<FileOrFolder>,
            { files: Array<{ fileName: string; parentId: string | null; s3ObjectKey: string; fileSize: number }> }
        >({
            query: (payload) => ({
                url: FILE_MGT.CONFIRM_UPLOAD,
                method: HTTPMethod.POST,
                body: payload,
            }),
            // Invalidate the cache for the parent folders to trigger a refetch
            invalidatesTags: (result, error, { files }) => {
                // Get unique parent folder IDs
                const parentFolders = [...new Set(files.map(file => file.parentId))];
                // Return tags for each parent folder
                return parentFolders.map(parentId => ({ type: 'Folder', id: parentId || 'ROOT' }));
            },
        }),
    }),
});

export const {
    useGetFolderContentsQuery,
    useCreateFolderMutation,
    useRenameFolderMutation,
    useRenameFileMutation,
    useGetBreadcrumbQuery,
    useGetPresignedUrlMutation,
    useConfirmFileUploadMutation,
} = fileManagementApi;