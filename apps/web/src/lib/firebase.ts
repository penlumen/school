import {initializeApp, getApps, type FirebaseApp} from 'firebase/app';
import {getMessaging, getToken, isSupported, type Messaging} from 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp | null {
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
    if (!app) {
        app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    }
    return app;
}

/**
 * Requests notification permission and returns an FCM registration token,
 * or null if Firebase isn't configured, unsupported, or permission was denied.
 * Safe to call repeatedly - it's a no-op once already granted/denied.
 */
export async function requestFcmToken(): Promise<string | null> {
    try {
        if (typeof window === 'undefined') return null;
        if (!(await isSupported())) return null;

        const firebaseApp = getFirebaseApp();
        if (!firebaseApp) return null;

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return null;

        const swParams = new URLSearchParams(
            Object.fromEntries(
                Object.entries(firebaseConfig).filter(([, v]) => !!v) as [string, string][]
            )
        );
        const registration = await navigator.serviceWorker.register(
            `/firebase-messaging-sw.js?${swParams.toString()}`
        );
        const messaging: Messaging = getMessaging(firebaseApp);

        return await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
        });
    } catch {
        // Firebase not configured, browser unsupported, or permission flow failed -
        // in-app notifications keep working regardless.
        return null;
    }
}
