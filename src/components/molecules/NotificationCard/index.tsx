import React from 'react';
import { Clock, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

// Define the notification type
export interface Notification {
    id: string;
    title: string;
    description: string;
    date: Date;
    read: boolean;
    link?: string;
    type: 'comment' | 'follow' | 'like' | 'feature' | 'alert' | 'success' | 'message';
    priority: 'low' | 'medium' | 'high';
}

// Helper function to get notification icon background color
export const getNotificationIconBackground = (type: string) => {
    switch (type) {
        case 'comment':
            return 'bg-blue-500';
        case 'follow':
            return 'bg-purple-500';
        case 'like':
            return 'bg-pink-500';
        case 'feature':
            return 'bg-amber-500';
        case 'alert':
            return 'bg-red-500';
        case 'success':
            return 'bg-green-500';
        case 'message':
            return 'bg-indigo-500';
        default:
            return 'bg-gray-500';
    }
};

// Helper function to format notification time
export const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) {
        return 'Just now';
    } else if (diffMin < 60) {
        return `${diffMin}m ago`;
    } else if (diffHour < 24) {
        return `${diffHour}h ago`;
    } else if (diffDay < 7) {
        return `${diffDay}d ago`;
    } else {
        return date.toLocaleDateString();
    }
};

interface NotificationCardProps {
    notification: Notification;
    icon: React.ReactNode;
    onClick: (notification: Notification) => void;
}

/**
 * NotificationCard component displays a single notification with its details
 * 
 * @param notification - The notification data to display
 * @param icon - The icon to display for the notification type
 * @param onClick - Function to call when the notification is clicked
 */
const NotificationCard: React.FC<NotificationCardProps> = ({
    notification,
    icon,
    onClick,
}) => {
    return (
        <Card
            className={cn(
                "hover:shadow-md transition-shadow cursor-pointer",
                notification.read ? 'bg-card' : 'bg-blue-50'
            )}
            onClick={() => onClick(notification)}
        >
            <CardContent className="p-3">
                <div className="flex gap-3">
                    <div className={cn("rounded-full p-2 shrink-0", getNotificationIconBackground(notification.type))}>
                        {icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            {notification.priority === 'high' && (
                                <Badge
                                    variant="destructive"
                                    className="bg-red-100 text-red-800 text-xs"
                                >
                                    Important
                                </Badge>
                            )}
                        </div>
                        <p className="text-xs flex items-center gap-1 mt-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatNotificationTime(notification.date)}
                        </p>
                        <p className="text-sm mt-2">{notification.description}</p>
                        {notification.link && (
                            <button className="text-primary text-xs font-medium mt-2 flex items-center hover:underline">
                                View details <Send className="h-3 w-3 ml-1" />
                            </button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationCard; 