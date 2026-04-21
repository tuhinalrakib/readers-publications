import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart_items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cart_items = action.payload;
    },
    addCartItem: (state, action) => {
      if(state.cart_items.find((item) => item.book_id === action.payload.book_id)) {
        state.cart_items.find((item) => item.book_id === action.payload.book_id).quantity += action.payload.quantity;
      } else {
        state.cart_items.push(action.payload);
      }
    },
    removeCartItem: (state, action) => {
      state.cart_items = state.cart_items.filter((item) => !action.payload.includes(item.uuid));
    },
    updateSelectionStatusChange: (state, action) => {
      console.log(action.payload.ids)
      state.cart_items = state.cart_items.map((item) => {
        if (action.payload.ids.includes(item.uuid)) {
          return { ...item, is_selected: !item.is_selected }
        }
        return item
      })
    }
  },
});

export const { setCartItems, addCartItem, removeCartItem, updateSelectionStatusChange } = cartSlice.actions;
export default cartSlice.reducer;
