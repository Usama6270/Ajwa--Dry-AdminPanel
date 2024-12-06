import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light', // You can toggle between light/dark mode
  user: null, // Initially, no user is logged in
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set user data from the login response
    },
    removeUser: (state) => {
      state.user = null; // Remove user data on logout
    },
  },
});

export const { setUser, removeUser } = globalSlice.actions;
export default globalSlice.reducer;
