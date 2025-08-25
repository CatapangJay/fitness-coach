# Design Document

## Overview

The Fitness Coach App is a mobile-first Progressive Web Application (PWA) designed specifically for Filipino users. The application follows a user-centric design approach with a focus on simplicity, education, and cultural relevance. The system architecture emphasizes offline capability, fast loading times, and intuitive navigation suitable for users with varying levels of fitness knowledge.

## Architecture

### System Architecture
The application follows a modern full-stack Next.js architecture pattern:

```
┌─────────────────────────────────────────┐    ┌─────────────────┐
│           Next.js Application           │    │   Supabase      │
│                                         │◄──►│   Database      │
│ - Next.js 14+ (App Router)             │    │                 │
│ - TypeScript                            │    │ - PostgreSQL    │
│ - Tailwind CSS + shadcn/ui              │    │ - User Profiles │
│ - Server Components & Actions           │    │ - Workout Plans │
│ - Client Components for Interactivity   │    │ - Exercise DB   │
│ - PWA Features (Service Worker)         │    │ - Meal Plans    │
│ - Supabase Client (Direct DB Access)    │    │ - Progress Data │
└─────────────────────────────────────────┘    └─────────────────┘
```

### Technology Stack
- **Framework**: Next.js 14+ with App Router and TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS for styling
- **Database**: Supabase (PostgreSQL) with direct client access
- **Authentication**: Supabase Auth with built-in providers
- **PWA Features**: Next.js PWA plugin with Service Worker
- **State Management**: React Context API with useReducer for complex state
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for progress visualization
- **Database Client**: Supabase JavaScript client and Prisma ORM for direct database operations

## Components and Interfaces

### Core Components

#### 1. Onboarding Flow Component
```typescript
interface OnboardingData {
  personalInfo: {
    age: number;
    gender: 'male' | 'female';
    height: { value: number; unit: 'cm' | 'ft-in' };
    weight: { value: number; unit: 'kg' | 'lbs' };
  };
  fitnessProfile: {
    bodyComposition: 'skinny' | 'skinny-fat' | 'average' | 'overweight' | 'obese';
    goal: 'bulking' | 'cutting' | 'maintain';
    activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';
    workoutFrequency: number; // 1-7 days per week
    availableEquipment: string[]; // ['home', 'dumbbells', 'barbells', 'machines', etc.]
  };
}
```

#### 2. TDEE Calculator Service
```typescript
interface TDEECalculation {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number; // Adjusted for goal
  macros: {
    protein: { grams: number; calories: number };
    carbs: { grams: number; calories: number };
    fats: { grams: number; calories: number };
  };
}

class TDEECalculator {
  calculateBMR(age: number, gender: string, weight: number, height: number): number;
  calculateTDEE(bmr: number, activityLevel: string): number;
  adjustForGoal(tdee: number, goal: string): number;
  calculateMacros(targetCalories: number, goal: string): MacroBreakdown;
}
```

#### 3. Workout Plan Generator
```typescript
interface Exercise {
  id: string;
  name: string;
  nameFilipino?: string;
  category: 'strength' | 'cardio' | 'flexibility';
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
}

interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  schedule: WorkoutDay[];
  duration: number; // weeks
  goal: string;
}

interface WorkoutDay {
  dayOfWeek: number;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // minutes
}

interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number | string; // "8-12" for ranges
  weight?: number;
  restPeriod: number; // seconds
  notes?: string;
}
```

#### 4. Progress Tracking System
```typescript
interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId: string;
  date: Date;
  exercises: CompletedExercise[];
  duration: number; // actual workout time in minutes
  difficulty: 'too-easy' | 'just-right' | 'too-hard';
  notes?: string;
}

interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
}

interface CompletedSet {
  reps: number;
  weight?: number;
  completed: boolean;
  restTime?: number; // actual rest time taken
}
```

#### 5. Meal Planning Component
```typescript
interface MealPlan {
  id: string;
  userId: string;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  totalMacros: MacroBreakdown;
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'merienda' | 'dinner';
  foods: FoodItem[];
  calories: number;
  macros: MacroBreakdown;
}

interface FoodItem {
  id: string;
  name: string;
  nameFilipino?: string;
  category: string;
  servingSize: string;
  calories: number;
  macros: MacroBreakdown;
  commonInPhilippines: boolean;
  estimatedCost?: number; // in PHP
}
```

### User Interface Design

#### Mobile-First Approach
- **Viewport**: Optimized for 375px-414px width (iPhone/Android standard)
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Typography**: System fonts with clear hierarchy (16px base, 1.5 line height)
- **Color Scheme**: High contrast with accessibility compliance (WCAG 2.1 AA)
- **Navigation**: Bottom tab bar for main sections, swipe gestures for workout tracking

#### Screen Flow
1. **Splash Screen** → **Onboarding** → **Dashboard**
2. **Dashboard** → **Workout Plan** → **Exercise Detail** → **Workout Tracking**
3. **Dashboard** → **Meal Plan** → **Food Detail** → **Nutrition Tracking**
4. **Dashboard** → **Progress** → **History Detail** → **Charts**

## Data Models

### Supabase Database Schema

#### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  height_value DECIMAL,
  height_unit TEXT CHECK (height_unit IN ('cm', 'ft-in')),
  weight_value DECIMAL,
  weight_unit TEXT CHECK (weight_unit IN ('kg', 'lbs')),
  body_composition TEXT CHECK (body_composition IN ('skinny', 'skinny-fat', 'average', 'overweight', 'obese')),
  goal TEXT CHECK (goal IN ('bulking', 'cutting', 'maintain')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active')),
  workout_frequency INTEGER CHECK (workout_frequency BETWEEN 1 AND 7),
  available_equipment TEXT[], -- array of equipment types
  bmr DECIMAL,
  tdee DECIMAL,
  target_calories DECIMAL,
  protein_grams DECIMAL,
  protein_calories DECIMAL,
  carbs_grams DECIMAL,
  carbs_calories DECIMAL,
  fats_grams DECIMAL,
  fats_calories DECIMAL,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'fil')),
  units TEXT DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Exercises Table
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_filipino TEXT,
  category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility')),
  muscle_groups TEXT[], -- array of muscle group names
  equipment TEXT[], -- array of required equipment
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT[],
  form_tips TEXT[],
  common_mistakes TEXT[],
  video_url TEXT,
  image_urls TEXT[],
  alternatives UUID[], -- array of exercise IDs
  progression_path UUID[], -- array of exercise IDs (easier to harder)
  is_popular_in_ph BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Filipino Foods Table
```sql
CREATE TABLE filipino_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_filipino TEXT,
  category TEXT, -- 'protein', 'carbs', 'vegetables', 'fruits', etc.
  serving_size TEXT,
  calories DECIMAL,
  protein DECIMAL,
  carbs DECIMAL,
  fats DECIMAL,
  fiber DECIMAL,
  sodium DECIMAL,
  common_in_ph BOOLEAN DEFAULT true,
  regions TEXT[], -- where it's commonly found
  season TEXT, -- if seasonal
  estimated_cost DECIMAL, -- average cost in PHP
  cooking_methods TEXT[],
  meal_types TEXT[], -- breakfast, lunch, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
```

## Error Handling

### Client-Side Error Handling
- **Network Errors**: Graceful offline mode with cached data
- **Validation Errors**: Real-time form validation with clear error messages
- **Authentication Errors**: Automatic token refresh, fallback to login
- **Data Sync Errors**: Queue failed requests for retry when online

### Server-Side Error Handling (Next.js Server Actions)
- **Input Validation**: Comprehensive validation using Zod schemas in Server Actions
- **Database Errors**: Proper error logging with Supabase error handling
- **Authentication Errors**: Supabase Auth error handling with user-friendly messages
- **Rate Limiting**: Implement custom rate limiting in Server Actions if needed

### Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}
```

## Testing Strategy

### Unit Testing
- **Frontend**: Jest + React Testing Library for component testing
- **Backend**: Jest + Supertest for API endpoint testing
- **Utilities**: Test TDEE calculations, form validations, data transformations
- **Coverage Target**: 80% code coverage minimum

### Integration Testing
- **Database Integration**: Test complete user flows from Next.js to Supabase
- **PWA Features**: Test offline functionality, service worker behavior
- **Authentication Flow**: Test Supabase Auth login, registration, session management

### End-to-End Testing
- **User Journeys**: Playwright tests for critical user paths
- **Mobile Testing**: Test on actual devices and browser dev tools
- **Performance Testing**: Lighthouse CI for performance regression detection

### Test Data
- **Mock Filipino Foods**: Comprehensive database of local foods with accurate nutrition
- **Sample Workouts**: Pre-built workout plans for different equipment/goals
- **User Personas**: Test accounts representing different user types and goals

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy load routes and heavy components
- **Image Optimization**: WebP format with fallbacks, lazy loading
- **Bundle Size**: Target <200KB initial bundle, <500KB total
- **Caching Strategy**: Aggressive caching for static assets, smart caching for API data

### Database Optimization (Supabase)
- **Database Indexing**: Proper indexes on user queries, workout lookups in PostgreSQL
- **Response Caching**: Next.js caching strategies for frequently accessed data
- **Query Optimization**: Efficient Supabase queries with proper filtering and pagination
- **Data Pagination**: Limit response sizes for workout history, exercise lists using Supabase pagination

### PWA Performance
- **Service Worker**: Cache-first strategy for static assets, network-first for dynamic data
- **Offline Capability**: Core functionality available without internet
- **Background Sync**: Queue workout data when offline, sync when online
- **Push Notifications**: Workout reminders, progress celebrations

## Security Considerations

### Authentication & Authorization (Supabase Auth)
- **Supabase Auth**: Built-in authentication with JWT tokens and refresh tokens
- **Password Security**: Supabase handles password hashing and security
- **Session Management**: Supabase client handles secure token storage and refresh
- **Social Login**: Optional Google/Facebook login through Supabase Auth

### Data Protection
- **Input Sanitization**: Prevent XSS and injection attacks
- **HTTPS Only**: Force secure connections in production
- **CORS Configuration**: Restrict cross-origin requests appropriately
- **Data Encryption**: Encrypt sensitive user data at rest

### Privacy Compliance
- **Data Minimization**: Collect only necessary user information
- **User Consent**: Clear privacy policy and data usage consent
- **Data Retention**: Automatic cleanup of old workout data
- **Export/Delete**: Allow users to export or delete their data