import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getCountries } from '@/lib/api/index.js';

import { PAGE_SIZE, REGIONS } from './countriesConstants.js';

const initialState = {
  list: [],
  status: 'idle',
  error: null,
  filter: REGIONS.ALL,
  visibleCount: PAGE_SIZE,
};

export const fetchCountries = createAsyncThunk(
  'countries/fetch',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getCountries({ signal });
    } catch (err) {
      return rejectWithValue({
        message: err.message || 'Failed to load countries',
        name: err.name || 'Error',
      });
    }
  },
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
      state.visibleCount = PAGE_SIZE;
    },
    loadMore(state) {
      state.visibleCount += PAGE_SIZE;
    },
    resetCountries() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message ?? action.error?.message ?? 'Failed';
      });
  },
});

export const { setFilter, loadMore, resetCountries } = countriesSlice.actions;
export default countriesSlice.reducer;
