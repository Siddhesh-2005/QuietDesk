import React from 'react';
import Input from './Input';
import postsReactionService from '../appwriteservices/postsReactions';


export const AddComment = ({ postId, currentUserId }) => {
    const [comment, setComment] = React.useState("");
    const handleSubmit=()=>{
        postsReactionService.addComment({
            postId:postId,
            userId:currentUserId,
            content:comment
        });
    }

    return (
        <div className="mb-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-white font-medium mb-3">Add a Comment</h4>
            <Input 
                value={comment} 
                onChange={(e) => {
                    setComment(e.target.value);
                }} 
                placeholder="Write your comment..."
                className="mb-3"
            />
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                }} 
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
                Post Comment
            </button>
        </div>
    );
}
