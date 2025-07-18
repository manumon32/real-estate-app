import RazorpayCheckout, {CheckoutOptions} from 'react-native-razorpay';
import axios from 'axios';
import {usePaymentStore} from '../../stores/paymentSlice';
import {createOrder, updateOrder} from '@api/services';
import Toast from 'react-native-toast-message';

// ↓ helper so we can call the store outside React render
const PaymentStore = usePaymentStore.getState;

/**
 * Full order-create ➜ checkout ➜ verify loop
 * Everything is a Promise; every stage update hits Zustand.
 */
export function startCheckoutPromise(params: any): Promise<void> {
  const {
    bearerToken,
    token,
    clientId,
    phone,
    email,
    purchaseType,
    purchaseTypeId,
  } = params;
  const amountPaise = params.amountInRupees * 100;

  /* 1️⃣  Create order */
  PaymentStore().reset();
  PaymentStore().setStage('CREATING_ORDER');
  let payload = {
    amount: amountPaise,
    currency: 'INR',
    purchasePlanId: params.purchasePlanId,
    purchaseType,
    purchaseTypeId,
  };
  let payloadConfig = {
    bearerToken,
    token,
    clientId,
  };
  return (
    createOrder(payload, payloadConfig)
      .then(order => {
        PaymentStore().setOrderId(order.paymentId);
        PaymentStore().setStage('CHECKOUT_SHOWN');

        const options: CheckoutOptions = {
          key: 'rzp_test_IjDpxmHi7vULgK', // ← fetch from server in prod
          order_id: order.orderId,
          amount: amountPaise,
          currency: order.currency,
          name: 'Real Estate App',
          description: '',
          image: 'https://i.imgur.com/3g7nmJC.png',
          prefill: {email: email, contact: phone},
          // method: {upi: true, card: true, netbanking: true, wallet: true, paylater: true},
          theme: {color: '#F37254'},
          notes: params.notes,
        };

        return RazorpayCheckout.open(options); // returns Promise
      })
      /* 3️⃣  Verify on backend */
      .then(payment => {
        PaymentStore().setPaymentId(payment.razorpay_payment_id);
        PaymentStore().setStage('VERIFYING');
        console.log({
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
          paymentId: PaymentStore().paymentId,
        });
        return updateOrder(
          {
            razorpay_order_id: payment.razorpay_order_id,
            razorpay_payment_id: payment.razorpay_payment_id,
            razorpay_signature: payment.razorpay_signature,
          },
          payloadConfig,
          PaymentStore().orderId,
        );
      })
      /* 4️⃣  Success */
      .then(() => {
        PaymentStore().setStage('SUCCESS');
        Toast.show({
          type: 'success',
          text1: 'Payment successful',
          position: 'bottom',
        });
      })
      /* 5️⃣  Any error or cancellation */
      .catch(err => {
        updateOrder(
          {
            paymentStatus: 'failed',
          },
          payloadConfig,
          PaymentStore().orderId,
        );
        let message = 'Payment could not be completed.';
        if (err?.description) {
          message = message;
        } else if (axios.isAxiosError(err)) {
          message = 'Network error – please try again.';
        }
        Toast.show({
          type: 'error',
          text1: message,
          position: 'bottom',
        });
        PaymentStore().setError(message);
        PaymentStore().setStage('FAIL');

        throw err; // bubble so caller can retry / log
      })
  );
}
