require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static frontend
app.use(express.static(path.join(__dirname, 'public')));

// routes
const paymentsRoute = require('./routes/payments');
app.use('/api/payments', paymentsRoute);

// homepage
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// health check
app.get('/health', (req, res) => {
res.json({ status: 'ok' });
});

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
