import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export function Navbar() {
  const { user, logout, isJobSeeker, isEmployer, isAdmin } = useAuth();
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
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-primary-600 dark:text-primary-400"
            >
              Job Finder
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link
                to="/"
                onClick={() => {
                  try {
                    // fallback navigation in case Link isn't activating due to layout/overlay issues
                    navigate("/");
                  } catch (e) {
                    // noop
                  }
                }}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md"
              >
                Jobs
              </Link>
              {isJobSeeker && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/recommendations"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md"
                  >
                    For You
                  </Link>
                </>
              )}
              {isEmployer && (
                <>
                  <Link
                    to="/employer"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/employer/jobs"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md"
                  >
                    My Jobs
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDark}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {dark ? "☀️" : "🌙"}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
                >
                  <span className="text-sm font-medium truncate max-w-[120px]">
                    {user.name || user.email}
                  </span>
                  <span className="text-gray-500 text-xs">▼</span>
                </button>
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                      <Link
                        to={
                          isJobSeeker
                            ? "/dashboard"
                            : isEmployer
                              ? "/employer"
                              : "/admin"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  className="px-4 py-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
