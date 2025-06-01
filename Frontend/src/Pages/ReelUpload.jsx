import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import VideoUpload from '../components/Reel/VideoUpload';
import { uploadReel } from '../services/operations/ReelsApi';


const categories = ['Comedy', 'Dance', 'Travel', 'Food', 'Fitness', 'Fashion'];

export default function ReelUpload() {
  const [videoFile, setVideoFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const username = user?.username;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("caption", caption);
    formData.append("category", category);


    dispatch(uploadReel(formData, token, username, navigate));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-14 from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-indigo-700">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8 tracking-wide drop-shadow-lg">
          Upload Your Reel
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-7">
          <VideoUpload onVideoSelect={setVideoFile} />

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-indigo-300 tracking-wide">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-indigo-300 tracking-wide">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              placeholder="Write a captivating caption..."
              className="bg-gray-800 text-white p-3 rounded-lg border border-indigo-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder-indigo-400"
              required
            />
          </div>



          <button
            type="submit"
            disabled={!videoFile || !category || !caption}
            className={`w-full py-3 rounded-xl text-white font-bold tracking-wide transition ${videoFile && category && caption
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/50'
                : 'bg-indigo-400 cursor-not-allowed'
              }`}
          >
            Upload Reel
          </button>
        </form>
      </div>
    </div>
  );
}
