import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { useAuth } from './useAuth';
import { UserProfile } from '../types/user';
import { logger } from '../lib/logger';

/**
 * React Query hook to fetch and cache user profiles from Firestore
 */
export function useUser() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-profile', user?.uid],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.uid) return null;
      logger.info(`Fetching user profile from Firestore for UID: ${user.uid}`);
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      logger.info(`No user profile found for UID: ${user.uid}`);
      return null;
    },
    enabled: !!user?.uid, // Only fetch if user session exists
  });

  // Mutation to update cached profile manually (optimistic updates support)
  const updateMutation = useMutation({
    mutationFn: async (updatedProfile: Partial<UserProfile>) => {
      if (!user?.uid) throw new Error('Unauthenticated');
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, updatedProfile, { merge: true });
      return updatedProfile;
    },
    onSuccess: (data) => {
      // Invalidate cache to trigger re-fetch
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.uid] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
export default useUser;
