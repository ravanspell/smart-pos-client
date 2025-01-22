import React, { useState, useEffect } from 'react';
import { messaging } from '@/lib/firebaseClient';
import { onMessage, Unsubscribe } from 'firebase/messaging';
import { AlertDialogCustom } from '@/components/molecules/AlertDialog';

const NotificationDisplay: React.FC = () => {
    const [notifications, setNotifications] = useState<{ title: string; body: string }[]>([]);
    const [showPermissionDialog, setShowPermissionDialog] = useState(false);

    const grantBrowserPermissions = async (): Promise<any> => {
        await Notification.requestPermission();
    }

    const handleRegisterNotificationServiceWorker = async (): Promise<void> => {
        try {
            const registrationRes = await navigator.serviceWorker
                .register('/firebase-messaging-sw.js', { scope: '/' });
            console.log('Service Worker registered with scope:', registrationRes.scope);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    const checkAndTriggerForNotificationPermission = ():void => {
        if (Notification.permission !== "granted") {
            setShowPermissionDialog(true);
        }
    }

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            handleRegisterNotificationServiceWorker();
            checkAndTriggerForNotificationPermission();
        }
    }, []);

    useEffect(() => {
        const setupListener = async () => {
            const m = await messaging();
            if (!m) return;

            // Register a listener for incoming FCM messages.
            const unsubscribe = onMessage(m, (payload) => {
                if (Notification.permission !== "granted") return;

                console.log("Foreground push notification received:", payload);
                const link = payload.fcmOptions?.link || payload.data?.link;
                // --------------------------------------------
                // Disable this if you only want toast notifications.
                const n = new Notification(
                  payload.notification?.title || "New message",
                  {
                    body: payload.notification?.body || "This is a new message",
                    data: link ? { url: link } : undefined,
                  }
                );

                // Handle notification click event to navigate to a link if present.
                n.onclick = (event) => {
                  event.preventDefault();
                  const link = (event.target as any)?.data?.url;
                  if (link) {
                    // router.push(link);
                    console.log("link--->", link);
                  } else {
                    console.log("No link found in the notification payload");
                  }
                };
                // --------------------------------------------
            });

            return unsubscribe;
        };

        let unsubscribe: Unsubscribe | null = null;

        setupListener().then((unsub) => {
            if (unsub) {
                unsubscribe = unsub;
            }
        }).catch((re) => console.log('logggg --> :', re));

        // Cleanup the listener when the component unmounts.
        return () => unsubscribe?.();
    }, []);

    return (
        <div className="notification-container">
            {notifications.map((notification, index) => (
                <div key={index} className="notification">
                    <h4>{notification.title}</h4>
                    <p>{notification.body}</p>
                </div>
            ))}
            <style jsx>{`
        .notification-container {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 1000;
        }
        .notification {
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 10px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
      `}</style>
            <AlertDialogCustom
                title='Enable Notifications?'
                open={showPermissionDialog}
                onOpenChange={setShowPermissionDialog}
                description='Stay updated with important messages and events. You can always manage this in your browser settings.'
                onConfirm={grantBrowserPermissions}
                onCancel={() => setShowPermissionDialog(false)}
            />
        </div>
    );
};

export default NotificationDisplay;