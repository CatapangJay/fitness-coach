# Requirements Document

## Introduction

A mobile-first web application that serves as a personalized fitness coach for Filipino users. The app collects user information to calculate TDEE (Total Daily Energy Expenditure), generates customized workout plans and meal suggestions, and provides workout tracking with progressive overload monitoring. The application includes educational content with simple explanations of fitness terminology, localized for Philippine audiences.

## Requirements

### Requirement 1: User Onboarding and Profile Setup

**User Story:** As a new user, I want to provide my physical information and fitness goals so that the app can create a personalized fitness plan for me.

#### Acceptance Criteria

1. WHEN a new user opens the app THEN the system SHALL display an onboarding flow requesting basic information
2. WHEN collecting age and gender THEN the system SHALL use this information for accurate TDEE calculations
3. WHEN collecting height THEN the system SHALL accept input in both centimeters and feet/inches format
4. WHEN collecting weight THEN the system SHALL accept input in both kilograms and pounds
5. WHEN asking for body composition THEN the system SHALL provide user-friendly terms like "skinny", "skinny fat", "average", "overweight", "obese" and short simple descriptions instead of technical body fat percentages
6. WHEN collecting fitness goals THEN the system SHALL offer options for "bulking" (muscle gain), "cutting" (fat loss), and "maintain" (maintenance) and simple descriptions for each
7. WHEN asking about activity level THEN the system SHALL provide clear descriptions like "sedentary (desk job)", "lightly active (light exercise 1-3 days/week)", "moderately active (moderate exercise 3-5 days/week)", "very active (hard exercise 6-7 days/week)"
8. WHEN collecting equipment availability THEN the system SHALL offer multiple selection options including "home workout (no equipment)", "dumbbells", "barbells", "gym machines", "resistance bands", "pull-up bar", etc.
9. WHEN asking workout frequency THEN the system SHALL allow users to specify how many days per week they can commit to working out (1-7 days) and how many minutes or hours
10. WHEN asking for workout splits, show options based on the amount of workout days user can commit
11. WHEN all required information is collected THEN the system SHALL calculate and display the user's TDEE with explanation

### Requirement 2: TDEE Calculation and Nutritional Guidance

**User Story:** As a user, I want to know my daily caloric needs and receive meal suggestions so that I can achieve my fitness goals effectively.

#### Acceptance Criteria

1. WHEN user profile is complete THEN the system SHALL calculate TDEE using the Mifflin-St Jeor equation adjusted for activity level
2. WHEN goal is "cutting" THEN the system SHALL recommend a caloric deficit of 300-500 calories below TDEE
3. WHEN goal is "bulking" THEN the system SHALL recommend a caloric surplus of 200-500 calories above TDEE
4. WHEN goal is "maintain" THEN the system SHALL recommend calories at TDEE level
5. WHEN displaying caloric needs THEN the system SHALL break down macronutrient recommendations (protein, carbs, fats) with Filipino-friendly explanations
6. WHEN providing meal suggestions THEN the system SHALL include common Filipino foods like rice, chicken adobo, bangus, vegetables, fruits available in Philippines
7. WHEN suggesting meal plans THEN the system SHALL consider typical Filipino eating patterns (breakfast, lunch, merienda, dinner)
8. WHEN displaying nutritional information THEN the system SHALL provide simple explanations of terms like "protein", "carbohydrates", "calories", "macros"

### Requirement 3: Workout Plan Generation

**User Story:** As a user, I want to receive a customized workout plan based on my available equipment and schedule so that I can start exercising effectively.

#### Acceptance Criteria

1. WHEN user completes onboarding THEN the system SHALL generate a workout plan based on available equipment and workout frequency
2. WHEN equipment is "home workout" THEN the system SHALL create bodyweight exercise routines
3. WHEN equipment includes "dumbbells" THEN the system SHALL incorporate dumbbell exercises appropriate for the user's goal
4. WHEN equipment includes "gym machines" THEN the system SHALL include machine-based exercises
5. WHEN workout frequency is 3 days or less THEN the system SHALL create full-body workout routines
6. WHEN workout frequency is 4+ days THEN the system SHALL create split routines (upper/lower or push/pull/legs)
7. WHEN displaying exercises THEN the system SHALL include exercise names in both English and Filipino where applicable
8. WHEN showing exercise instructions THEN the system SHALL provide clear, simple descriptions of proper form
9. WHEN goal is "bulking" THEN the system SHALL emphasize compound movements and progressive overload
10. WHEN goal is "cutting" THEN the system SHALL include both strength training and cardio recommendations

### Requirement 4: Workout Tracking and Progress Monitoring

**User Story:** As a user, I want to track my workouts and monitor my progress so that I can see improvements and ensure progressive overload.

#### Acceptance Criteria

1. WHEN starting a workout THEN the system SHALL display the planned exercises with sets, reps, and suggested weights
2. WHEN completing an exercise THEN the system SHALL allow users to log actual sets, reps, and weights used
3. WHEN logging workout data THEN the system SHALL save the information with timestamp for history tracking
4. WHEN viewing exercise history THEN the system SHALL show previous performances for comparison
5. WHEN displaying progress THEN the system SHALL highlight improvements in weight, reps, or sets over time
6. WHEN progressive overload is detected THEN the system SHALL provide positive feedback and encouragement
7. WHEN user hasn't improved in 2+ sessions THEN the system SHALL suggest form tips or alternative progressions
8. WHEN workout is completed THEN the system SHALL ask for user feedback on difficulty level (too easy, just right, too hard)
9. WHEN tracking rest periods THEN the system SHALL provide timer functionality between sets
10. WHEN viewing workout history THEN the system SHALL display data in an easy-to-understand format with charts or graphs

### Requirement 5: Educational Content and Fitness Terminology

**User Story:** As a user new to fitness, I want to understand fitness terms and concepts so that I can make informed decisions about my health and workouts.

#### Acceptance Criteria

1. WHEN encountering fitness terms THEN the system SHALL provide simple, jargon-free explanations
2. WHEN explaining "progressive overload" THEN the system SHALL describe it as "gradually increasing difficulty to keep challenging your muscles"
3. WHEN explaining "TDEE" THEN the system SHALL describe it as "total calories your body burns in a day including exercise"
4. WHEN explaining "macros" THEN the system SHALL describe them as "the main types of nutrients your body needs: protein, carbs, and fats"
5. WHEN explaining exercise types THEN the system SHALL use familiar comparisons (e.g., "compound exercises work multiple muscles like doing chores that use your whole body")
6. WHEN providing form tips THEN the system SHALL use simple language avoiding technical anatomical terms
7. WHEN explaining rest periods THEN the system SHALL relate to everyday activities (e.g., "rest as long as it takes to walk to the kitchen and back")
8. WHEN discussing nutrition THEN the system SHALL use Filipino food examples and cooking methods
9. WHEN explaining workout splits THEN the system SHALL use simple day-based descriptions (e.g., "Monday: Upper body, Wednesday: Lower body")
10. WHEN users tap on any fitness term THEN the system SHALL show a popup with simple explanation

### Requirement 6: Philippine Localization

**User Story:** As a Filipino user, I want the app to understand my local context including available foods, typical work schedules, and cultural preferences so that recommendations are practical for my lifestyle.

#### Acceptance Criteria

1. WHEN suggesting meal times THEN the system SHALL account for typical Filipino work schedules (8am-5pm office jobs, shift work, etc.)
2. WHEN recommending foods THEN the system SHALL prioritize ingredients commonly available in Philippine markets and grocery stores
3. WHEN calculating costs THEN the system SHALL use Philippine peso and local food prices
4. WHEN suggesting meal prep THEN the system SHALL consider tropical climate and food storage limitations
5. WHEN providing exercise alternatives THEN the system SHALL account for limited space in typical Filipino homes
6. WHEN recommending outdoor activities THEN the system SHALL consider Philippine weather patterns and safety
7. WHEN displaying measurements THEN the system SHALL default to metric system but allow imperial conversion
8. WHEN suggesting workout times THEN the system SHALL consider hot tropical climate and recommend cooler hours
9. WHEN providing portion sizes THEN the system SHALL use familiar Filipino measurements (cups of rice, pieces of fish, etc.)
10. WHEN offering support THEN the system SHALL be available in both English and Filipino languages where appropriate