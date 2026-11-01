import { StyleSheet, Text, View } from 'react-native';

import { ALLOWED_EMAIL_DOMAIN } from '../../config/auth';
import type { UserRole } from '../../lib/users';
import { InfoRow } from '../ui/info-row';
import { Panel } from '../ui/panel';
import { LogoutButton } from './logout-button';

export function SecuritySection({
  emailVerified,
  role,
}: {
  emailVerified: boolean;
  role: UserRole;
}) {
  return (
    <Panel>
      <Text style={styles.pageTitle}>Security</Text>
      <Text style={styles.muted}>Review your account authentication details.</Text>

      <InfoRow label="Authentication" value="Google OAuth 2.0" />
      <InfoRow label="Access Status" value="Authorized" />
      <InfoRow label="Access Role" value={role === 'admin' ? 'Admin' : 'User'} />
      <InfoRow label="Allowed Domain" value={ALLOWED_EMAIL_DOMAIN} />
      <InfoRow
        label="Email Verification"
        value={emailVerified ? 'Verified' : 'Not verified'}
      />

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>✓ Google Authentication Active</Text>
        <Text style={styles.muted}>
          Your account is authenticated through Firebase Authentication.
        </Text>
      </View>

      <LogoutButton variant="full" />
    </Panel>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: '#172B4D', fontSize: 25, fontWeight: '900', marginBottom: 8 },
  muted: { color: '#8293AC', fontSize: 12, marginTop: 5 },
  notice: {
    backgroundColor: '#E9F8EF',
    padding: 17,
    borderRadius: 12,
    marginTop: 22,
  },
  noticeTitle: { color: '#16843E', fontWeight: '900', marginBottom: 6 },
});
