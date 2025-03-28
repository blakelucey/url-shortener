import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { clearUser, setError as setUserError, setLoading as setUserLoading, setUser } from '@/store/slices/userSlice';
import { addLink, removeLink, setLinks, updateLink, setError as setLinkError, setLoading as setLinkLoading } from '@/store/slices/linkSlice';
import { addClick, setClicks, setError as setClickError, setLoading as setClickLoading } from '@/store/slices/clickSlice';

// User hooks
export const useUser = () => {
  return useSelector((state: RootState) => state.users.user);
};

export const useUserLoading = () => {
  return useSelector((state: RootState) => state.users.loading);
};

export const useUserError = () => {
  return useSelector((state: RootState) => state.users.error);
};

export const useUserActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  return {
    setUser: (user: any) => dispatch(setUser(user)),
    setLoading: (loading: boolean) => dispatch(setUserLoading(loading)),
    setError: (error: string | null) => dispatch(setUserError(error)),
    clearUser: () => dispatch(clearUser()),
  };
};

// Link hooks
export const useLinks = () => {
  return useSelector((state: RootState) => state.links.links);
};

export const useLinksLoading = () => {
  return useSelector((state: RootState) => state.links.loading);
};

export const useLinksError = () => {
  return useSelector((state: RootState) => state.links.error);
};

export const useLinkActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  return {
    setLinks: (links: any) => dispatch(setLinks(links)),
    addLink: (link: any) => dispatch(addLink(link)),
    updateLink: (link: any) => dispatch(updateLink(link)),
    removeLink: (shortHash: any) => dispatch(removeLink(shortHash)),
    setLoading: (loading: boolean) => dispatch(setLinkLoading(loading)),
    setError: (error: string | null) => dispatch(setLinkError(error)),
  };
};

// Click hooks
export const useClicks = () => {
  return useSelector((state: RootState) => state.clicks.clicks);
};

export const useClicksLoading = () => {
  return useSelector((state: RootState) => state.clicks.loading);
};

export const useClicksError = () => {
  return useSelector((state: RootState) => state.clicks.error);
};

export const useClickActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  return {
    setClicks: (clicks: any) => dispatch(setClicks(clicks)),
    addClick: (click: any) => dispatch(addClick(click)),
    setLoading: (loading: boolean) => dispatch(setClickLoading(loading)),
    setError: (error: string | null) => dispatch(setClickError(error)),
  };
};