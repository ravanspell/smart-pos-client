import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  scopes: string[]; 
};

const initialState: AuthState = {
  scopes: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserAuthInfo(state, action: PayloadAction<string[]>) {
      state.scopes = action.payload;
    },
  },
  selectors: {
    setUserScopses: (auth) => auth.scopes,
  },
});

export const { setUserScopses } = authSlice.selectors;
export const { setUserAuthInfo } = authSlice.actions;

export default authSlice.reducer;