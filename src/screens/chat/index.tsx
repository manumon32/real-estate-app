// MessageCard.tsx
import React from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView} from 'react-native';

interface MessageCardProps {
  name: string;
  message: string;
  time: string;
  avatarUrl: string;
  unreadCount?: number;
}

const MessageCard: React.FC<MessageCardProps> = ({
  name,
  message,
  time,
  avatarUrl,
  unreadCount = 0,
}) => {
  return (
    <View style={styles.container}>
      <Image
        style={{height: 56, width: 56, borderRadius: 50}}
        source={{uri: avatarUrl}}
      />
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </View>
  );
};

const Chat = React.memo(({}: any) => {
  return (
    <SafeAreaView>
      <MessageCard
        name={'Manu'}
        message={'Hi'}
        time={'10.24'}
        unreadCount={10}
        avatarUrl={
          'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_items_boosted&w=740'
        }
      />
      <MessageCard
        name={'Vishnu'}
        message={'Hi'}
        time={'10.24'}
        unreadCount={1}
        avatarUrl={
          'https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png'
        }
      />
      <MessageCard
        name={'Nissam'}
        message={'Hi'}
        time={'10.24'}
        unreadCount={8}
        avatarUrl={
          'https://static.vecteezy.com/system/resources/previews/048/216/761/non_2x/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png'
        }
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1e1e1e',
  },
  time: {
    fontSize: 12,
    color: '#2F8D79',
  },
  message: {
    color: '#444',
    fontSize: 13,
  },
  badge: {
    backgroundColor: '#2a9d8f',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    top:10
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default Chat;
