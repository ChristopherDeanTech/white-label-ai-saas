const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/api');
const paymentRoutes = require('./routes/payments');
const schedulingRoutes = require('./routes/scheduling');
const webhookRoutes = require('./routes/webhook');
const errorHandler = require('./middleware/errorhandler');

const app = express();

app.use(cors());

// Stripe webhook route must come before express.json()
app.use('/api/webhook/stripe', webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/scheduling', schedulingRoutes);

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/signup', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pages', 'signup.html'));
});

app.get('/pricing', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pages', 'pricing.html'));
});

app.get('/dashboard', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
console.log('MongoDB connected');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((error) => {
console.error('MongoDB connection error:', error.message);
});