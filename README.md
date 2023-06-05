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
