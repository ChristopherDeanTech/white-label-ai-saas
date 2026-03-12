const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(priceId, email) {
const session = await stripe.checkout.sessions.create({
mode: "subscription",
line_items: [
{
price: priceId,
quantity: 1
}
],
customer_email: email,
success_url: `${process.env.BASE_URL}/pages/dashboard.html`,
cancel_url: `${process.env.BASE_URL}/pages/pricing.html`
});

return session;
}

module.exports = { createCheckoutSession };