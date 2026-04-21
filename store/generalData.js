import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const generalDataSlice = createSlice({
  name: 'generalData',
  initialState,
  reducers: {
    setGeneralData: (state, action) => {
      return action.payload;
    },
  },
});

export const { setGeneralData } = generalDataSlice.actions;
export default generalDataSlice.reducer;
