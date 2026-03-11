const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async () => {

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "AI SaaS Subscription" },
          unit_amount: 2000
        },
        quantity: 1
      }
    ],
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel"
  });

  return session;
};