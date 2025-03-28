// src/store/slices/clickSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Click {
  _id: string;
  linkId: string;
  userId: string;
  timestamp: string; // ISO string representation
  referrer?: string;
  ip?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  operatingSystem?: string;
  country?: string;
  region?: string;
  city?: string;
  postal?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

interface ClickState {
  clicks: Click[];
  loading: boolean;
  error: string | null;
}

const initialState: ClickState = {
  clicks: [],
  loading: false,
  error: null,
};

// In clickSlice.ts
export const fetchClicks = createAsyncThunk(
  'clicks/fetchClicks',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Get authentication token
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

      // Fetch all clicks for the user
      const response = await fetch(`/api/clicks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch clicks');
      }
      return data; // Expecting an array of clicks
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a click.
export const deleteClickAsync = createAsyncThunk<string, { clickId: string, userId: string }>(
  'clicks/deleteClick',
  async ({ clickId, userId }, { rejectWithValue }) => {
    try {
      // Get token using userId.
      const signResponse = await fetch(`/api/signToken?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
      });
      if (!signResponse.ok) {
        const errorData = await signResponse.json();
        return rejectWithValue(errorData.error || 'Failed to sign token');
      }
      const signData = await signResponse.json();
      const token = signData.data; // Assuming token is in signData.data
      if (!token) {
        throw new Error('Token not found');
      }
      // Assuming you have a DELETE endpoint at /api/clicks/:clickId
      const response = await fetch(`/api/clicks/${clickId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Replace with your token logic
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete click');
      }
      // Return the id of the deleted click.
      return clickId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const clickSlice = createSlice({
  name: 'clicks',
  initialState,
  reducers: {
    setClicks: (state, action: PayloadAction<Click[]>) => {
      state.clicks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addClick: (state, action: PayloadAction<Click>) => {
      state.clicks.push(action.payload);
    },
    deleteClick: (state, action: PayloadAction<string>) => {
      state.clicks = state.clicks.filter(click => click._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch clicks
    builder.addCase(fetchClicks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClicks.fulfilled, (state, action: PayloadAction<Click[]>) => {
      state.clicks = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchClicks.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Failed to fetch clicks';
    });
    // Delete click
    builder.addCase(deleteClickAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteClickAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.clicks = state.clicks.filter(click => click._id !== action.payload);
      state.loading = false;
    });
    builder.addCase(deleteClickAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Failed to delete click';
    });
  },
});

export const { setClicks, addClick, deleteClick, setLoading, setError } = clickSlice.actions;
export default clickSlice.reducer;