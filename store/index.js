import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import generalDataReducer from './generalData';
import cartReducer from './cart';

export const store = configureStore({
  reducer: {
    user: userReducer,
    generalData: generalDataReducer,
    cart: cartReducer,
  },
});
