import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import your existing slices
import localeSlice from './slices/localeSlice';
import productSlice from './slices/productSlice';
import productDetailSlice from './slices/productDetail';
import drawerSlice from './slices/cardStateSlice';
import accessModalSlice from './slices/accessModalslice';
import signupInformationSlice from './slices/signupInformationSlice';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';

// Persistence Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userStore', 'cartStore'], 
};

const rootReducer = {
  localeStore: localeSlice.reducer,
  productStore: productSlice.reducer,
  detailsStore: productDetailSlice.reducer,
  drawerStore: drawerSlice.reducer,
  accessModalStore: accessModalSlice.reducer,
  signupStore: signupInformationSlice.reducer,
  cartStore: cartSlice.reducer,
  userStore: userSlice.reducer,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducer),
);

const store = configureStore({
  reducer: persistedReducer,
 
});

// Create Persistor
const persistor = persistStore(store);

export const localeActions = localeSlice.actions;
export const productActions = productSlice.actions;
export const productDetailActions = productDetailSlice.actions;
export const drawerActions = drawerSlice.actions;
export const accesModalActions = accessModalSlice.actions;
export const signupActions = signupInformationSlice.actions;
export const cartActions = cartSlice.actions;
export const userActions = userSlice.actions;

export { store, persistor };
