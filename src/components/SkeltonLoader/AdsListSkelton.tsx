/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Skeleton = () => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={styles.title} />
        <View style={styles.address} />
        <View style={styles.price} />
      </View>
      <View style={styles.status} />
    </View>
    <View style={styles.metaRow}>
      <View style={styles.circle} />
      <View style={styles.metaText} />
    </View>
    <View style={styles.buttonRow}>
      <View style={styles.button} />
      <View style={styles.button} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 10,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  title: {
    width: 160,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 6,
  },
  address: {
    width: 120,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 6,
  },
  price: {
    width: 80,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  status: {
    width: 50,
    height: 20,
    backgroundColor: '#d1f0d1',
    borderRadius: 10,
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  metaText: {
    width: 120,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    width: '48%',
    height: 35,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
});

export default Skeleton;
