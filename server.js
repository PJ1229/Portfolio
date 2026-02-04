// server.js
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
require("dotenv").config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "64kb" })); // parse JSON body with size cap
app.use(express.static(path.join(__dirname, "public"))); // serve static files

const requiredEnv = ["EMAIL_USER", "EMAIL_PASS"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error(`Missing required env vars: ${missingEnv.join(", ")}`);
  process.exit(1);
}

// --- Serve index.html at root ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Contact API endpoint ---
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const { subject, name, email, message } = req.body;

  if (!subject || !name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const trimmedSubject = String(subject).trim();
  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedMessage = String(message).trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !trimmedSubject ||
    !trimmedName ||
    !trimmedEmail ||
    !trimmedMessage ||
    trimmedSubject.length > 120 ||
    trimmedName.length > 120 ||
    trimmedEmail.length > 254 ||
    trimmedMessage.length > 4000 ||
    !emailRegex.test(trimmedEmail)
  ) {
    return res.status(400).json({ error: "Invalid input." });
  }

  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // Email content
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      replyTo: trimmedEmail,
      to: process.env.EMAIL_USER,
      subject: `[Portfolio Contact] ${trimmedSubject}`,
      text: `
        📬 New message from your portfolio site:

        Name: ${trimmedName}
        Email: ${trimmedEmail}
        Subject: ${trimmedSubject}

        Message:
        ${trimmedMessage}
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent from ${email}`);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// --- Server startup ---
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
