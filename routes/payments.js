const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
try {
const { plan } = req.body;

const priceMap = {
basic: process.env.STRIPE_PRICE_BASIC,
pro: process.env.STRIPE_PRICE_PRO,
agency: process.env.STRIPE_PRICE_AGENCY
};

const priceId = priceMap[plan];

if (!priceId) {
return res.status(400).json({
message: "Invalid plan selected."
});
}

const session = await stripe.checkout.sessions.create({
mode: "subscription",
payment_method_types: ["card"],
line_items: [
{
price: priceId,
quantity: 1
}
],
success_url: `${process.env.APP_URL}/success.html`,
cancel_url: `${process.env.APP_URL}/cancel.html`
});

return res.status(200).json({ url: session.url });
} catch (error) {
console.error("Stripe checkout error:", error);
return res.status(500).json({
message: error.message || "Unable to create checkout session."
});
}
});

module.exports = router;