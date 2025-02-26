// Generic query params interface that can be used for any data type
export interface QueryParams<T = any> {
    page?: number;
    limit?: number;
    sortBy?: keyof T | string;
    sortOrder?: 'asc' | 'desc';
    filter?: Partial<Record<keyof T, string>>;
}

// Response interface for paginated data
export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}