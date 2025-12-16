import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';


@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const productId = process.env.STRIPE_PRODUCT_ID;

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in .env');
    }
    if (!productId) {
      throw new Error('STRIPE_PRODUCT_ID is not defined in .env');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  async createCustomer(email: string) {
    return this.stripe.customers.create({ email });
  }

  async createDynamicWeeklySubscription(customerId: string, amount: number) {
    const productId = process.env.STRIPE_PRODUCT_ID!;

    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price_data: {
            currency: 'usd',
            product: productId,
            recurring: { interval: 'week' },
            unit_amount: amount,
          },
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
  }

}


