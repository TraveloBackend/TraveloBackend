import stripe from 'stripe';

export type InvoiceWithPaymentIntent = stripe.Invoice & {
  payment_intent?: stripe.PaymentIntent;
};
