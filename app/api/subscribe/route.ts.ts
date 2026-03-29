import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { email, answers, recommendations } = await req.json();

    if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                email,
                updateEnabled: true,
                listIds: [2], // Replace with your actual list ID
                attributes: {
                    QUIZ_GOAL: answers?.goal || '',
                    QUIZ_AGE: answers?.age || '',
                    QUIZ_DIET: answers?.diet || '',
                    QUIZ_CONDITION: answers?.condition || '',
                    QUIZ_MEDS: answers?.meds || '',
                    QUIZ_RECS: (recommendations || []).join(','),
                    SIGNUP_SOURCE: 'supplement-quiz',
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 400 && data.code === 'duplicate_parameter') {
                return NextResponse.json({ success: true, message: 'Contact already exists' });
            }
            
            console.error('Brevo API error:', data);
            return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Successfully subscribed' });
        
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}