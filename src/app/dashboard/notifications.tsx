'use client';

import React, { useState } from 'react';
import NotificationViewer from '@/components/molecules/NotificationViewer';
import { Button } from '@/components/atoms/Button';
import { Bell } from 'lucide-react';
import { Notification } from '@/components/molecules/NotificationCard';
import { Badge } from '@/components/atoms/Badge';

/**
 * Notifications page component
 * 
 * This page displays the notification viewer in a dashboard layout
 */
const NotificationsPage = () => {
    const [unreadCount, setUnreadCount] = useState(9);
    const [isOpen, setIsOpen] = useState(false);

    // Sample notifications data
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'New comment on your post',
            description: 'John Doe commented on your recent post',
            date: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            read: false,
            link: '/posts/1',
            type: 'comment',
            priority: 'medium'
        },
        {
            id: '2',
            title: 'New follower',
            description: 'Jane Smith started following you',
            date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            read: false,
            link: '/profile/janesmith',
            type: 'follow',
            priority: 'low'
        },
        {
            id: '3',
            title: 'Your post was featured',
            description: 'Your post "Getting Started with ShadCN UI" was featured on the homepage',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: true,
            link: '/posts/featured',
            type: 'feature',
            priority: 'high'
        },
        {
            id: '4',
            title: 'System maintenance',
            description: 'The system will be down for maintenance on Saturday from 2-4 AM',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true,
            link: '/announcements/maintenance',
            type: 'alert',
            priority: 'high'
        },
        {
            id: '5',
            title: 'New message',
            description: 'You received a new message from Alex Johnson',
            date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            read: false,
            link: '/messages/alex',
            type: 'message',
            priority: 'medium'
        }
    ]);


    return (
        <div className="p-1">
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(!isOpen)} >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Button>
            <NotificationViewer
                notifications={notifications}
                setNotifications={setNotifications}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
        </div>
    );
};

export default NotificationsPage;