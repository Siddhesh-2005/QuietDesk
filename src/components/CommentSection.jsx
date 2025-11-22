import React, { useEffect, useState } from 'react'
import postsReactionService from '../appwriteservices/postsReactions';

function CommentSection({ postId, refreshTrigger = 0, onCommentsLoaded }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      try {
        const res = await postsReactionService.getComments(postId);
        const rows = res?.rows || [];
        if (mounted) {
          setComments(rows);
          // Report the comment count back to parent
          if (onCommentsLoaded) {
            onCommentsLoaded(rows.length);
          }
        }
        console.log(rows);
        
      } catch (err) {
        console.error('CommentSection: getComments failed', err.message || err);
      }
    };

    fetchComments();
    
    return () => {
      mounted = false;
    };
  }, [postId, refreshTrigger, onCommentsLoaded]);

  return (
    <div className="mt-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
      <h4 className="text-white font-medium mb-3">Comments</h4>
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.$id} className="p-3 bg-white/5 rounded-md border border-white/10">
              <p className='text-white text-bold'>{comment.userId}</p>
              <p className="text-gray-200 text-sm">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">No comments yet</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection