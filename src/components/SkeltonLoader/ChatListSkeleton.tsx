import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

const ChatSkeletonItem = () => (
  <View style={styles.chatItem}>
    <View style={styles.avatar} />
    <View style={styles.chatContent}>
      <View style={styles.nameTimeRow}>
        <View style={styles.nameLine} />
      </View>
      <View style={styles.messageLine} />
    </View>
  </View>
);

const ChatListSkeleton = () => {
  return (
    <FlatList
      data={Array(6).fill(0)}
      keyExtractor={(_, index) => `chat-skel-${index}`}
      contentContainerStyle={{ padding: 16 }}
      renderItem={() => <ChatSkeletonItem />}
    />
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
    padding:10
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
  },
  chatContent: {
    flex: 1,
    marginLeft: 12,
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  nameLine: {
    width: '50%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  timeLine: {
    width: 40,
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  messageLine: {
    width: '80%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
});

export default ChatListSkeleton;
