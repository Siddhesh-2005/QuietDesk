import React, { useEffect, useState } from 'react'
import postsReactionService from '../appwriteservices/postsReactions';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchComments = async () => {
      try {
        const res = await postsReactionService.getComments(postId);
        const rows = res?.rows || [];
        if (mounted) setComments(rows);
        console.log(rows);
        
      } catch (err) {
        console.error('CommentSection: getComments failed', err.message || err);
      }
    };

    fetchComments();
    
    return () => {
      mounted = false;
    };
  }, [postId]);

  return (
    <div>
      <ul>
        {comments.length > 0
          ? comments.map((comment) => (
              <li key={comment.$id }>
                {comment.content }
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}

export default CommentSection