'use client';

import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/components/auth/LoginForm').then(m => m.LoginForm), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-gray-600">Loading…</div>,
});

export default function LoginClient() {
  return <LoginForm />;
}
