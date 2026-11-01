import { StyleSheet, Text, View } from 'react-native';

import type { UserProfile } from '../../lib/user-profile';
import type { UserRole } from '../../lib/users';
import { Avatar } from '../ui/avatar';
import { InfoRow } from '../ui/info-row';
import { Panel } from '../ui/panel';

export function ProfileDetails({ profile, role }: { profile: UserProfile; role: UserRole }) {
  return (
    <Panel>
      <Text style={styles.pageTitle}>My Profile</Text>
      <Text style={styles.muted}>Your authenticated Google account information.</Text>

      <View style={styles.header}>
        <Avatar initial={profile.initial} size="large" />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.muted}>{profile.email}</Text>
        </View>
      </View>

      <InfoRow label="Full Name" value={profile.fullName} />
      <InfoRow label="Email Address" value={profile.email} />
      <InfoRow label="Firebase User ID" value={profile.uid} />
      <InfoRow label="Login Provider" value="Google" />
      <InfoRow label="Access Role" value={role === 'admin' ? 'Admin' : 'User'} />
      <InfoRow
        label="Email Verification"
        value={profile.emailVerified ? 'Verified' : 'Not verified'}
      />
    </Panel>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: '#172B4D', fontSize: 25, fontWeight: '900', marginBottom: 8 },
  muted: { color: '#8293AC', fontSize: 12, marginTop: 5 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 15, marginVertical: 25 },
  headerInfo: { flex: 1, minWidth: 0 },
  name: { color: '#192C4C', fontWeight: '900', fontSize: 16 },
});
