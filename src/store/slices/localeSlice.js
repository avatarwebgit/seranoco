import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lng: localStorage.getItem("i18nextLng") || "en",
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    en(state) {
      state.lng = "en";
      localStorage.setItem("i18nextLng", "en");
    },
    fa(state) {
      state.lng = "fa";
      localStorage.setItem("i18nextLng", "fa");
    },
  },
});

export default localeSlice;
