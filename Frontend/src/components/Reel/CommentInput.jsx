import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { addComment } from '../../services/operations/ProfileApI';

const CommentInput = ({ userImg, reelId, onCommentAdded }) => {
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { token } = useSelector((state) => state.auth);

  const handleEmojiClick = (emojiData) => {
    setCommentText((prev) => prev + emojiData.emoji);
  };

  const handlePost = async () => {
  if (commentText.trim() === '') return;

  const newComment = await addComment(reelId, commentText.trim(), token);
  if (newComment) {
    toast.success('Comment added');
    setCommentText('');
    setShowEmojiPicker(false);
    onCommentAdded?.(newComment);  
  } else {
    toast.error('Failed to add comment(Login First)');
  }
};


  return (
    <div className="border-t p-2 mt-1 relative text-black">
      <div className="flex items-center gap-2">
        <img src={userImg} alt="user" className="w-8 h-8 rounded-full" />

        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-full outline-none"
        />

        <button
          className="text-xl px-2"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          😊
        </button>

        {commentText.trim() !== '' && (
          <button
            onClick={handlePost}
            className="ml-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-full"
          >
            Post
          </button>
        )}
      </div>

      {showEmojiPicker && (
        <div className="absolute bottom-12 right-0 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default CommentInput;
