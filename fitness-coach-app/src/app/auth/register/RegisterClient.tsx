'use client';

import dynamic from 'next/dynamic';

const RegisterForm = dynamic(() => import('@/components/auth/RegisterForm').then(m => m.RegisterForm), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-600">Loading…</div>,
});

export default function RegisterClient() {
  return <RegisterForm />;
}
