import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

export async function getServerSession() {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting server session:', error);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Unexpected error getting server session:', error);
    return null;
  }
}

export async function requireAuth(redirectTo: string = '/auth/login') {
  const session = await getServerSession();
  
  if (!session) {
    redirect(redirectTo);
  }
  
  return session;
}

export async function requireNoAuth(redirectTo: string = '/dashboard') {
  const session = await getServerSession();
  
  if (session) {
    redirect(redirectTo);
  }
  
  return null;
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}