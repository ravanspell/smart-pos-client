/**
 * Custom hook to monitor network status.
 *
 * @returns {boolean} `true` if online, `false` if offline.
 * @example
 * const isOnline = useNetworkStatus();
 */
import { useState, useEffect } from 'react';

const useNetworkStatus = (): boolean => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    return isOnline;
};

export default useNetworkStatus;