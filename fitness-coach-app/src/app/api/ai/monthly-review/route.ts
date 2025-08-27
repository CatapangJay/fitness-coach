import { NextResponse } from 'next/server';
import { getOpenAI, getModel } from '@/lib/ai/openai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, workoutSummary, nutrition, month } = body as {
      profile: any;
      workoutSummary: any; // include totals, frequency, streaks, per-week breakdown if available
      nutrition?: {
        avgCalories?: number;
        avgProtein?: number;
        avgCarbs?: number;
        avgFats?: number;
      };
      month?: string; // e.g. 2025-08
    };

    if (!profile || !workoutSummary) {
      return NextResponse.json({ error: 'Missing required fields: profile, workoutSummary' }, { status: 400 });
    }

    const client = getOpenAI();
    const model = getModel();

    const system = `You are a Filipino fitness and nutrition coach. Provide a monthly review in a friendly, motivating tone. Be practical and safe; avoid medical claims. Keep suggestions culturally relevant for the Philippines.`;

    const userContent = {
      month,
      profile,
      workoutSummary,
      nutrition,
      request: 'Assess last month and propose adjustments and targets for next month.'
    };

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        {
          role: 'user',
          content: `Return strict JSON with the following shape:\n{
  "assessment": string, // 120-220 words
  "adjustments": {
    "workout": string[], // 4-6 bullet suggestions
    "meal": string[] // 4-6 bullet suggestions
  },
  "next_month_goals": {
    "weekly_workouts": number, // recommended average per week
    "target_calories": number | null, // daily target if relevant; otherwise null
    "focus_muscle_groups": string[],
    "habits": string[] // 3-5 habit goals
  }
}
Input: ${JSON.stringify(userContent)}.`
        }
      ]
    });

    const content = completion.choices?.[0]?.message?.content ?? '{}';
    let data: any;
    try {
      data = JSON.parse(content);
    } catch {
      data = { assessment: content };
    }

    return NextResponse.json(data);
  } catch (e: any) {
    console.error('AI monthly-review error', e);
    return NextResponse.json({ error: 'Failed to generate monthly review' }, { status: 500 });
  }
}
