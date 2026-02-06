import { useQuery } from '@tanstack/react-query';
import { recommendationsApi } from '../api/client';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';

export function Recommendations() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendations', 'jobs'],
    queryFn: () => recommendationsApi.jobs(),
  });

  const jobs = data?.data ?? data ?? [];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended for you</h1>
        <p className="text-gray-600 dark:text-gray-400">Jobs matched to your profile and skills.</p>
      </div>
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      )}
      {error && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
          {error.message}
        </div>
      )}
      {!isLoading && !error && jobs.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">Complete your profile and add skills to get recommendations.</p>
      )}
      {!isLoading && !error && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </Layout>
  );
}
