import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ReelCard from "../components/Profile/ReelCard";
import ProfileSection from "../components/Profile/ProfileSection";
import { getUserDetails } from "../services/operations/ProfileApI";
import { deleteReel } from "../services/operations/ReelsApi";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useParams();
const { token } = useSelector((state) => state.auth);
  const { user: loggedInUser } = useSelector((state) => state.profile);
  
  const isOwnProfile = loggedInUser?.username === username;

  const [userDetails, setUserDetails] = useState(null);
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const data = await dispatch(getUserDetails(username, navigate));
      if (data) {
        setUserDetails(data.user);
        setReels(data.reels);
      }
    };

    fetchUserDetails();
  }, [username]);

  const handleEdit = (id) => {
    navigate(`/EditReel/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reel?");
    if (!confirmDelete) return;

    const success = await deleteReel({ reelId: id }, token);
    if (success) {
      setReels((prev) => prev.filter((reel) => reel._id !== id));
    }
  };


  if (!userDetails) {
    return <div className="text-center text-white mt-10">Loading user profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 mt-14">
      <ProfileSection
        user={{
          name: userDetails.Name,
          username: userDetails.username,
          profileImg: userDetails.profileImage,
          bio: userDetails.bio,
          email: userDetails.email,
        }}
        reelsCount={reels.length}
        isOwnProfile={isOwnProfile}
      />

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reels.map((reel) => (
          <ReelCard
            key={reel._id}
            reel={reel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isOwnProfile={isOwnProfile}
          />
        ))}
      </div>
    </div>
  );
}
