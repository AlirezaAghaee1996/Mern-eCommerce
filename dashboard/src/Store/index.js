
import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage

import authSliceReducer from './Slices/AuthSlice';

// Persist configuration for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
};

// Create a persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authSliceReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);
export default store;