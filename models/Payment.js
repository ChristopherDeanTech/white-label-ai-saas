const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
stripeSessionId: { type: String, unique: true, sparse: true },
stripePaymentIntentId: { type: String, default: "" },
customerEmail: { type: String, default: "" },
customerName: { type: String, default: "" },
amountTotal: { type: Number, default: 0 },
currency: { type: String, default: "usd" },
paymentStatus: { type: String, default: "unpaid" },
bookingUnlocked: { type: Boolean, default: false },
metadata: { type: Object, default: {} }
},
{ timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);