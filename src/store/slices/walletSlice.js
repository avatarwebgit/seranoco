import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  useWallet: true,
  userIntraction: false,
  couponCode: JSON.parse(localStorage.getItem("seranoco-coupon-value")) || 0,
  useCoupon: JSON.parse(localStorage.getItem("seranoco-coupon-usage")) || false,
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
      state.useCoupon = action.payload.useCoupon;
      localStorage.setItem("seranoco-coupon-usage", action.payload.useCoupon);
      state.couponCode = action.payload.value;
      localStorage.setItem("seranoco-coupon-value", action.payload.value);
    },
  },
});

export default walletSlice;
