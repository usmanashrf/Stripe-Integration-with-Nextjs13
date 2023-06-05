# Nextjs_Stripe_Integration
### Demo project link https://sanity-integration-usmanashrf.vercel.app/
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
- Create a new file in api/create-stripe-session.ts. And add the following.
```
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});
```

- Creating the shape for the item needed by Stripe.

There is a particular type of object which Stripe expects to get, this is the object. You should use your local currency instead of "usd" if you want.

```
const transformedItem = {
         price_data: {
          currency: 'usd',
          product_data:{
            name: item.name,
            description: item.description,
            images:[item.image],
            metadata:{name:"some additional info",
                     task:"Usm created a task"},

          },
          unit_amount: item.price * 100,

        },
        quantity: item.quantity,
        
      };
```
### Creating Stripe Session in the backend
in api/create-stripe-session.ts. file you will need to create a stripe session object where you need to define some data.

```
 const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://stripe-checkout-next-js-demo.vercel.app';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [transformedItem],
        mode: 'payment',
        success_url: redirectURL + '/payment/success',
        cancel_url: redirectURL + '/payment/fail',
        metadata: {
          images: item.image,
        },
      });
      return NextResponse.json(session?.id) ;
```

- payment_method_type: In this, we add the payment methods to pay the price of the product. [Click here](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-payment_method_types) to know more payment methods.
- success_url: In [success_url](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-success_url), you define where the user will go after the payment is successful.
- cancel_url: In the [cancel_url](https://stripe.com/docs/api/checkout/sessions/object#checkout_session_object-cancel_url), you define where the user will go if the user clicks the back button. It can be a cancel page or   the checkout page as well.
- metadata: In [metadata](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-metadata), we will add images of the product, if you want you can add other options too.

Now, our backend is ready, now we have to send a POST request to API to get the session.

#### Redirecting to Stripe Checkout Page
install following library
```
import { loadStripe } from "@stripe/stripe-js";
```

```
npm install @stripe/stripe-js
```

in your Product.tsx file add below code
```
  const publishableKey = process.env
    .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
  const stripePromise = loadStripe(publishableKey);
```
- Now, we'll create createCheckoutSession function to get the Stripe Session for the checkout.
```
const createCheckOutSession = async () => {
    
    const stripe = await stripePromise;

    const checkoutSession = await fetch(
      "http://localhost:3000/api/create-stripe-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: item,
        }),
      }
    );

    const sessionID= await checkoutSession.json();
    const result = await stripe?.redirectToCheckout({
      sessionId: sessionID,
    });
    if (result?.error) {
      alert(result.error.message);
    }
  };
```
Now, we have to call this function while the user clicks the Buy button.
And onClick={createCheckoutSession}

```
<button
  disabled={item.quantity === 0}
  onClick={createCheckOutSession}
  className='bg-blue-500 hover:bg-blue-600 text-white block w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-blue-100'
>
  Buy
</button>
```
- we have came to end now run your project
```
npm run dev
```
