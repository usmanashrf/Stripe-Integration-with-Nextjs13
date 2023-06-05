import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "micro";
import getRawBody from "raw-body";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export  async function POST(req: any, res: any){
    
    try {
    const rawBody = await req.text();
    console.log("rawBody.-----------...........----------......------",rawBody);
    const sig = req.headers.get("stripe-signature") as string
    //req.headers["stripe-signature"];
    console.log("sig-----------=============-------====-=-=-", sig);

    const event = stripe.webhooks.constructEvent(rawBody,sig,webhookSecret);

    console.log("Hello usman-----------------");
    console.log(event);

    if ( 'checkout.session.completed' === event.type ) {
        const session = event.data.object;

        console.log( 'payment success-----------------------', session );

        const line_Items  = await stripe.checkout.sessions.listLineItems(event.data.object!.id);
console.log("Line Items==========================",line_Items);

        // res.json({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        // res.status(405).end("Method Not Allowed");
    }
    } catch (err: any) {
        console.log("Error in webhook----------", err);
        // res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
   
}