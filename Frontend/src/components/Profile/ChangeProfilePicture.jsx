import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { updateDisplayPicture } from "../../services/operations/ProfileApI";




export default function ChangeProfilePicture() {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(null);

    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            previewFile(file);
        }
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleFileUpload = () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("displayPicture", imageFile);
            dispatch(updateDisplayPicture(token, formData)).then(() => {
                setLoading(false);
            });
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message);
        }
    };


    useEffect(() => {
        if (imageFile) {
            previewFile(imageFile);
        }
    }, [imageFile]);

    return (
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 rounded-lg border border-gray-600 bg-gray-800 p-6 text-gray-100 shadow-md">
  {/* Profile Image & Text */}
  <div className="flex items-center gap-6 w-full md:w-auto">
    <img
      src={previewSource || user?.profileImage}
      alt={`profile-${user?.Name}`}
      className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-lg"
    />
    <div>
      <p className="text-xl font-semibold mb-3">Change Profile Picture</p>
      <div className="flex flex-wrap gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/gif, image/jpeg"
        />

        {/* Select Button */}
        <button
          onClick={handleClick}
          disabled={loading}
          className="px-5 py-2 rounded-md border bg-gray-800 text-purple-400 text-sm font-semibold transition hover:bg-gray-700 disabled:opacity-50"
        >
          Select
        </button>

        {/* Upload Button */}
        <button
          onClick={handleFileUpload}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition ${
            loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-purple-400 text-gray-900 hover:bg-purple-300"
          }`}
        >
          {loading ? "Uploading..." : (
            <>
              <FiUpload className="text-lg" />
              Upload
            </>
          )}
        </button>
      </div>
    </div>
  </div>
</div>

    );
}
