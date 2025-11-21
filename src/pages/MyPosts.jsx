import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { fetchMyPosts } from "../features/posts/myPostsSlice";
import PostCard from "../components/PostCard";

function MyPosts() {
  const dispatch=useDispatch()
  const myPosts=useSelector((state)=>state.myPosts.myPosts)
  const user=useSelector((state)=>state.auth.userData)
  useEffect(()=>{
    dispatch(fetchMyPosts())
    console.log(myPosts);
    
    
  },[dispatch])
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-8 lg:px-16">
  <div className="space-y-6">
    {myPosts.length > 0 ? (
      myPosts.map((p) => (
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

export default MyPosts;