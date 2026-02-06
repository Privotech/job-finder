import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationsApi, resumesApi } from "../api/client";

export function ApplyModal({ jobId, onClose }) {
  const [resumeId, setResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const queryClient = useQueryClient();

  const { data: resumesData } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumesApi.my(),
  });
  const resumes = resumesData?.data ?? resumesData ?? [];

  const applyMutation = useMutation({
    mutationFn: () =>
      applicationsApi.create({
        jobId,
        resumeId: resumeId || undefined,
        coverLetter,
      }),
    onSuccess: () => {
      // invalidate job seeker queries
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      // also invalidate employer's applications list for this job (useful if same session)
      queryClient.invalidateQueries({
        queryKey: ["employer", "applications", jobId],
      });
      onClose();
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    applyMutation.mutate();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Apply for this job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resume
            </label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            >
              <option value="">Select a resume</option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.originalName || "Resume"} {r.isPrimary ? "(Primary)" : ""}
                </option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                Upload a resume in your dashboard first.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cover letter (optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          {applyMutation.error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {applyMutation.error.message}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                applyMutation.isPending || (resumes.length > 0 && !resumeId)
              }
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {applyMutation.isPending ? "Submitting…" : "Submit application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
