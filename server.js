const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;

// TikTok OAuth callback
app.get('/tiktok/callback', async (req, res) => {
    const authCode = req.query.auth_code; // TikTok sends 'auth_code'
    const state = req.query.state;

    if (!authCode) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        // Exchange auth code for access token
        const response = await axios.post('https://open-api.tiktokglobalshop.com/api/v1/oauth/token', {
            app_key: 'YOUR_APP_KEY',
            app_secret: 'YOUR_APP_SECRET',
            auth_code: authCode,
            grant_type: 'authorization_code'
        });

        const accessToken = response.data.data.access_token;

        console.log('Access token:', accessToken);

        // You can save the token in a DB or just return it
        res.send(`Access token received: ${accessToken}`);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error exchanging auth code');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
