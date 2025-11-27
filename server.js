const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// 1️⃣ Callback route — REQUIRED so TikTok can return the ?code
app.get("/tiktok/callback", (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Missing ?code");
    }

    // Just show the code on screen so you can copy it
    return res.send("Authorization code: " + code);
});


// 2️⃣ Exchange authorization code → access token
app.post('/get-token', async (req, res) => {
    const { auth_code } = req.body;

    if (!auth_code) {
        return res.status(400).json({ error: 'auth_code is required' });
    }

    try {
        const response = await axios.post(
            "https://open-api.tiktokglobalshop.com/api/v1/oauth/token",
            {
                app_key: process.env.TIKTOK_APP_KEY,
                app_secret: process.env.TIKTOK_APP_SECRET,
                auth_code: auth_code,
                grant_type: "authorization_code"
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        return res.status(200).json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        return res.status(500).json({ error: err.response?.data || err.message });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
