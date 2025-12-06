import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
 persistStore,
 persistReducer,
 PERSIST,
 REHYDRATE,
 FLUSH,
 PAUSE,
 PURGE,
 REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import localeSlice from './slices/localeSlice';
import productSlice from './slices/productSlice';
import productDetailSlice from './slices/productDetail';
import drawerSlice from './slices/cardStateSlice';
import accessModalSlice from './slices/accessModalslice';
import signupInformationSlice from './slices/signupInformationSlice';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';
import favoriteSlice from './slices/favorites';
import categorySlice from './slices/categorySlice';
import walletSlice from './slices/walletSlice';

// Persistence Configuration
const persistConfig = {
 key: 'root',
 storage,
 whitelist: ['userStore', 'walletStore'],
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
 favoriteStore: favoriteSlice.reducer,
 categoryStore: categorySlice.reducer,
 walletStore: walletSlice.reducer,
};

const persistedReducer = persistReducer(
 persistConfig,
 combineReducers(rootReducer),
);

const loggerMiddleware = (store) => (next) => (action) => {
  console.log("🔵 Dispatching action:", action.type);
  console.log("📦 Action payload:", action.payload);
  console.log("📊 State before:", store.getState());

  const result = next(action);

  console.log("📊 State after:", store.getState());
  console.log("---");

  return result;
};


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(loggerMiddleware),
});

export const localeActions = localeSlice.actions;
export const productActions = productSlice.actions;
export const productDetailActions = productDetailSlice.actions;
export const drawerActions = drawerSlice.actions;
export const accesModalActions = accessModalSlice.actions;
export const signupActions = signupInformationSlice.actions;
export const cartActions = cartSlice.actions;
export const userActions = userSlice.actions;
export const favoriteActions = favoriteSlice.actions;
export const categoryActions = categorySlice.actions;
export const walletActions = walletSlice.actions;

const persistor = persistStore(store);

export { store, persistor };
