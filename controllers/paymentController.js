const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user');

exports.createCheckoutSession = async (req, res) => {
try {
const user = await User.findById(req.user.id);

if (!user) {
return res.status(404).json({ message: 'User not found' });
}

let customerId = user.stripeCustomerId;

if (!customerId) {
const customer = await stripe.customers.create({
email: user.email,
name: user.name,
metadata: {
userId: user._id.toString()
}
});

customerId = customer.id;
user.stripeCustomerId = customerId;
await user.save();
}

const session = await stripe.checkout.sessions.create({
customer: customerId,
payment_method_types: ['card'],
mode: 'subscription',
line_items: [
{
price: process.env.STRIPE_PRICE_ID,
quantity: 1
}
],
success_url: `${process.env.CLIENT_URL}/success.html`,
cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
metadata: {
userId: user._id.toString()
}
});

res.json({ url: session.url });
} catch (error) {
res.status(500).json({ message: error.message });
}
};