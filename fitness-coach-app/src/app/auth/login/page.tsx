import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - Fitness Coach App',
  description: 'Sign in to your Fitness Coach account to access your personalized workout plans and nutrition guidance.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fitness Coach
          </h1>
          <p className="text-gray-600">
            Your personalized Filipino fitness companion
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}