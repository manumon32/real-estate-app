import RazorpayCheckout, {CheckoutOptions} from 'react-native-razorpay';
import { PaymentRequest } from '@rnw-community/react-native-payments';
// @ts-ignore
// import { PaymentMethodNameEnum, SupportedNetworkEnum } from '@rnw-community/react-native-payments/src';


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
          key: 'rzp_test_RJ066i1Rc2I4Q3', // ← fetch from server in prod
          order_id: order.orderId,
          amount: amountPaise,
          currency: order.currency,
          name: 'Hotplotz',
          description: '',
          image: 'https://portal.hotplotz.com/static/media/logo.1bbb2dbc0fc247838c30.jpg',
          prefill: {email: email, contact: phone},
          // method: {upi: true, card: true, netbanking: true, wallet: true, paylater: true},
          theme: {color: 'teal'},
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

export async function payWithApplePay() {
  const methodData = [
  {
    // PaymentMethodNameEnum.ApplePay
    supportedMethods: [],
    data: {
      merchantIdentifier: 'merchant.com.yourapp.id',      // your merchant ID
      supportedNetworks: [],//[SupportedNetworkEnum.Visa, SupportedNetworkEnum.Mastercard],
      countryCode: 'IN',       // your country ISO
      currencyCode: 'INR',      // currency you charge in
      // optional: you can also provide applicationData (metadata)
      // applicationData: JSON.stringify({ orderId: '12345' }),
    }
  }
];

const details = {
  id: 'order-001',   // unique order id
  displayItems: [
    {
      label: 'Item A',
      amount: { currency: 'INR', value: '10.00' }
    },
  ],
  total: {
    label: 'Hotplotz',
    amount: { currency: 'INR', value: '12.00' }
  }
};
  try {
    // @ts-ignore
    const paymentRequest = new PaymentRequest(methodData, details);

    // Check if Apple Pay is possible/enabled
    const isCapable = await paymentRequest.canMakePayment();
    if (!isCapable) {
      console.log('Apple Pay is not available on this device/configuration');
      return;
    }

    // Show payment sheet
    const paymentResponse = await paymentRequest.show();

    // At this point user has authorized, you have token etc:
    // const { applePayToken, transactionIdentifier } = paymentResponse.details;
    console.log(paymentResponse.details)
    // There may also be payer info etc if requested.

    // Send the `applePayToken` (and perhaps other details) to your backend to process with your payment gateway
    // await sendTokenToBackend(applePayToken, {
    //   transactionIdentifier,
    //   displayItems: details.displayItems,
    //   total: details.total,
    //   orderId: details.id,
    // });

    // Once backend confirms, complete the sheet
    // paymentResponse.complete(PaymentComplete.Success);

    // any UI / state updates
    console.log('Payment successful');

  } catch (err) {
    console.log('Payment failed or cancelled', err);
    // If needed complete failure
    // If paymentResponse exists:
    // paymentResponse.complete(PaymentComplete.Fail);
  }
}
