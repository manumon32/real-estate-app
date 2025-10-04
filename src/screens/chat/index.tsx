/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BlurView} from '@react-native-community/blur';
import Image from 'react-native-fast-image';
import {
  View,
  Text,
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
import {deleteChatListAPI, reportUser} from '@api/services';
import Toast from 'react-native-toast-message';
import BottomModal from '@components/Modal/BottomModal';
import ReportUserModal from './ReportUserModal';

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
  isSelected: boolean;
  isSelectionMode: boolean;
  onLongPress: () => void;
  onSelect: (arg: any) => void;
  setBottomModalVisible?: () => void;
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
  isSelected,
  isSelectionMode,
  onLongPress,
  onSelect,
  setBottomModalVisible,
}) => {
  const isActive = item.property?.adStatus === 'active';

  const {theme} = useTheme();
  return (
    <TouchableOpacity
      onPress={() => {
        isSelectionMode
          ? onSelect(item?._id)
          : navigation.navigate('ChatDetails', {
              items: {...item, propertyId: item?._id},
            });
      }}
      onLongPress={onLongPress}
      style={[
        styles.container,
        {
          backgroundColor: isSelected
            ? theme.colors.backgroundHome
            : theme.colors.backgroundHome,
        },
        !isActive && {opacity: 0.8},
      ]}>
      {(isSelected || isSelectionMode) && (
        <View style={{marginRight: 10}}>
          <MaterialCommunityIcons
            name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={22}
            color={isSelected ? '#2A9D8F' : '#999'}
          />
        </View>
      )}
      <Image
        style={{height: 60, width: 60, borderRadius: 5}}
        source={{uri: coverImage, cache: Image.cacheControl.immutable}}
        // @ts-ignore
        blurRadius={isActive ? 0 : 10} // Blur the image if the ad is not active
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
            <Text
              numberOfLines={1}
              style={[
                styles.name,
                {color: theme.colors.text},
                !isActive && {opacity: 0.5},
              ]}>
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
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {color: theme.colors.text},
              !isActive && {opacity: 0.5},
            ]}>
            {title}
          </Text>
        )}
        <View style={{flexDirection: 'row'}}>
          {isOwner && isActive && (
            <MaterialCommunityIcons
              name={status === 'sent' ? 'check' : 'check-all'}
              size={16}
              color={status === 'read' ? '#307bfc' : theme.colors.text}
              style={{marginRight: 5}}
            />
          )}
          {type === 'text' && isActive && (
            <Text
              numberOfLines={2}
              style={[
                styles.message,
                {color: theme.colors.text},
                unreadCount <= 0 && {fontFamily: Fonts.REGULAR},
              ]}>
              {message}
            </Text>
          )}

          {!isActive && (
            <Text
              numberOfLines={2}
              style={[
                styles.message,
                {color: theme.colors.text},
                {fontFamily: Fonts.BOLD, color: 'red', opacity: 1},
              ]}>
              {'This ad has been disabled by the owner.'}
            </Text>
          )}
          {type === 'image' && isActive && (
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Icon name="camera-outline" size={16} color={theme.colors.text} />
              <Text
                numberOfLines={2}
                style={[
                  styles.message,
                  {color: theme.colors.text},
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
          <Text style={[styles.badgeText]}>{unreadCount}</Text>
        </View>
      )}
      {!isSelected && (
        <MaterialCommunityIcons
          onPress={() => {
            !isSelectionMode && setBottomModalVisible?.();
          }}
          name="dots-vertical"
          size={20}
        />
      )}

      {!isActive && (
        <>
          <BlurView
            style={styles.blurView}
            blurType="light"
            blurAmount={-1}
            // reducedTransparencyFallbackColor="white"
          />
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(255, 255, 255, 0)',
            }}
          />
        </>
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
    token,
    clientId,
    setFilters,
  } = useBoundStore();
  const [filterBy, setFilterBy] = useState<any>(null);
  const [isReportVisible, setIsReportVisible] = useState(false);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const {theme} = useTheme();
  const [bottomModalVisible, setBottomModalVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const toggleSelectChat = useCallback((id: string) => {
    console.log('Toggling selection for chat ID:', id);
    setSelectedChats(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id],
    );
  }, []);

  const clearSelection = () => {
    setIsSelectionMode(false);
    setSelectedChats([]);
  };

  const deleteChats = async (ids = null) => {
    const body = {
      roomIds: ids ? ids : selectedChats,
    };
    try {
      await deleteChatListAPI(body, {
        token: token,
        clientId: clientId,
        bearerToken: bearerToken,
      });
      Toast.show({
        type: 'success',
        text1: 'Chats deleted successfully',
        position: 'bottom',
      });
      clearSelection();
      fetchChatListings();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to delete chats',
        position: 'bottom',
      });
      console.error('Error deleting chats:', error);
      return;
    }
  };

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
          isSelected={selectedChats.includes(item?.item?._id)}
          isSelectionMode={isSelectionMode}
          setBottomModalVisible={() => {
            setBottomModalVisible(true);
            setSelectedChat(item?.item?._id);
          }}
          onLongPress={() => {
            setIsSelectionMode(true);
            setSelectedChats([item?.item?._id]);
          }}
          onSelect={id => toggleSelectChat(id)}
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
    [
      navigation,
      onlineUsers,
      selectedChats,
      setSelectedChats,
      isSelectionMode,
      toggleSelectChat,
      user,
    ],
  );

  const renderFooter = () => {
    return (
      <>
        {chatListloading && chatList.length <= 0 && <ChatListSkeleton />}
        {(filterBy
          ? chatList.filter((items: any) =>
              filterBy === 'sell'
                ? items.property.customerId === user?._id
                : items.property.customerId !== user?._id,
            ).length <= 0
          : chatList.length <= 0) && !chatListloading ? (
          <NoChats
            onExplore={() => {
              setFilters({page: 0});
              // @ts-ignore
              navigation.navigate('filter');
            }}
            buttonText={'Explore'}
            icon="message-text-outline"
            iconName={'Chat'}
            title="Its quite here..."
            body="Get out there to start finding great deals."
          />
        ) : (
          <></>
        )}
      </>
    );
  };

  const listHeader = () => {
    return (
      <>
        {isSelectionMode ? (
          <View
            style={{
              zIndex: 99,
              backgroundColor: theme.colors.backgroundHome,
              padding: 10,
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
              }}
              onPress={() => {
                clearSelection();
              }}>
              <MaterialCommunityIcons
                name="close"
                color={theme.colors.text}
                size={20}
              />
              <Text
                style={{
                  fontFamily: Fonts.REGULAR,
                  fontSize: 16,
                  color: theme.colors.text,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            {selectedChats.length > 0 && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  deleteChats();
                }}>
                <MaterialCommunityIcons
                  name="delete"
                  size={20}
                  color={theme.colors.text}
                />
                <Text
                  style={{
                    fontFamily: Fonts.REGULAR,
                    fontSize: 16,
                    color: theme.colors.text,
                  }}>
                  Delete All
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          chatList.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: 'row',
                padding: 10,
                backgroundColor: theme.colors.backgroundHome,
              }}>
              <TouchableOpacity
                style={[styles.chip, !filterBy && styles.chipSelected]}
                onPress={() => {
                  setFilterBy(null);
                }}>
                <Text
                  style={[
                    styles.chipText,
                    {color: theme.colors.text},
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
                    {color: theme.colors.text},
                    filterBy === 'sell' && styles.chipTextSelected,
                  ]}>
                  {'My Listings'}
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
                    {color: theme.colors.text},
                    filterBy === 'buy' && styles.chipTextSelected,
                  ]}>
                  {'My Enquiries'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )
        )}
      </>
    );
  };

  const reportUsers = async (data: any) => {
    console.log(selectedChat);
      const uploadParams = {token, clientId, bearerToken};
      try {
        let payload = {
          reportedBy: user._id,
          reportedUser: selectedChat,
          status: 'pending',
          ...data,
        };
        await reportUser(payload, uploadParams);
        Toast.show({
          type: 'success',
          text1: 'Reported sucessfully',
          position: 'bottom',
        });
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          position: 'bottom',
        });
      }
    };

  return (
    <SafeAreaView
      style={{backgroundColor: theme.colors.background, height: '100%'}}>
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
          backgroundColor: theme.colors.background,
          minHeight: chatList.length > 0 ? 900 : 0,
          //  padding: 14,
        }}
        ListHeaderComponent={listHeader}
        ListHeaderComponentStyle={styles.listHeaderComponentStyle}
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
        ListFooterComponent={renderFooter}
      />
      <BottomModal
        visible={bottomModalVisible}
        onClose={() => setBottomModalVisible(false)}
        handleDelete={() => {
          console.log(selectedChat);
          // @ts-ignore
          deleteChats([selectedChat]);
          setBottomModalVisible(false);
        }}
        selectMultiple={() => {
          setBottomModalVisible(false);
          setTimeout(() => {
            setIsSelectionMode(true);
            // @ts-ignore
            setSelectedChats([selectedChat]);
          }, 300);
        }}
        reportUser={() => {
          setBottomModalVisible(false);
          setTimeout(() => {
            setIsReportVisible(true);
          }, 300);
        }}
      />
      <ReportUserModal
        visible={isReportVisible}
        onClose={() => setIsReportVisible(false)}
        onSubmit={(note: any) => {
          setIsReportVisible(false);
          reportUsers(note);
        }}
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
  listHeaderComponentStyle: {
    padding: 0,
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
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
