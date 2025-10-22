import React, { useEffect } from "react";
import LogoutBtn from "../components/Header/LogoutBtn";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/posts/postsSlice";
import PostCard from "../components/PostCard";

function Home() {
  const dispatch=useDispatch()
  const posts=useSelector((state)=>state.posts.posts)
  const user=useSelector((state)=>state.auth.userData)
  useEffect(()=>{
    dispatch(fetchPosts())
  },[dispatch])
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-8 lg:px-16">
  <div className="space-y-6">
    {posts.length > 0 ? (
      posts.map((p) => (
        <div key={p.$id}>
          <PostCard
            postId={p.$id}
            currentUserId={user.$id}
            name={p.userId}
            title={p.title}
            content={p.textContent}
            time={p.$createdAt}
            likes={p.likesCount}
            dislikes={p.dislikesCount}
            comments={p.commentsCount}
            image={p.imageUrl}
          />
        </div>
      ))
    ) : (
      <p className="text-gray-500">No posts to display.</p>
    )}
  </div>
</div>

  );
}

export default Home;