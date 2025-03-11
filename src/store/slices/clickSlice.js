import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clicks: [],
  loading: false,
  error: null,
};

const clickSlice = createSlice({
  name: 'clicks',
  initialState,
  reducers: {
    setClicks: (state, action) => {
      state.clicks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addClick: (state, action) => {
      state.clicks.push(action.payload);
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

export const { setClicks, addClick, setLoading, setError } = clickSlice.actions;
export default clickSlice.reducer;