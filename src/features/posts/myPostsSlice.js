import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postsService from "../../appwriteservices/posts";

export const fetchMyPosts = createAsyncThunk("myPosts/fetchMyPosts", async (_,thunkAPI) => {
  const state=thunkAPI.getState();
  const user=state.auth.userData;  
  const response = await postsService.getUserPosts(user.$id);
  console.log("Fetched my posts:", response);
  return response; 
});

const initialState = {
  myPosts: [],
  loading: false,
  error: null,
};

const myPostsSlice = createSlice({
  name: "myPosts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.myPosts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.myPosts.findIndex((p) => p.$id === action.payload.$id);
      if (index !== -1) {
        state.myPosts[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.myPosts = state.myPosts.filter((p) => p.$id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = action.payload;
        console.log("Redux got posts:", action.payload);

      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addPost, updatePost, deletePost } = myPostsSlice.actions;
export default myPostsSlice.reducer;
