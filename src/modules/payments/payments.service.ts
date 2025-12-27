import { Injectable } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { StripeService } from "../stripe/stripe.service";
import { InvoiceWithPaymentIntent } from "../stripe/stripe.types";

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  // async subscribeDriver(driver: any) {
  //   const customer = await this.stripeService.createCustomer(driver.email);

  //   const feeAmount = driver.seater === 2 ? 500 : 1000; // cents

  //   let subscription = await this.stripeService.createDynamicWeeklySubscription(
  //     customer.id,
  //     feeAmount
  //   );

  //   const latestInvoice = subscription.latest_invoice;

  //   if (!latestInvoice || typeof latestInvoice === "string") {
  //     throw new Error("Latest invoice not expanded");
  //   }

  //   const invoice = latestInvoice as InvoiceWithPaymentIntent;

  //   if (!invoice.payment_intent) {
  //     throw new Error("PaymentIntent missing on invoice");
  //   }

  //   return {
  //     subscriptionId: subscription.id,
  //     clientSecret: invoice.payment_intent.client_secret,
  //   };
  // }
}
