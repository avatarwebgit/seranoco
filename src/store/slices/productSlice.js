import { createSlice } from '@reduxjs/toolkit';

const initialState = { productIds: [] };

const productSlice = createSlice({
  name: 'productIds',
  initialState,
  reducers: {
    addProduct(state, action) {
      state.productIds.push(action.payload);
    },
    removeProduct(state, action) {
      state.productIds = state.productIds.filter(id => id !== action.payload);
    },
  },
});

export default productSlice;
