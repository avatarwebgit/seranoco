// In your userSlice.js or wherever you manage the token
import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: null, user: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    reset(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export default userSlice;
