import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { editReelDetails, getReelDetailsById } from "../services/operations/ReelsApi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const categories = ['Comedy', 'Dance', 'Travel', 'Food', 'Fitness', 'Fashion'];

export default function EditReel() {
  const { reelId } = useParams();
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);


  useEffect(() => {
    const fetchReelData = async () => {
      const reel = await getReelDetailsById(reelId, token);
      if (reel) {
        setCaption(reel.caption);
        setCategory(reel.category);
      } else {
        toast.error("Reel not found");
        navigate("/");
      }
      setLoading(false);
    };

    fetchReelData();
  }, [reelId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      reelId,      
      caption,
      category,
    };

    const updatedReel = await editReelDetails(data, token);

    if (updatedReel) {
      navigate(`/reel/${reelId}`); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#1f0036] via-[#390052] to-[#000000] flex items-center justify-center p-6">
      <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl max-w-xl w-full p-10 text-white">
        <h2 className="text-4xl font-bold mb-8 text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          ✨ Edit Your Reel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Caption */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white/80 uppercase tracking-wide">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Write something amazing..."
              required
              className="w-full p-4 rounded-2xl bg-white/20 placeholder-white/60 text-white 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white/80 uppercase tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-4 rounded-2xl bg-white/20 text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            >
              <option value="" disabled className="text-gray-300">
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-black">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl py-4 rounded-2xl font-bold text-lg tracking-wider transition-transform duration-300 transform hover:-translate-y-1"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
