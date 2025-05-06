import { createSlice } from '@reduxjs/toolkit';

const initialState = { drawerOpen: false, favoritesDrawer: false };

const drawerSlice = createSlice({
 name: 'drawer',
 initialState,
 reducers: {
  open(state) {
   state.drawerOpen = true;
  },
  close(state) {
   state.drawerOpen = false;
  },
  favoritesOpen(state) {
   state.favoritesDrawer = true;
  },
  favoritesClose(state) {
   state.favoritesDrawer = false;
  },
 },
});

export default drawerSlice;
