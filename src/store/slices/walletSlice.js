import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  useWallet: true,
  userIntraction: false,
  coupon: 0,
  useCoupon: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setBalance(state, action) {
      state.balance = action.payload;
      if (!state.userIntraction) {
        state.userIntraction = false;
      }
      if (state.balance > 0 && !state.userIntraction) {
        state.useWallet = true;
      }
    },

    setWalletUse(state, action) {
      state.useWallet = action.payload;
    },

    setUserIntraction(state) {
      state.userIntraction = true;
    },
    setCoupon(state, action) {
      state.coupon = action.payload;
    },
    setCouponState(state, action) {
      state.useCoupon = action.payload;
    },
  },
});

export default walletSlice;
