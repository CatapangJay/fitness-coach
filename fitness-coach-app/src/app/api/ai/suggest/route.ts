import { NextResponse } from 'next/server';
import { getOpenAI, getModel } from '@/lib/ai/openai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, profile, context } = body as {
      type: 'workout' | 'meal';
      profile: any;
      context?: any;
    };

    if (!type || !profile) {
      return NextResponse.json({ error: 'Missing required fields: type, profile' }, { status: 400 });
    }

    const client = getOpenAI();
    const model = getModel();

    const system =
      type === 'workout'
        ? 'You are a Filipino fitness coach. Provide concise, safe, and culturally relevant workout plan suggestions based on the user profile. Use bullet points.'
        : 'You are a Filipino nutrition coach. Provide concise, safe, and culturally relevant daily meal plan suggestions based on the user profile and context. Use bullet points.';

    const userPrompt = JSON.stringify({ profile, context, type });

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content:
            'Generate 4-6 practical suggestions tailored to the user. Avoid medical claims. Keep to 120-200 words total. Input: ' +
            userPrompt,
        },
      ],
      temperature: 0.7,
    });

    const text = completion.choices?.[0]?.message?.content ?? 'No suggestions available.';

    return NextResponse.json({ suggestions: text });
  } catch (e: any) {
    console.error('AI suggest error', e);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
