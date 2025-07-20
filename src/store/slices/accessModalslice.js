import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 login: false,
 signup: false,
 otp: true,
 mobile: false,
 modalOpen: false,
 loginOTP: false,
 resetPasswordModal: false,
 mobileNo: 0,
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
   state.loginOTP = false;
   state.resetPasswordModal = false;
  },
  signup(state) {
   state.modalOpen = true;
   state.signup = true;
   state.login = false;
   state.otp = false;
   state.mobile = false;
   state.loginOTP = false;
   state.resetPasswordModal = false;
  },
  otp(state) {
   state.modalOpen = true;
   state.otp = true;
   state.login = false;
   state.signup = false;
   state.mobile = false;
   state.loginOTP = false;
   state.resetPasswordModal = false;
  },
  mobile(state) {
   state.modalOpen = true;
   state.otp = false;
   state.login = false;
   state.signup = false;
   state.mobile = true;
   state.loginOTP = false;
   state.resetPasswordModal = false;
  },
  loginOtp(state) {
   state.modalOpen = true;
   state.otp = false;
   state.login = false;
   state.signup = false;
   state.mobile = false;
   state.loginOTP = true;
   state.resetPasswordModal = false;
  },
  resetPassword(state) {
   state.modalOpen = true;
   state.otp = false;
   state.login = false;
   state.signup = false;
   state.mobile = false;
   state.loginOTP = false;
   state.resetPasswordModal = true;
  },
  setMobile(state, action) {
   state.mobileNo = action.payload;
  },
  close(state) {
   state.modalOpen = false;
  },
 },
});

export default accessModalSlice;
