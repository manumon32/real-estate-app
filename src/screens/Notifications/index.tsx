import React, {useCallback, useState} from 'react';
import {View, StyleSheet, RefreshControl} from 'react-native';
import {Text, Card, Divider, useTheme, IconButton} from 'react-native-paper';
import {SwipeListView} from 'react-native-swipe-list-view';
import {SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDistanceToNow} from 'date-fns';
import CommonHeader from '@components/Header/CommonHeaderProfile';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import {useFocusEffect} from '@react-navigation/native';

type NotificationType = 'message' | 'offer' | 'listing' | 'system';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  entityType: string;
  entityId: string;
}

const getIconName = (type: NotificationType) => {
  switch (type) {
    case 'message':
      return 'message-text-outline';
    case 'offer':
      return 'tag-outline';
    case 'listing':
      return 'home-outline';
    default:
      return 'alert-circle-outline';
  }
};

export default function NotificationListSwipe() {
  const {colors} = useTheme();
  const {notifications_List, fetchNotifications, updateNotifications} =
    useBoundStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
    setTimeout(() => setRefreshing(false), 800);
  }, [fetchNotifications]);
  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  //   const markAllAsRead = () => {
  //     updateNotifications_List((prev) => prev.map((n) => ({ ...n, isRead: true })));
  //   };

  const deleteNotification = (rowKey: string) => {
    const newData = notifications_List.filter(
      (item: any) => item._id !== rowKey,
    );
    updateNotifications(newData);
  };

  const renderItem = (data: {item: Notification}) => {
    const item = data.item;
    return (
      <Card
        mode="contained"
        style={[
          styles.card,
          !item.read && {backgroundColor: colors.elevation.level1},
        ]}
        onPress={() => {
          const updated = notifications_List.map((n: any) =>
            n._id === item._id ? {...n, read: true} : n,
          );
          updateNotifications(updated);
        }}>
        <View style={styles.row}>
          <Icon
            name={getIconName(item.type)}
            size={24}
            color={item.read ? colors.onSurfaceDisabled : colors.primary}
          />
          <View style={{flex: 1}}>
            <Text
              variant="titleSmall"
              style={item.read ? styles.readTitle : styles.unreadTitle}>
              {item.title}
            </Text>
            <Text
              variant="bodySmall"
              numberOfLines={2}
              style={{
                fontFamily: Fonts.REGULAR,
              }}>
              {item.message}
            </Text>
          </View>
          <Text variant="labelSmall" style={styles.timeAgo}>
            {formatDistanceToNow(new Date(item.createdAt), {addSuffix: true})}
          </Text>
        </View>
      </Card>
    );
  };

  const renderHiddenItem = (data: {item: Notification}) => (
    <View style={styles.rowBack}>
      <IconButton
        icon="delete-outline"
        iconColor="#fff"
        containerColor="#d32f2f"
        size={24}
        onPress={() => deleteNotification(data.item._id)}
      />
    </View>
  );

  return (
    <SafeAreaView>
      <CommonHeader title="Notifications" textColor="#171717" />
      <SwipeListView
        data={notifications_List}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-70}
        disableRightSwipe
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="bell-off-outline" size={48} color={colors.outline} />
            <Text>No notifications yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 60,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  unreadTitle: {
    fontWeight: 'bold',
    fontFamily: Fonts.REGULAR,
  },
  readTitle: {
    color: '#999',
    fontFamily: Fonts.REGULAR,
  },
  timeAgo: {
    fontSize: 10,
    color: '#999',
    fontFamily: Fonts.REGULAR,
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
  },
});
