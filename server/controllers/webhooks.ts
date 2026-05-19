import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

type OrderItem = {
  product: string;
  quantity: number;
};

export const stripeWebhook = async (
  request: Request,
  response: Response
) => {
  let event: Stripe.Event;

  // Check webhook secret
  if (!endpointSecret) {
    return response.status(500).send("Webhook secret missing");
  }

  // Get Stripe signature
  const signature = request.headers["stripe-signature"];

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature as string,
      endpointSecret
    );
  } catch (err: any) {
    console.log(
      "⚠️ Webhook signature verification failed.",
      err.message
    );

    return response.sendStatus(400);
  }

  try {
    switch (event.type) {
      // PAYMENT SUCCESS
      case "payment_intent.succeeded": {
        const paymentIntent =
          event.data.object as Stripe.PaymentIntent;

        const paymentIntentId = paymentIntent.id;

        // Get checkout session
        const session = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data.length) {
          return response.status(404).send("Session not found");
        }

        // Get orderId from metadata
        const { orderId } = session.data[0].metadata as {
          orderId: string;
        };

        // Mark order as paid
        const paidOrder = await prisma.order.update({
          where: { id: orderId },
          data: { isPaid: true },
        });

        // Get order items safely
        const orderItems: OrderItem[] = Array.isArray(
          paidOrder.items
        )
          ? (paidOrder.items as unknown as OrderItem[])
          : [];

        // Decrease product stock
        for (const item of orderItems) {
          await prisma.product.update({
            where: { id: item.product },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Send order placed event
        await inngest.send({
          name: "order/placed",
          data: { orderId },
        });

        // Send inventory update events
        for (const item of orderItems) {
          await inngest.send({
            name: "inventory/stock.updated",
            data: {
              productId: item.product,
            },
          });
        }

        break;
      }

      // PAYMENT FAILED OR CANCELED
      case "payment_intent.canceled":
      case "payment_intent.payment_failed": {
        const failedPaymentIntent =
          event.data.object as Stripe.PaymentIntent;

        const paymentIntentId = failedPaymentIntent.id;

        // Get checkout session
        const sessionFailure =
          await stripe.checkout.sessions.list({
            payment_intent: paymentIntentId,
          });

        if (!sessionFailure.data.length) {
          return response.status(404).send("Session not found");
        }

        const failureOrderId =
          sessionFailure.data[0].metadata?.orderId;

        // Delete failed order
        if (failureOrderId) {
          await prisma.order.delete({
            where: { id: failureOrderId },
          });
        }

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Success response
    return response.json({
      received: true,
    });
  } catch (error: any) {
    console.log("Webhook Error:", error.message);

    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};