import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "../api/client";
import { JobCard } from "../components/JobCard";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // Fetch featured jobs
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", { limit: 6 }],
    queryFn: () => jobsApi.list({ limit: 6, page: 1 }),
  });

  const featuredJobs = jobsData?.data?.jobs ?? jobsData?.jobs ?? [];

  const categories = [
    "Marketing, communication",
    "Sales",
    "IT, new technologies",
    "Services",
    "Management",
    "Accounting, controlling, finance",
  ];

  const industries = [
    "IT, software engineering, Internet",
    "Marketing, communication, media",
    "Distribution, selling, wholesale",
    "Services other",
    "Banking, insurance, finance",
    "Education, training",
  ];

  const regions = [
    "Lagos",
    "Abuja",
    "International",
    "Osun",
    "Ibadan - Oyo",
    "Abeokuta - Ogun",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("keyword", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedRegion) params.append("region", selectedRegion);
    navigate(`/dashboard?${params.toString()}`);
  };

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-sky-700 to-sky-600 text-white py-20 px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          
          {/* User Avatar Display */}
          {user && (
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-sky-500">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-sky-600 font-bold text-lg">
                  {user.name?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    "U"}
                </span>
              </div>
              <div>
                <p className="text-sm text-sky-100">Welcome back</p>
                <p className="font-semibold text-lg">
                  {user.name || user.email}
                </p>
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find your Future Job among 2750+ Open Positions
          </h1>
          <p className="text-sky-100 text-lg mb-8">
            Committed to employment in Nigeria and across Africa
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                />
              </div>
              <div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                >
                  <option value="">Regions</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                >
                  <option value="">Job category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition text-center inline-block"
            >
              Candidate: Find Jobs
            </Link>
            <Link
              to="/employer/jobs/new"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition text-center inline-block"
            >
              Recruiter: Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Committed to employment in Nigeria and in Africa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Jobs by Category */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Jobs by Category
              </h3>
              <ul className="space-y-3 mb-6">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        navigate(
                          `/dashboard?category=${encodeURIComponent(cat)}`,
                        );
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition text-left"
                    >
                      • {cat}
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:border-sky-600 hover:text-sky-600 dark:hover:text-sky-400 transition"
              >
                All job categories
              </Link>
            </div>

            {/* Jobs by Industry */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Jobs by Industry
              </h3>
              <ul className="space-y-3 mb-6">
                {industries.slice(0, 6).map((ind) => (
                  <li key={ind}>
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard?industry=${encodeURIComponent(ind)}`,
                        )
                      }
                      className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition text-left cursor-pointer"
                    >
                      • {ind}
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:border-sky-600 hover:text-sky-600 dark:hover:text-sky-400 transition"
              >
                All industries
              </Link>
            </div>

            {/* Jobs by Region */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Jobs by Region
              </h3>
              <ul className="space-y-3 mb-6">
                {regions.map((region) => (
                  <li key={region}>
                    <button
                      onClick={() => {
                        setSelectedRegion(region);
                        navigate(
                          `/dashboard?region=${encodeURIComponent(region)}`,
                        );
                      }}
                      className="text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition text-left cursor-pointer"
                    >
                      • {region}
                    </button>
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:border-sky-600 hover:text-sky-600 dark:hover:text-sky-400 transition"
              >
                All regions
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 transition text-lg"
            >
              Create your account now
            </Link>
          </div>
        </div>

        {/* Featured Jobs Section */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Jobs Available
            </h2>
            <Link
              to="/dashboard"
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold text-lg"
            >
              See all jobs →
            </Link>
          </div>

          {jobsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600" />
            </div>
          ) : featuredJobs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">
              No jobs available yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition hover:border-sky-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {job.company?.name || job.company || "Company"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {job.location}
                  </p>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-block px-4 py-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-full font-semibold transition"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 bg-sky-600 text-white font-bold rounded-full hover:bg-sky-700 transition text-lg"
            >
              Browse All Jobs
            </Link>
          </div>
        </div>

        {/* Email Alert Section */}
        <div className="bg-gradient-to-r from-sky-700 to-sky-600 text-white py-12 px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Receive by email job offers that interest you!
          </h3>
          <button className="px-8 py-3 bg-white text-sky-600 font-semibold rounded-full hover:bg-gray-100 transition">
            Activate your email alert
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">
                IT Freelancers
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Committed to employment in Nigeria and across Africa. Finding
                the right opportunities for talented professionals.
              </p>
            </div>

            {/* For Job Seekers */}
            <div>
              <h4 className="text-white font-bold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-sky-400 transition"
                  >
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/profile"
                    className="hover:text-sky-400 transition"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-sky-400 transition"
                  >
                    Saved Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-sky-400 transition"
                  >
                    My Applications
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div>
              <h4 className="text-white font-bold mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/employer"
                    className="hover:text-sky-400 transition"
                  >
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employer"
                    className="hover:text-sky-400 transition"
                  >
                    Browse Candidates
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employer/company"
                    className="hover:text-sky-400 transition"
                  >
                    Company Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/employer"
                    className="hover:text-sky-400 transition"
                  >
                    My Jobs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-white font-bold mb-4">Connect With Us</h4>
              <p className="text-sm text-gray-400 mb-4">
                Follow us on social media
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center hover:bg-sky-700 transition"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center hover:bg-sky-700 transition"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center hover:bg-sky-700 transition"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.045-8.733 0-9.652h3.554v1.366c.43-.662 1.19-1.604 2.894-1.604 2.165 0 3.779 1.414 3.779 4.452v5.438zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.955.77-1.715 1.926-1.715 1.144 0 1.915.76 1.915 1.715 0 .953-.771 1.715-1.926 1.715zm1.946 11.019H3.391V9.956h3.892v10.496zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400 mb-4">
              <div className="flex justify-center md:justify-start gap-4">
                <Link to="#" className="hover:text-sky-400 transition">
                  Privacy Policy
                </Link>
                <Link to="#" className="hover:text-sky-400 transition">
                  Terms of Service
                </Link>
              </div>
              <div className="text-center">
                <p>&copy; 2026 IT Freelancers. All rights reserved.</p>
              </div>
              <div className="text-center md:text-right">
                <p>Made with ❤️ for Africa</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
