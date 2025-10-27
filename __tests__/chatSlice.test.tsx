import { act } from 'react-test-renderer';
import { cleanup } from '@testing-library/react-native';
import useBoundStore from '../src/stores/index';
import { fetchChatDetailsAPI, fetchChatListingsAPI } from '@api/services';

jest.mock('@api/services', () => ({
  fetchChatDetailsAPI: jest.fn(),
  fetchChatListingsAPI: jest.fn(),
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('Chat Slice', () => {
  beforeEach(() => {
    act(() => {
      useBoundStore.setState({
        chatList: [],
        onlineUsers: [],
        chatDetails: {},
        chatListloading: false,
        chat_loading: false,
        unreadCount: 0,
        filter_roomId: '',
        imageUploading: {},
        chat_page: 0,
        chat_hasMore: false,
      });
    });
  });

  it('should initialize with default state', () => {
    const state = useBoundStore.getState();
    expect(state.chatList).toEqual([]);
    expect(state.onlineUsers).toEqual([]);
    expect(state.chatDetails).toEqual({});
    expect(state.chatListloading).toBe(false);
    expect(state.chat_loading).toBe(false);
    expect(state.unreadCount).toBe(0);
  });

  it('should fetch chat listings successfully', async () => {
    const mockResponse = { data: [{ _id: '1', roomId: 'r1', unreadCount: 0 }] };
    (fetchChatListingsAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useBoundStore.getState().fetchChatListings();
    });

    const state = useBoundStore.getState();
    expect(fetchChatListingsAPI).toHaveBeenCalledTimes(1);
    expect(state.chatList).toEqual(mockResponse.data);
    expect(state.chatListloading).toBe(false);
  });

  it('should handle chat listings API failure', async () => {
    (fetchChatListingsAPI as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore.getState().fetchChatListings();
    });

    const state = useBoundStore.getState();
    expect(state.chatListloading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should fetch chat details successfully', async () => {
    const roomId = 'room1';
    const mockResponse = { rows: [{ messageId: 'm1', body: 'Hello' }] };
    (fetchChatDetailsAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    await act(async () => {
      await useBoundStore.getState().fetchChatDetails(roomId);
    });

    const state = useBoundStore.getState();
    expect(fetchChatDetailsAPI).toHaveBeenCalledTimes(1);
        // @ts-ignore
    expect(state.chatDetails[roomId]).toEqual(mockResponse.rows);
    expect(state.chat_loading).toBe(false);
  });

  it('should handle chat details API failure', async () => {
    const roomId = 'room1';
    (fetchChatDetailsAPI as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await useBoundStore.getState().fetchChatDetails(roomId);
    });

    const state = useBoundStore.getState();
    expect(state.chat_loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should update unread count correctly', () => {
    act(() => {
      useBoundStore.getState().setUnreadCount(5);
    });
    expect(useBoundStore.getState().unreadCount).toBe(5);
  });

  it('should set chat list manually', () => {
    const chatList = [{ _id: '1', roomId: 'r1', unreadCount: 0 }];
    act(() => {
      useBoundStore.getState().setChatList(chatList);
    });
    expect(useBoundStore.getState().chatList).toEqual(chatList);
  });

  it('should update online users correctly', () => {
    const users = ['user1', 'user2'];
    act(() => {
      useBoundStore.getState().updateOnlineUsers(users);
    });
    expect(useBoundStore.getState().onlineUsers).toEqual(users);
  });

  it('should update chat messages correctly', () => {
    const msg = { roomId: 'r1', messageId: 'm1', body: 'Hi' };
    act(() => {
      useBoundStore.getState().updateChat(msg);
    });
        // @ts-ignore
    expect(useBoundStore.getState().chatDetails['r1'][0]).toEqual(msg);
  });

  it('should reset chat details', () => {
    act(() => {
      useBoundStore.setState({
        // @ts-ignore
        chatList: [{ _id: '1' }],
        chatDetails: { r1: [{ messageId: 'm1' }] },
      });
      useBoundStore.getState().resetChatDetails();
    });
    const state = useBoundStore.getState();
    expect(state.chatList).toEqual([]);
    expect(state.chatDetails).toEqual({});
    expect(state.chat_page).toBe(0);
    expect(state.chat_hasMore).toBe(false);
  });

  it('should reset chat completely', () => {
    act(() => {
      useBoundStore.setState({
        // @ts-ignore
        chatList: [{ _id: '1' }],
        chatDetails: { r1: [{ messageId: 'm1' }] },
      });
      useBoundStore.getState().resetChat();
    });
    const state = useBoundStore.getState();
    expect(state.chatList).toEqual([]);
    expect(state.chatDetails).toEqual({});
    expect(state.chat_page).toBe(0);
    expect(state.chat_hasMore).toBe(false);
  });

  it('should set image uploading correctly', () => {
    const payload = { r1: 'uploading' };
    act(() => {
      useBoundStore.getState().setImageUploading(payload);
    });
    expect(useBoundStore.getState().imageUploading).toEqual(payload);
  });
});
