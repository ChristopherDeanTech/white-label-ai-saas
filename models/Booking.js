const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
calendlyEvent: { type: String, default: "" },
inviteeName: { type: String, default: "" },
inviteeEmail: { type: String, default: "" },
scheduledEventUri: { type: String, default: "" },
inviteeUri: { type: String, default: "", unique: true, sparse: true },
status: { type: String, default: "scheduled" },
rawPayload: { type: Object, default: {} }
},
{ timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);