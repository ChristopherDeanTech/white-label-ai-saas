const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

if (signupForm) {
signupForm.addEventListener('submit', async (e) => {
e.preventDefault();

const payload = {
name: document.getElementById('name').value,
email: document.getElementById('email').value,
password: document.getElementById('password').value
};

try {
const res = await fetch('/api/auth/signup', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(payload)
});

const data = await res.json();

document.getElementById('signupMessage').textContent =
data.message || 'Signup complete';

if (data.token) {
localStorage.setItem('token', data.token);
window.location.href = '/dashboard';
}
} catch (error) {
document.getElementById('signupMessage').textContent = 'Signup failed';
}
});
}

if (loginForm) {
loginForm.addEventListener('submit', async (e) => {
e.preventDefault();

const payload = {
email: document.getElementById('loginEmail').value,
password: document.getElementById('loginPassword').value
};

try {
const res = await fetch('/api/auth/login', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(payload)
});

const data = await res.json();

document.getElementById('loginMessage').textContent =
data.message || 'Login complete';

if (data.token) {
localStorage.setItem('token', data.token);
window.location.href = '/dashboard';
}
} catch (error) {
document.getElementById('loginMessage').textContent = 'Login failed';
}
});
}
