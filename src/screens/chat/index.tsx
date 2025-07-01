/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import CommonHeader from '@components/Header/CommonHeader';
import {Fonts} from '@constants/font';
import useBoundStore from '@stores/index';
import {useTheme} from '@theme/ThemeProvider';
import React, {useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getTimeAgo} from './ChatBubble';

interface MessageCardProps {
  name: string;
  message: string;
  time: any;
  avatarUrl: string;
  unreadCount?: number;
  navigation: any;
  item: any;
}

const MessageCard: React.FC<MessageCardProps> = ({
  name,
  message,
  time,
  avatarUrl,
  unreadCount = 0,
  navigation,
  item,
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
        style={{height: 56, width: 56, borderRadius: 50}}
        source={{uri: avatarUrl}}
      />
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{name}</Text>
          {time && (
            <Text style={styles.time}>
              {getTimeAgo(new Date(time)?.getTime())}
            </Text>
          )}
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.message,
            unreadCount <= 0 && {fontFamily: Fonts.REGULAR},
          ]}>
          {message}
        </Text>
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
  const {fetchChatListings, chatList, resetChatDetails} = useBoundStore();
  const {theme} = useTheme();

  useFocusEffect(
    useCallback(() => {
      resetChatDetails([]);

      fetchChatListings();
      return () => {};
    }, []),
  );

  const renderAdItem = useCallback(
    (item: any) => {
      return (
        <MessageCard
          name={item?.item?.user?.name ?? 'User'}
          message={item?.item?.lastMessage?.body}
          navigation={navigation}
          time={item?.item?.lastMessage?.createdAt}
          unreadCount={item?.item?.unreadCount ?? 0}
          item={item?.item}
          avatarUrl={
            item?.item?.user?.profilePicture ??
            'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_items_boosted&w=740'
          }
        />
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView>
      <CommonHeader title="Chats" />
      <FlatList
        data={chatList}
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
                style={[
                  styles.chip,
                  // // !filterBy &&
                  styles.chipSelected,
                ]}
                onPress={() => {
                  // setFilterBy(null);
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    // !filterBy &&
                    styles.chipTextSelected,
                  ]}>
                  {'All'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // key={index}
                style={[
                  styles.chip,
                  // filterBy === AdStatusEnum[items] && styles.chipSelected,
                ]}
                onPress={() => {
                  // setFilterBy(AdStatusEnum[items]);
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    // filterBy === AdStatusEnum[items] &&
                    // styles.chipTextSelected,
                  ]}>
                  {'Sell'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // key={index}
                style={[
                  styles.chip,
                  // filterBy === AdStatusEnum[items] && styles.chipSelected,
                ]}
                onPress={() => {
                  // setFilterBy(AdStatusEnum[items]);
                }}>
                <Text
                  style={[
                    // newselected?.includes(item._id)
                    styles.chipText,
                    // filterBy === AdStatusEnum[items] &&
                    // styles.chipTextSelected,
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
          chatList.length <= 0 ? (
            <Text style={styles.endText}>No Conversations.</Text>
          ) : (
            <></>
          )
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
    color: '#131313',
    fontFamily: Fonts.BOLD,
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
