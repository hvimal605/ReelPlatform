import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

export default function VideoUpload({ onVideoSelect }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.type.startsWith('video/')) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;

        if (duration > 30) {
          toast.error('Please upload a video that is 30 seconds or shorter.');
          return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);
        setFileName(file.name);
        onVideoSelect(file);
      };
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    onVideoSelect(null);
    inputRef.current.click(); // Optional: open file dialog again
  };

  return (
    <div
      className={`w-full border-2 border-dashed rounded-xl transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 ${
        preview ? 'border-indigo-600' : 'border-gray-700 hover:border-indigo-500'
      } p-4`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ aspectRatio: '9 / 16' }}
    >
      <input
        type="file"
        accept="video/*"
        ref={inputRef}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!preview ? (
        <div
          className="flex flex-col items-center justify-center space-y-3 text-white h-full cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          <FaCloudUploadAlt className="text-indigo-400 text-5xl" />
          <p className="text-lg font-semibold text-center">
            Drag & drop your reel here
          </p>
          <p className="text-sm text-gray-400 text-center">
            or click to browse<br />
            <em>(Max 30 seconds • 9:16 ratio recommended)</em>
          </p>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-between">
          <div className="relative rounded-lg overflow-hidden w-full" style={{ aspectRatio: '9 / 16' }}>
            <video
              src={preview}
              controls
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-2 text-white text-sm flex items-center justify-between">
            <p className="truncate w-[80%]">{fileName}</p>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full transition"
              title="Remove video"
            >
              <FaTimes className="text-white text-xs" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="mt-3 w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-sm font-semibold"
          >
            Change Video
          </button>
        </div>
      )}
    </div>
  );
}
