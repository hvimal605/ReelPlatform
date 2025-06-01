import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import CommentModal from './CommentModal';
import ShareModal from './ShareModal';

import {
    FaHeart,
    FaThumbsDown,
    FaRegCommentDots,
    FaShare,
    FaVolumeMute,
    FaVolumeUp,
    FaPlay,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { likeReel, dislikeReel } from '../../services/operations/ReelsApi';
import toast from 'react-hot-toast';

const ReelCard = ({ reel,}) => {
    const {
        _id: reelId,
        videoUrl,
        caption = '',
        user = {},
        likes = [],
        dislikes = [],

        shareCount,
    } = reel;

    const creatorName = user.username || 'unknown_user';
    const creatorImg = user.profileImage || 'https://i.pravatar.cc/40?img=1';

    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [showPlayIcon, setShowPlayIcon] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showFullCaption, setShowFullCaption] = useState(false);
    const [likesCount, setLikesCount] = useState(likes.length);
    const [dislikesCount, setDislikesCount] = useState(dislikes.length);

    const controls = useAnimation();

    const { token } = useSelector((state) => state.auth);
    const { user: loggedInUser } = useSelector((state) => state.profile);
    // console.log("Logged in user:", loggedInUser._id);
    const userId = loggedInUser?._id;

    // On mount, check if user already liked or disliked
    useEffect(() => {
        setLiked(likes.includes(userId));
        setDisliked(dislikes.includes(userId));
    }, [likes, dislikes, userId]);

    const toggleMute = () => {
        const video = videoRef.current;
        if (video) {
            video.muted = !video.muted;
            setMuted(video.muted);
        }
    };

    // Like reel handler
    const handleLike = async () => {
        if (!token) return toast.error("Please login to like the reel.");

        // Optimistic UI update
        setLiked((prevLiked) => {
            const newLiked = !prevLiked;
            if (newLiked) setDisliked(false);
            return newLiked;
        });

        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
        if (disliked) setDislikesCount((prev) => prev - 1);

        try {
            const data = await likeReel(reelId, token);
            if (data) {
                setLikesCount(data.totalLikes);
                if (data.totalDislikes !== undefined) setDislikesCount(data.totalDislikes);
            }
        } catch (error) {
            // Revert UI on error
            setLiked(liked);
            setLikesCount(likes.length);
            if (disliked) setDislikesCount(dislikes.length);
            console.error("Failed to like reel", error);
        }
    };

    // Dislike reel handler
    const handleDislike = async () => {
        if (!token) return toast.error("Please login to dislike the reel.");

        // Optimistic UI update
        setDisliked((prevDisliked) => {
            const newDisliked = !prevDisliked;
            if (newDisliked) setLiked(false);
            return newDisliked;
        });

        setDislikesCount((prev) => (disliked ? prev - 1 : prev + 1));
        if (liked) setLikesCount((prev) => prev - 1);

        try {
            const data = await dislikeReel(reelId, token);
            if (data) {
                setDislikesCount(data.totalDislikes);
                if (data.totalLikes !== undefined) setLikesCount(data.totalLikes);
            }
        } catch (error) {
            // Revert UI on error
            setDisliked(disliked);
            setDislikesCount(dislikes.length);
            if (liked) setLikesCount(likes.length);
            console.error("Failed to dislike reel", error);
        }
    };

    // Handle swipe gesture
    const handleSwipe = async (direction) => {
        if (!token) return alert("Please login to react to the reel.");

        if (direction === 'right') {
            if (!liked) {
                await handleLike();
            }
        } else if (direction === 'left') {
            if (!disliked) {
                await handleDislike();
            }
        }

        // Animate swipe
        await controls.start({
            x: direction === 'right' ? 200 : -200,
            opacity: 0,
            transition: { duration: 0.4 },
        });
        await controls.start({ x: 0, opacity: 1 });
    };

    const handleVideoClick = () => {
        const video = videoRef.current;
        if (!video) return;

        if (playing) {
            video.pause();
            setShowPlayIcon(true);
            setTimeout(() => setShowPlayIcon(false), 1000);
        } else {
            video.play();
        }

        setPlaying(!playing);
    };

    const getTrimmedCaption = (text, limit = 60) =>
        text.length > limit ? text.substring(0, limit) + '...' : text;

    return (
        <>
            <motion.div
                className="relative mx-auto bg-black w-full h-[80vh] sm:h-[85vh] sm:max-w-md rounded-xl sm:rounded-2xl overflow-hidden"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                    if (info.offset.x > 100) handleSwipe('right');
                    else if (info.offset.x < -100) handleSwipe('left');
                }}
                animate={controls}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="object-cover w-full h-full"
                    autoPlay
                    loop
                    muted={muted}
                    onClick={handleVideoClick}
                />

                {showPlayIcon && (
                    <motion.div
                        className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <FaPlay className="text-6xl drop-shadow-lg" />
                    </motion.div>
                )}

                <button
                    onClick={toggleMute}
                    className="absolute top-4 right-4 z-10 bg-black/40 p-2 rounded-full text-white hover:bg-black/70 transition"
                    aria-label={muted ? "Unmute" : "Mute"}
                >
                    {muted ? <FaVolumeMute className="w-5 h-5" /> : <FaVolumeUp className="w-5 h-5" />}
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex justify-between items-end bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-[80%] flex gap-3 items-start">
                        <Link to={`/${creatorName}`}>
                            <img
                                src={creatorImg}
                                alt="creator"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                            />
                        </Link>
                        <div className="flex flex-col">
                            <Link to={`/${creatorName}`}>
                                <p className="font-semibold text-base">@{creatorName}</p>
                            </Link>
                            <p className="text-sm leading-snug transition-all duration-300 ease-in-out">
                                {showFullCaption ? caption : getTrimmedCaption(caption)}
                            </p>
                            {caption.length > 60 && (
                                <button
                                    onClick={() => setShowFullCaption(!showFullCaption)}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-all mt-1"
                                >
                                    {showFullCaption ? 'Less' : 'More'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 pr-2 mb-6 text-center">
                        <button
                            onClick={handleLike}
                            aria-label="Like"
                            className="flex flex-col items-center transition-transform transform hover:scale-110 group"
                        >
                            <FaHeart
                                className={`w-7 h-7 drop-shadow-md transition-all ${liked ? 'text-red-500 scale-110' : 'text-white group-hover:text-red-400'
                                    }`}
                            />
                            <span className="text-xs mt-1 text-gray-200 group-hover:text-white">{likesCount}</span>
                        </button>

                        <button
                            onClick={handleDislike}
                            aria-label="Dislike"
                            className="flex flex-col items-center transition-transform transform hover:scale-110 group"
                        >
                            <FaThumbsDown
                                className={`w-7 h-7 drop-shadow-md transition-all ${disliked ? 'text-blue-500 scale-110' : 'text-white group-hover:text-blue-400'
                                    }`}
                            />
                            <span className="text-xs mt-1 text-gray-200 group-hover:text-white">{dislikesCount}</span>
                        </button>

                        <button
                            onClick={() => setShowComments(true)}
                            aria-label="Comments"
                            className="flex flex-col items-center transition-transform transform hover:scale-110 group"
                        >
                            <FaRegCommentDots className="w-7 h-7 drop-shadow-md text-white group-hover:text-blue-400" />
                            <span className="text-xs mt-1 text-gray-200 group-hover:text-white">
                                {reel.comments?.length || 0}
                            </span>
                        </button>

                        <button
                            onClick={() => setShowShareModal(true)}
                            aria-label="Share"
                            className="flex flex-col items-center transition-transform transform hover:scale-110 group"
                        >
                            <FaShare className="w-7 h-7 drop-shadow-md text-white group-hover:text-blue-400" />
                            <span className="text-xs mt-1 text-gray-200 group-hover:text-white">{shareCount}</span>
                        </button>
                    </div>
                </div>
            </motion.div>
            {/* Comment Modal */}
            <CommentModal
                isOpen={showComments}
                onClose={() => setShowComments(false)}
                reelId={reel._id}
                reelCreatorId={reel.user._id}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                reelId={reelId}
                token={token}
            />
        </>
    );
};

export default ReelCard;
