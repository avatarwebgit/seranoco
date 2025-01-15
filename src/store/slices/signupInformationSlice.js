import { createSlice } from '@reduxjs/toolkit';

const initialState = { data: JSON.parse(localStorage.getItem('sis')) || null };

const signupInformationSlice = createSlice({
  name: 'sis',
  initialState,
  reducers: {
    set(state, action) {
      state.data = action.payload;
      localStorage.setItem('sis', JSON.stringify(state.data));
    },
    reset(state) {
      state.data = null;
      localStorage.setItem('sis', null);
    },
  },
});

export default signupInformationSlice;
