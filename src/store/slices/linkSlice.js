import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  links: [],
  loading: false,
  error: null,
};

const linkSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    setLinks: (state, action) => {
      state.links = action.payload;
      state.loading = false;
      state.error = null;
    },
    addLink: (state, action) => {
      state.links.push(action.payload);
    },
    updateLink: (state, action) => {
      const index = state.links.findIndex(link => link.shortHash === action.payload.shortHash);
      if (index !== -1) {
        state.links[index] = action.payload;
      }
    },
    removeLink: (state, action) => {
      state.links = state.links.filter(link => link.shortHash !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLinks, addLink, updateLink, removeLink, setLoading, setError } = linkSlice.actions;
export default linkSlice.reducer;