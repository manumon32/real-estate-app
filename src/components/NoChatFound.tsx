import { Fonts } from '@constants/font';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NoChats = ({ onExplore }: { onExplore: () => void }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="message-text-outline"
        size={64}
        color="#B0B0B0"
        style={styles.icon}
      />
      <Text style={styles.title}>No Chats Found</Text>
      <Text style={styles.subtitle}>
        Looks like you haven’t started any conversations yet.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onExplore}>
        <Text style={styles.buttonText}>Explore More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    fontFamily:Fonts.BOLD,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    fontFamily:Fonts.REGULAR,
  },
  button: {
    backgroundColor: '#00C897',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    fontFamily:Fonts.BOLD,
  },
});

export default NoChats;
