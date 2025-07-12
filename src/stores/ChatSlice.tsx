import {fetchChatDetailsAPI, fetchChatListingsAPI} from '@api/services';

export interface Chatlist {
  _id: string;
  type: string;
  propertyId: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  __v: number;
  lastMessage: {
    _id: string;
    senderId: string;
    roomId: string;
    type: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    isRead: boolean;
  };
}

export interface ChatSlice {
  unreadCount: number;
  chatList: Chatlist[];
  onlineUsers: string[];
  chatDetails: Object;
  chatListloading: boolean;
  error: string | null;
  chat_page: number;
  chat_hasMore: boolean;
  chat_loading: boolean;
  chat_error: string | null;
  chat_triggerRefresh: boolean;
  chat_totalpages: number;
  filter_roomId: string;
  fetchChatListings: (filters?: any, page?: number) => Promise<void>;
  setUnreadCount: (count: number) => Promise<void>;
  setChatList: (arg: any) => Promise<void>;
  fetchChatDetails: (filters?: any, page?: number) => Promise<void>;
  updateChat: (msg?: any) => Promise<any>;
  updateOnlineUsers: (msg?: any) => Promise<any>;
  resetChatDetails: (msg?: any) => Promise<void>;
  resetChat: (msg?: any) => Promise<any>;
}

export const createChatSlice = (set: any, get: any): ChatSlice => ({
  chatList: [],
  onlineUsers:[],
  error: null,
  chatListloading: false,
  unreadCount: 0,
  chatDetails: {},
  chat_page: 0,
  chat_hasMore: false,
  chat_loading: false,
  chat_triggerRefresh: false,
  chat_error: null,
  chat_totalpages: 0,
  filter_roomId: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchChatListings: async () => {
    set({chatListloading: true, chat_page: 0, filter_roomId: null});
    let filters = {
      filter_conversationCreated: true,
    };
    try {
      const res = await fetchChatListingsAPI(filters, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set(() => ({
        chatList: res.data,
        chatListloading: false,
        chat_page: 0,
        filter_roomId: null,
      }));
    } catch (err: any) {
      set({error: err.message, chatListloading: false});
    }
  },
  updateOnlineUsers: (users) =>{
    return set({onlineUsers: users});
  },
  setChatList: (list: any) => set({chatList: list}),
  fetchChatDetails: async (id: any) => {
    set({chat_loading: true, filter_roomId: id});
    try {
      let filters = {
        noPagination: true,
        filter_roomId: id,
      };
      const res = await fetchChatDetailsAPI(filters, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set(() => ({
        chatDetails: {...get().chatDetails, [id]: res.rows},
        chat_loading: false,
      }));
    } catch (err: any) {
      set({error: err.message, loading: false});
    }
  },
  updateChat: (msg: any) => {
    const state = get();
    const roomId = msg?.roomId;

    if (!roomId && !msg?.messageId) return;

    const existingMessages = state.chatDetails?.[roomId] ?? [];
    const index = existingMessages.findIndex(
      (item: any) => item.messageId === msg.messageId,
    );

    const updatedMessages =
      index !== -1
        ? [
            ...existingMessages.slice(0, index),
            msg,
            ...existingMessages.slice(index + 1),
          ]
        : [...existingMessages, msg];

    return set(() => ({
      chatDetails: {
        ...state.chatDetails,
        [roomId]: updatedMessages,
      },
    }));
  },
  resetChatDetails: (msg: any) =>
    set(() => ({
      chatDetails: msg,
      chat_page: 0,
      chat_hasMore: false,
      filter_roomId: null,
    })),

  resetChat: () =>
    set(() => ({
      chatList: [],
      chatDetails: {},
      chat_page: 0,
      chat_hasMore: false,
      filter_roomId: null,
    })),
  setUnreadCount: (count: number) => set({unreadCount: count}),
});
