import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

const ChatBubbleSkeleton = ({ isSender }: any) => (
  <View
    style={[
      styles.bubbleContainer,
      isSender ? styles.rightAlign : styles.leftAlign,
    ]}
  >
    <View
      style={[
        styles.bubble,
        isSender ? styles.senderBubble : styles.receiverBubble,
        { width: `${Math.floor(Math.random() * 20) + 30}%` }, // random width
      ]}
    />
  </View>
);

const ChatDetailSkeleton = () => {
  const dummyData = Array(6).fill(0);

  return (
    <FlatList
      data={dummyData}
      keyExtractor={(_, i) => `chat-bubble-${i}`}
      contentContainerStyle={styles.container}
      renderItem={({ index }) => (
        <ChatBubbleSkeleton isSender={index % 2 === 0} />
      )}
    />
  );
};

export default ChatDetailSkeleton;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  bubbleContainer: {
    marginVertical: 8,
    flexDirection: 'row',
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  bubble: {
    height: 40,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
  senderBubble: {
    backgroundColor: '#d0d0d0',
  },
  receiverBubble: {
    backgroundColor: '#eee',
  },
});
