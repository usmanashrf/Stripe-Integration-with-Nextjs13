import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET as string;

export  async function POST(req: any, res: any){
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let stripeEvent;
    try {
        stripeEvent = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        console.log( 'stripeEvent', stripeEvent );
    } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    if ( 'checkout.session.completed' === stripeEvent.type ) {
        const session = stripeEvent.data.object;
        console.log( 'payment success', session );
        res.json({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}