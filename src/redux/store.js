import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./reducer/AuthReducer";

export const store = configureStore({
  reducer: {
    AuthReducer: AuthReducer,

  },
});
