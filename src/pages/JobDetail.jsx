import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../api/client';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';
import { ApplyModal } from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { savedJobsApi } from '../api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const employmentLabels = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
};

export function JobDetail() {
  const { id } = useParams();
  const { user, isJobSeeker } = useAuth();
  const [showApply, setShowApply] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsApi.get(id),
    enabled: !!id,
  });

  const job = data?.data ?? data;
  const similar = job?.recommendations ?? job?.similar ?? [];
  const savedIds = (data?.data?.savedIds ?? data?.savedIds) ?? [];
  const isSaved = savedIds.includes(job?._id);

  const saveMutation = useMutation({
    mutationFn: () => (isSaved ? savedJobsApi.remove(job._id) : savedJobsApi.add(job._id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs', id] }),
  });

  if (isLoading || !job) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700">{error.message}</div>
      </Layout>
    );
  }

  const salary =
    job.salaryMin != null || job.salaryMax != null
      ? [job.salaryMin, job.salaryMax].filter(Boolean).join(' – ')
      : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
            ← Back to jobs
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {job.company?.name || 'Company'}
                {job.location ? ` · ${job.location}` : ''}
                {job.company?.locations?.length ? ` · ${job.company.locations.join(', ')}` : ''}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.employmentType && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    {employmentLabels[job.employmentType] || job.employmentType}
                  </span>
                )}
                {job.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {salary && <p className="text-gray-600 dark:text-gray-400 mt-2">Salary: {salary}</p>}
            </div>
            {isJobSeeker && user && (
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {isSaved ? 'Unsave' : 'Save job'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApply(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Apply now
                </button>
              </div>
            )}
          </div>
          {job.company?.description && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">About the company</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{job.company.description}</p>
            </div>
          )}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{job.description}</p>
          </div>
          {job.requirements && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}
        </div>
        {similar.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similar jobs</h2>
            <div className="space-y-4">
              {similar.map((j) => (
                <JobCard key={j._id} job={j} />
              ))}
            </div>
          </div>
        )}
      </div>
      {showApply && <ApplyModal jobId={job._id} onClose={() => setShowApply(false)} />}
    </Layout>
  );
}
