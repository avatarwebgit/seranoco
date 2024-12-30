import { configureStore } from '@reduxjs/toolkit';

import localeSlice from './slices/localeSlice';
import productSlice from './slices/productSlice';

const store = configureStore({
  reducer: {
    localeStore: localeSlice.reducer,
    productStore: productSlice.reducer,
  },
});

export const localeActions = localeSlice.actions;
export const productActions = productSlice.actions;

export default store;
