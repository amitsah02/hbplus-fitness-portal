import { StyleSheet, View } from 'react-native';

import { NavList } from './nav-list';
import type { Section } from './nav-items';

type Props = {
  active: Section;
  onSelect: (section: Section) => void;
  isAdmin: boolean;
};

/** Dropdown menu shown under the header on small screens. */
export function MobileNav({ active, onSelect, isAdmin }: Props) {
  return (
    <View style={styles.menu}>
      <NavList active={active} onSelect={onSelect} isAdmin={isAdmin} />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: { backgroundColor: '#101F3B', padding: 12 },
});
