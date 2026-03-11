require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
res.send("API is running");
});

// Create Stripe Checkout Session
app.post("/api/stripe/create-checkout-session", async (req, res) => {
try {
const session = await stripe.checkout.sessions.create({
payment_method_types: ["card"],
mode: "subscription",
line_items: [
{
price: process.env.STRIPE_PRICE_BASIC,
quantity: 1,
},
],
success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.CLIENT_URL}/cancel`,
});

res.status(200).json({ url: session.url });
} catch (error) {
console.error("Stripe checkout error:", error.message);
res.status(500).json({ error: "Failed to create checkout session" });
}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});