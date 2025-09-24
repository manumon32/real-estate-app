import {
  fetchverificationDataAPI,
  fetchverificationDetailsAPI,
  startVerificationAPI,
} from '@api/services';
import {navigate} from '@navigation/RootNavigation';

export interface Verificationlist {
  _id: string;
  files: string[];
  verificationId: string;
  senderType: string;
  message: string;
  senderId: string;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationSlice {
  verificationDetails: string[];
  verification_loading: boolean;
  verificationError: string | null;
  verification_page: number;
  verification_data: any;
  verification_hasMore: boolean;
  verification_totalpages: number;
  startVerification: (payload: any) => Promise<void>;
  updateVerificationDetails: (msg?: any) => Promise<any>;
  fetchverificationsData: (msg?: any) => Promise<any>;
  fetchverificationDetails: (filters?: any, page?: number) => Promise<void>;
  resetverificationDetails: () => Promise<any>;
}

export const createVerificationSlice = (
  set: any,
  get: any,
): VerificationSlice => ({
  verificationError: null,
  verification_loading: false,
  verificationDetails: [],
  verification_page: 0,
  verification_hasMore: false,
  verification_data: {},
  verification_totalpages: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startVerification: async payload => {
    set({
      verification_loading: true,
      verification_page: 0,
      verificationDetails: [],
    });
    try {
      const res = await startVerificationAPI(payload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set({verification_loading: false});
      navigate('VerifyListing', {items: {_id: res._id}});
    } catch (err: any) {
      // navigate('VerifyListing', {items: {id: '6853e34e05711055c493ff3b'}});
      set({verificationError: err.message, verification_loading: false});
    }
  },
  updateVerificationDetails: (msg: any) =>
    set((state: any) => ({
      verificationDetails: [...state.verificationDetails, msg],
    })),
  fetchverificationDetails: async (id: any) => {
    set({verification_loading: true, verificationDetails: []});
    try {
      let filters = {
        filter_verificationId: id,
      };
      const res = await fetchverificationDetailsAPI(filters, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set(() => ({
        verificationDetails: res.rows,
        verification_page: res.pageNum,
        verification_hasMore: res.pageNum < res.pages ? true : false,
        verification_totalpages: res.total,
        verification_loading: false,
      }));
    } catch (err: any) {
      set({verificationError: err.message, verification_loading: false});
    }
  },
  fetchverificationsData: async (id: any) => {
    set({verification_loading: true, verificationDetails: []});
    try {
      const res = await fetchverificationDataAPI(id, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set(() => ({
        verification_data: res,
        verification_loading: false,
      }));
    } catch (err: any) {
      set({verificationError: err.message, verification_loading: false});
    }
  },

  resetverificationDetails: () => {
    return set(() => ({
      verificationDetails: [],
      verification_page: 0,
      verification_hasMore: false,
      verification_loading: false,
      verification_data: {},
    }));
  },
});
