import { combineReducers } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";
import { fileManagementApi } from "../api/fileManagmentAPI";
import { authManagementApi } from "../api/authManagementAPI";
// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineReducers({
    // Non-API slices
    [counterSlice.reducerPath]: counterSlice.reducer,
    // API slices (RTK Query reducers)
    [fileManagementApi.reducerPath]: fileManagementApi.reducer,
    [authManagementApi.reducerPath]: authManagementApi.reducer,
});
export default rootReducer;