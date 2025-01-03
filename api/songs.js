import { google } from 'googleapis';

export default async function handler(req, res) {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            type: "service_account",
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const request = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1!A12:A200',
        auth: authClient,
    };

    try {
        const sheets = google.sheets('v4');
        const response = await sheets.spreadsheets.values.get(request);
        
        // Flatten the array and remove duplicates using a Set
        const uniqueValues = [...new Set(response.data.values.flat())];

        res.status(200).json(uniqueValues);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
}

console.log('Environment Variables:', {
    SPREADSHEET_ID: process.env.SPREADSHEET_ID,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 'Exists' : 'Missing',
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
});
