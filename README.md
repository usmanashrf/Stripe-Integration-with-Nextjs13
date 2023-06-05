# Nextjs_Stripe_Integration
- First create Nextjs 13 app and add product page, you can see in /components/Product/Product.tsx
- Create stripe account and open dashboard then add new a project 
- Install stripe in you local project
 ```
 npm install stripe
 ```
 - Add the required environment variables. Create a new file .env.local in the root directory with the following data.
 ```
 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
 ```
- You can get these credentials from Dashboard -> Developers -> API Keys.
- Now need to build an API to get the session id that is required for redirecting the user to the checkout page.
- Create a new file in api/create-stripe-session.js. And add the following.
```
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});
```
