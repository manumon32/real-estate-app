import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';

export type PaymentStage =
  | 'IDLE'
  | 'CREATING_ORDER'
  | 'CHECKOUT_SHOWN'
  | 'VERIFYING'
  | 'SUCCESS'
  | 'FAIL';

interface PaymentState {
  stage: PaymentStage;
  orderId?: string;
  paymentId?: string;
  error?: string | null;

  /** actions */
  setStage: (s: PaymentStage) => void;
  setOrderId: (id: string) => void;
  setPaymentId: (id: string) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

/**
 * Persist the last known payment outcome so the user can resume / retry
 * even after a crash or cold start.
 */
export const usePaymentStore = create<PaymentState>()(
  devtools(
    persist(
      (set) => ({
        stage: 'IDLE',
        error: null,

        setStage: (stage) => set({stage}),
        setOrderId: (orderId) => set({orderId}),
        setPaymentId: (paymentId) => set({paymentId}),
        setError: (error) => set({error}),
        reset: () =>
          set({
            stage: 'IDLE',
            orderId: undefined,
            paymentId: undefined,
            error: null,
          }),
      }),
      {name: 'payment-flow'} // AsyncStorage key
    )
  )
);
