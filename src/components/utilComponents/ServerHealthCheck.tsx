import { ReactNode, useEffect, useState } from "react";
import { useHealthCheckQuery, useWakeupMutation } from "@/redux/api/appAPI";

interface Props {
    children: ReactNode;
}

export default function ServerHealthCheck({ children }: Props) {
    const [shouldPoll, setShouldPoll] = useState(true);
    const [wakeup] = useWakeupMutation();
    const { data: healthData, refetch, error: healthError } = useHealthCheckQuery(undefined, {
        pollingInterval: shouldPoll ? 5000 : 0,
    });
    
    const checkHealth = async (): Promise<void> => {
        try {
            // If we have health data and it's successful, stop polling
            if (healthData?.success && healthData.data.status === 'ok') {
                setShouldPoll(false);
                return;
            } else if (healthError) {
                // If we have an error or no successful health data, try to wake up
                await wakeup().unwrap();
                // After wakeup, refetch health check
                refetch();
            }
        } catch (error) {
            console.error('Failed to wake up server:', error);
        }
    };

    useEffect(() => {
        checkHealth();
    }, [healthData]);

    if (!healthData?.success || healthData.data.status !== 'ok') {
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