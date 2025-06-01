import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { BsThreeDots } from "react-icons/bs";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function ReelCard({ reel, onEdit, onDelete, isOwnProfile }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const uploadedTime = formatDistanceToNow(new Date(reel.createdAt), {
    addSuffix: true,
  });

  const handleCardClick = () => {
    if (!showMenu) {
      navigate(`/reel/${reel._id}`);
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    if (action === "edit") onEdit(reel._id);
    else if (action === "delete") onDelete(reel._id);
    setShowMenu(false);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative group overflow-hidden rounded-2xl shadow-2xl bg-gray-900 transition-transform transform hover:scale-105 duration-300 w-full cursor-pointer"
    >
      {/* Video */}
      <div className="relative">
        <video
          src={reel.videoUrl}
          className="w-full h-[500px] object-cover rounded-t-2xl"
          controls={false}
          preload="metadata"
          muted
          playsInline
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {isOwnProfile && (
          <>
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={handleMenuClick}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition"
              >
                <BsThreeDots size={20} className="text-white" />
              </button>
            </div>

            {showMenu && (
              <div className="absolute top-12 right-3 z-20 animate-fade-in">
                <div className="rounded-xl bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-xl overflow-hidden min-w-[150px]">
                  <button
                    onClick={(e) => handleAction(e, "edit")}
                    className="flex items-center gap-2 px-4 py-3 w-full hover:bg-gray-700 transition text-md text-white"
                  >
                    <HiPencilAlt className="text-purple-400" /> Edit
                  </button>
                  <button
                    onClick={(e) => handleAction(e, "delete")}
                    className="flex items-center gap-2 px-4 py-3 w-full hover:bg-gray-700 transition text-md text-red-400"
                  >
                    <HiTrash className="text-red-500" /> Delete
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-xl text-white truncate">{reel.title}</h3>
        {reel.caption && (
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{reel.caption}</p>
        )}
        <p className="text-xs text-gray-500 mt-3">Uploaded {uploadedTime}</p>
      </div>
    </div>
  );
}
