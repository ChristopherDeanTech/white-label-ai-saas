async function subscribePlan(plan) {
try {
const response = await fetch('/api/payments/create-checkout-session', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ plan })
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.error || 'Unable to create checkout session');
}

window.location.href = data.url;
} catch (error) {
console.error('Subscription error:', error);
alert(error.message || 'Something went wrong starting checkout.');
}
}
