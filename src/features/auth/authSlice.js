import { createSlice } from '@reduxjs/toolkit';

import { readSession } from './authStorage.js';

const persisted = readSession();

const initialState = persisted
  ? { isAuthenticated: true, user: persisted.user, status: 'idle' }
  : { isAuthenticated: false, user: null, status: 'idle' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email };
      state.status = 'idle';
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { login, logout, setStatus } = authSlice.actions;
export default authSlice.reducer;
