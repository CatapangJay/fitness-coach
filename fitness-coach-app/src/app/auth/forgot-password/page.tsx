import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - Fitness Coach App',
  description: 'Reset your Fitness Coach account password to regain access to your personalized fitness plans.',
};

export default function ForgotPasswordPage() {
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
        
        <ForgotPasswordForm />
      </div>
    </div>
  );
}