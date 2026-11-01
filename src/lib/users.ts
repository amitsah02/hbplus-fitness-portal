import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';

import { db } from './db';

export type UserRole = 'admin' | 'user';

export type UserRecord = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: Date | null;
  lastLoginAt: Date | null;
};

const USERS = 'users';

function toDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null;
}

function toRecord(uid: string, data: DocumentData): UserRecord {
  return {
    uid,
    email: String(data.email ?? ''),
    displayName: String(data.displayName ?? ''),
    photoURL: String(data.photoURL ?? ''),
    // Anything that is not exactly "admin" is treated as a normal user.
    role: data.role === 'admin' ? 'admin' : 'user',
    createdAt: toDate(data.createdAt),
    lastLoginAt: toDate(data.lastLoginAt),
  };
}

/**
 * Creates the user's record on first login and refreshes it on later logins.
 * New users always start as "user". Firestore rules block anyone from
 * granting themselves a higher role.
 */
export async function ensureUserRecord(user: User): Promise<UserRecord> {
  const ref = doc(db, USERS, user.uid);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      role: 'user',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  } else {
    await updateDoc(ref, {
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      lastLoginAt: serverTimestamp(),
    });
  }

  const fresh = await getDoc(ref);
  return toRecord(fresh.id, fresh.data() ?? {});
}

/** Admin only. Firestore rules reject this for everyone else. */
export async function listUsers(): Promise<UserRecord[]> {
  const snapshot = await getDocs(
    query(collection(db, USERS), orderBy('lastLoginAt', 'desc')),
  );
  return snapshot.docs.map((d) => toRecord(d.id, d.data()));
}

/** Admin only. Firestore rules reject this for everyone else. */
export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, USERS, uid), { role });
}
