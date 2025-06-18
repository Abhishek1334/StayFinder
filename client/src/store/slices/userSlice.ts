import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: {
    name: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
});

export const { setUserProfile, setLoading, setError, clearUserProfile } = userSlice.actions;
export default userSlice.reducer; 