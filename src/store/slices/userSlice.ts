// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface StripeCustomerInfo {
  subsRes: any;
  customer: any;
}

export interface User {
  _id: string;
  userId: string;
  authType: string;
  email: string;
  firstName: string;
  lastName: string;
  isTrial: boolean;
  isBasic: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  subscriptionStatus: string;
  subscriptionEndsAt: Date;
  deletionScheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface FetchUserPayload {
  user: User | null;
  exists: boolean;
  isComplete: boolean;
  wallet: string;
}

interface UserState {
  user: User | null;
  exists: boolean | null;
  isComplete: boolean;
  lastFetchedWallet: string | null;
  lastRequestedWallet: string | null;
  stripeInfo: StripeCustomerInfo | null;
  loading: boolean;
  stripeLoading: boolean;
  error: string | null;
  stripeError: string | null;
}

const initialState: UserState = {
  user: null,
  exists: null,
  isComplete: false,
  lastFetchedWallet: null,
  lastRequestedWallet: null,
  stripeInfo: null,
  loading: false,
  stripeLoading: false,
  error: null,
  stripeError: null,
};

export const fetchUser = createAsyncThunk<FetchUserPayload, string, { rejectValue: string }>(
  'user/fetchUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users?userId=${encodeURIComponent(userId)}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch user');
      }

      if (!data?.exists) {
        return {
          user: null,
          exists: false,
          isComplete: false,
          wallet: userId,
        };
      }

      return {
        user: data.user as User,
        exists: true,
        isComplete: Boolean(data.isComplete),
        wallet: userId,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

export const createUserAsync = createAsyncThunk<
  User,
  { userId: string; firstName: string; lastName: string; email: string; sessionId: string; authType?: string },
  { rejectValue: string }
>(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create user');
      }
      if (!data?.user) {
        return rejectWithValue(data.message || 'Failed to create user');
      }
      return data.user as User;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'user/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const signResponse = await fetch(`/api/signToken?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
      });
      if (!signResponse.ok) {
        const errorData = await signResponse.json();
        return rejectWithValue(errorData.error || 'Failed to sign token');
      }
      const signData = await signResponse.json();
      const token = signData.data;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`/api/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete user');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStripeCustomer = createAsyncThunk<
  StripeCustomerInfo,
  string,
  { rejectValue: string }
>(
  'user/fetchStripeCustomer',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/stripe?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch stripe customer');
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.exists = action.payload ? true : state.exists;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.exists = null;
      state.isComplete = false;
      state.lastFetchedWallet = null;
      state.lastRequestedWallet = null;
      state.loading = false;
      state.error = null;
      state.stripeInfo = null;
      state.stripeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastRequestedWallet = action.meta.arg;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<FetchUserPayload>) => {
        state.user = action.payload.user;
        state.exists = action.payload.exists;
        state.isComplete = action.payload.isComplete;
        state.lastFetchedWallet = action.payload.wallet;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
      })
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.exists = true;
        state.isComplete = true;
        state.lastFetchedWallet = action.payload.userId;
        state.loading = false;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create user';
      })
      .addCase(deleteUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.user = null;
        state.exists = false;
        state.isComplete = false;
        state.loading = false;
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      })
      .addCase(fetchStripeCustomer.pending, (state) => {
        state.stripeLoading = true;
        state.stripeError = null;
      })
      .addCase(fetchStripeCustomer.fulfilled, (state, action: PayloadAction<StripeCustomerInfo>) => {
        state.stripeInfo = action.payload;
        state.stripeLoading = false;
      })
      .addCase(fetchStripeCustomer.rejected, (state, action) => {
        state.stripeLoading = false;
        state.stripeError = action.payload || 'Failed to fetch stripe customer';
      });
  },
});

export const selectUser = (state: RootState) => state.users.user;
export const selectUserExists = (state: RootState) => state.users.exists;
export const selectUserIsComplete = (state: RootState) => state.users.isComplete;
export const selectUserLoading = (state: RootState) => state.users.loading;
export const selectUserError = (state: RootState) => state.users.error;
export const selectLastFetchedWallet = (state: RootState) => state.users.lastFetchedWallet;
export const selectLastRequestedWallet = (state: RootState) => state.users.lastRequestedWallet;
export const selectStripeInfo = (state: RootState) => state.users.stripeInfo;
export const selectSubscription = (state: RootState) => state.users.stripeInfo?.subsRes;
export const selectCustomer = (state: RootState) => state.users.stripeInfo?.customer;
export const selectStripeLoading = (state: RootState) => state.users.stripeLoading;
export const selectStripeError = (state: RootState) => state.users.stripeError;

export const { setUser, setLoading, setError, clearUser } = userSlice.actions;
export default userSlice.reducer;
