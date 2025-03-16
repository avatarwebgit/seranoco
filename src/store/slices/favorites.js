import { createSlice } from '@reduxjs/toolkit';

const initialState = { products: [] };

const favoriteSlice = createSlice({
  name: 'favoriteSlice',
  initialState,
  reducers: {
    add(state, action) {
      state.products.push(action.payload);
    },
    remove(state, action) {
      state.products = state.products.filter(
        el => el.variation_id !== action.payload,
      );
    },
    setFetchedProducts(state, action) {
      state.products = action.payload;
    },
  },
});

export default favoriteSlice;
