import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout } from "../components/Layout";

export function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "job_seeker",
    // Job seeker profile fields
    location: "",
    headline: "",
    experienceSummary: "",
    skills: "",
    yearsOfExperience: "",
    preferredLocations: "",
    preferredRoles: "",
    // Employer company fields
    companyName: "",
    website: "",
    description: "",
    companyLocations: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to role-specific dashboard
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      if (user.role === "employer") navigate("/employer", { replace: true });
      else if (user.role === "job_seeker")
        navigate("/dashboard", { replace: true });
      else if (user.role === "admin") navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: form.name,
        role: form.role,
      };

      if (form.role === "job_seeker") {
        payload.location = form.location;
        payload.profile = {
          headline: form.headline,
          experienceSummary: form.experienceSummary,
          skills: form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
          yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
          preferredLocations: form.preferredLocations ? form.preferredLocations.split(",").map((s) => s.trim()).filter(Boolean) : [],
          preferredRoles: form.preferredRoles ? form.preferredRoles.split(",").map((s) => s.trim()).filter(Boolean) : [],
        };
      } else if (form.role === "employer") {
        payload.companyProfile = {
          name: form.companyName,
          website: form.website,
          description: form.description,
          locations: form.companyLocations ? form.companyLocations.split(",").map((s) => s.trim()).filter(Boolean) : [],
        };
      }

      await register(payload);
      if (form.role === "employer") {
        navigate("/employer", { replace: true });
      } else if (form.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-8 mb-12">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create your account
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4"
        >
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              I am a
            </label>
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
            >
              <option value="job_seeker">Job seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
            />
          </div>

          {/* Job Seeker Profile Fields */}
          {form.role === "job_seeker" && (
            <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="City, Country"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) => update("headline", e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Experience Summary
                </label>
                <textarea
                  value={form.experienceSummary}
                  onChange={(e) => update("experienceSummary", e.target.value)}
                  rows={3}
                  placeholder="Tell us about your experience..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="e.g. React, Node.js, TypeScript"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={form.yearsOfExperience}
                  onChange={(e) => update("yearsOfExperience", e.target.value)}
                  min={0}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Locations (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.preferredLocations}
                  onChange={(e) => update("preferredLocations", e.target.value)}
                  placeholder="e.g. Remote, London, New York"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Roles (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.preferredRoles}
                  onChange={(e) => update("preferredRoles", e.target.value)}
                  placeholder="e.g. Frontend Developer, Full Stack Developer"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* Employer Company Fields */}
          {form.role === "employer" && (
            <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  placeholder="Tell us about your company..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Office Locations (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.companyLocations}
                  onChange={(e) => update("companyLocations", e.target.value)}
                  placeholder="e.g. London, New York, Remote"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50 mt-6"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 dark:text-sky-400 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </Layout>
  );
}
