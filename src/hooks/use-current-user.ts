'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUser,
  selectUser,
  selectUserExists,
  selectUserIsComplete,
  selectUserLoading,
  selectLastFetchedWallet,
  selectLastRequestedWallet,
} from '@/store/slices/userSlice';
import { useAppKitAccount } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export interface UseCurrentUserOptions {
  requireAuthenticated?: boolean;
  requireCompletedProfile?: boolean;
  redirectTo?: string;
  missingUserRedirect?: string;
}

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const {
    requireAuthenticated = false,
    requireCompletedProfile = false,
    redirectTo = '/',
    missingUserRedirect = '/',
  } = options;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { caipAddress } = useAppKitAccount();
  const { isConnected } = useAccount();

  const user = useAppSelector(selectUser);
  const exists = useAppSelector(selectUserExists);
  const isComplete = useAppSelector(selectUserIsComplete);
  const loading = useAppSelector(selectUserLoading);
  const lastFetchedWallet = useAppSelector(selectLastFetchedWallet);
  const lastRequestedWallet = useAppSelector(selectLastRequestedWallet);

  const walletCandidate = useMemo(() => {
    return caipAddress ?? lastFetchedWallet ?? lastRequestedWallet ?? null;
  }, [caipAddress, lastFetchedWallet, lastRequestedWallet]);

  useEffect(() => {
    if (!walletCandidate) {
      return;
    }

    const alreadyRequested = lastRequestedWallet === walletCandidate;
    const alreadyFetched = lastFetchedWallet === walletCandidate;

    if (!loading && (!alreadyRequested || !alreadyFetched)) {
      void dispatch(fetchUser(walletCandidate));
    }
  }, [
    walletCandidate,
    dispatch,
    loading,
    lastFetchedWallet,
    lastRequestedWallet,
  ]);

  useEffect(() => {
    if (!requireAuthenticated || loading) {
      return;
    }

    const hasWallet = Boolean(walletCandidate);
    const hasPersistedUser = Boolean(user);

    if (!isConnected && !hasWallet && !hasPersistedUser) {
      router.replace(redirectTo);
      return;
    }

    if (exists === false) {
      router.replace(missingUserRedirect);
      return;
    }

    if (requireCompletedProfile && exists && !isComplete) {
      router.replace(redirectTo);
    }
  }, [requireAuthenticated, requireCompletedProfile, exists, isComplete, loading, isConnected, redirectTo, missingUserRedirect, router, walletCandidate]);

  const refresh = useMemo(() => {
    if (!walletCandidate) {
      return () => Promise.resolve();
    }
    return () => dispatch(fetchUser(walletCandidate));
  }, [walletCandidate, dispatch]);

  return {
    user,
    exists,
    isComplete,
    loading,
    isConnected,
    wallet: walletCandidate,
    refresh,
  };
}
