import React from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaFlag } from "react-icons/fa";
import postsReactionService from "../appwriteservices/postsReactions";
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
  const handleLike = () =>
    postsReactionService.toggleReaction(postId, currentUserId, "like");

  return (
    <div className="w-full bg-gray-200 border-2 border-gray-500 rounded-lg shadow-md p-6 relative">
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
            className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500 text-white hover:scale-110 transition"
          >
            <FaThumbsUp size={15} />
          </button>
          <span className="text-xs text-gray-700 mt-1">{likes}</span>
        </div>

        <div className="flex flex-col items-center">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500 text-white hover:scale-110 transition">
            <FaThumbsDown size={15} />
          </button>
          <span className="text-xs text-gray-700 mt-1">{dislikes}</span>
        </div>

        <div className="flex flex-col items-center">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:scale-110 transition">
            <FaComment size={15} />
          </button>
          <span className="text-xs text-gray-700 mt-1">{comments}</span>
        </div>
      </div>

      {/* Report Button */}
      <button className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600 text-white absolute bottom-6 right-6 hover:scale-110 transition">
        <FaFlag size={15} />
      </button>
    </div>
  );
};

export default PostCard;
