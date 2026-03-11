require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  CALENDLY_API_KEY: process.env.CALENDLY_API_KEY
};