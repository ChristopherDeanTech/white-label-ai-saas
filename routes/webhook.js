const express = require('express');
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DATA_FILE = path.join(__dirname, '..', 'data', 'subscriptions.json');

function readSubscriptions() {
try {
const raw = fs.readFileSync(DATA_FILE, 'utf8');
return JSON.parse(raw || '{}');
} catch (err) {
return {};
}
}

function writeSubscriptions(data) {
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getPlanFromPriceId(priceId) {
if (priceId === process.env.STRIPE_PRICE_BASIC) return 'basic';
if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
if (priceId === process.env.STRIPE_PRICE_AGENCY) return 'agency';
return 'basic';
}

router.post('/', async (req, res) => {
const sig = req.headers['stripe-signature'];

let event;
try {
event = stripe.webhooks.constructEvent(
req.body,
sig,
process.env.STRIPE_WEBHOOK_SECRET
);
} catch (err) {
console.error('Webhook signature verification failed:', err.message);
return res.status(400).send(`Webhook Error: ${err.message}`);
}

try {
const subscriptions = readSubscriptions();

switch (event.type) {
case 'checkout.session.completed': {
const session = event.data.object;
const email = (session.customer_details?.email || '').toLowerCase();
if (email) {
subscriptions[email] = {
...(subscriptions[email] || {}),
email,
customerId: session.customer,
checkoutCompleted: true,
lastCheckoutSessionId: session.id,
updatedAt: new Date().toISOString()
};
}
break;
}

case 'customer.subscription.created':
case 'customer.subscription.updated': {
const subscription = event.data.object;
const customerId = subscription.customer;
const priceId = subscription.items?.data?.[0]?.price?.id;
const plan = getPlanFromPriceId(priceId);

const customer = await stripe.customers.retrieve(customerId);
const email = (customer.email || '').toLowerCase();

if (email) {
subscriptions[email] = {
...(subscriptions[email] || {}),
email,
customerId,
subscriptionId: subscription.id,
subscriptionStatus: subscription.status,
plan,
currentPeriodEnd: subscription.current_period_end || null,
updatedAt: new Date().toISOString()
};
}
break;
}

case 'customer.subscription.deleted': {
const subscription = event.data.object;
const customerId = subscription.customer;

const customer = await stripe.customers.retrieve(customerId);
const email = (customer.email || '').toLowerCase();

if (email && subscriptions[email]) {
subscriptions[email] = {
...(subscriptions[email] || {}),
subscriptionId: subscription.id,
subscriptionStatus: 'canceled',
updatedAt: new Date().toISOString()
};
}
break;
}

default:
break;
}

writeSubscriptions(subscriptions);
res.json({ received: true });
} catch (err) {
console.error('Webhook handling error:', err);
res.status(500).json({ error: err.message });
}
});

module.exports = router;
