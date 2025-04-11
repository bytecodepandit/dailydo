import {PayPalButtons, PayPalScriptProvider} from '@paypal/react-paypal-js';

function PayPalPaymentScreen() {
  return (
    <PayPalScriptProvider options={{'client-id': 'YOUR_CLIENT_ID'}}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return fetch('YOUR_SERVER_URL/create-paypal-order', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              value: '10.00', // The amount to charge
            }),
          }).then(response => response.text());
        }}
        onApprove={(data, actions) => {
          return fetch('YOUR_SERVER_URL/capture-paypal-order', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderID: data.orderID,
            }),
          })
            .then(response => response.json())
            .then(details => {
              // Handle successful payment
            });
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalPaymentScreen;
