import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReelCard from "../components/Reel/ReelCard";
import { toast } from "react-hot-toast";
import {
  getReelDetailsById,
  getReelsByUsername,
} from "../services/operations/ReelsApi";

export default function ReelPage() {
  const { reelId } = useParams();
  const [mainReel, setMainReel] = useState(null);
  const [creatorReels, setCreatorReels] = useState([]);

  useEffect(() => {
    async function loadReels() {
      const reel = await getReelDetailsById(reelId);
      if (!reel) {
        toast.error("Reel not found");
        return;
      }

      setMainReel(reel);

      if (reel?.user?.username) {
        const reels = await getReelsByUsername(reel.user.username);
        const filteredReels = reels.filter((r) => r._id !== reel._id);
        setCreatorReels(filteredReels);
      }
    }

    if (reelId) {
      loadReels();
    }
  }, [reelId]);

  if (!mainReel) {
    return (
      <p className="text-center mt-10 text-lg text-gray-300 animate-pulse">
        Loading reel...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br mt-12 from-[#1e1e2f] via-[#1a1a2e] to-[#0f0c29] p-6 text-white font-inter">
      {/* Main Reel */}
      <div className="max-w-md mx-auto mb-4">
        <ReelCard reel={mainReel} />
      </div>

      {/* Other reels */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-wide">
          More reels from <span className="text-purple-400">@{mainReel.user.username}</span>
        </h2>

        <div className="flex justify-center">
          <div className="flex space-x-6 overflow-x-auto pb-2 max-w-5xl scrollbar-hide">
            {creatorReels.length === 0 ? (
              <p className="text-gray-400">No other reels available.</p>
            ) : (
              creatorReels.map((r) => (
                <Link to={`/reel/${r._id}`} key={r._id}>
                  <div className="flex-shrink-0 w-64 bg-white/5 backdrop-blur-sm hover:scale-[1.03] transition-transform rounded-xl overflow-hidden shadow-lg border border-white/10 hover:border-purple-500">
                    <video
                      src={r.videoUrl}
                      className="w-full aspect-[9/16] object-cover"
                      muted
                      loop
                      controls={false}
                      preload="metadata"
                    />
                    <div className="p-3">
                      <p className="text-sm font-medium text-white truncate">
                        {r.caption}
                      </p>
                      <div className="flex justify-between text-xs mt-1 text-gray-400">
                        <span>❤️ {r.likes?.length || 0}</span>
                        <span>💬 {r.comments?.length || 0}</span>
                        <span>🔄 {r.shareCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
