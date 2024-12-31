// Use dynamic import to load node-fetch
let fetch;
try {
    fetch = (await import('node-fetch')).default;
} catch (error) {
    console.error('Failed to import node-fetch:', error);
    throw error;
}

export default async function handler(req, res) {
    const { url } = req.query;
    const songId = url.split('/').pop();

    let fetch;
    try {
        fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
    } catch (error) {
        console.error('Failed to import node-fetch:', error);
        res.status(500).json({ error: 'Failed to import node-fetch' });
        return;
    }

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