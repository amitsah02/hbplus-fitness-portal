import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { listUsers, setUserRole, type UserRecord } from '../../lib/users';
import { useAuth } from '../../providers/auth-provider';
import { Panel } from '../ui/panel';

/**
 * Admin-only section. The role check here only hides the screen.
 * The real protection is in firestore.rules, which reject non-admins.
 */
export function UserManagement() {
  const { isAdmin, user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setUsers(await listUsers());
    } catch {
      setError('Could not load users. Check your connection and Firestore rules.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (!isAdmin) {
    return (
      <Panel>
        <Text style={styles.pageTitle}>Access denied</Text>
        <Text style={styles.muted}>This section is only available to administrators.</Text>
      </Panel>
    );
  }

  const changeRole = async (target: UserRecord) => {
    const next = target.role === 'admin' ? 'user' : 'admin';
    try {
      setBusyUid(target.uid);
      setError('');
      await setUserRole(target.uid, next);
      setUsers((previous) =>
        previous.map((item) => (item.uid === target.uid ? { ...item, role: next } : item)),
      );
    } catch {
      setError('Could not update the role. Please try again.');
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <Panel>
      <Text style={styles.pageTitle}>User Management</Text>
      <Text style={styles.muted}>
        Everyone who has signed in. Promote a user to admin or return them to user.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#2563EB" />
      ) : users.length === 0 ? (
        <Text style={[styles.muted, styles.empty]}>No users yet.</Text>
      ) : (
        users.map((item) => {
          const isSelf = item.uid === user?.uid;
          const busy = busyUid === item.uid;
          return (
            <View key={item.uid} style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.displayName || item.email}
                  {isSelf ? '  (you)' : ''}
                </Text>
                <Text style={styles.muted} numberOfLines={1}>
                  {item.email}
                </Text>
                <Text style={styles.meta}>
                  Last login: {item.lastLoginAt ? item.lastLoginAt.toLocaleString() : 'n/a'}
                </Text>
              </View>

              <View style={styles.actions}>
                <Text style={[styles.badge, item.role === 'admin' && styles.adminBadge]}>
                  {item.role === 'admin' ? 'Admin' : 'User'}
                </Text>
                <TouchableOpacity
                  style={[styles.button, (isSelf || busy) && styles.disabled]}
                  onPress={() => changeRole(item)}
                  disabled={isSelf || busy}
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>
                    {busy ? '...' : item.role === 'admin' ? 'Make user' : 'Make admin'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </Panel>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: '#172B4D', fontSize: 25, fontWeight: '900', marginBottom: 8 },
  muted: { color: '#8293AC', fontSize: 12, marginTop: 5 },
  error: { color: '#DC2626', fontSize: 13, marginTop: 14 },
  loader: { marginVertical: 30 },
  empty: { marginTop: 24 },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF1F7',
    paddingVertical: 14,
    marginTop: 6,
  },
  info: { flex: 1, minWidth: 180 },
  name: { color: '#192C4C', fontWeight: '900', fontSize: 14 },
  meta: { color: '#8B9BB2', fontSize: 11, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    color: '#2563EB',
    backgroundColor: '#E5EEFF',
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: '800',
  },
  adminBadge: { color: '#16843E', backgroundColor: '#DDF8E8' },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabled: { opacity: 0.45 },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
});
