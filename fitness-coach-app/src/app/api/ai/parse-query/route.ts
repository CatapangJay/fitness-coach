import { NextResponse } from 'next/server';
import { getOpenAI, getModel } from '@/lib/ai/openai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body as { query: string };

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing required field: query' }, { status: 400 });
    }

    const client = getOpenAI();
    const model = getModel();

    const schema = `Return JSON with { intent: 'workout|meal|other', entities: Record<string, string|number>, summary: string }`;
    const messages = [
      { role: 'system', content: 'You are an intent parser for a Filipino fitness app. Be concise and safe.' },
      { role: 'user', content: `${schema}. Query: ${query}` },
    ] as const;

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices?.[0]?.message?.content ?? '{}';
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (e: any) {
    console.error('AI parse-query error', e);
    return NextResponse.json({ error: 'Failed to parse query' }, { status: 500 });
  }
}
