import { createSlice } from '@reduxjs/toolkit';

const initialState = { token: JSON.parse(localStorage.getItem('t')) || null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set(state, action) {
      state.token = action.payload;
      localStorage.setItem('t', JSON.stringify(action.payload));
    },
    reset(state) {
      state.token = null;
      localStorage.setItem('t', null);
    },
  },
});

export default userSlice;
