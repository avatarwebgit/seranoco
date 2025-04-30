import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 login: true,
 signup: false,
 otp: false,
 mobile: false,
 modalOpen: false,
};

const accessModalSlice = createSlice({
 name: 'accessModal',
 initialState,
 reducers: {
  login(state) {
   state.modalOpen = true;
   state.login = true;
   state.signup = false;
   state.otp = false;
   state.mobile = false;
  },
  signup(state) {
   state.modalOpen = true;
   state.signup = true;
   state.login = false;
   state.otp = false;
   state.mobile = false;
  },
  otp(state) {
   state.modalOpen = true;
   state.otp = true;
   state.login = false;
   state.signup = false;
   state.mobile = false;
  },
  mobile(state) {
   state.modalOpen = true;
   state.otp = false;
   state.login = false;
   state.signup = false;
   state.mobile = true;
  },
  close(state) {
   state.modalOpen = false;
  },
 },
});

export default accessModalSlice;
