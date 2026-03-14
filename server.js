require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// 1. SERVE FRONTEND FILES
app.use(express.static(__dirname));

// 2. DATABASE CONNECTION
// This creates a pool of connections to your MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Test Database Connection
pool.getConnection()
    .then(conn => {
        console.log("✅ Database Connected Successfully!");
        conn.release();
    })
    .catch(err => console.log("⚠️ Database not connected yet. (Check your MySQL settings)"));


// 3. OTP AUTHENTICATION SYSTEM
const otpDatabase = {}; // Temporary memory for OTPs

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route: Generate & Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpDatabase[email] = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

    const mailOptions = {
        from: `"FindBack Security" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your FindBack Access Token',
        html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #8b5cf6;">FindBack System</h2>
                <p>Hello ${name || 'User'}, your secure initialization token is:</p>
                <h1 style="letter-spacing: 5px; background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h1>
                <p style="color: #888; font-size: 12px;">This code expires in 5 minutes.</p>
               </div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[AUTH] OTP sent to ${email}`);
        res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
        console.error("[ERROR] Email failed:", error);
        res.status(500).json({ error: "Failed to send email." });
    }
});

// Route: Verify OTP & Register User
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp, name, phone } = req.body;
    const record = otpDatabase[email];

    if (!record) return res.status(400).json({ error: "No OTP requested." });
    if (Date.now() > record.expiresAt) {
        delete otpDatabase[email];
        return res.status(400).json({ error: "OTP expired." });
    }

    if (record.code === otp) {
        delete otpDatabase[email]; 

        try {
            // Save user to database if they don't exist yet!
            const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length === 0 && name && phone) {
                await pool.execute('INSERT INTO users (full_name, phone_number, email) VALUES (?, ?, ?)', [name, phone, email]);
                console.log(`[DB] New user registered: ${email}`);
            }
            res.status(200).json({ message: "Authentication successful!" });
        } catch (dbError) {
            console.error("[DB ERROR]:", dbError);
            // We still let them log in even if DB fails during prototype phase
            res.status(200).json({ message: "Auth successful (DB offline)" }); 
        }
    } else {
        res.status(400).json({ error: "Invalid Token." });
    }
});

// 4. ODYSSEY AI SECURE PROXY ROUTE
// Frontend asks this route -> This route asks Google -> Returns answer to Frontend
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) return res.status(400).json({ error: "Message is required." });

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "You are Odyssey, an AI assistant for a lost-and-found app called FindBack. Keep responses brief. User says: " + message }] }]
            })
        });
        
        const data = await response.json();
        
        if(data.candidates && data.candidates[0].content.parts[0].text) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: "Odyssey could not generate a response." });
        }
    } catch (error) {
        console.error("[AI ERROR]:", error);
        res.status(500).json({ error: "Failed to connect to Odyssey servers." });
    }
});

// 5. FALLBACK ROUTE
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 FindBack System Active`);
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`=========================================\n`);
});