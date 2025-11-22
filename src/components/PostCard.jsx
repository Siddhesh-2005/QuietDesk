import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaFlag } from "react-icons/fa";
import postsReactionService from "../appwriteservices/postsReactions";
import CommentSection from "./CommentSection";
import { AddComment } from "./AddComment";
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dynamicCommentCount, setDynamicCommentCount] = useState(comments);
  const [dynamicLikeCount, setDynamicLikeCount] = useState(likes);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [loadingUserReaction, setLoadingUserReaction] = useState(true);

  // Check if user has already liked this post on component mount
  useEffect(() => {
    const checkUserReaction = async () => {
      if (!currentUserId || !postId) {
        setLoadingUserReaction(false);
        return;
      }
      
      try {
        const res = await postsReactionService.getUserReaction(postId, currentUserId);
        setUserHasLiked(res?.reaction === 'like');
      } catch (error) {
        console.error('Error checking user reaction:', error);
      } finally {
        setLoadingUserReaction(false);
      }
    };
    
    checkUserReaction();
  }, [postId, currentUserId]);
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUserId || loadingLike || loadingUserReaction) return;
    
    // Store current state for rollback
    const previousLikeState = userHasLiked;
    const previousLikeCount = dynamicLikeCount;
    
    try {
      setLoadingLike(true);
      
      // Optimistic UI update
      if (userHasLiked) {
        setUserHasLiked(false);
        setDynamicLikeCount(prev => Math.max(prev - 1, 0));
      } else {
        setUserHasLiked(true);
        setDynamicLikeCount(prev => prev + 1);
      }
      
      // Make API call
      await postsReactionService.toggleReaction({ 
        postId, 
        userId: currentUserId, 
        reaction: "like" 
      });
      
    } catch (err) {
      console.error('handleLike failed', err.message || err);
      
      // Rollback optimistic updates on error
      setUserHasLiked(previousLikeState);
      setDynamicLikeCount(previousLikeCount);
      
      // Show error message (optional)
      // You could add a toast notification here
      
    } finally {
      setLoadingLike(false);
    }
  };

  const [isCommentOpen, setCommentOpen] = useState(false);
  const handleCommentSection = () => {
    setCommentOpen(prev => !prev)
  }

  // Function to refresh comments after adding new one
  const handleCommentAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setDynamicCommentCount(prev => prev + 1);
  };

  // Function to update comment count when comments are fetched
  const handleCommentsLoaded = (commentCount) => {
    setDynamicCommentCount(commentCount);
  };

  return (
    <div onClick={handleCommentSection}
      className="w-1/2 mx-auto bg-blue-600 border border-gray-700/50 rounded-lg shadow-lg p-6 relative backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600"></div>
          <span className="font-medium text-gray-200">{name}</span>
        </div>
        <span className="text-sm text-white">
          {new Date(time).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
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
      <div className="mt-3 text-gray-300 text-sm">{content}</div>

      {/* Action Buttons with Counters */}
      <div className="flex items-start justify-start gap-6 mt-4">
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            disabled={loadingLike || loadingUserReaction}
            className={`px-4 py-2 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 backdrop-blur-sm border ${
              userHasLiked 
                ? 'bg-blue-500/30 hover:bg-blue-500/40 text-blue-300 border-blue-400/50 shadow-lg shadow-blue-500/20' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            } ${loadingLike ? 'animate-pulse' : ''}`}
          >
            <FaThumbsUp 
              size={14} 
              className={`mr-2 transition-all duration-200 ${
                userHasLiked ? 'text-blue-300 drop-shadow-sm' : 'text-white'
              } ${loadingLike ? 'animate-pulse' : ''}`} 
            />
            <span className="text-sm font-medium">
              {loadingUserReaction ? '...' : dynamicLikeCount}
            </span>
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
            onClick={(e) => {
              e.stopPropagation();
              handleCommentSection();
            }}
            className="px-4 py-2 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20">
            {isCommentOpen ? (
              <span className="text-sm">Hide Comments</span>
            ) : (
              <>
                <FaComment size={14} className="mr-2" />
                <span className="text-sm">{dynamicCommentCount}</span>
              </>
            )}
          </button>
        </div>
      </div>


      {/* Comment Section */}
      <div className="mt-4">
        {isCommentOpen && (
          <>
            <AddComment 
              postId={postId} 
              currentUserId={currentUserId} 
              onCommentAdded={handleCommentAdded}
            />
            <CommentSection 
              postId={postId} 
              refreshTrigger={refreshTrigger}
              onCommentsLoaded={handleCommentsLoaded}
            />
          </>
        )}
      </div>
    </div>

  );
};

export default PostCard;
