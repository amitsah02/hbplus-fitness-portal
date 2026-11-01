import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { UserRole } from '../../lib/users';
import { Avatar } from '../ui/avatar';
import { LogoutButton } from './logout-button';

type Props = {
  email: string;
  initial: string;
  role: UserRole;
  isMobile: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function Header({ email, initial, role, isMobile, menuOpen, onToggleMenu }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.topbar,
        isMobile && styles.mobileTopbar,
        { paddingTop: (isMobile ? 10 : 12) + insets.top },
      ]}
    >
      <View style={styles.left}>
        {isMobile && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={onToggleMenu}
            accessibilityRole="button"
            accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <Text style={styles.menuIcon}>{menuOpen ? '✕' : '☰'}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>HB+ Fitness Portal</Text>
          {!isMobile && (
            <Text style={styles.subtitle}>Your Wellness & Fitness Workspace</Text>
          )}
        </View>
      </View>

      <View style={styles.right}>
        <Avatar initial={initial} />
        {!isMobile && <Text style={styles.email}>{email}</Text>}
        {!isMobile && (
          <Text style={[styles.role, role === 'admin' && styles.adminRole]}>
            {role === 'admin' ? 'Admin' : 'User'}
          </Text>
        )}
        <LogoutButton variant="header" compact={isMobile} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    minHeight: 82,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E4EBF5',
    gap: 10,
  },
  mobileTopbar: { minHeight: 76, paddingHorizontal: 9, paddingBottom: 10, gap: 5 },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    gap: 10,
  },
  titleContainer: { flexShrink: 1 },
  title: { color: '#142746', fontSize: 19, fontWeight: '900' },
  subtitle: { color: '#7185A4', fontSize: 13, marginTop: 5 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 0 },
  email: { color: '#647895', fontSize: 13 },
  role: {
    color: '#2563EB',
    backgroundColor: '#E5EEFF',
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: '800',
  },
  adminRole: { color: '#16843E', backgroundColor: '#DDF8E8' },
  menuButton: {
    width: 42,
    height: 42,
    backgroundColor: '#EAF2FF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: { color: '#17345C', fontSize: 22 },
});
