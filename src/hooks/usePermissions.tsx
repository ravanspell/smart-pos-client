'use client';

import { useCallback } from 'react';
import { useGetUserAuthInfoQuery } from '@/redux/api/authManagementAPI';

/**
 * Custom hook for managing and checking user permissions throughout the application.
 * 
 * This hook leverages RTK Query's caching capabilities to efficiently access
 * permission data without unnecessary refetch. It provides various methods
 * for checking permissions in different contexts (single permission, multiple
 * permissions, resource-based access, etc.).
 * 
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { canAccess, hasPermission } = usePermissions();
 * 
 *   if (!canAccess('admin_panel', 'view')) {
 *     return <AccessDenied />;
 *   }
 * 
 *   return (
 *     <div>
 *       {hasPermission('manage_users') && <UserManagement />}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @returns An object containing various permission checking functions
 */
export function usePermissions() {
  // Fetch authentication data which includes permissions
  const { data } = useGetUserAuthInfoQuery();
  // Safely access permissions with a fallback to empty array
  const permissions = data?.data?.scopes ?? [];

  /**
   * Checks if the user has a specific permission by its code.
   * Memoized to prevent unnecessary re-renders in dependent components.
   * 
   * @param permissionCode - The unique identifier of the permission to check
   * @returns boolean indicating if the user has the specified permission
   */
  const hasPermission = useCallback((permissionCode: string): boolean => {
    return permissions.some((permission: string) =>  permission === permissionCode);
  }, [permissions]);

  /**
   * Verifies that the user has ALL of the specified permissions.
   * Useful for features that require multiple permissions to access.
   * 
   * @param permissionCodes - Array of permission codes to check
   * @returns boolean indicating if the user has all specified permissions
   */
  const hasAllPermissions = useCallback((permissionCodes: string[]): boolean => {
    return permissionCodes.every(currentPermission => hasPermission(currentPermission));
  }, [permissions]);

  /**
   * Checks if the user has ANY of the specified permissions.
   * Useful for features that can be accessed with different permission sets.
   * 
   * @param permissionCodes - Array of permission codes to check
   * @returns boolean indicating if the user has at least one of the specified permissions
   */
  const hasAnyPermission = useCallback((permissionCodes: string[]): boolean => {
    return permissionCodes.some(currentPermission => hasPermission(currentPermission));
  }, [permissions]);

  /**
   * Returns the complete list of user permissions.
   * Not memoized since it just returns the permissions array directly.
   * 
   * @returns Array of all Permission objects for the current user
   */
  const getAllPermissions = () => permissions;

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getAllPermissions,
  };
}