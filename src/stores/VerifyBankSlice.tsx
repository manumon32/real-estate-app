import {
  fetchBankVerificationDetailsAPI,
  fetchVerifiedBankAPI,
  startBankVerificationAPI,
} from '@api/services';

export interface BankbankVerificationlist {
  _id: string;
  files: string[];
  bankVerificationId: string;
  senderType: string;
  message: string;
  senderId: string;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankVerificationSlice {
  banks: string[];
  bankVerificationDetails: string[];
  bankVerification_loading: boolean;
  bankVerificationError: string | null;
  bankVerification_page: number;
  bankVerification_hasMore: boolean;
  bankVerification_totalpages: number;
  fetchBanks: (payload: any) => Promise<void>;
  startBankVerification: (payload: any) => Promise<void>;
  updateBankVerificationDetails: (msg?: any) => Promise<any>;

  fetchBankVerificationDetails: (filters?: any, page?: number) => Promise<void>;
  resetBankVerificationDetails: () => Promise<any>;
  resetBankSlice: () => Promise<any>;
}

export const createBankVerificationSlice = (
  set: any,
  get: any,
): BankVerificationSlice => ({
  banks: [],
  bankVerificationError: null,
  bankVerification_loading: false,
  bankVerificationDetails: [],
  bankVerification_page: 0,
  bankVerification_hasMore: false,
  bankVerification_totalpages: 0,

  fetchBanks: async payload => {
    set({bankVerification_loading: true, bankVerificationDetails: []});
    try {
      let newPayload = {
        filter_propertyId: payload,
        populate: 'bankId',
      };

      const res = await fetchVerifiedBankAPI(newPayload, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set({bankVerification_loading: false, banks: res.rows});
    } catch (err: any) {
      set({
        bankVerificationError: err.message,
        bankVerification_loading: false,
      });
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startBankVerification: async payload => {
    set({
      bankVerification_loading: true,
      bankVerification_page: 0,
    });
    try {
      await startBankVerificationAPI(
        {propertyId: payload},
        {
          token: get().token,
          clientId: get().clientId,
          bearerToken: get().bearerToken,
        },
      ).catch(error => {
        console.warn('startBankVerificationAPI failed:', error);
      });
      set({
        bankVerification_loading: false,
      });
    } catch (err: any) {
      // navigate('VerifyListing', {items: {id: '6853e34e05711055c493ff3b'}});
      set({
        bankVerificationError: err.message,
        bankVerification_loading: false,
      });
    }
  },

  updateBankVerificationDetails: (msg: any) =>
    set((state: any) => ({
      bankVerificationDetails: [...state.bankVerificationDetails, msg],
    })),
  fetchBankVerificationDetails: async (id: any) => {
    set({bankVerification_loading: true, bankVerificationDetails: []});
    try {
      let filters = {
        filter_bankVerificationId: id,
      };
      const res = await fetchBankVerificationDetailsAPI(filters, {
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      set(() => ({
        bankVerificationDetails: res.rows,
        bankVerification_page: res.pageNum,
        bankVerification_hasMore: res.pageNum < res.pages ? true : false,
        bankVerification_totalpages: res.total,
        bankVerification_loading: false,
      }));
    } catch (err: any) {
      set({
        bankVerificationError: err.message,
        bankVerification_loading: false,
      });
    }
  },

  resetBankVerificationDetails: () => {
    return set(() => ({
      bankVerificationDetails: [],
      bankVerification_page: 0,
      bankVerification_hasMore: false,
      bankVerification_loading: false,
    }));
  },

  resetBankSlice: () => {
    return set(() => ({
      banks: [],
      bankVerificationDetails: [],
      bankVerification_page: 0,
      bankVerification_hasMore: false,
      bankVerification_loading: false,
    }));
  },
});
