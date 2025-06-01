import { useState } from "react";
import {
  FaVideo,
  FaEnvelope,
  FaEllipsisV,
  FaShareAlt,
  FaSignOutAlt,
  FaPlusCircle,
  FaQrcode,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLink,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/operations/authApi";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export default function ProfileSection({ user, reelsCount, isOwnProfile }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
 const navigate  =  useNavigate();
 const dispatch = useDispatch();
  const handleshare = (option) => {

    setShowShareOptions(!showShareOptions);

  };
  


  const shareLink = `https://yourdomain.com/${user.username}`;

  return (
    <>
      <div className="relative max-w-4xl mx-auto text-center mb-16 px-8 py-10 bg-gray-900 bg-opacity-70 rounded-3xl backdrop-blur-xl shadow-2xl">
        {/* Top right 3 dots button (only own profile) */}
        {isOwnProfile && (
          <button
            onClick={() => setModalOpen(true)}
            aria-label="More options"
            className="absolute top-6 right-6 p-3 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-700 to-pink-600 text-white shadow-lg hover:scale-110 transform transition"
            title="More options"
          >
            <FaEllipsisV size={24} />
          </button>
        )}

        {/* Profile Picture */}
        <div className="relative inline-block">
          <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-indigo-600 to-pink-500 animate-pulse shadow-2xl">
            <img
              src={user.profileImg}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-8 border-gray-950 shadow-lg"
            />
          </div>

          {/* Reels Badge */}
          <div className="absolute -bottom-4 -right-4 flex items-center space-x-2 bg-gradient-to-r from-purple-700 to-indigo-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-xl select-none">
            <FaVideo className="text-lg" />
            <span>
              {reelsCount} Reel{reelsCount !== 1 && "s"}
            </span>
          </div>
        </div>

        {/* Name and Username */}
        <div className="mt-8 flex flex-col items-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-lg">
            {user.name}
          </h1>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 drop-shadow-md">
            @{user.username}
          </p>
        </div>

        {/* Bio */}
        <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
          {user.bio}
        </p>

        {/* Email */}
        {user.email && (
          <div className="mt-6 flex items-center justify-center space-x-3 text-gray-400 text-base select-text">
            <FaEnvelope className="text-purple-500" />
            <span>{user.email}</span>
          </div>
        )}

        {/* Buttons container for own profile */}
        {isOwnProfile ? (
          <div className="mt-8 flex justify-center space-x-6">
            <Link to="/EditProfile">
              <button
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-full font-semibold text-white shadow-xl transform hover:scale-105"
               
              >
                Edit Profile
              </button>
            </Link>

            <button
              onClick={handleshare}

              className="flex items-center space-x-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-full font-semibold text-white shadow-lg"
            >
              <FaShareAlt />
              <span>Share</span>
            </button>
          </div>
        ) : (
          // For normal users show Share button centered
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleshare}

              className="flex items-center space-x-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition rounded-full font-semibold text-white shadow-lg"
            >
              <FaShareAlt />
              <span>Share</span>
            </button>
          </div>
        )}

        {/* Share Options */}
        {showShareOptions && (
          <div className="mt-4 flex flex-col items-center space-y-3 animate-fade-in">
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast.success("Link copied to clipboard!");
              }}
              className="flex items-center space-x-2 text-sm text-white hover:text-purple-400"
            >
              <FaLink />
              <span>Copy Link</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Check out this profile: ${shareLink}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-white hover:text-green-400"
            >
              <FaWhatsapp />
              <span>WhatsApp</span>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareLink
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-white hover:text-blue-400"
            >
              <FaFacebook />
              <span>Facebook</span>
            </a>

            <a
              href={`https://www.instagram.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-white hover:text-pink-400"
            >
              <FaInstagram />
              <span>Instagram</span>
            </a>
          </div>
        )}

        {/* Reels Count Footer */}
        <div className="mt-10 text-sm text-gray-400 flex justify-center items-center space-x-3 select-none">
          <FaVideo className="text-purple-500 text-lg" />
          <span>
            Total <span className="font-semibold text-white">{reelsCount}</span>{" "}
            reel{reelsCount !== 1 && "s"} uploaded
          </span>
        </div>
      </div>

      {/* Modal for 3-dot options (own profile only) */}
      {modalOpen && (
        <div
          onClick={() => {
            setModalOpen(false);

          }}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-xl shadow-2xl p-6 w-72 text-white space-y-4"
          >
            <Link to="/UploadReel">
              <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-purple-700 transition">
                <FaPlusCircle className="text-purple-400" />
                <span>Create</span>
              </button>
            </Link>

            <Link to="/accounts/qr-code">
              <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-purple-700 transition">
                <FaQrcode className="text-purple-400" />
                <span>QR Code</span>
              </button>
            </Link>

            <button
              onClick={() => dispatch(logout(navigate))}
              className="flex items-center space-x-3 w-full px-4 py-2 border border-red-400 rounded-lg hover:bg-red-900 transition"
            >
              <FaSignOutAlt className="text-red-400" />
              <span className=" text-red-300 font-bold">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
