// In your userSlice.js or wherever you manage the token
import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set(state, action) {
      state.token = action.payload;
      // If a token is set, save it in localStorage
      if (state.token) {
        localStorage.setItem('token', state.token);
      }
    },
    reset(state) {
      state.token = null;
      // Remove token from localStorage when it's reset
      localStorage.removeItem('token');
    },
  },
});

export default userSlice;
