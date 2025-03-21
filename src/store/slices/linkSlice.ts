import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Link {
  userId: any;
  originalUrl: string;
  shortHash: string;
  channels?: string[];
  campaigns?: string[];
}

interface LinkState {
  links: Link[];
  loading: boolean;
  error: string | null;
}

const initialState: LinkState = {
  links: [],
  loading: false,
  error: null,
};

// Async thunk to fetch links for the authenticated user.
export const fetchLinks = createAsyncThunk<Link[], string>(
  'links/fetchLinks',
  async (userId: string, { rejectWithValue }) => {
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
      // Now fetch links using the token.
      const response = await fetch('/api/links', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch links');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create a new link for the authenticated user.
export const createLinkAsync = createAsyncThunk<Link, { linkData: Link }>(
  'links/createLink',
  async ({ linkData }, { rejectWithValue }) => {
    try {
      // Get token using the userId from linkData.
      const signResponse = await fetch(`/api/signToken?userId=${encodeURIComponent(linkData.userId)}`, {
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
      // Create the link using the token.
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(linkData),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create link');
      }
      return data.link;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// **New:** Async thunk to delete a link.
export const deleteLinkAsync = createAsyncThunk<string, { userId: string; shortUrl: string; linkId: string; }>(
  'links/deleteLink',
  async ({ userId, shortUrl, linkId }, { rejectWithValue }) => {
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
      const token = signData.data;
      if (!token) {
        throw new Error('Token not found');
      }
      // Call DELETE endpoint. Notice shortHash is passed as a query parameter.
      const response = await fetch(`/api/links?shortUrl=${encodeURIComponent(shortUrl)}&linkId=${encodeURIComponent(linkId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete link');
      }
      // Return the shortHash as an identifier for deletion.
      return shortUrl;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const linkSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    setLinks: (state, action: PayloadAction<Link[]>) => {
      state.links = action.payload;
      state.loading = false;
      state.error = null;
    },
    addLink: (state, action: PayloadAction<Link>) => {
      state.links.push(action.payload);
    },
    updateLink: (state, action: PayloadAction<Link>) => {
      const index = state.links.findIndex(link => link.shortHash === action.payload.shortHash);
      if (index !== -1) {
        state.links[index] = action.payload;
      }
    },
    removeLink: (state, action: PayloadAction<string>) => {
      state.links = state.links.filter(link => link.shortHash !== action.payload);
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
    builder
      // Handle fetchLinks
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action: PayloadAction<Link[]>) => {
        state.links = action.payload;
        state.loading = false;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch links';
      })
      // Handle createLinkAsync
      .addCase(createLinkAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLinkAsync.fulfilled, (state, action: PayloadAction<Link>) => {
        state.links.push(action.payload);
        state.loading = false;
      })
      .addCase(createLinkAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to create link';
      })
      // Handle deleteLinkAsync
      .addCase(deleteLinkAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLinkAsync.fulfilled, (state, action: PayloadAction<string>) => {
        // Remove link from state by shortHash.
        state.links = state.links.filter(link => link.shortHash !== action.payload);
        state.loading = false;
      })
      .addCase(deleteLinkAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to delete link';
      });
  },
});

export const { setLinks, addLink, updateLink, removeLink, setLoading, setError } = linkSlice.actions;
export default linkSlice.reducer;