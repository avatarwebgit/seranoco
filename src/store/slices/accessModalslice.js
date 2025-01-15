import { createSlice } from '@reduxjs/toolkit';

const initialState = { login: false, signup: true, otp: false };

const accessModalSlice = createSlice({
  name: 'accessModal',
  initialState,
  reducers: {
    login(state) {
      state.login = true;
      state.signup = false;
      state.otp = false;
    },
    signup(state) {
      state.signup = true;
      state.login = false;
      state.otp = false;
    },
    otp(state) {
      state.otp = true;
      state.login = false;
      state.signup = false;
    },
  },
});

export default accessModalSlice;
