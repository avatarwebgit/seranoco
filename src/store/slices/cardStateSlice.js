import { createSlice } from '@reduxjs/toolkit';

const initialState = { drawerOpen: false };

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
  },
});

export default drawerSlice;
