import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaFlag } from "react-icons/fa";
import postsReactionService from "../appwriteservices/postsReactions";
import CommentSection from "./CommentSection";
const PostCard = ({
  postId,
  currentUserId,
  name,
  time,
  title,
  content,
  image,
  likes = 0,
  dislikes = 0,
  comments = 0,
}) => {
  const [loadingLike, setLoadingLike] = useState(false);
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUserId || loadingLike) return;
    try {
      setLoadingLike(true);
      await postsReactionService.toggleReaction({ postId, userId: currentUserId, reaction: "like" });
    } catch (err) {
      console.error('handleLike failed', err.message || err);
    } finally {
      setLoadingLike(false);
    }
  };

  const [isCommentOpen,setCommentOpen]=useState(false);
  const handleCommentSection=()=>{
    setCommentOpen(prev=>!prev)
  }

  return (
    <div onClick={handleCommentSection}
     className="w-full bg-gray-200 border-2 border-gray-500 rounded-lg shadow-md p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600"></div>
          <span className="font-medium">{name}</span>
        </div>
        <span className="text-sm text-gray-600">{time}</span>
      </div>

      {/* Title */}
      <div className="text-lg font-bold mt-2">{title}</div>

      {/* Image - use an <img> so the image scales responsively. */}
      {image && (
        <div className="w-full mt-3">
          <img
            src={image}
            alt={title || "post image"}
            className="w-auto max-h-80 rounded-md object-cover"
            style={{ display: "block" }}
          />
        </div>
      )}

      {/* Content */}
      <div className="mt-3 text-gray-800 text-sm">{content}</div>

      {/* Action Buttons with Counters */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 text-white hover:scale-110 transition disabled:opacity-50"
          >
            <FaThumbsUp size={15} />
          </button>
          <span className="text-xs text-gray-700 mt-1">{likes}</span>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={(e)=>e.stopPropagation()} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 transition">
            <FaThumbsDown size={15} />
          </button>
          <span className="text-xs text-gray-700 mt-1">{dislikes}</span>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={(e)=>e.stopPropagation()} className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:scale-110 transition">
            {!isCommentOpen ?<FaComment size={15} />:<p>Add Comment</p>}
          </button>
          <span className="text-xs text-gray-700 mt-1">{comments}</span>
        </div>
      </div>

      {/* Report Button */}
      <button onClick={(e)=>e.stopPropagation()} className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600 text-white absolute bottom-6 right-6 hover:scale-110 transition">
        <FaFlag size={15} />
      </button>
      <div>
        {isCommentOpen && <CommentSection postId={postId}/>}
      </div>
    </div>

  );
};

export default PostCard;
