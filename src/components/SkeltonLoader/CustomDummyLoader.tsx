import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const CustomDummyLoader = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Stats Row */}
      <View style={styles.row}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.statCard}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.statText} />
            <View style={styles.statSubText} />
          </View>
        ))}
      </View>

      {/* Tags Row */}
      <View style={styles.tagRow}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.tag} />
        ))}
      </View>

      {/* EMI Button */}
      <View style={styles.button} />

      {/* Description */}
      <View style={styles.sectionTitle} />
      <View style={styles.textLine} />
      <View style={styles.textLine} />
      <View style={[styles.textLine, { width: '70%' }]} />

      {/* Amenities */}
      <View style={[styles.sectionTitle, { marginTop: 30 }]} />
      <View style={styles.tagRow}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.amenityTag} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    borderRadius: 12,
    marginBottom: 8,
  },
  statText: {
    width: 40,
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 4,
  },
  statSubText: {
    width: 30,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  tag: {
    height: 30,
    width: 100,
    backgroundColor: '#eee',
    borderRadius: 16,
  },
  button: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#ccf1e6',
    marginTop: 20,
  },
  sectionTitle: {
    height: 14,
    width: 100,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginTop: 24,
    marginBottom: 12,
  },
  textLine: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
    width: '90%',
  },
  amenityTag: {
    height: 30,
    width: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
});

export default CustomDummyLoader;
