import fetch from 'node-fetch';

async function getToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authOptions = {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    };

    try {
        const response = await fetch(tokenUrl, authOptions);
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    const { url } = req.query;
    const songId = url.split('/').pop();

    try {
        const token = await getToken();
        const response = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        res.status(200).json({
            thumbnailUrl: data.album.images[0].url,
            spotifyUrl: `https://open.spotify.com/track/${songId}`,
        });
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        res.status(500).json({ error: 'Failed to fetch Spotify data' });
    }
}
