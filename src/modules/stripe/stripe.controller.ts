import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { CreateStripeDto } from "./dto/create-stripe.dto";
import { UpdateStripeDto } from "./dto/update-stripe.dto";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async create(@Body() createStripeDto: CreateStripeDto, @Request() req) {
    const user = req.user.user;
    console.log(user, "user");
    let stripeCustomerId: string;
    
    if (!user.stripeCustomerId) {
      const customer = await this.stripeService.createCustomer(user.email);
      stripeCustomerId = customer.id;
      console.log(stripeCustomerId, "stripeCustomerId");
    } else {
      stripeCustomerId = user.stripeCustomerId;
    }
    

    
    return this.stripeService.createDynamicWeeklySubscription({amountInCents: 25,customerId: stripeCustomerId});
  }

  // @Get()
  // findAll() {
  //   return this.stripeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.stripeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStripeDto: UpdateStripeDto) {
  //   return this.stripeService.update(+id, updateStripeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.stripeService.remove(+id);
  // }
}



// import { Controller, Post, Body, Param } from '@nestjs/common';
// import { StripeService } from './stripe.service';

// @Controller('ride')
// export class RideController {
//   constructor(private readonly stripeService: StripeService) {}

//   // Step 1: Start ride, lock basic fee
//   @Post('start')
//   async startRide(
//     @Body() body: { riderId: string; basicFee: number },
//   ) {
//     const paymentIntent = await this.stripeService.createRidePaymentIntent(
//       body.riderId,
//       body.basicFee,
//     );
//     return { paymentIntentId: paymentIntent.id, clientSecret: paymentIntent.client_secret };
//   }

//   // Step 2: Update ride charges (extra stops, tip, cleaning)
//   @Post(':paymentIntentId/update')
//   async updateRideCharges(
//     @Param('paymentIntentId') paymentIntentId: string,
//     @Body() body: { newTotalAmount: number },
//   ) {
//     const updated = await this.stripeService.updateRidePaymentIntent(
//       paymentIntentId,
//       body.newTotalAmount,
//     );
//     return updated;
//   }

//   // Step 3: Complete ride and capture payment
//   @Post(':paymentIntentId/capture')
//   async completeRide(
//     @Param('paymentIntentId') paymentIntentId: string,
//     @Body() body: { driverAccountId: string; driverAmount: number },
//   ) {
//     // Capture payment
//     const captured = await this.stripeService.captureRidePayment(paymentIntentId);

//     // Pay driver if using Stripe Connect
//     const chargeId = captured.charges.data[0].id;
//     const transfer = await this.stripeService.payDriver(
//       body.driverAccountId,
//       body.driverAmount,
//       captured.currency,
//       chargeId,
//     );

//     return { captured, transfer };
//   }
// }