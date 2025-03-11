import {
  combineReducers,
  configureStore,
  Observable,
  UnknownAction,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import clickSlice from './slices/clickSlice'
import linkSlice from './slices/linkSlice'
import userSlice from './slices/userSlice'
const persistConfig = {
  key: "root",
  storage,
};
// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  clicks: clickSlice,
  links: linkSlice,
  users: userSlice
});
// for the approach of logout redux- and persistence-clearing behavior, see
// https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
const logoutActionString = "LOGOUT_ACTION";
const persistedReducer = persistReducer(
  persistConfig,
  (state: RootState | undefined, action: UnknownAction) => {
    if (action.type === logoutActionString) {
      // clear the persisted state:
      localStorage.removeItem("persist:root");
      // clear the redux state:
      return rootReducer(undefined, action);
    }
    return rootReducer(state, action);
  },
);
// Infer the `RootState` type from rootReducer
export type RootState = ReturnType<typeof rootReducer>;
export const LOGOUT_ACTION: UnknownAction = {
  type: logoutActionString,
};

// see https://medium.com/@sergio.mazzoleni/using-recursive-partial-types-in-unit-tests-with-typescript-aad844416308
export type PartialDeep<T> = T extends (...args: never[]) => never
  ? T
  : T extends Promise<infer U>
  ? Promise<PartialDeep<U>>
  : T extends Observable<infer U>
  ? Observable<PartialDeep<U>>
  : {
    [P in keyof T]?: PartialDeep<T[P]>;
  };

export const makeStoreForTests = (preloadedState: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};
export const makeStoreForProduction = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStoreForTests>;
// Infer `AppDispatch` types from the store itself
export type AppDispatch = AppStore["dispatch"];
