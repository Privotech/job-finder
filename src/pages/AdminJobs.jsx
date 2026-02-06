import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/client';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';

export function AdminJobs() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'jobs'],
    queryFn: () => adminApi.jobs(),
  });
  const jobs = data?.data ?? data ?? [];

  const hideMutation = useMutation({
    mutationFn: (id) => adminApi.hideJob(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'jobs'] }),
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job moderation</h1>
      </div>
      {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Title</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Company</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Hidden</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3">
                    <Link to={`/jobs/${job._id}`} className="text-primary-600 dark:text-primary-400 hover:underline font-medium">{job.title}</Link>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{job.company?.name ?? '-'}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{job.status ?? '-'}</td>
                  <td className="py-3">{job.isHidden ? <span className="text-amber-600">Hidden</span> : '-'}</td>
                  <td className="py-3">
                    {!job.isHidden && (
                      <button type="button" onClick={() => hideMutation.mutate(job._id)} disabled={hideMutation.isPending} className="text-amber-600 hover:underline text-sm">
                        Hide
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <p className="text-gray-500 dark:text-gray-400 py-4">No jobs.</p>}
        </div>
      )}
    </Layout>
  );
}
