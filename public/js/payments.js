const stripe = Stripe("pk_live_51T9GCnHVpuxjxsYljktX6RYoAl8yRl3kaMhJWwvWngxErORaDi9Ac31yzJcaNlzStAPgeZPn9wWUJQkFKvOBiyvP00UMup1BRU");

async function startCheckout() {
const response = await fetch("/api/payments/create-checkout-session", {
method: "POST"
});

const session = await response.json();

stripe.redirectToCheckout({
sessionId: session.id
});
}