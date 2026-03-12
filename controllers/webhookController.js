const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');

exports.handleStripeWebhook = async (req, res) => {
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
switch (event.type) {
case 'checkout.session.completed': {
const session = event.data.object;
const userId = session.metadata?.userId;

if (userId) {
await User.findByIdAndUpdate(userId, {
subscriptionStatus: 'active'
});
}
break;
}

case 'customer.subscription.created': {
const subscription = event.data.object;
const customerId = subscription.customer;

await User.findOneAndUpdate(
{ stripeCustomerId: customerId },
{
subscriptionStatus: 'active',
stripeSubscriptionId: subscription.id
}
);
break;
}

case 'customer.subscription.deleted': {
const subscription = event.data.object;

await User.findOneAndUpdate(
{ stripeSubscriptionId: subscription.id },
{
subscriptionStatus: 'free'
}
);
break;
}

case 'invoice.payment_failed': {
const invoice = event.data.object;
const customerId = invoice.customer;

await User.findOneAndUpdate(
{ stripeCustomerId: customerId },
{
subscriptionStatus: 'past_due'
}
);
break;
}

default:
console.log(`Unhandled event type: ${event.type}`);
}

res.json({ received: true });
} catch (error) {
console.error('Webhook handling error:', error.message);
res.status(500).json({ message: error.message });
}
};
