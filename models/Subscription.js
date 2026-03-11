const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},
stripeCustomerId: {
type: String,
default: ""
},
stripeSubscriptionId: {
type: String,
default: ""
},
plan: {
type: String,
default: "free"
},
status: {
type: String,
default: "inactive"
},
createdAt: {
type: Date,
default: Date.now
}
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);