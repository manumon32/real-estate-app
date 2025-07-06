import React from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px padding on both sides + 16px gap

const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.image} />
    <View style={styles.line} />
    <View style={[styles.line, { width: '60%' }]} />
    <View style={styles.iconRow}>
      <View style={styles.iconBlock} />
      <View style={styles.iconBlock} />
    </View>
    <View style={styles.price} />
  </View>
);

const HomepageSkelton = () => {
  return (
    <FlatList
      data={Array(4)}
      keyExtractor={(_, i) => `skeleton-${i}`}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
      contentContainerStyle={{ padding: 16 }}
      renderItem={() => <SkeletonCard />}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    padding: 8,
    margin:8
  },
  image: {
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  line: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginBottom: 6,
    width: '80%',
    alignSelf: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    paddingHorizontal: 4,
  },
  iconBlock: {
    width: '48%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  price: {
    height: 12,
    backgroundColor: '#bbb',
    borderRadius: 6,
    marginTop: 6,
    width: '50%',
    alignSelf: 'center',
  },
});

export default HomepageSkelton;
