import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DashboardFooter } from '../components/dashboard/dashboard-footer';
import { FitnessResources } from '../components/dashboard/fitness-resources';
import { Header } from '../components/dashboard/header';
import { MobileNav } from '../components/dashboard/mobile-nav';
import type { Section } from '../components/dashboard/nav-items';
import { OverviewSection } from '../components/dashboard/overview-section';
import { ProfileDetails } from '../components/dashboard/profile-details';
import { SecuritySection } from '../components/dashboard/security-section';
import { Sidebar } from '../components/dashboard/sidebar';
import { UserManagement } from '../components/dashboard/user-management';
import { useIsMobile } from '../hooks/use-is-mobile';
import { getUserProfile } from '../lib/user-profile';
import { useAuth } from '../providers/auth-provider';

/**
 * Dashboard screen. Access control lives in app/_layout.tsx, so this file
 * only arranges layout and picks which section to show.
 */
export default function DashboardScreen() {
  const { user, role, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const insets = useSafeAreaInsets();

  const [activeSection, setActiveSection] = useState<Section>('Overview');
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const profile = getUserProfile(user);

  // If admin rights are removed while open, fall back to a normal section.
  const section: Section =
    activeSection === 'User Management' && !isAdmin ? 'Overview' : activeSection;

  const selectSection = (section: Section) => {
    setActiveSection(section);
    setMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      {!isMobile && <Sidebar active={section} onSelect={selectSection} isAdmin={isAdmin} />}

      <View style={styles.main}>
        <Header
          email={profile.email}
          initial={profile.initial}
          role={role}
          isMobile={isMobile}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((open) => !open)}
        />

        {isMobile && menuOpen && (
          <MobileNav active={section} onSelect={selectSection} isAdmin={isAdmin} />
        )}

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            isMobile && styles.mobileContent,
            { paddingBottom: (isMobile ? 30 : 40) + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {section === 'Overview' && (
            <OverviewSection profile={profile} role={role} isMobile={isMobile} />
          )}
          {section === 'My Profile' && <ProfileDetails profile={profile} role={role} />}
          {section === 'Fitness Resources' && <FitnessResources isMobile={isMobile} />}
          {section === 'Security' && (
            <SecuritySection emailVerified={profile.emailVerified} role={role} />
          )}
          {section === 'User Management' && <UserManagement />}

          <DashboardFooter />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F7FD',
    minHeight: '100%',
  },
  main: { flex: 1, minWidth: 0 },
  scroll: { flex: 1 },
  content: { padding: 28 },
  mobileContent: { padding: 14 },
});
