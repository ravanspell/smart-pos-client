/**
 * Custom hook for managing breadcrumbs.
 *
 * This hook automatically sets the initial breadcrumbs when the component mounts,
 * and clears them when the component unmounts. It also returns a memoized function
 * that allows for dynamic updates of the breadcrumbs at any time.
 *
 * @param initialBreadcrumbs - An array of breadcrumb objects to be set initially.
 */
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs, clearBreadcrumbs, Breadcrumb } from '@/redux/slices/appSlice';


export const useBreadcrumb = (initialBreadcrumbs: Breadcrumb[] = []) => {
    const dispatch = useDispatch();

    // Memoized function to update breadcrumbs
    const updateBreadcrumbs = useCallback(
        (newBreadcrumbs: Breadcrumb[]) => {
            dispatch(setBreadcrumbs(newBreadcrumbs));
        },
        [dispatch]
    );

    // On mount, set the breadcrumbs from initialBreadcrumbs.
    // And clear them on unmount.
    useEffect(() => {
        dispatch(setBreadcrumbs(initialBreadcrumbs));
        return () => {
            dispatch(clearBreadcrumbs());
        };
    }, [initialBreadcrumbs]);

    return { updateBreadcrumbs };
};