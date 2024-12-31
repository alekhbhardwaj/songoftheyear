const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const sheets = google.sheets('v4');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public'));

const clientId = CLIENT_ID;
const clientSecret = CLIENT_SECRET;

const auth = new google.auth.GoogleAuth({
    keyFile: 'C:\\Users\\Alekh\\SongOfTheYear\\songoftheyear-d44bc7cccd62.json',
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
        spreadsheetId: SPREADSHEET_ID,
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
