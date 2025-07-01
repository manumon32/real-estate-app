import {fetchTransactionsAPI} from '@api/services';

export interface TransactionsSlice {
  transLoading: Boolean;
  transactions: [];
  fetchTransactions: () => void;
}

export const createTransactionsSlice = (set: any, get: any): TransactionsSlice => ({
  transactions: [],
  transLoading: false,
  fetchTransactions: async () => {
    set({transLoading: true});
    try {
      const res = await fetchTransactionsAPI({
        token: get().token,
        clientId: get().clientId,
        bearerToken: get().bearerToken,
      });
      res?.rows &&
        set(() => ({
          transactions: res.rows,
          transLoading: false,
        }));
    } catch (err) {
      // Rollback if API fails
      set({transLoading: false});
    }
  },
});
