import { createSlice } from '@reduxjs/toolkit';

const initialState = { balance: 10000, useWallet: false };

const walletSlice = createSlice({
 name: 'locale',
 initialState,
 reducers: {
  setBalance(state, action) {
   state.balance = action.payload;
  },
  setWalletUse(state, action) {
   state.useWallet = action.payload;
  },
 },
});

export default walletSlice;
