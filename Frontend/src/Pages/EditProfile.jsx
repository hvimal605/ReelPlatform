import React, { useState, useEffect } from 'react';
import UsernameInput from '../components/auth/UsernameInput';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../services/operations/ProfileApI';
import ChangeProfilePicture from '../components/Profile/ChangeProfilePicture';

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.Name || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    Name: name,
    username,
    bio,
  };

  try {
    await dispatch(updateProfile(token, payload));
    toast.success('Profile updated successfully!');
  } catch (err) {
    toast.error('Failed to update profile.');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#2a2651] to-[#24243e] flex items-center justify-center p-6 mt-14">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-12 relative">
        <h2 className="text-4xl font-extrabold text-white text-center mb-10 tracking-wider drop-shadow-lg">
          Edit Profile
        </h2>
     
     <div className="mt-10 mb-10">
      <ChangeProfilePicture />
     </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-indigo-200 block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pr-10 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-gray-400"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-indigo-200 block text-sm font-semibold mb-1">Username</label>
            <UsernameInput
              value={username}
              setValue={setUsername}
              fullName={name}
              originalUsername={user?.username || ''}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-indigo-200 block text-sm font-semibold mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full pr-10 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder:text-gray-400"
              placeholder="Tell something interesting about you..."
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-indigo-200 block text-sm font-semibold mb-1">Email (readonly)</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full pr-10 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl text-white font-bold text-lg shadow-lg shadow-indigo-500/30"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
