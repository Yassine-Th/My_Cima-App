import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiKey } from "../../common/apis/MovieApiKey";
import MovieApi from "../../common/apis/MovieApi";
import { type } from "@testing-library/user-event/dist/type";

export const fetchAsyncMovies = createAsyncThunk(
  "movies/fetchAsyncMovies",
  async (term) => {
    const response = await MovieApi.get(
      `?apikey=${apiKey}&s=${term}&type=movie`
    );
    return { ...response.data,type: "movie" };
  }
);

export const fetchAsyncShows = createAsyncThunk(
  "movies/fetchAsyncShows",
  async (term) => {
    const response = await MovieApi.get(
      `?apikey=${apiKey}&s=${term}&type=series`
    );
    return { ...response.data, type: "series" };
  }
);
export const fetchAsyncMovieOrShowDetail = createAsyncThunk(
  "selectedMovieOrShow/fetchAsyncShows",
  async (id) => {
    const movieText = "friends";
     const response = await MovieApi.get(`?apikey=${apiKey}&i=${id}&Plot=f ull`);
    return response.data;
  }
);
 
const initialState = {
  movies: {},
  shows: {},
  selectedMovieOrShow: {},
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    removeSelectedMovieOrShow: (state) => {
      state.selectedMovieOrShow = {};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncMovies.pending, (state) => {
        console.log("pending");
      })
      .addCase(fetchAsyncMovies.fulfilled, (state, { payload }) => {
        console.log("fulfilled");
        state.movies = payload;
      })
      .addCase(fetchAsyncMovies.rejected, (state) => {
        console.log("rejected");
      })
      .addCase(fetchAsyncShows.fulfilled, (state, { payload }) => {
        console.log("fulfilled");
        state.shows = payload;
      })
      .addCase(fetchAsyncMovieOrShowDetail.fulfilled, (state, { payload }) => {
        console.log("fulfilled");
        state.selectedMovieOrShow = payload;
      });
      
  },
});

export const { removeSelectedMovieOrShow } = movieSlice.actions;
export const getAllMovies = (state) => state.movies.movies;
export const getAllShows = (state) => state.movies.shows;
export const getMovieOrShow = (state) => state.movies.selectedMovieOrShow;

export default movieSlice.reducer;
