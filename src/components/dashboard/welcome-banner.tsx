import { StyleSheet, Text, View } from 'react-native';

export function WelcomeBanner({
  fullName,
  isMobile,
}: {
  fullName: string;
  isMobile: boolean;
}) {
  return (
    <View style={[styles.card, isMobile && styles.mobileCard]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome back,</Text>
        <Text style={styles.name}>{fullName}!</Text>
        <Text style={styles.description}>
          Access your fitness portal, manage your profile, and explore wellness
          resources.
        </Text>
      </View>

      <View style={[styles.artwork, isMobile && styles.mobileArtwork]}>
        <Text style={styles.runner}>🏃</Text>
        <Text style={styles.artworkBrand}>
          HB<Text style={styles.green}>+</Text>
        </Text>
        <Text style={styles.artworkSubtitle}>FITNESS PORTAL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0EAF8',
    padding: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 25,
    marginBottom: 28,
  },
  mobileCard: {
    padding: 19,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 16,
  },
  textContainer: { flex: 1, minWidth: 0 },
  title: { color: '#142746', fontSize: 32, fontWeight: '900', flexWrap: 'wrap' },
  name: { color: '#2563D9', fontSize: 34, fontWeight: '900', flexWrap: 'wrap' },
  description: {
    color: '#7185A4',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 520,
  },
  artwork: {
    width: 190,
    minHeight: 160,
    backgroundColor: '#EAF4FF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileArtwork: { width: '100%' },
  runner: { fontSize: 43 },
  artworkBrand: { color: '#142746', fontSize: 27, fontWeight: '900', marginTop: 5 },
  green: { color: '#27C77B' },
  artworkSubtitle: {
    color: '#6682A8',
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
