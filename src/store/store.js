import { configureStore } from '@reduxjs/toolkit';

import localeSlice from './slices/localeSlice';
import productSlice from './slices/productSlice';
import productDetailSlice from './slices/productDetail';
import drawerSlice from './slices/cardStateSlice';
import accessModalSlice from './slices/accessModalslice';
import signupInformationSlice from './slices/signupInformationSlice';
import cartSlice from './slices/cartSlice';

const store = configureStore({
  reducer: {
    localeStore: localeSlice.reducer,
    productStore: productSlice.reducer,
    detailsStore: productDetailSlice.reducer,
    drawerStore: drawerSlice.reducer,
    accessModalStore: accessModalSlice.reducer,
    signupStore: signupInformationSlice.reducer,
    cartStore: cartSlice.reducer,
  },
});

export const localeActions = localeSlice.actions;
export const productActions = productSlice.actions;
export const productDetailActions = productDetailSlice.actions;
export const drawerActions = drawerSlice.actions;
export const accesModalActions = accessModalSlice.actions;
export const signupActions = signupInformationSlice.actions;
export const cartActions = cartSlice.actions;

export default store;
