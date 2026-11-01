import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { NAV_ITEMS, type Section } from './nav-items';

type Props = {
  active: Section;
  onSelect: (section: Section) => void;
  isAdmin: boolean;
};

/** Navigation links shared by the desktop sidebar and the mobile menu. */
export function NavList({ active, onSelect, isAdmin }: Props) {
  return (
    <View style={styles.list}>
      {NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin).map((item) => {
        const selected = active === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.item, selected && styles.activeItem]}
            onPress={() => onSelect(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={[styles.text, selected && styles.activeText]}>
              {item.key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 14,
  },
  activeItem: { backgroundColor: '#294A78' },
  icon: { color: '#9BC9FF', fontSize: 20, width: 22 },
  text: { color: '#D7E5F8', fontSize: 14 },
  activeText: { color: '#FFFFFF', fontWeight: '800' },
});
