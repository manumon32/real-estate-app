import {io, Socket} from 'socket.io-client';
import useBoundStore from '@stores/index';
import {getCurrentRouteName} from '@navigation/RootNavigation';
import {Vibration} from 'react-native';

let socket: Socket | null = null;

const SOCKET_URL = 'http://13.61.181.173:8082';

const updateChatList = (msg: any) => {
  const currentScreen = getCurrentRouteName();
  if (
    currentScreen === 'ChatDetails' &&
    msg.lastMessage.roomId === useBoundStore.getState().filter_roomId
  ) {
    useBoundStore.getState().updateChat(msg.lastMessage);
  } else {
    Vibration.vibrate(500);
    const currentChatList = useBoundStore.getState().chatList || [];
    let updatedItems: any = currentChatList.filter(
      (item: any) => item?.roomId !== msg.room?._id,
    );
    let updatedChatList;
    updatedChatList = [
      {...msg, roomId: msg.room?._id, _id: msg.room?._id},
      ...updatedItems,
    ];
    console.log(updatedChatList);
    useBoundStore.getState().setChatList(updatedChatList);

    let unreadCount = useBoundStore.getState().unreadCount + 1;
    useBoundStore.getState().setUnreadCount(unreadCount);
  }
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

  socket.on('messageRecived', msg => {
    console.log('✅ Connected New Message', msg);
    updateChatList(msg);
  });

  socket.on('connect_error', err => {
    console.log('❌ Connect Socket error:', err.message);
  });
};

export const getSocket = () => socket;
