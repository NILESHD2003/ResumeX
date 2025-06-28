import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import authReducer from "../slices/authSlices"
import jobReducer from "../slices/jobIdSlice"

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    job: jobReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);