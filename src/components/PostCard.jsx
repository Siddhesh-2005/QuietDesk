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

  const [isCommentOpen, setCommentOpen] = useState(false);
  const handleCommentSection = () => {
    setCommentOpen(prev => !prev)
  }

  return (
    <div onClick={handleCommentSection}
      className="w-1/2 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border border-gray-700/50 rounded-lg shadow-lg p-6 relative backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600"></div>
          <span className="font-medium text-gray-200">{name}</span>
        </div>
        <span className="text-sm text-gray-500">{time}</span>
      </div>

      {/* Title */}
      <div className="text-lg font-bold mt-2 text-gray-100">{title}</div>

      {/* Image - use an <img> so the image scales responsively. */}
      {image && (
        <div className="w-full mt-3">
          <img
            src={image}
            alt={title || "post image"}
            className="w-full max-h-64 rounded-md object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="mt-3 text-gray-400 text-sm">{content}</div>

      {/* Action Buttons with Counters */}
      <div className="flex items-start justify-start gap-6 mt-4">
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className="px-4 py-2 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 disabled:opacity-50 backdrop-blur-sm border border-white/20"
          >
            <FaThumbsUp size={14} className="mr-2" />
            <span className="text-sm">{likes}</span>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={(e) => e.stopPropagation()} className="px-4 py-2 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20">
            <FaFlag size={14} className="mr-2" />
            <span className="text-sm">Report</span>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20">
            {isCommentOpen ? (
              <span className="text-sm">Add Comment</span>
            ) : (
              <>
                <FaComment size={14} className="mr-2" />
                <span className="text-sm">{comments}</span>
              </>
            )}
          </button>
        </div>
      </div>


      {/* Comment Section */}
      <div className="mt-4">
        {isCommentOpen && <CommentSection postId={postId} />}
      </div>
    </div>

  );
};

export default PostCard;
