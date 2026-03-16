const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
try {
const { plan } = req.body;

console.log('Selected plan:', plan);
console.log('Basic price:', process.env.STRIPE_PRICE_BASIC);
console.log('Pro price:', process.env.STRIPE_PRICE_PRO);
console.log('Agency price:', process.env.STRIPE_PRICE_AGENCY);
console.log('Client URL:', process.env.CLIENT_URL);

let priceId;

if (plan === 'basic') {
priceId = process.env.STRIPE_PRICE_BASIC;
} else if (plan === 'pro') {
priceId = process.env.STRIPE_PRICE_PRO;
} else if (plan === 'agency') {
priceId = process.env.STRIPE_PRICE_AGENCY;
} else {
return res.status(400).json({ error: 'Invalid plan selected' });
}

if (!priceId) {
return res.status(500).json({ error: 'Missing Stripe price ID in .env' });
}

const session = await stripe.checkout.sessions.create({
mode: 'subscription',
payment_method_types: ['card'],
line_items: [
{
price: priceId,
quantity: 1
}
],
success_url: `${process.env.CLIENT_URL}/success.html`,
cancel_url: `${process.env.CLIENT_URL}/cancel.html`
});

res.json({ url: session.url });
} catch (error) {
console.error('Stripe checkout error full:', error);
res.status(500).json({ error: error.message });
}
});

module.exports = router;