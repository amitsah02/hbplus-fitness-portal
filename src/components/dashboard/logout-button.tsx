import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { logout } from '../../lib/auth';

type Props = {
  /** "header" is the small top-bar button, "full" the wide button. */
  variant?: 'header' | 'full';
  compact?: boolean;
};

/**
 * Signs the user out. The route guard in app/_layout.tsx moves the
 * user back to the login screen once the session is cleared.
 */
export function LogoutButton({ variant = 'header', compact = false }: Props) {
  const [loggingOut, setLoggingOut] = useState(false);
  const full = variant === 'full';

  const handlePress = async () => {
    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const label = full
    ? loggingOut
      ? 'Logging out...'
      : 'Logout from Account'
    : loggingOut
      ? '...'
      : 'Logout';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        full && styles.full,
        compact && styles.compact,
        loggingOut && styles.disabled,
      ]}
      onPress={handlePress}
      disabled={loggingOut}
      accessibilityRole="button"
      accessibilityLabel="Logout"
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E52525',
    borderRadius: 10,
    paddingHorizontal: 23,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { padding: 15, marginTop: 20 },
  compact: { paddingHorizontal: 11, paddingVertical: 11, borderRadius: 9 },
  disabled: { opacity: 0.7 },
  text: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
