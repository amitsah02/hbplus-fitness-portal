import { StyleSheet, Text, View } from 'react-native';

import type { UserProfile } from '../../lib/user-profile';
import type { UserRole } from '../../lib/users';
import { Avatar } from '../ui/avatar';
import { InfoRow } from '../ui/info-row';
import { Panel } from '../ui/panel';
import { AccountOverviewCards } from './account-overview-cards';
import { WelcomeBanner } from './welcome-banner';

const JOURNEY_POINTS = [
  'Secure and authorized access',
  'Personalized fitness workspace',
  'Wellness portal access',
  'A healthier, more active you',
];

export function OverviewSection({
  profile,
  role,
  isMobile,
}: {
  profile: UserProfile;
  role: UserRole;
  isMobile: boolean;
}) {
  return (
    <>
      <WelcomeBanner fullName={profile.fullName} isMobile={isMobile} />
      <AccountOverviewCards emailVerified={profile.emailVerified} isMobile={isMobile} />

      <View style={[styles.lowerGrid, isMobile && styles.mobileLowerGrid]}>
        <Panel>
          <Text style={styles.panelTitle}>◉ Your Account Details</Text>
          <View style={styles.profileHeader}>
            <Avatar initial={profile.initial} size="large" />
            <View style={styles.profileHeaderInfo}>
              <Text style={styles.profileName}>{profile.fullName}</Text>
              <Text style={styles.muted}>{profile.email}</Text>
            </View>
            <Text style={styles.activeBadge}>Active</Text>
          </View>
          <InfoRow label="Full Name" value={profile.fullName} />
          <InfoRow label="Email Address" value={profile.email} />
          <InfoRow label="Authentication Provider" value="Google" />
          <InfoRow label="Access Role" value={role === 'admin' ? 'Admin' : 'User'} />
          <InfoRow label="Email Verified" value={profile.emailVerified ? 'Yes' : 'No'} />
        </Panel>

        <View style={styles.journeyPanel}>
          <View style={styles.emojiStrip}>
            <Text style={styles.emoji}>🏋️</Text>
            <Text style={styles.emoji}>💪</Text>
            <Text style={styles.emoji}>🥤</Text>
          </View>
          <Text style={styles.panelTitle}>Your Fitness Journey with HB+</Text>
          {JOURNEY_POINTS.map((item) => (
            <Text key={item} style={styles.point}>
              ✓  {item}
            </Text>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  lowerGrid: { flexDirection: 'row', alignItems: 'stretch', gap: 16 },
  mobileLowerGrid: { flexDirection: 'column' },
  panelTitle: { color: '#172B4D', fontSize: 17, fontWeight: '900', marginBottom: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  profileHeaderInfo: { flex: 1, minWidth: 0 },
  profileName: { color: '#192C4C', fontWeight: '900', fontSize: 16 },
  muted: { color: '#8293AC', fontSize: 12, marginTop: 5 },
  activeBadge: {
    color: '#16843E',
    backgroundColor: '#DDF8E8',
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: '800',
  },
  journeyPanel: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#EAF3FF',
    borderRadius: 17,
    padding: 20,
    marginBottom: 16,
  },
  emojiStrip: {
    backgroundColor: '#D8E9FF',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emoji: { fontSize: 27 },
  point: { color: '#526A8B', fontSize: 12, marginTop: 11 },
});
