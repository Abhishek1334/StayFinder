import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/login/fulfilled", "auth/register/fulfilled", "auth/getMe/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.user", "payload.token"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.user", "auth.token"],
      },
    }),
});

// Enable the refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 