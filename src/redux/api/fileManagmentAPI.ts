import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './api';
import { ApiResponse, FileOrFolder, GetFolderContentsResponse } from './types/file-mgt';


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
        // **Get Folder Contents**
        getFolderContents: builder.query<
            ApiResponse<GetFolderContentsResponse>,
            { folderId?: string | null; page?: number; pageSize?: number }
        >({
            query: ({ folderId, page = 1, pageSize = 10 }) => {
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
                url: `folder/${parentId || ''}`,
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: (result, error, { parentId }) => [{ type: 'Folder', id: parentId || 'ROOT' }],
            async onQueryStarted({ parentId, name }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    fileManagementApi.util.updateQueryData(
                        'getFolderContents',
                        { folderId: parentId, page: 1, pageSize: 10 },
                        (draft) => {
                            if (draft && draft.data) {
                                draft.data.filesAndFolders.push({
                                    id: 'temp-id',
                                    name,
                                    folder: true,
                                    isTemporary: true,
                                    fileCount: 0,
                                    folderCount: 0,
                                    createdAt: new Date().toISOString(),
                                });
                            }
                        }
                    )
                );
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        fileManagementApi.util.updateQueryData(
                            'getFolderContents',
                            { folderId: parentId, page: 1, pageSize: 10 },
                            (draft) => {
                                if (draft && draft.data) {
                                    const index = draft.data.filesAndFolders.findIndex((item) => item.id === 'temp-id');
                                    if (index !== -1) {
                                        draft.data.filesAndFolders[index] = data.data;
                                    } else {
                                        draft.data.filesAndFolders.push(data.data);
                                    }
                                }
                            }
                        )
                    );
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // **Rename Folder**
        renameFolder: builder.mutation<
            ApiResponse<FileOrFolder>,
            { folderId: string; newName: string; parentId: string }
        >({
            query: ({ folderId, newName }) => ({
                url: 'rename-folder',
                method: 'PATCH',
                body: { folderId, newName },
            }),
            invalidatesTags: (result, error, { folderId }) => [{ type: 'Folder', id: folderId }],
            async onQueryStarted({ folderId, newName, parentId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    fileManagementApi.util.updateQueryData(
                        'getFolderContents',
                        { folderId: parentId, page: 1, pageSize: 10 },
                        (draft) => {
                            if (draft && draft.data) {
                                const item = draft.data.filesAndFolders.find((f) => f.id === folderId && f.folder);
                                if (item) {
                                    item.name = newName;
                                }
                            }
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // **Rename File**
        renameFile: builder.mutation<
            ApiResponse<FileOrFolder>,
            { fileId: string; newName: string; parentFolderId: string }
        >({
            query: ({ fileId, newName }) => ({
                url: 'rename-file',
                method: 'PATCH',
                body: { fileId, newName },
            }),
            invalidatesTags: (result, error, { fileId }) => [{ type: 'File', id: fileId }],
            async onQueryStarted({ fileId, newName, parentFolderId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    fileManagementApi.util.updateQueryData(
                        'getFolderContents',
                        { folderId: parentFolderId, page: 1, pageSize: 10 },
                        (draft) => {
                            if (draft && draft.data) {
                                const item = draft.data.filesAndFolders.find((f) => f.id === fileId && !f.folder);
                                if (item) {
                                    item.name = newName;
                                }
                            }
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        // **Get Breadcrumb**
        getBreadcrumb: builder.query<ApiResponse<BreadcrumbResponse>, string>({
            query: (folderId): string => `file-management/breadcrumb/${folderId}`,
            transformResponse: (response: ApiResponse<BreadcrumbResponse>) => response,
            // providesTags: (result, error, folderId) => [{ type: 'Breadcrumb', id: folderId }],
        }),
    }),
});

export const {
    useGetFolderContentsQuery,
    useCreateFolderMutation,
    useRenameFolderMutation,
    useRenameFileMutation,
    useGetBreadcrumbQuery,
} = fileManagementApi;