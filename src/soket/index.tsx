import {io, Socket} from 'socket.io-client';
import useBoundStore from '@stores/index';
import {getCurrentRouteName} from '@navigation/RootNavigation';
import {Vibration} from 'react-native';
import Toast from 'react-native-toast-message';

var socket: Socket | null = null;

const SOCKET_URL = 'http://13.61.181.173:8082';

// const updateChatList = (msg: any) => {
//   const currentScreen = getCurrentRouteName();
//   if (
//     currentScreen === 'ChatDetails' &&
//     msg.lastMessage.roomId === useBoundStore.getState().filter_roomId
//   ) {
//     if (msg.lastMessage.senderId !== useBoundStore.getState().user?._id) {
//       socket?.emit('messageSeen', {
//         messageId: msg.lastMessage._id,
//       });
//       const currentChatList = useBoundStore.getState().chatList || [];
//       let msgIndex: any = currentChatList.findIndex(
//         (item: any) => item?.roomId !== msg.room?._id,
//       );
//       const updatedMessages =
//         msgIndex !== -1
//           ? [
//               ...currentChatList.slice(0, msgIndex),
//               {...currentChatList[msgIndex], unreadCount: 0},
//               ...currentChatList.slice(msgIndex + 1),
//             ]
//           : [...currentChatList, msg];
//       useBoundStore.getState().setChatList(updatedMessages);
//     }
//     useBoundStore.getState().updateChat(msg.lastMessage);
//   } else {
//     Vibration.vibrate(500);
//     const currentChatList = useBoundStore.getState().chatList || [];
//     let updatedItems: any = currentChatList.filter(
//       (item: any) => item?.roomId !== msg.room?._id,
//     );
//     let updatedChatList;
//     updatedChatList = [
//       {...msg, roomId: msg.room?._id, _id: msg.room?._id},
//       ...updatedItems,
//     ];
//     useBoundStore.getState().setChatList(updatedChatList);

//     let unreadCount = useBoundStore.getState().unreadCount + 1;
//     if (
//       currentScreen === 'ChatDetails' &&
//       msg.lastMessage.roomId !== useBoundStore.getState().filter_roomId
//     ) {
//       Toast.show({
//         type: 'newMessage',
//         text1: 'You have messages in another chats',
//         position: 'top',
//       });
//     } else {
//       useBoundStore.getState().setUnreadCount(unreadCount);
//     }
//   }
// };

const updateChatList = (msg: any) => {
  const {
    chatList = [],
    filter_roomId,
    user,
    unreadCount,
    setChatList,
    setUnreadCount,
    updateChat,
  } = useBoundStore.getState();

  const currentScreen = getCurrentRouteName();
  const isCurrentChatRoom =
    currentScreen === 'ChatDetails' && msg.lastMessage.roomId === filter_roomId;
  const isFromOtherUser = msg.lastMessage.senderId !== user?._id;
  const roomId = msg.room?._id;

  if (isCurrentChatRoom) {
    // Current user is in the chat room of this message
    if (isFromOtherUser) {
      socket?.emit('messageSeen', {
        messageId: msg.lastMessage._id,
      });

      const msgIndex = chatList.findIndex(item => item?.roomId === roomId);

      if (msgIndex !== -1) {
        const updatedChatList = [...chatList];
        updatedChatList[msgIndex] = {
          ...updatedChatList[msgIndex],
          unreadCount: 0,
        };
        setChatList(updatedChatList);
      }
    }

    updateChat(msg.lastMessage);
  } else {
    // Message is from another room
    Vibration.vibrate(500);

    const filteredList = chatList.filter(item => item?.roomId !== roomId);

    const updatedChatList = [
      {
        ...msg,
        roomId,
        _id: roomId,
      },
      ...filteredList,
    ];

    setChatList(updatedChatList);

    if (
      currentScreen === 'ChatDetails' &&
      msg.lastMessage.roomId !== filter_roomId &&
      msg.lastMessage.senderId !== useBoundStore.getState().user?._id
    ) {
      Toast.show({
        type: 'newMessage',
        text1: 'You have messages in other chats',
        position: 'top',
      });
    } else {
     currentScreen !== 'ChatDetails' && currentScreen !== 'Chat' && setUnreadCount(unreadCount + 1);
    }
  }
};

const updateOnlineUsers = (user: {userId: string; status: string}) => {
  let onlineUsers = useBoundStore.getState().onlineUsers;
  const exists = onlineUsers.includes(user.userId);
  if (user.status === 'online' && !exists) {
    onlineUsers = [...onlineUsers, user.userId];
  } else if (user.status !== 'online' && exists) {
    onlineUsers = onlineUsers.filter(id => id !== user.userId);
  }
  console.log('✅ onlineUsers List', onlineUsers);
  useBoundStore.getState().updateOnlineUsers(onlineUsers);
};

export const connectSocket = () => {
  const token = useBoundStore.getState().bearerToken;
  if (!token) {
    console.warn('Connect No token available to connect socket.');
    return;
  }
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: {token},
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket:', socket?.id);
  });

  socket.on('initialAppData', items => {
    useBoundStore.getState().updateOnlineUsers(items.onlineUsers);
    useBoundStore.getState().setUnreadCount(items.chatListCount);
    console.log('✅ initialAppData received', items);
  });

  socket.on('messageRecived', msg => {
    console.log('✅ New Message received', msg);
    updateChatList(msg);
  });

  socket.on('userOnlineStatus', user => {
    console.log('✅ Online  Status received', user);
    updateOnlineUsers(user);
  });

  socket.on('connect_error', err => {
    console.log('❌ Connect Socket error:', err.message);
  });
};

export const getSocket = () => socket;
