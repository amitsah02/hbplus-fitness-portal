import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavList } from './nav-list';
import type { Section } from './nav-items';

type Props = {
  active: Section;
  onSelect: (section: Section) => void;
  isAdmin: boolean;
};

/**
 * Desktop and tablet sidebar. It scrolls when the window is shorter than its
 * content, and pins the footer to the bottom when there is spare room.
 */
export function Sidebar({ active, onSelect, isAdmin }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.sidebar}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: 35 + insets.top, paddingBottom: 35 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.brandContainer}>
            <Text style={styles.brand}>
              HB<Text style={styles.green}>+</Text>
            </Text>
            <Text style={styles.brandSubtitle}>FITNESS PORTAL</Text>
          </View>

          <Text style={styles.navHeading}>WORKSPACE</Text>
          <NavList active={active} onSelect={onSelect} isAdmin={isAdmin} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>STAY FIT  STAY ACTIVE</Text>
          <Text style={styles.footerText}>Your wellness journey starts here.</Text>
          <Text style={styles.footerBrand}>
            HB<Text style={styles.green}>+</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: '#101F3B',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  brandContainer: { marginBottom: 45 },
  brand: { fontSize: 48, fontWeight: '900', color: '#FFFFFF' },
  green: { color: '#27C77B' },
  brandSubtitle: {
    color: '#A7C8F4',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 3,
  },
  navHeading: {
    color: '#8EA6C8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 18,
  },
  footer: { marginTop: 40 },
  footerTitle: { color: '#FFFFFF', fontWeight: '900', fontSize: 13 },
  footerText: {
    color: '#A7C8F4',
    marginTop: 12,
    lineHeight: 22,
    fontSize: 13,
  },
  footerBrand: {
    color: '#27C77B',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 25,
  },
});
