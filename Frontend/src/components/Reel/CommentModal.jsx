import React, { useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import { timeAgo } from '../../../utils/DateFormater';
import { useSelector } from 'react-redux';

import toast from 'react-hot-toast';
import { getReelComments } from '../../services/operations/ReelsApi';
import { Link } from 'react-router-dom';

const CommentModal = ({ isOpen, onClose, reelId, reelCreatorId }) => {
  const { user } = useSelector((state) => state.profile);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !reelId) return;

    const fetchComments = async () => {
      setLoading(true);


      const fetchedComments = await getReelComments(reelId);
      if (fetchedComments) {
        setComments(fetchedComments);
      } else {
        setComments([]);
      }
      setLoading(false);
    };

    fetchComments();
  }, [isOpen, reelId, user]);

  if (!isOpen) return null;

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-start sm:justify-end backdrop-blur-sm animate-fadeIn">
      <div className="relative w-[92%] h-[85vh] sm:w-[400px] sm:h-[80vh] bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg rounded-3xl flex flex-col overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-gray-900/90 backdrop-blur-md border-b border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold tracking-wide drop-shadow-md">Comments</h2>
          <button
            onClick={onClose}
            className="text-3xl font-bold text-gray-400 hover:text-white transition duration-200 ease-in-out transform hover:scale-110"
            aria-label="Close comments"
          >
            &times;
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {loading ? (
            <p className="text-center text-gray-400">Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((c, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 animate-slideUp hover:bg-gray-700 rounded-xl p-3 transition-colors duration-300 cursor-pointer"
              >
                <Link to={`/${c.user.username}`}>
                <img
                  src={c.user.profileImage}
                  alt={`${c.user.username} avatar`}
                  className="w-10 h-10 rounded-full object-cover shadow-lg border border-white/20"
                />
                </Link>
                <div className="bg-gray-800/70 backdrop-blur-sm px-5 py-3 rounded-2xl flex flex-col max-w-[80%] shadow-md border border-gray-700">
                  <p className="font-semibold text-sm text-white tracking-wide mb-1">
                    {c.user._id === reelCreatorId ? 'Me (author)' : c.user.username}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-300">
                    <p className="flex-1 leading-relaxed">{c.text}</p>
                    <small className="ml-5 text-xs text-gray-400 whitespace-nowrap font-mono">
                      {timeAgo(c.createdAt)}
                    </small>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm italic tracking-wide select-none">No comments yet. Be the first!</p>
          )}
        </div>

        {/* Input Box */}
        <div className="border-t border-gray-700 px-6 py-4 bg-gray-900/90 backdrop-blur-md sticky bottom-0 z-10 shadow-inner">
          <CommentInput
            userImg={user?.profileImage}
            reelId={reelId}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
