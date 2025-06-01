import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/operations/authApi";

export default function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout(navigate));
    setMenuOpen(false); // close menu on logout
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-md border-b border-white/20 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-blue-400 text-transparent bg-clip-text"
          onClick={() => setMenuOpen(false)}
        >
          ReelVibe
        </Link>

        {/* Center: Navigation Links (desktop) */}
        <div className="hidden md:flex gap-10 text-lg font-medium">
          <Link
            to="/"
            className="hover:text-pink-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/reels/1"
            className="hover:text-pink-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Reels
          </Link>
          <Link
            to="/uploadReel"
            className="hover:text-pink-400 transition"
            onClick={() => setMenuOpen(false)}
          >
            Upload Reel
          </Link>
        </div>

        {/* Right side: Auth buttons & mobile menu toggle */}
        <div className="flex items-center gap-3 sm:gap-5">
          {!token ? (
            <>
              {/* Desktop Buttons */}
              <div className="hidden md:flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 transition flex items-center gap-2 shadow-md"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition flex items-center gap-2 shadow-md"
                >
                  Signup
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md hover:bg-white/20 transition"
                aria-label="Toggle Menu"
              >
                {menuOpen ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            </>
          ) : (
            <>
              {/* Desktop Dashboard & Logout */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to={`/${user?.username}`}
                  className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 transition flex items-center gap-2 shadow-md"
                  onClick={() => setMenuOpen(false)}
                >
                  <MdDashboard /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-100 transition shadow-md"
                >
                  Logout
                </button>
              </div>

              {/* Mobile profile pic and menu toggle */}
              <div className="flex items-center md:hidden gap-3">
                <Link
                  to={`/${user?.username}`}
                  onClick={() => setMenuOpen(false)}
                  aria-label="User Profile"
                >
                  <img
                    src={user?.profileImage}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-pink-500 object-cover"
                  />
                </Link>

                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-md hover:bg-white/20 transition"
                  aria-label="Toggle Menu"
                >
                  {menuOpen ? (
                    <FaTimes className="text-xl" />
                  ) : (
                    <FaBars className="text-xl" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 border-t border-white/10 shadow-inner ">
          <div className="flex flex-col space-y-3 px-6 py-4 text-center text-white">
            <Link
              to="/"
              className="py-2 hover:text-pink-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/reels/1"
              className="py-2 hover:text-pink-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Reels
            </Link>
            <Link
              to="/uploadReel"
              className="py-2 hover:text-pink-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Upload Reel
            </Link>

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="py-2 bg-pink-500 rounded-md hover:bg-pink-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="py-2 bg-white text-black rounded-md hover:bg-gray-100 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/${user?.username}`}
                  className="py-2 bg-pink-500 rounded-md hover:bg-pink-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 bg-white text-black rounded-md hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
