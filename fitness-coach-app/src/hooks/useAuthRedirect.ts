'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  requireNoAuth?: boolean;
}

export function useAuthRedirect({
  redirectTo = '/dashboard',
  requireAuth = false,
  requireNoAuth = false,
}: UseAuthRedirectOptions = {}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Don't redirect while loading

    if (requireAuth && !user) {
      // User must be authenticated but isn't
      router.push('/auth/login');
    } else if (requireNoAuth && user) {
      // User must not be authenticated but is
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo, requireAuth, requireNoAuth]);

  return { user, loading };
}