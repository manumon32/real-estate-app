/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  Image,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getTimeAgo} from './ChatBubble';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChatListSkeleton from '@components/SkeltonLoader/ChatListSkeleton';
import NoChats from '@components/NoChatFound';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connectSocket} from '@soket/index';

interface MessageCardProps {
  name: string;
  message: string;
  time: any;
  title: string;
  avatarUrl: string;
  coverImage: string;
  unreadCount?: number;
  navigation: any;
  item: any;
  type: string;
  status: string;
  isOwner: boolean;
  onlineStatus: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
  name,
  title,
  message,
  time,
  avatarUrl,
  coverImage,
  unreadCount = 0,
  onlineStatus,
  navigation,
  item,
  type,
  status,
  isOwner,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ChatDetails', {
          items: {
            ...item,
            propertyId: item?._id,
          },
        });
      }}
      style={styles.container}>
      <Image
        style={{height: 60, width: 60, borderRadius: 5}}
        source={{uri: coverImage}}
      />
      {avatarUrl && (
        <View
          style={{
            borderRadius: 100,
            position: 'absolute',
            left: 46,
            bottom: 8,
            borderWidth: 2,
            borderColor: '#fff',
          }}>
          <Image
            style={{
              height: 32,
              width: 32,
              borderRadius: 50,
            }}
            source={{uri: avatarUrl}}
          />
          {onlineStatus && (
            <MaterialCommunityIcons
              name={'checkbox-blank-circle'}
              style={{position: 'absolute', left: 18, bottom: -6}}
              size={14}
              color={'green'}
            />
          )}
        </View>
      )}
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <View style={{flexDirection: 'row', width: '80%'}}>
            <Text numberOfLines={1} style={styles.name}>
              {name}
            </Text>
          </View>
          {time && (
            <Text style={styles.time}>
              {getTimeAgo(new Date(time)?.getTime())}
            </Text>
          )}
        </View>

        {title && (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        )}
        <View style={{flexDirection: 'row'}}>
          {isOwner && (
            <MaterialCommunityIcons
              name={status === 'sent' ? 'check' : 'check-all'}
              size={16}
              color={status === 'read' ? 'blue' : '#000'}
              style={{marginRight: 5}}
            />
          )}
          {type === 'text' && (
            <Text
              numberOfLines={2}
              style={[
                styles.message,
                unreadCount <= 0 && {fontFamily: Fonts.REGULAR},
              ]}>
              {message}
            </Text>
          )}
          {type === 'image' && (
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Icon name="camera-outline" size={16} color="#000" />
              <Text
                numberOfLines={2}
                style={[
                  styles.message,
                  unreadCount <= 0 && {fontFamily: Fonts.REGULAR},
                ]}>
                {' Image'}
              </Text>
            </View>
          )}
        </View>
      </View>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Chat = React.memo(({navigation}: any) => {
  const {
    fetchChatListings,
    chatList,
    chatListloading,
    user,
    onlineUsers,
    bearerToken,
  } = useBoundStore();
  const [filterBy, setFilterBy] = useState<any>(null);
  const {theme} = useTheme();

  useFocusEffect(
    useCallback(() => {
      fetchChatListings();
      return () => {};
    }, []),
  );

  useEffect(() => {
    bearerToken && connectSocket();
  }, [bearerToken]);

  const renderAdItem = useCallback(
    (item: any) => {
      return (
        <MessageCard
          name={item?.item?.user?.name ?? 'User'}
          type={item?.item?.lastMessage?.type ?? 'message'}
          message={item?.item?.lastMessage?.body}
          navigation={navigation}
          title={item?.item?.property.title}
          isOwner={item?.item?.lastMessage?.senderId === user?._id}
          time={item?.item?.lastMessage?.createdAt}
          unreadCount={item?.item?.unreadCount ?? 0}
          onlineStatus={onlineUsers.includes(item?.item?.user?._id)}
          item={item?.item}
          status={item?.item?.lastMessage?.status}
          coverImage={
            item?.item?.property?.coverImage ??
            'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_items_boosted&w=740'
          }
          avatarUrl={
            item?.item?.user?.profilePicture ??
            'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_items_boosted&w=740'
          }
        />
      );
    },
    [navigation, onlineUsers],
  );

  return (
    <SafeAreaView style={{backgroundColor: '#fff', height: '100%'}}>
      <CommonHeader title="Chats" />
      <FlatList
        data={
          filterBy
            ? chatList.filter((items: any) =>
                filterBy === 'sell'
                  ? items.property.customerId === user?._id
                  : items.property.customerId !== user?._id,
              )
            : chatList
        }
        renderItem={renderAdItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 120,
          backgroundColor: theme.colors.backgroundHome,
          minHeight: 900,
          //  padding: 14,
        }}
        ListHeaderComponent={
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: 'row',
                padding: 10,
                backgroundColor: '#fff',
              }}>
              <TouchableOpacity
                style={[styles.chip, !filterBy && styles.chipSelected]}
                onPress={() => {
                  setFilterBy(null);
                }}>
                <Text
                  style={[
                    styles.chipText,
                    !filterBy && styles.chipTextSelected,
                  ]}>
                  {'All'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filterBy === 'sell' && styles.chipSelected,
                ]}
                onPress={() => {
                  setFilterBy('sell');
                }}>
                <Text
                  style={[
                    styles.chipText,
                    filterBy === 'sell' && styles.chipTextSelected,
                  ]}>
                  {'Sell'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // key={index}
                style={[styles.chip, filterBy === 'buy' && styles.chipSelected]}
                onPress={() => {
                  setFilterBy('buy');
                }}>
                <Text
                  style={[
                    styles.chipText,
                    filterBy === 'buy' && styles.chipTextSelected,
                  ]}>
                  {'Buy'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        }
        ListHeaderComponentStyle={{
          padding: 0,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              fetchChatListings();
            }}
            colors={['#40DABE', '#40DABE', '#227465']}
          />
        }
        ListFooterComponent={
          <>
            {chatListloading && chatList.length <= 0 && <ChatListSkeleton />}
            {chatList.length <= 0 && !chatListloading ? (
              <NoChats
                onExplore={() => {
                  navigation.navigate('filter');
                }}
              />
            ) : (
              <></>
            )}
          </>
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
    fontSize: 16,
    color: '#131313',
    fontFamily: Fonts.BOLD,
  },
  title: {
    fontWeight: '600',
    fontSize: 10,
    width: '80%',
    color: '#131313',
    fontFamily: Fonts.MEDIUM,
  },
  time: {
    fontSize: 12,
    color: '#2F8D79',
  },
  message: {
    color: '#131313',
    fontSize: 13,
    fontFamily: Fonts.BOLD,
    width: '90%',
  },
  badge: {
    backgroundColor: '#2a9d8f',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -20,
    top: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 5,
    // marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  chipText: {
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
  },

  endText: {
    textAlign: 'center',
    color: '#888',
    padding: 12,
    fontStyle: 'italic',
    // top: -40,
    fontFamily: Fonts.MEDIUM_ITALIC,
  },
});

export default Chat;
