/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Text, Card, Divider, IconButton, useTheme} from 'react-native-paper';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDistanceToNow} from 'date-fns';
import CommonHeader from '@components/Header/CommonHeader';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {
  deleteNotificationsAPI,
  markAllReadNotificationsAPI,
} from '@api/services';
import {useTheme as useThemes} from '@theme/ThemeProvider';
import {INotification, navigateByNotification} from '../../firebase/notificationService';
import NoChats from '@components/NoChatFound';


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
  const navigation = useNavigation();
  const {
    notifications_Loading,
    notifications_List,
    fetchNotifications,
    updateNotifications,
    token,
    clientId,
    bearerToken,
    updateNotificationCount,
    setFilters,
  } = useBoundStore();
  const {theme} = useThemes();
  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const [selectAll, setSelectall] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>([]);

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

  const toggleSelectChat = useCallback((id: string) => {
    console.log('Toggling selection for chat ID:', id);
    setSelectedNotification((prev: any) =>
      prev.includes(id) ? prev.filter((cid: any) => cid !== id) : [...prev, id],
    );
  }, []);

  const clearSelection = () => {
    setIsSelectionMode(false);
    setSelectedNotification([]);
  };

  //   const markAllAsRead = () => {
  //     updateNotifications_List((prev) => prev.map((n) => ({ ...n, isRead: true })));
  //   };

  const deleteNotification = (rowKey: string) => {
    const newData = notifications_List.filter(
      (item: any) => item._id !== rowKey,
    );
    updateNotifications(newData);
  };

  useEffect(() => {
    const total = notifications_List.length;
    const selected = selectedNotification.length;

    setIsSelectionMode(selected > 0);
    setSelectall(selected === total && total > 0);
  }, [notifications_List.length, selectedNotification.length]);

  const renderItem = (data: {item: Notification}) => {
    const item: any = data.item;
    const isSelected = selectedNotification.includes(item?._id);
    return (
      <Card
        mode="contained"
        style={[
          styles.card,
          !item.read && {backgroundColor: colors.elevation.level1},
        ]}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleSelectChat(item._id);
        }}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelectChat(item._id);
          } else {
            const updated = notifications_List.map((n: any) =>
              n._id === item._id ? {...n, read: true} : n,
            );
            console.log('item', item);
            updateNotifications(updated);
            // markAllAsRead(item._id);
            navigateByNotification({
              ...item,
              notificationId: item._id,
            } as any as INotification);
          }
        }}>
        <View style={styles.row}>
          {(isSelected || isSelectionMode) && (
            <View style={{marginRight: 10}}>
              <Icon
                name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={22}
                color={isSelected ? '#2A9D8F' : '#999'}
              />
            </View>
          )}
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

  const deleteNotifications = async () => {
    const body = {
      notifications:
        selectedNotification.length === notifications_List.length
          ? 'all'
          : selectedNotification,
    };
    console.log('Deleting chats with IDs:', body);
    try {
      const res = await deleteNotificationsAPI(body, {
        token,
        clientId,
        bearerToken,
      });
      Toast.show({
        type: 'success',
        text1: 'Notifications deleted successfully',
        position: 'bottom',
      });
      updateNotificationCount(res?.count ?? 0);
      clearSelection();
      fetchNotifications();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete notifications',
        position: 'bottom',
      });
      console.log('Error deleting notifications:', error);
      return;
    }
  };

  const markAllAsRead = async (notificationId = null) => {
    const body = {
      notifications: notificationId
        ? [notificationId]
        : selectedNotification.length === notifications_List.length
        ? 'all'
        : selectedNotification,
    };
    try {
      const res = await markAllReadNotificationsAPI(body, {
        token,
        clientId,
        bearerToken,
      });
      if (res?.message) {
        // Toast.show({
        //   type: 'success',
        //   text1: 'Notifications marked as read successfully',
        //   position: 'bottom',
        // });
        console.log('notification count', res.count);
        updateNotificationCount(res?.count ?? 0);
        clearSelection();
        fetchNotifications();
      }
    } catch (error) {
      if (!notificationId) {
        Toast.show({
          type: 'error',
          text1: 'Failed to mark notifications as read',
          position: 'bottom',
        });
        console.log('Error marking notifications as read:', error);
      }
      return;
    }
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
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <CommonHeader
        title="Notifications"
        textColor={theme.colors.text}
        rightIcon={
          notifications_List.length > 0
            ? !selectAll
              ? 'checkbox-blank-outline'
              : 'checkbox-marked-outline'
            : false
        }
        onRightPress={() => {
          if (notifications_List.length > 0) {
            setSelectall(!selectAll);
            if (selectAll) {
              setIsSelectionMode(false);
              clearSelection();
            } else {
              setIsSelectionMode(true);
              setSelectedNotification(
                notifications_List.map((n: any) => n._id),
              );
            }
          }
        }}
      />
      <SwipeListView
        data={notifications_List}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        ListHeaderComponent={
          isSelectionMode ? (
            <View
              style={{
                padding: 8,
                backgroundColor: '#fff',
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 10,
              }}>
              {notifications_List.filter((item: any) => !item.read).length >
                0 && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    markAllAsRead();
                  }}>
                  <Icon name="information" style={{right: 1}} size={20} />
                  <Text style={{fontFamily: Fonts.REGULAR, fontSize: 16}}>
                    Mark all as read
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  deleteNotifications();
                }}>
                <Icon name="delete" size={20} />
                <Text style={{fontFamily: Fonts.REGULAR, fontSize: 16}}>
                  {selectedNotification.length > 0
                    ? `Delete (${selectedNotification.length})`
                    : 'Delete All'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )
        }
        rightOpenValue={-70}
        disableRightSwipe
        disableLeftSwipe
        contentContainerStyle={[
          styles.container,
          {
            minHeight: notifications_List.length > 0 ? windowHeight : 0,
            backgroundColor:
              notifications_List.length > 0
                ? theme.colors.backgroundHome
                : theme.colors.background,
          },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          !notifications_Loading ? (
            <NoChats
              icon="bell-off-outline"
              title="Its quite here..."
              body="Get out there to start finding great deals."
              iconName="Notifications"
              onExplore={() => {
                setFilters({page: 0});
                // @ts-ignore
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      // @ts-ignore
                      name: 'Main',
                      state: {
                        index: 4, // 'MyAds' is the 4th tab (0-based index)
                        routes: [
                          {name: 'Home'},
                          {name: 'Chat'},
                          {name: 'AddPost'},
                          {name: 'MyAds'},
                          {name: 'filter'},
                        ],
                      },
                    },
                  ],
                });
              }}
              buttonText={'Explore'}
            />
          ) : notifications_Loading ? (
            <ActivityIndicator color={theme.colors.text} />
          ) : (
            <></>
          )
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
    margin: 5,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  rowBack: {
    alignItems: 'center',
    // backgroundColor: '#d32f2f',
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
