// Vercel Serverless Function — forwards form data to Google Apps Script Web App
// which writes it directly into your Google Sheet.
//
// Required environment variable in Vercel dashboard:
//   APPS_SCRIPT_URL  — the Web App URL from your Google Apps Script deployment

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return res.status(500).json({ error: 'Server misconfigured: APPS_SCRIPT_URL not set.' });
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow', // Apps Script redirects once before responding
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Apps Script sometimes returns HTML on auth errors
      throw new Error('Unexpected response from Apps Script. Check deployment settings.');
    }

    if (!result.success) {
      throw new Error(result.error || 'Apps Script returned an error.');
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Submit error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
