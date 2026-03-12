const token = localStorage.getItem('token');

if (!token) {
window.location.href = '/login';
}

async function loadProfile() {
try {
const res = await fetch('/api/auth/profile', {
headers: {
Authorization: `Bearer ${token}`
}
});

const data = await res.json();

if (!res.ok) {
localStorage.removeItem('token');
window.location.href = '/login';
return;
}

document.getElementById('userInfo').textContent =
`Logged in as ${data.name} (${data.email})`;

document.getElementById('subscriptionStatus').textContent =
data.subscriptionStatus || 'free';
} catch (error) {
document.getElementById('userInfo').textContent = 'Could not load profile';
}
}

async function askAI() {
const prompt = document.getElementById('promptInput').value;

if (!prompt.trim()) return;

try {
const res = await fetch('/api/ai/ask', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`
},
body: JSON.stringify({ prompt })
});

const data = await res.json();
document.getElementById('aiResponse').textContent =
data.response || data.message || 'No response';
} catch (error) {
document.getElementById('aiResponse').textContent = 'AI request failed';
}
}

async function startCheckout() {
try {
const res = await fetch('/api/payments/create-checkout-session', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`
}
});

const data = await res.json();

if (data.url) {
window.location.href = data.url;
}
} catch (error) {
alert('Could not start checkout');
}
}

async function loadCalendlyLink() {
try {
const res = await fetch('/api/scheduling/link', {
headers: {
Authorization: `Bearer ${token}`
}
});

const data = await res.json();
document.getElementById('bookingLink').href = data.url;
} catch (error) {
document.getElementById('bookingLink').textContent = 'Calendly unavailable';
}
}

document.getElementById('askAiBtn').addEventListener('click', askAI);
document.getElementById('checkoutBtn').addEventListener('click', startCheckout);
document.getElementById('logoutBtn').addEventListener('click', (e) => {
e.preventDefault();
localStorage.removeItem('token');
window.location.href = '/login';
});

loadProfile();
loadCalendlyLink();
