'use client';

import dynamic from 'next/dynamic';

const ForgotPasswordForm = dynamic(() => import('@/components/auth/ForgotPasswordForm').then(m => m.ForgotPasswordForm), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-600">Loading form...</div>,
});

export default function ForgotPasswordClient() {
  return <ForgotPasswordForm />;
}
