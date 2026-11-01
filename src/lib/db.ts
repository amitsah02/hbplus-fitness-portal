import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';

import app from './firebase';

// Auto-detecting long polling keeps Firestore reliable on React Native and
// behind strict networks. initializeFirestore can only run once, so fall
// back to getFirestore if fast refresh runs this file again.
function createDb(): Firestore {
  try {
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return getFirestore(app);
  }
}

export const db = createDb();
