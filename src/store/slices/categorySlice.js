import { createSlice } from '@reduxjs/toolkit';

const initialState = { category: {} };

const categorySlice = createSlice({
 name: 'cartProductIds',
 initialState,
 reducers: {
  setCategory(state, action) {
   state.category = action.payload;
  },
  resetCategory(state, action) {
   state.category = {};
  },
 },
});

export default categorySlice;
