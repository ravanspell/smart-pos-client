import { combineSlices } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";
// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(counterSlice);

export default rootReducer;