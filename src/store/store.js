import { configureStore } from '@reduxjs/toolkit';

import localeSlice from './slices/localeSlice';
import productSlice from './slices/productSlice';
import productDetailSlice from './slices/productDetail';
import drawerSlice from './slices/cardStateSlice';
import accessModal from './slices/accessModalslice';

const store = configureStore({
  reducer: {
    localeStore: localeSlice.reducer,
    productStore: productSlice.reducer,
    detailsStore: productDetailSlice.reducer,
    drawerStore: drawerSlice.reducer,
    accessModalStore: accessModal.reducer,
  },
});

export const localeActions = localeSlice.actions;
export const productActions = productSlice.actions;
export const productDetailActions = productDetailSlice.actions;
export const drawerActions = drawerSlice.actions;
export const accesModalActions = accessModal.actions;

export default store;
