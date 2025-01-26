"use client"

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearError, getSectionError } from '@/redux/slices/appSlice';
import { Button } from '@/components/atoms/Button';
import useNetworkStatus from '@/hooks/useNetworkStatus';
import { DEFAULT_ERROR_SECTION_ID, ERROR_TYPES } from '@/constants';

interface SectionStatusBoundaryProps {
  /**
   *  @param {string} sectionId - The unique ID for the section, used to retrieve error state from Redux.
   */
  sectionId: string;
  /**
   * @param {() => void} fetchMethod - The method to re-trigger the fetch operation.
   */
  fetchMethod: () => void;
  /**
   * @param {boolean} isLoading - The loading state, shared externally for centralized status management.
   */
  isLoading: boolean;
  children: React.ReactNode;
}

const SectionStatusBoundary: React.FC<SectionStatusBoundaryProps> = ({
  sectionId = DEFAULT_ERROR_SECTION_ID,
  fetchMethod,
  isLoading,
  children,
}) => {
  const dispatch = useDispatch();
  const errorState = useSelector((state: RootState) => getSectionError(state, sectionId));
  const isOnline = useNetworkStatus();

  const handleRetry = async (): Promise<void> => {
    dispatch(clearError({ sectionId }));
    fetchMethod();
  };

  useEffect(() => {
    if (isOnline && errorState?.type === ERROR_TYPES.NETWORK) {
      handleRetry();
    }
  }, [isOnline, errorState, fetchMethod]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {isLoading &&
          <div className="flex flex-col items-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status"></div>
          </div>
        }
        <>
          {!isLoading && errorState && (
            <>
              <p className="text-lg text-red-500 mb-4">{errorState.message || 'An error occurred.'}</p>

              {(errorState.type === ERROR_TYPES.NETWORK && !isOnline) &&
                (
                  <>
                    <p className="text-gray-700 mb-4">Please check your internet connection.</p>

                    <Button
                      className="px-4 py-2"
                      onClick={handleRetry}
                    />
                  </>
                )
              }
            </>
          )}
        </>
        {!isLoading && !errorState && (
          { children }
        )}
      </div>
    </div>
  );
};

export default SectionStatusBoundary;
