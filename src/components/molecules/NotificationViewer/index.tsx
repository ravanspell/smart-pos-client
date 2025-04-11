'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/atoms/Sheet';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import NotificationCard, { Notification } from '@/components/molecules/NotificationCard';
import NotificationIcon from '@/components/atoms/NotificationIcon';

interface NotificationViewerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

/**
 * NotificationViewer component displays a list of notifications in a slide-out sheet
 * 
 */
const NotificationViewer: React.FC<NotificationViewerProps> = ({
  isOpen,
  setIsOpen,
  notifications,
  setNotifications
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');


  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'important') return notification.priority === 'high';
    return true;
  });

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <SheetTitle>Notifications</SheetTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="border-b px-4 py-2 flex space-x-1">
          <Button
            variant={filter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
          <Button
            variant={filter === 'important' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('important')}
          >
            Important
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 h-[calc(100vh-8rem)]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
              <Bell className="h-10 w-10 text-gray-300 mb-2" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  icon={<NotificationIcon type={notification.type} />}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationViewer; 