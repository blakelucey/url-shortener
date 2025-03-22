import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define interfaces
export interface Link {
  _id: string; // Present after creation
  userId: string;
  originalUrl: string;
  shortHash: string;
  channels?: string[];
  campaigns?: string[];
}

export interface NewLink {
  userId: string;
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

// Async thunk to fetch existing links for the authenticated user
export const fetchLinks = createAsyncThunk<Link[], string>(
  'links/fetchLinks',
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
      return data; // Expecting Link[] with _id
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create a new link
export const createLinkAsync = createAsyncThunk<Link, { linkData: NewLink }>(
  'links/createLink',
  async ({ linkData }, { rejectWithValue }) => {
    try {
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
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(linkData), // Sending NewLink (no _id)
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create link');
      }
      return data.link; // Expecting created Link with _id
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a link
export const deleteLinkAsync = createAsyncThunk<string, { userId: string; shortUrl: string; linkId: string; originalUrl: string }>(
  'links/deleteLink',
  async ({ userId, shortUrl, linkId, originalUrl }, { rejectWithValue }) => {
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
      const response = await fetch(`/api/links?shortUrl=${encodeURIComponent(shortUrl)}&linkId=${encodeURIComponent(linkId)}&originalUrl=${encodeURIComponent(originalUrl)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to delete link');
      }
      return shortUrl; // Return shortHash for removal
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
        state.links.push(action.payload); // Add created Link with _id
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