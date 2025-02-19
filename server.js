require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors"); 
const app = express();
app.use(express.json());

// Allow all origins for now (but restrict this in production)
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

const context = `
    You are a virtual assistant for Dr. Atarizvi's Chronic Care Clinic.
    Your job is to provide accurate, compassionate, and friendly responses based on the clinic's services.
    Be empathetic and helpful, making sure the patient feels valued and supported.

    
    `;

    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: `${context}\nUser: ${message}\nAI:` }] }],
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Server error" });
  }
});

// Handle OPTIONS preflight requests
app.options("*", (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
