document.getElementById('pricingCheckoutBtn')?.addEventListener('click', async () => {
const token = localStorage.getItem('token');

if (!token) {
window.location.href = '/login';
return;
}

try {
const res = await fetch('/api/payments/create-checkout-session', {
method: 'POST',
headers: {
Authorization: `Bearer ${token}`,
'Content-Type': 'application/json'
}
});

const data = await res.json();

if (data.url) {
window.location.href = data.url;
}
} catch (error) {
alert('Checkout failed');
}
});
