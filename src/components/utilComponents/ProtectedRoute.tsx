'use client';

import { useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useLazyGetUserAuthInfoQuery } from '@/redux/api/authManagementAPI';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { ERROR_LAYOUT_TYPES } from '@/constants';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermissions?: string[];
    redirectTo?: string;
}

/**
 * A client-side component that protects routes based on authentication
 * and permission status. It uses RTK Query for state management and
 * integrates with Next.js navigation.
 */
export function ProtectedRoute({
    children,
    requiredPermissions = [],
}: ProtectedRouteProps) {
    const [fetchAuthInfo, { isLoading }] = useLazyGetUserAuthInfoQuery();
    const { hasAllPermissions } = usePermissions();
    const { handleError } = useErrorHandler();

    const handleCheckAuthentication = async () => {
        try {
            await fetchAuthInfo().unwrap();
        } catch (error) {
            handleError(error, {layout: ERROR_LAYOUT_TYPES.FULL_PAGE});
        }
    }

    useEffect(() => {
        handleCheckAuthentication();
    }, []);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }
    // Check permissions if specified
    if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
        return (
            <div>
                You don't have the required permissions to access this page
            </div>
        );
    }
    // If authenticated and has permissions, render children
    return children;
}