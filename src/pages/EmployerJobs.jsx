import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { employerApi } from "../api/client";
import { Layout } from "../components/Layout";

/**
 * EmployerJobs - Lists all jobs posted by the employer
 * Shows applicant counts and allows navigation to job details
 */
export function EmployerJobs() {
  // Get selected job ID from URL params
  const { jobId } = useParams();

  // Fetch employer's jobs
  const { data, isLoading } = useQuery({
    queryKey: ["employer", "jobs"],
    queryFn: () => employerApi.jobs(),
  });

  // Extract jobs with fallback defaults
  const jobs = data?.data ?? data ?? [];
  const current = jobId ? jobs.find((j) => j._id === jobId) : null;

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My jobs
        </h1>
        <Link
          to="/employer/jobs/new"
          className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
        >
          Post a job
        </Link>
      </div>

      {/* Job List */}
      {isLoading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <Link
              key={job._id}
              to={`/employer/jobs/${job._id}`}
              className={`block p-4 rounded-lg border ${
                current?._id === job._id
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300"
              }`}
            >
              {/* Job Title and Status */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </span>
                  {/* Status Badge and Applicant Count */}
                  <div className="flex items-center gap-3 mt-1">
                    {/* Status Badge */}
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        job.status === "open"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600"
                      }`}
                    >
                      {job.status}
                    </span>
                    {/* Applicant Count - Blue Badge */}
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {job.applicantCount ?? 0}{" "}
                      {job.applicantCount === 1 ? "applicant" : "applicants"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Job Location */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {job.location ?? "No location"}
              </p>
            </Link>
          ))}
          {/* Empty State */}
          {jobs.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No jobs yet.</p>
          )}
        </div>
      )}
    </Layout>
  );
}
