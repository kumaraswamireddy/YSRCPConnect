import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import feedSlice from './feedSlice';
import profileSlice from './profileSlice';
import notificationsSlice from './notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    feed: feedSlice,
    profile: profileSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Uncomment these types if using TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;