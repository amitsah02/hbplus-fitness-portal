// Android and iOS build. Persists the session in AsyncStorage so the user
// stays signed in after the app is closed.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import type { Auth, Persistence } from 'firebase/auth';

import { firebaseConfig } from './firebase-config';

// Metro resolves the React Native build of firebase/auth, which exports
// getReactNativePersistence. The default TypeScript types do not include it.
const { getReactNativePersistence } = FirebaseAuth as unknown as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

const isFirstInit = getApps().length === 0;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// initializeAuth may only run once. On fast refresh, fall back to getAuth.
export const auth: Auth = isFirstInit
  ? FirebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  : FirebaseAuth.getAuth(app);

export default app;
