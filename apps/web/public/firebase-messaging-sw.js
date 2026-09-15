// Must live at the site root (public/firebase-messaging-sw.js) - a Firebase
// requirement. Service workers can't read process.env, so the config is
// passed as query params on the registration URL (see src/lib/firebase.ts)
// and parsed here instead of hardcoding/templating values into this file.
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const {title, body} = payload.notification || {};
  self.registration.showNotification(title || 'Penlumen', {
    body: body || '',
    icon: '/icon.png',
  });
});
