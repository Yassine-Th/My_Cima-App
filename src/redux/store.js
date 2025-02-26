import { configureStore } from "@reduxjs/toolkit";
import movieRed from "./movies/movieSLice";

export const store = configureStore({
  reducer:{
   movies: movieRed
  },
})