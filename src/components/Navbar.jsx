import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isJobSeeker, isEmployer } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-sky-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with socials and app store */}
        <div className="flex justify-between items-center py-3 text-sm border-b border-sky-700">
          <div className="flex items-center">
            <span className="font-bold text-lg">IT Freelancers</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Google Play Button */}
            <a
              href="#"
              className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded hover:bg-black/30 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M3 13.5v8.25A1.5 1.5 0 004.5 23h15A1.5 1.5 0 0021 21.75V13.5M17.25 2H6.75A1.5 1.5 0 005.25 3.5v7.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5z" />
              </svg>
              <span>GOOGLE PLAY</span>
            </a>
            {/* Social Media Icons */}
            <div className="flex gap-3 pl-4 border-l border-sky-700">
              <Link href="#" className="hover:opacity-80 transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <a href="#" className="hover:opacity-80 transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="hover:opacity-80 transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.045-8.733 0-9.652h3.554v1.366c.43-.662 1.19-1.604 2.894-1.604 2.165 0 3.779 1.414 3.779 4.452v5.438zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.926-1.715 1.144 0 1.915.76 1.915 1.715 0 .953-.771 1.715-1.926 1.715zm1.946 11.019H3.391V9.956h3.892v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-sky-100 transition font-medium">
              Job Seekers Home
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-sky-100 transition font-medium"
            >
              Job Vacancies
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-sky-100 transition font-medium"
            >
              Companies Hiring
            </Link>
            <Link
              to="/employer"
              className="hover:text-sky-100 transition font-medium"
            >
              Employers Home
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-sky-700 transition"
              aria-label="Toggle dark mode"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sky-700 transition"
                >
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {user.name || user.email}
                  </span>
                  <span className="text-xs">▼</span>
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 py-1 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 z-20">
                      <Link
                        to={
                          isJobSeeker
                            ? "/dashboard"
                            : isEmployer
                              ? "/employer"
                              : "/admin"
                        }
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to={
                          isJobSeeker
                            ? "/dashboard/profile"
                            : "/employer/company"
                        }
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-sky-600 hover:bg-gray-100"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium hover:text-sky-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-sky-600 rounded-lg hover:bg-gray-100 font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
