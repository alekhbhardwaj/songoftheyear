const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public'));

const clientId = process.env.CLIENT_ID; 
const clientSecret = process.env.CLIENT_SECRET;

const auth = new google.auth.GoogleAuth({
    credentials: {
        "type": "service_account",
        "project_id": "songoftheyear",
        "private_key_id": "d44bc7cccd62f6fc68a24e110fff25864ab3df9d",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC2plqtxTuf6ZSm\nMOuePE0vpa/SaMJ68OBd9VgkcUqz4rOz8+/tw7snOBYglc32kIaDQwlHUhuPaZkr\nGCuD1eaaHd4jQzDgt2oG/YyT+jQ8NT3XYVzTw4huG2L0n1BnB1jvPFOlWRKUJwwq\newZ3RjFLuVHsjVUOPo+XzUAj8b5blVvRgqopXZAScAmF1rVu9Xo1PSg3GeCnt/uB\n18RLPmooFTjDNmDrAlO95sYngOVbyWBTJoTCqp8TP6ZLeEGm6uPnFKscDMTAvKeC\nIndT5fNsE7GYtDGOKVBWGKuTxFGNkx0DuRrqRaUs9aOumQYzvp9IMMukbzcRLB33\nrRYR5nBZAgMBAAECggEABS4nLL4HEKREk8kX6as+qi8KE07m0ytRRcDvYMs4yezQ\nWXZ989GlFXntALwW9RsIwaDNWtE8mF7vme4Lz+epbG4T7o6ZjIoPLwcSbWD/icSd\nziXEBvqI/Ex5DESXeHCYKGLe4XXrBbosyWinWIssW0A0j1+7zZVfJ7hJzSsuUbUY\ntvQxIYg3AFGpw+jp4gOQUm69pcoV07YT9Z8E+zWehxTfgG+bl++IliciIgnR+1p7\nGbqfiu1Cq2xklWBXzXomNg7S9TKH+wri9cNHQgh9tp4cGUKPmVLP/UtLCj27bZE2\niSdTgiPGFgAnltgYLwtU4BUGCQf8ZbZ8kdA9vQ1zLQKBgQDj1tyNgn2SM8iAQOxE\nBLuzJEMzZVKL9NBebdlvJb5+Q8BdYXTLbQDMmTsuTywPuNiSL2kg5bue4myuxlyf\nn2GBzvpwbFII9zU3f+rY9KFM4+pXMTcq8yAySx5VQcWT2xn56OlP3SyidfZwAP36\neCpXHUmwsun+/neBEkZA9tnONQKBgQDNOaMsbNgi+4Ugli87VSkrb3LM+k6hrouF\nBG7pCKHN1vxSTQwxh+eh1iuJXC1N2SQvCTshv0fSRJRM1tMYU8ZwbHSTctI51Ojp\n147U1a3XB/8cK2rdgpEdM6v1flcRzp5ya13WEvJY3BTHN+SE8qIrQb6zXX7TF4Hs\nxVZd7m8uFQKBgQCtQ+XAG99Awu6UUksawvq3FjmgqUooMwoO9bzoIK0IOp/co9N9\nLCzyawktg3n/jtPr//AT24FeJ9T86M7heQRfAjdELawJM24eAcJoMUlFPwIkQsIw\ngGoYtTWhIn6NnY7YlX5whMN/3POHY8nBo4aXbyduH/GBQKVC29Hfb5pdjQKBgQCJ\nLp4EdD2GJNs4jSvFXYfHoRf8LNWi/ioFIJGC9GI0ViEUYqxj75TGeYNgrl0aTKwD\nRQhh5pr70xvOwUsaV+WuANFsPrSIM+n9Zjnzy2II+y9shRlKOJ0ICCJKV8mb/aGs\nmlh/YOreuz6obJQ0ynvcrnXrL/Q25t/ShZbV8ywegQKBgQCiJRlqXSqw8KCYz4k4\n1pbJs3vDbTx0t+hwgpq9M2Q0+tULn6JpusJq1gTfA8QZnegHcwn03aZLUFUqgkN+\nYsXUtRsblTU8WIKOdhHDgwpVBdf7V0ZgtETVLA2+NnomJ9GkvF5TspCPimx0a1b2\n46KoteKOyGu5pQpy7RCg90FEog==\n-----END PRIVATE KEY-----\n",
        "client_email": "service-account@songoftheyear.iam.gserviceaccount.com",
        "client_id": "114403551100305471167",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40songoftheyear.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      }
      ,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});


app.get('/token', async (req, res) => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authOptions = {
        method: 'post',
        url: tokenUrl,
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
    };

    try {
        const response = await axios(authOptions);
        res.send(response.data.access_token);
    } catch (error) {
        res.send(error);
    }
});

app.get('/songs', async (req, res) => {
    const authClient = await auth.getClient();
    const request = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1!A1:A70',
        auth: authClient,
    };

    try {
        const response = await sheets.spreadsheets.values.get(request);
        const songs = response.data.values.flat(); // Flatten the array of arrays to a single array
        res.send(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.send([]);
    }
});

app.get('/spotify/:url', async (req, res) => {
    const spotifyUrl = req.params.url;
    const songId = spotifyUrl.split('/').pop(); // Extracts the song ID from the URL
    const token = await getToken();

    const options = {
        method: 'get',
        url: `https://api.spotify.com/v1/tracks/${songId}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios(options);
        res.send({
            thumbnailUrl: response.data.album.images[0].url,
            spotifyUrl: spotifyUrl
        });
    } catch (error) {
        console.error('Error fetching song data:', error);
        res.send(error);
    }
});


async function getToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authOptions = {
        method: 'post',
        url: tokenUrl,
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
    };

    try {
        const response = await axios(authOptions);
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
