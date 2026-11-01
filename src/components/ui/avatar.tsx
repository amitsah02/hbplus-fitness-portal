import { StyleSheet, Text, View } from 'react-native';

export function Avatar({
  initial,
  size = 'small',
}: {
  initial: string;
  size?: 'small' | 'large';
}) {
  const large = size === 'large';
  return (
    <View style={large ? styles.large : styles.small}>
      <Text style={large ? styles.largeText : styles.smallText}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  small: {
    width: 42,
    height: 42,
    borderRadius: 25,
    backgroundColor: '#DCEBFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: { color: '#2563EB', fontWeight: '900', fontSize: 17 },
  large: {
    width: 62,
    height: 62,
    borderRadius: 40,
    backgroundColor: '#DCEBFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeText: { color: '#2563EB', fontSize: 25, fontWeight: '900' },
});
