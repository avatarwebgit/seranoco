import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 balance: 0,
 useWallet: true,
 userIntraction: false,
};

const walletSlice = createSlice({
 name: 'wallet',
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
 },
});

export default walletSlice;
