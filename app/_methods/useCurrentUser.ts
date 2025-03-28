// hooks/useCurrentUser.ts
import { UserType } from '@/types/UserTypes';
import { useState, useEffect } from 'react';
import { GetUser } from './auth';

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const user =await  GetUser()

      if (user===null) {
          return null; // Not authenticated

      }

    
      setUser(user);
   return user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check auth');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Automatically check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: checkAuth // Manual re-check
  };
};