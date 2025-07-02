import {fetchChatDetailsAPI, fetchChatListingsAPI} from '@api/services';

export interface Chatlist {
  _id: string;
  participants: [string];
  type: string;
  propertyId: string;
  roomId: string;
  createdAt: string;
  updatedAt: string;
  unreadCount: string;
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
  chatDetails: string[];
  loading: boolean;
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
  resetChatDetails: (msg?: any) => Promise<any>;
}

export const createChatSlice = (set: any, get: any): ChatSlice => ({
  chatList: [],
  error: null,
  loading: false,
  unreadCount: 0,
  chatDetails: [],
  chat_page: 0,
  chat_hasMore: false,
  chat_loading: false,
  chat_triggerRefresh: false,
  chat_error: null,
  chat_totalpages: 0,
  filter_roomId: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetchChatListings: async () => {
    set({loading: true, chat_page: 0, filter_roomId: null});
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
        loading: false,
        chat_page: 0,
        filter_roomId: null,
      }));
    } catch (err: any) {
      set({error: err.message, loading: false});
    }
  },
  setChatList: (list: any) => set({chatList: list}),
  fetchChatDetails: async (id: any) => {
    set({loading: true, filter_roomId: id});
    try {
      let filters = {
        pageNum: get().chat_page + 1,
        pageSize: 30,
        filter_roomId: id,
      };
      const res = await fetchChatDetailsAPI(filters, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set((state: any) => ({
        chatDetails:
          filters.pageNum === 1
            ? res.rows
            : [...state.chatDetails, ...res.rows]?.filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    t => JSON.stringify(t) === JSON.stringify(item),
                  ),
              ),
        chat_page: res.pageNum,
        chat_hasMore: res.pageNum < res.pages ? true : false,
        chat_loading: false,
        chat_totalpages: res.total,
        loading: false,
      }));
    } catch (err: any) {
      set({error: err.message, loading: false});
    }
  },
  updateChat: (msg: any) =>
    set((state: any) => ({
      chatDetails: [...state.chatDetails, msg],
    })),

  resetChatDetails: (msg: any) =>
    set(() => ({
      chatDetails: msg,
      chat_page: 0,
      chat_hasMore: false,
      filter_roomId: null,
    })),
  setUnreadCount: (count: number) => set({unreadCount: count}),
});
