import { StyleSheet, Text, View } from 'react-native';

export function DashboardFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>HB+ Fitness Portal</Text>
      <Text style={styles.text}>Stay Fit  Stay Active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  text: { color: '#8A9BB3', fontSize: 11 },
});
