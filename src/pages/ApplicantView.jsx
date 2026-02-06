import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employerApi } from "../api/client";
import { Layout } from "../components/Layout";

const STATUS_OPTIONS = [
  "applied",
  "under_review",
  "interviewed",
  "rejected",
  "hired",
];

export function ApplicantView() {
  const { jobId } = useParams();
  const queryClient = useQueryClient();

  const { data: appsData } = useQuery({
    queryKey: ["employer", "applications", jobId],
    queryFn: () => employerApi.applications(jobId),
    // Poll for new applications every 10 seconds while on this page
    refetchInterval: 10000,
    enabled: !!jobId,
  });
  const applications = appsData?.data ?? appsData ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      employerApi.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employer", "applications", jobId],
      });
    },
  });

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link
            to="/employer/jobs"
            className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
          >
            Back to jobs
          </Link>
          <button
            type="button"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["employer", "applications", jobId],
              })
            }
            className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
        <Link
          to={`/employer/jobs/${jobId}/edit`}
          className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Edit job
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Applicants
      </h1>
      {applications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No applications for this job yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">
                  Candidate
                </th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">
                  Applied
                </th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="py-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {app.candidate?.name ||
                        app.candidate?.email ||
                        "Unknown Candidate"}
                    </span>
                    {app.coverLetter && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate max-w-xs">
                        {app.coverLetter}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          id: app._id,
                          status: e.target.value,
                        })
                      }
                      className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm py-1"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    {app.resume?.filePath && (
                      <a
                        href={
                          app.resume.filePath.startsWith("http")
                            ? app.resume.filePath
                            : `/api/resumes/file/${app.resume._id}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        View resume
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
