This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## AI Integration (Task 15)

This app integrates OpenAI Chat Completions for workout and meal suggestions and a simple natural language query parser.

### 1) Install dependency

```
npm install openai
```

### 2) Environment variables

Add the following to your `.env.local` in `fitness-coach-app/`:

```
OPENAI_API_KEY=sk-...
# Optional: override default model
OPENAI_MODEL=gpt-4o-mini
```

Do not commit your `.env.local`.

### 3) OpenAI client

Defined in `src/lib/ai/openai.ts`. Reads `OPENAI_API_KEY` and `OPENAI_MODEL`.

### 4) API Routes

- `POST /api/ai/suggest`
  - Body: `{ type: 'workout'|'meal', profile: object, context?: object }`
  - Returns: `{ suggestions: string }`

- `POST /api/ai/parse-query`
  - Body: `{ query: string }`
  - Returns JSON: `{ intent: 'workout'|'meal'|'other', entities: Record<string, any>, summary: string }`

### 5) UI Hooks

- Workout Planner: `src/app/workout-planner/WorkoutPlannerClient.tsx` has a "Get AI Suggestions" button under Generate tab.
- Meal Planner: `src/app/meal-planner/MealPlannerClient.tsx` has a similar button under AI Generator tab.

Both call `/api/ai/suggest` and display returned text.

### Notes

- Be mindful of API costs and rate limits.
- Add server-side rate limiting and logging for production.
