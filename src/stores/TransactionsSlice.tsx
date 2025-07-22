import {fetchTransactionsAPI} from '@api/services';

export interface TransactionsSlice {
  transLoading: Boolean;
  transactions: [];
  fetchTransactions: () => void;
  resetTransactions: () => void;
}

export const createTransactionsSlice = (
  set: any,
  get: any,
): TransactionsSlice => ({
  transactions: [],
  transLoading: false,
  fetchTransactions: async () => {
    set({transLoading: true});
    try {
      let filter = {
        filter_userId: get().user?._id,
        populate: 'subscriptionPlanId',
        noPagination: true,
        orderBy: 'createdAt',
        orderByDir: 'desc',
      };
      const res = await fetchTransactionsAPI(filter, {
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
  resetTransactions: () =>set({transactions:[]}),
});
