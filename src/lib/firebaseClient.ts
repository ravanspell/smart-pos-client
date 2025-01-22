import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
    try {
        const fcmMessaging = await messaging();
        if (fcmMessaging) {
            const token = await getToken(fcmMessaging, {
                vapidKey: 'BCvwYPm2GlegGUjbJTDc_U2WhO9LsMoetWquu9cc7kKzL7q9TKoeeWRyqax_a4Rle3Y5K5feQ5QU2dEZZfjNFgY' // process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
            });
            return token;
        }
        return null;
    } catch (err) {
        console.error("An error occurred while fetching the token:", err);
        return null;
    }
};

export { app, messaging };