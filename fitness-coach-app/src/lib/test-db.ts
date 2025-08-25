import { supabase, dbHelpers } from './supabase';

// Test database connection and basic operations
export async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase.from('exercises').select('count').limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Fetch exercises
    console.log('🧪 Testing exercise queries...');
    const exercises = await dbHelpers.getExercises({ popularInPh: true });
    console.log(`✅ Found ${exercises.length} popular Filipino exercises`);
    
    // Test 3: Fetch Filipino foods
    console.log('🧪 Testing Filipino foods queries...');
    const foods = await dbHelpers.getFilipinoFoods({ category: 'protein' });
    console.log(`✅ Found ${foods.length} protein foods`);
    
    // Test 4: Test search functionality
    console.log('🧪 Testing search functionality...');
    const searchResults = await dbHelpers.getFilipinoFoods({ search: 'rice' });
    console.log(`✅ Found ${searchResults.length} foods matching 'rice'`);
    
    console.log('🎉 All database tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Test specific queries that will be used in the app
export async function testAppQueries() {
  console.log('🧪 Testing application-specific queries...');
  
  try {
    // Test bodyweight exercises for home workouts
    const bodyweightExercises = await dbHelpers.getExercises({
      equipment: ['home'],
      difficulty: 'beginner'
    });
    console.log(`✅ Found ${bodyweightExercises.length} beginner bodyweight exercises`);
    
    // Test Filipino breakfast foods
    const breakfastFoods = await dbHelpers.getFilipinoFoods({
      mealTypes: ['breakfast'],
      commonInPh: true
    });
    console.log(`✅ Found ${breakfastFoods.length} Filipino breakfast foods`);
    
    // Test strength exercises
    const strengthExercises = await dbHelpers.getExercises({
      category: 'strength',
      popularInPh: true
    });
    console.log(`✅ Found ${strengthExercises.length} popular strength exercises`);
    
    return true;
  } catch (error) {
    console.error('❌ App query test failed:', error);
    return false;
  }
}

// Function to run all tests
export async function runAllDatabaseTests() {
  console.log('🚀 Starting comprehensive database tests...\n');
  
  const connectionTest = await testDatabaseConnection();
  console.log('');
  
  if (connectionTest) {
    const appTest = await testAppQueries();
    console.log('');
    
    if (appTest) {
      console.log('🎉 All database tests completed successfully!');
      console.log('📋 Your database is ready for the Fitness Coach App');
    }
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Run the migrations in your Supabase SQL Editor');
  console.log('2. Verify the data is properly seeded');
  console.log('3. Test the authentication flow');
  console.log('4. Start building the onboarding components');
}