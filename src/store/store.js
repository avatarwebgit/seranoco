import { configureStore } from "@reduxjs/toolkit";

import localeSlice from "./slices/localeSlice";

const store = configureStore({ reducer: { localeStore: localeSlice.reducer } });

export const localeActions = localeSlice.actions;

export default store;
