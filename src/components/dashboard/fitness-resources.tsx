import { StyleSheet, Text, View } from 'react-native';

type Resource = { icon: string; title: string; description: string };

const RESOURCES: Resource[] = [
  {
    icon: '🏋️',
    title: 'Strength Training',
    description: 'Learn about strength exercises and workout fundamentals.',
  },
  {
    icon: '🥗',
    title: 'Healthy Nutrition',
    description: 'Explore balanced nutrition and healthy eating habits.',
  },
  {
    icon: '🏃',
    title: 'Cardio & Fitness',
    description: 'Discover cardio activities and fitness basics.',
  },
  {
    icon: '🧘',
    title: 'Mental Wellness',
    description: 'Learn about relaxation, recovery and healthy routines.',
  },
];

export function ResourceCard({ icon, title, description }: Resource) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

export function FitnessResources({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <Text style={styles.pageTitle}>Fitness Resources</Text>
      <Text style={styles.muted}>Explore basic fitness and wellness information.</Text>

      <View style={[styles.grid, isMobile && styles.mobileGrid]}>
        {RESOURCES.map((resource) => (
          <ResourceCard key={resource.title} {...resource} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: { color: '#172B4D', fontSize: 25, fontWeight: '900', marginBottom: 8 },
  muted: { color: '#8293AC', fontSize: 12, marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 22 },
  mobileGrid: { flexDirection: 'column', flexWrap: 'nowrap' },
  
  card: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EAF6',
    borderRadius: 17,
    padding: 22,
    marginBottom: 5,
  },
  icon: { fontSize: 35, marginBottom: 15 },
  title: { color: '#172B4D', fontSize: 16, fontWeight: '900' },
  description: { color: '#7185A4', fontSize: 12, lineHeight: 19, marginTop: 9 },
});
