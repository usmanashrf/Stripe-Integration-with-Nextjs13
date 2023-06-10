import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export  async function POST(req: any, res: any){
    
    try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature") as string
    console.log("sig-----------=============-------====-=-=-", sig);

    const event = stripe.webhooks.constructEvent(rawBody,sig,webhookSecret);

   // console.log(event);

    if ( 'checkout.session.completed' === event.type ) {
        const session = event.data.object;

        console.log( 'payment success-----------------------', session );

        const line_Items  = await stripe.checkout.sessions.listLineItems(event.data.object!.id);
    //console.log("Line Items==========================",line_Items);
    

    //Once you'll get data you can use it according to your 
    //reqirement for making update in DB

        
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