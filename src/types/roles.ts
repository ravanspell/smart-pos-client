import { PaginatedResponse, QueryParams } from ".";

export interface Role {
    id: string;
    name: string;
    description: string;
}

export type RoleQueryParams = QueryParams<Role>;

export type RoleResponse = PaginatedResponse<Role>;
