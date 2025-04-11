import { ReactNode, useEffect, useState } from "react";
import { useWakeupCheckQuery, useUpdateActivityMutation } from "@/redux/api/appAPI";

interface Props {
    children: ReactNode;
}

const POLLING_INTERVAL = 5000;
const OK_STATUS = 'ok';

/**
 * Component that:
 * 1. Polls the wakeup check endpoint until the server is ready
 * 2. Periodically sends activity updates to the server to keep the server awake
 * 
 * this is to prevent the server from sleeping due to inactivity
 * !dev envirment only
 */
export default function ServerHealthCheck({ children }: Props) {
    const [shouldPoll, setShouldPoll] = useState(true);
    const { data, error } = useWakeupCheckQuery(undefined, {
        skip: process.env.NEXT_PUBLIC_ENV === 'local',
        pollingInterval: shouldPoll ? POLLING_INTERVAL : 0,
    });
    const [updateActivity] = useUpdateActivityMutation();

    // Handle wakeup check polling
    useEffect(() => {
        // If we have data and the status is 'ok', stop polling
        if (data?.status === OK_STATUS) {
            setShouldPoll(false);
        }
    }, [data]);

    // Handle periodic activity updates
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (data?.status === OK_STATUS && process.env.NEXT_PUBLIC_ENV !== 'local') {
            updateActivity().catch(error => {
                console.error('Failed to update activity:', error);
            });
            // Set up interval for periodic calls (every 10 minutes)
            intervalId = setInterval(() => {
                updateActivity().catch(error => {
                    console.error('Failed to update activity:', error);
                });
            }, 10 * 60 * 1000); // 10 minutes in milliseconds
        }
        // Clean up interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [data]);

    // If we have an error or the server is not ready, show loading state
    if (error || data?.status !== OK_STATUS && process.env.NEXT_PUBLIC_ENV !== 'local') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg">We are setting things up for you. Please wait.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 