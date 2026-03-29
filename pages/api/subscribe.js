// pages/api/subscribe.js
// Handles quiz email capture and adds contact to Brevo

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, answers, recommendations } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Add contact to Brevo with custom attributes
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        updateEnabled: true, // update if contact already exists
        listIds: [2], // change to your Brevo list ID
        attributes: {
          QUIZ_GOAL: answers?.goal || '',
          QUIZ_AGE: answers?.age || '',
          QUIZ_DIET: answers?.diet || '',
          QUIZ_CONDITION: answers?.condition || '',
          QUIZ_MEDS: answers?.meds || '',
          QUIZ_RECS: (recommendations || []).join(', '),
          SIGNUP_SOURCE: 'supplement-quiz',
        },
      }),
    });

    if (!brevoRes.ok) {
      const errBody = await brevoRes.json();
      // Code 400 + message about duplicate is fine — contact already exists
      if (brevoRes.status === 400 && errBody.code === 'duplicate_parameter') {
        return res.status(200).json({ success: true });
      }
      console.error('Brevo error:', errBody);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }

    // Optional: trigger a welcome/lead-magnet transactional email
    // Uncomment and set your templateId from Brevo dashboard
    /*
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        to: [{ email }],
        templateId: 1, // 2
        params: {
          RECOMMENDATIONS: (recommendations || []).join(', '),
          GOAL: answers?.goal,
        },
      }),
    });
    */

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}