import { createSlice } from '@reduxjs/toolkit';

const initialState = { itemIds: JSON.parse(localStorage.getItem('si')) || [] };

const productDetailSlice = createSlice({
  name: 'productIds',
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      if (!state.itemIds.includes(newItem)) {
        state.itemIds.push(newItem);
        localStorage.setItem('si', JSON.stringify(state.itemIds));
      }
    },
    removeItem(state, action) {
      state.itemIds = state.itemIds.filter(item => item !== action.payload);
      localStorage.setItem('si', JSON.stringify(state.itemIds));
    },
    reset(state, action) {
      state.itemIds = [];
      localStorage.setItem('si', JSON.stringify(state.itemIds));
    },
  },
});

export default productDetailSlice;
