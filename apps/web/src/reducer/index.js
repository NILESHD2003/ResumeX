import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlices"

const rootReducer = combineReducers({
    auth: authReducer,
})

export default rootReducer;