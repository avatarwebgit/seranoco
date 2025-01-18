import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  login: true,
  signup: false,
  otp: false,
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
    },
    signup(state) {
      state.modalOpen = true;
      state.signup = true;
      state.login = false;
      state.otp = false;
    },
    otp(state) {
      state.modalOpen = true;
      state.otp = true;
      state.login = false;
      state.signup = false;
    },
    close(state) {
      state.modalOpen = false;
    },
  },
});

export default accessModalSlice;
