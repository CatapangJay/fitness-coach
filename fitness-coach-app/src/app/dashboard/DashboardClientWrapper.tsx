'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { supabase, UserProfile } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function DashboardClientWrapper() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user profile
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setProfileLoading(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  return (
    <ProtectedRoute>
      {(loading || profileLoading) ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading dashboard...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <DashboardContent 
          user={user!} 
          profile={profile}
        />
      )}
    </ProtectedRoute>
  );
}