require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const hubspotRoutes = require("./routes/hubspot");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/hubspot", hubspotRoutes);

// Page routes
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/contact", (req, res) => {
res.sendFile(path.join(__dirname, "public", "contact.html"));
});

// Health check
app.get("/api/health", (req, res) => {
res.json({ ok: true, message: "Server is running" });
});

// 404
app.use((req, res) => {
res.status(404).json({ ok: false, message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
console.error("Server error:", err);
res.status(500).json({
ok: false,
message: "Internal server error"
});
});

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});
