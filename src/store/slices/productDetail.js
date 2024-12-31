import { createSlice } from '@reduxjs/toolkit';

const initialState = { shapeId: '', colorIds: [], sizeIds: [] };

const productDetailSlice = createSlice({
  name: 'productIds',
  initialState,
  reducers: {
    addShapeId(state, action) {
      state.shapeId = action.payload;
      state.colorIds = [];
      state.sizeIds = [];
    },
    addColorIds(state, action) {
      state.colorIds = action.payload;
    },
    addSizeIds(state, action) {
      state.sizeIds = action.payload;
    },
    resetDetails(state) {
      state.shapeId = '';
      state.colorIds = [];
      state.sizeIds = [];
    },
  },
});

export default productDetailSlice;
