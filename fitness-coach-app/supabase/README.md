# Supabase Database Setup

This directory contains the database schema and migrations for the Fitness Coach App.

## Migration Files

1. **001_initial_schema.sql** - Creates all the main tables for the application
2. **002_rls_policies.sql** - Sets up Row Level Security policies for data protection
3. **003_indexes.sql** - Creates database indexes for optimal query performance
4. **004_seed_exercises.sql** - Seeds the exercise database with Filipino-friendly exercises
5. **005_seed_filipino_foods.sql** - Seeds the Filipino foods database with local nutrition data
6. **006_functions.sql** - Creates utility functions for TDEE calculations and triggers

## How to Run Migrations

### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project (if not already done):
   ```bash
   supabase init
   ```

3. Link to your Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

### Option 2: Manual Execution via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file in order (001 through 006)
4. Execute each migration one by one

### Option 3: Using Database Client

You can also run these migrations using any PostgreSQL client by connecting to your Supabase database and executing the SQL files in order.

## Database Schema Overview

### Core Tables

- **user_profiles** - Stores user information and fitness goals
- **exercises** - Exercise database with Filipino-friendly options
- **filipino_foods** - Local food database with nutrition information
- **workout_plans** - User's workout plans
- **workout_days** - Individual workout days within plans
- **workout_exercises** - Exercises assigned to workout days
- **workout_sessions** - Actual workout tracking sessions
- **completed_exercises** - Exercises completed in sessions
- **completed_sets** - Individual sets completed
- **meal_plans** - Daily meal plans for users
- **meals** - Individual meals within meal plans
- **meal_foods** - Foods within meals

### Security

All tables have Row Level Security (RLS) enabled with appropriate policies:
- Users can only access their own data
- Exercise and food databases are publicly readable
- Admin-only write access for exercise and food data

### Performance

Database indexes are created for:
- Common query patterns
- Foreign key relationships
- Search functionality
- Date-based queries

## Environment Variables Required

Make sure these environment variables are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Seeded Data

The migrations include seed data for:
- **18 exercises** covering bodyweight, dumbbell, resistance band, and gym equipment
- **40+ Filipino foods** with accurate nutrition data and local context
- Exercise alternatives and progression paths
- Regional food availability and seasonal information

## Functions

The database includes utility functions for:
- TDEE calculation using Mifflin-St Jeor equation
- Target calorie calculation based on fitness goals
- Macronutrient breakdown calculation
- Automatic timestamp updates

## Troubleshooting

If you encounter issues:

1. **Permission errors**: Make sure you're using the service role key for admin operations
2. **Migration order**: Always run migrations in numerical order (001, 002, 003, etc.)
3. **Duplicate data**: If re-running seed migrations, you may need to clear existing data first
4. **RLS issues**: Check that your policies match your application's authentication flow

## Next Steps

After running these migrations:

1. Verify the schema in your Supabase dashboard
2. Test the RLS policies with different user roles
3. Confirm the seed data is properly loaded
4. Set up your Next.js application to connect to the database