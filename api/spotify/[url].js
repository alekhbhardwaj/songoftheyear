import axios from 'axios';

async function getToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authOptions = {
        method: 'post',
        url: tokenUrl,
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: 'grant_type=client_credentials',
    };

    try {
        const response = await axios(authOptions);
        return response.data.access_token;
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
        const options = {
            method: 'get',
            url: `https://api.spotify.com/v1/tracks/${songId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await axios(options);
        res.status(200).json({
            thumbnailUrl: response.data.album.images[0].url,
            spotifyUrl: `https://open.spotify.com/track/${songId}`,
        });
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        res.status(500).json({ error: 'Failed to fetch Spotify data' });
    }
}
