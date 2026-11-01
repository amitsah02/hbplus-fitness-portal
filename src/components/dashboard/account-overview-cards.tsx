import { StyleSheet, Text, View } from 'react-native';

import { ALLOWED_EMAIL_DOMAIN, IS_TESTING_DOMAIN } from '../../config/auth';

type StatCardProps = {
  icon: string;
  label: string;
  value: string;
  detail: string;
  green?: boolean;
};

export function StatCard({ icon, label, value, detail, green = false }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.icon, green && styles.greenIcon]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, green && styles.greenValue]}>{value}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
    </View>
  );
}

export function AccountOverviewCards({
  emailVerified,
  isMobile,
}: {
  emailVerified: boolean;
  isMobile: boolean;
}) {
  return (
    <>
      <Text style={styles.sectionTitle}>Account Overview</Text>
      <View style={[styles.grid, isMobile && styles.mobileGrid]}>
        <StatCard
          icon="♡"
          label="Account Status"
          value="Active"
          detail="Authenticated session"
          green
        />
        <StatCard
          icon="G"
          label="Login Provider"
          value="Google"
          detail="Google OAuth 2.0"
        />
        <StatCard
          icon="✉"
          label="Email Verification"
          value={emailVerified ? 'Verified' : 'Unverified'}
          detail="Google account status"
          green={emailVerified}
        />
        <StatCard
          icon="@"
          label="Access Domain"
          value={ALLOWED_EMAIL_DOMAIN.slice(1)}
          detail={IS_TESTING_DOMAIN ? 'Temporary testing domain' : 'Official HB+ domain'}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { color: '#192C4C', fontSize: 21, fontWeight: '900', marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 24 },
    mobileGrid: { flexDirection: 'column', flexWrap: 'nowrap' },
  card: {
    flex: 1,
    minWidth: 145,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EAF6',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 43,
    height: 43,
    borderRadius: 25,
    backgroundColor: '#E5EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenIcon: { backgroundColor: '#E0F8E9' },
  iconText: { color: '#2563EB', fontSize: 20, fontWeight: '800' },
  info: { flex: 1, minWidth: 0 },
  label: { color: '#8193AD', fontSize: 11 },
  value: { color: '#172B4D', fontSize: 17, fontWeight: '900', marginTop: 5 },
  greenValue: { color: '#16843E' },
  detail: { color: '#8B9BB2', fontSize: 10, marginTop: 4 },
});
