/**
 * Custom hook to handle API errors and manage error states using Redux.
 * Supports handling errors with different layouts (toast or full-page) and provides retry functionality.
 *
 * @returns {Object} - The `handleError`function.
 * @example
 * const { handleError, clearError } = useErrorHandler();
 * try {
 *   await apiCall();
 * } catch (error) {
 *   handleError(error);
 * }
 */

import { useCallback, useEffect, useState } from 'react';
import { StatusCode } from 'status-code-enum'
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import {
    setError,
    clearError as clearErrorAction,
    showToast
} from '@/redux/slices/appSlice';
import {
    DEFAULT_ERROR_SECTION_ID,
    ERROR_TYPES,
    ERROR_LAYOUT_TYPES,
    ErrorLayoutType,
} from '@/constants';
import { LOGIN_ROUTE } from '@/constants/routes';
import { IconEnum } from '@/lib/icons';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ErrorOptions {
    layout?: ErrorLayoutType; // Optional, defaults to ERROR_LAYOUT_TYPES.TOAST
    sectionId?: string; // Optional, defaults to DEFAULT_ERROR_SECTION_ID
}

export const useErrorHandler = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [sectionId, setSectionId] = useState<string>(DEFAULT_ERROR_SECTION_ID);

    // clear the section error when going away from the section / page
    useEffect(() => {
        return () => {
            dispatch(clearErrorAction({ sectionId }));
        };
    }, []);

    /**
     * Handles the display of error messages based on layout and type.
     *
     * @param message - The error message to display.
     * @param options - The error options, including layout and sectionId.
     * @param type - The type of error (e.g., 'NETWORK', 'UNEXPECTED', 'SERVER').
     * @returns {void}
     */
    const handleErrorMessage = useCallback((
        message: string,
        options: ErrorOptions,
        type: keyof typeof ERROR_TYPES,
        icon: string = ''
    ): void => {
        const sectionId = options.sectionId || DEFAULT_ERROR_SECTION_ID;
        const layout = options.layout || ERROR_LAYOUT_TYPES.TOAST;

        if (layout === ERROR_LAYOUT_TYPES.TOAST) {
            dispatch(showToast({
                message,
                type: 'error',
                icon,
            }));
        } else {
            dispatch(setError({ sectionId, message, type }));
        }
    }, []);

    /**
     * check the error is a http error or not
     */
    const isHttpError = useCallback((error: FetchBaseQueryError | TypeError | Error | unknown): boolean => {
        return typeof error === 'object' && error != null && 'status' in error;
    }, []);

    /**
     * Main error handling function.
     *
     * @param error - The error object thrown by the API call.
     * @param options - The error handling options, including layout and sectionId.
     * @returns {void}
     */
    const handleError = useCallback(
        async (error: FetchBaseQueryError | TypeError | Error | unknown, options?: ErrorOptions) => {
            const sectionId = options?.sectionId || DEFAULT_ERROR_SECTION_ID;
            const layout = options?.layout || ERROR_LAYOUT_TYPES.TOAST;

            // set the section id for global use of the hook.
            if (options?.sectionId) {
                setSectionId(sectionId);
            }

            // Handle TypeError or generic JavaScript errors
            if (error instanceof TypeError || error instanceof Error) {
                handleErrorMessage(
                    'An error occurred',
                    { sectionId, layout },
                    ERROR_TYPES.UNEXPECTED,
                    IconEnum.circleAlert
                );
                return;
            }

            try {
                if (error && isHttpError(error)) {
                    const httpError = error as FetchBaseQueryError

                    switch (httpError.status) {
                        case 'FETCH_ERROR':
                            // Handle network errors (e.g., failed to fetch)
                            handleErrorMessage(
                                'A network error occurred. Please check your connection and try again.',
                                { sectionId, layout },
                                ERROR_TYPES.NETWORK,
                                IconEnum.wifiOffIcon
                            );

                        case StatusCode.ClientErrorUnauthorized:
                            dispatch(
                                showToast({
                                    message: 'Session expired. Please login again.',
                                    type: ERROR_TYPES.UNEXPECTED,
                                    icon: IconEnum.keyIcon
                                })
                            );
                            const currentPath = window.location.pathname;
                            router.push(`${LOGIN_ROUTE}?returnUrl=${encodeURIComponent(currentPath)}`);
                            break;

                        case StatusCode.ClientErrorForbidden:
                            handleErrorMessage(
                                'You don\'t have permission to access this resource',
                                { sectionId, layout },
                                ERROR_TYPES.UNEXPECTED,
                                IconEnum.keyIcon
                            );
                            break;

                        default:
                            handleErrorMessage(
                                'An error occurred',
                                { sectionId, layout },
                                ERROR_TYPES.SERVER,
                                IconEnum.circleAlert
                            );
                    }
                }
            } catch {
                handleErrorMessage(
                    'Failed to process error response', {
                    sectionId,
                    layout,
                },
                    ERROR_TYPES.UNEXPECTED,
                    IconEnum.circleAlert
                );
            }
        }, []);

    return { handleError };
};