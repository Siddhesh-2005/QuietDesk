import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import postsReducer from "../features/posts/postsSlice"
import myPostsReducer from "../features/posts/myPostsSlice"

export const store = configureStore({
  reducer: {
    auth:authReducer,
    posts:postsReducer,
    myPosts:myPostsReducer,
  },
})