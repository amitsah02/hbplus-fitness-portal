import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { isAuthorizedUser } from '../lib/auth';
import { auth } from '../lib/firebase';
import { ensureUserRecord, type UserRecord, type UserRole } from '../lib/users';

type AuthContextValue = {
  /** The signed-in, authorized user, or null. */
  user: User | null;
  /** The user's database record (role, last login), or null if unavailable. */
  record: UserRecord | null;
  /** "admin" only when the database says so. Everything else is "user". */
  role: UserRole;
  isAdmin: boolean;
  /** True if the database record could not be loaded. */
  recordError: boolean;
  /** True until the saved session and the user record are resolved. */
  loading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [record, setRecord] = useState<UserRecord | null>(null);
  const [recordError, setRecordError] = useState(false);
  const [loading, setLoading] = useState(true);
  const runId = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const run = ++runId.current;

      if (!isAuthorizedUser(firebaseUser)) {
        // Wrong domain or unverified email: never expose the user to the app.
        setUser(null);
        setRecord(null);
        setRecordError(false);
        if (firebaseUser) {
          signOut(auth).catch(() => undefined);
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      setUser(firebaseUser);

      try {
        const loaded = await ensureUserRecord(firebaseUser);
        if (run !== runId.current) return;
        setRecord(loaded);
        setRecordError(false);
      } catch {
        if (run !== runId.current) return;
        // Fail closed: without a record the user is a plain "user".
        setRecord(null);
        setRecordError(true);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const role: UserRole = record?.role === 'admin' ? 'admin' : 'user';
    return {
      user,
      record,
      role,
      isAdmin: role === 'admin',
      recordError,
      loading,
      isAuthenticated: user !== null,
    };
  }, [user, record, recordError, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }
  return context;
}
