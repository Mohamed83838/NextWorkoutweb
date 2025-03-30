import { UserType } from "@/types/UserTypes";
import { useCallback, useEffect, useState } from "react";
import { GetUser } from "./auth";

interface UseGetUserResult{
     user: UserType | undefined;
      loadinguser: boolean;
      erroruser: string | null;
      refetchuser: () => Promise<void>;
}
// Corrected implementation
export const UseGetUser = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loadinguser, setLoading] = useState(true);
    const [erroruser, setError] = useState<string | null>(null);
  
    // Memoize the fetch function with useCallback
    const fetchUser = useCallback(async () => {
      try {
        setLoading(true);
        const fetcheduser = await GetUser();
        if (!fetcheduser) {
          setError("Authentication error");
        } else {
          setUser(fetcheduser);
        }
      } catch (error) {
        setError("Authentication error");
      } finally {
        setLoading(false);
      }
    }, []); // Empty dependency array if no external deps
  
    // Stable useEffect dependencies
    useEffect(() => {
      fetchUser();
    }, [fetchUser]); // Now the dependency array has consistent length
  
    return { user, loadinguser, erroruser, refetchuser: fetchUser };
  };