import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './slices'
import { fileManagementApi } from "./api/fileManagmentAPI";
import { authManagementApi } from "./api/authManagementAPI";
import { rolesApi } from "./api/rolesAPI";
import { appAPI } from "./api/appAPI";
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// Middleware grouping for clarity
const apiMiddlewares = [
  fileManagementApi.middleware,
  authManagementApi.middleware,
  rolesApi.middleware,
  appAPI.middleware,
];

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(...apiMiddlewares),
  });
};

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
