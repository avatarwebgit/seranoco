import { configureStore } from '@reduxjs/toolkit';

import localeSlice from './slices/localeSlice';
import productSlice from './slices/productSlice';
import productDetailSlice from './slices/productDetail';

const store = configureStore({
  reducer: {
    localeStore: localeSlice.reducer,
    productStore: productSlice.reducer,
    detailsStore: productDetailSlice.reducer,
  },
});

export const localeActions = localeSlice.actions;
export const productActions = productSlice.actions;
export const productDetailActions = productDetailSlice.actions;

export default store;
