import { combineReducers } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";
import { fileManagementApi } from "../api/fileManagmentAPI";
import { authManagementApi } from "../api/authManagementAPI";
import { appSlice } from "./appSlice";
import { authSlice } from "./authSlice";
import { rolesApi } from "../api/rolesAPI";
import { appAPI } from "../api/appAPI";
import { candidatesApi } from "../api/candidatesApi";
// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineReducers({
    // Non-API slices
    [counterSlice.reducerPath]: counterSlice.reducer,
    [appSlice.reducerPath]: appSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
    // API slices (RTK Query reducers)
    [fileManagementApi.reducerPath]: fileManagementApi.reducer,
    [authManagementApi.reducerPath]: authManagementApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [appAPI.reducerPath]: appAPI.reducer,
    [candidatesApi.reducerPath]: candidatesApi.reducer,
});
export default rootReducer;