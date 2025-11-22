import React from 'react';
import Input from './Input';
import postsReactionService from '../appwriteservices/postsReactions';


export const AddComment = ({ postId, currentUserId, onCommentAdded }) => {
    const [comment, setComment] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [message, setMessage] = React.useState("");
    
    const handleSubmit = async () => {
        if (!comment.trim()) {
            setMessage("Please write a comment");
            return;
        }
        
        setIsSubmitting(true);
        setMessage("");
        
        try {
            const newComment = await postsReactionService.addComment({
                postId: postId,
                userId: currentUserId,
                content: comment.trim()
            });
            
            setComment(""); // Clear the input
            setMessage("Comment posted successfully!");
            
            // Call the callback to refresh comments
            if (onCommentAdded) {
                onCommentAdded();
            }
            
            // Clear success message after 2 seconds
            setTimeout(() => setMessage(""), 2000);
            
        } catch (error) {
            console.error("Error posting comment:", error);
            setMessage("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mb-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-white font-medium mb-3">Add a Comment</h4>
            {message && (
                <p className={`text-sm mb-3 ${
                    message.includes("success") ? "text-green-300" : "text-red-300"
                }`}>
                    {message}
                </p>
            )}
            <Input 
                value={comment} 
                onChange={(e) => {
                    setComment(e.target.value);
                    if (message && !message.includes("success")) setMessage(""); // Clear error when typing
                }} 
                placeholder="Write your comment..."
                className="mb-3"
                disabled={isSubmitting}
            />
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                }} 
                disabled={isSubmitting || !comment.trim()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
        </div>
    );
}
