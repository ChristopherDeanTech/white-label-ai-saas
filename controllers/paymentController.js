const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
try {
const session = await stripe.checkout.sessions.create({
payment_method_types: ["card"],
mode: "subscription",
line_items: [
{
price: process.env.STRIPE_PRICE_ID,
quantity: 1
}
],
success_url: `${process.env.APP_URL}/success`,
cancel_url: `${process.env.APP_URL}/cancel`,
client_reference_id: req.user.id
});

res.status(200).json({ url: session.url });
} catch (error) {
res.status(500).json({
message: "Failed to create checkout session",
error: error.message
});
}
};