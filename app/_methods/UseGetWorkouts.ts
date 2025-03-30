// hooks/useWorkouts.ts
import { WorkoutType } from '@/types/WorkoutTypes';
import { useState, useEffect, useCallback } from 'react';
import { GetAuthToken } from './auth';
import axios from 'axios';


interface UseWorkoutsResult {
  workouts: WorkoutType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWorkouts = (): UseWorkoutsResult => {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await GetAuthToken()
      if(token ===null){
        setError( 'Unauthorized access');
       
      }else{
        const response = await axios.post(
          "http://localhost:3001/api/workouts/getall",
        {},
          {
            headers: { 
              "token":token
            }
          }
        );
        const data = await response.data;
        const {workouts}=  await data;
        setWorkouts(workouts);
      }
   



    
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, error, refetch: fetchWorkouts };
};