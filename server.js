require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const hubspotRoutes = require("./routes/hubspot");
const paymentRoutes = require("./routes/payments");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/hubspot", hubspotRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/contact", (req, res) => {
res.sendFile(path.join(__dirname, "public", "contact.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});