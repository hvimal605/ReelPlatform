import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaTelegram,
  FaEnvelope,
  FaLink,
  FaTimes,
} from 'react-icons/fa';

import toast from 'react-hot-toast';
import { shareReel } from '../../services/operations/ReelsApi';

const ShareModal = ({ isOpen, onClose, reelId, token }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !reelId) return null;

  const domain = 'http://localhost:5173'; // Replace with your production domain
  const shareUrl = `${domain}/reel/${reelId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleShareClick = async (url) => {
    setLoading(true);
    try {
      const result = await shareReel(reelId);
      if (result && result.success) {
        window.open(url, '_blank');
      } else {
        toast.error('Failed to share reel on server');
      }
    } catch (error) {
      toast.error('Error sharing reel');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=Check this reel&body=${encodeURIComponent(shareUrl)}`,
  };

  const socialStyles = {
    whatsapp: 'bg-gradient-to-tr from-green-400 to-green-600 hover:from-green-500 hover:to-green-700',
    facebook: 'bg-gradient-to-tr from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900',
    twitter: 'bg-gradient-to-tr from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700',
    linkedin: 'bg-gradient-to-tr from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950',
    telegram: 'bg-gradient-to-tr from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600',
    email: 'bg-gradient-to-tr from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900',
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 px-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col gap-8 text-gray-900 font-sans"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gradient">
            Share this reel
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-700 hover:text-pink-600 transition-transform duration-300 ease-in-out hover:rotate-90 focus:outline-none"
          >
            <FaTimes size={28} />
          </button>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-3 rounded-lg px-5 py-3 font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 hover:shadow-pink-400/70 transition-transform duration-300"
        >
          <FaLink className="text-xl" />
          Copy Link
        </button>

        <div className="grid grid-cols-3 gap-6">
          {Object.entries(shareLinks).map(([key, url]) => {
            const Icon = {
              whatsapp: FaWhatsapp,
              facebook: FaFacebook,
              twitter: FaTwitter,
              linkedin: FaLinkedin,
              telegram: FaTelegram,
              email: FaEnvelope,
            }[key];

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleShareClick(url)}
                disabled={loading}
                aria-label={`Share on ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-lg text-white transition-transform duration-300 ${socialStyles[key]} hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Icon className="text-3xl mb-2 drop-shadow-md" />
                <span className="text-base font-medium select-none">
                  {loading ? 'Sharing...' : key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ShareModal;
