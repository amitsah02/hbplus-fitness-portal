import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

/** White bordered card used across dashboard sections. */
export function Panel({ children }: { children: ReactNode }) {
  return <View style={styles.panel}>{children}</View>;
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EAF6',
    borderRadius: 17,
    padding: 20,
    marginBottom: 16,
  },
});
