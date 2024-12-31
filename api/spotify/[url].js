import got from 'got';

async function getToken() {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authOptions = {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    };

    try {
        const response = await got.post(tokenUrl, authOptions).json();
        return response.access_token;
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
        const response = await got.get(`https://api.spotify.com/v1/tracks/${songId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).json();
        res.status(200).json({
            thumbnailUrl: response.album.images[0].url,
            spotifyUrl: `https://open.spotify.com/track/${songId}`,
        });
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        res.status(500).json({ error: 'Failed to fetch Spotify data' });
    }
}