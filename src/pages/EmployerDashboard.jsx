import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { employerApi } from '../api/client';
import { Layout } from '../components/Layout';

export function EmployerDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['employer', 'jobs'],
    queryFn: () => employerApi.jobs(),
  });
  const jobs = data?.data ?? data ?? [];
  const openCount = jobs.filter((j) => j.status === 'open').length;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employer dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your jobs and view applicants.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total jobs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{isLoading ? '-' : jobs.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Open positions</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{isLoading ? '-' : openCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center">
          <Link to="/employer/jobs/new" className="w-full py-2.5 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700">Post a job</Link>
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your jobs</h2>
          <Link to="/employer/jobs" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">View all</Link>
        </div>
        {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /> : jobs.length === 0 ? <p className="text-gray-500 dark:text-gray-400">No jobs yet.</p> : (
          <ul className="space-y-2">
            {jobs.slice(0, 5).map((job) => (
              <li key={job._id}>
                <Link to={`/employer/jobs/${job._id}`} className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-400">
                  <span className="font-medium text-gray-900 dark:text-white">{job.title}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{job.status === 'open' ? 'Open' : 'Closed'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-8">
        <Link to="/employer/company" className="text-primary-600 dark:text-primary-400 hover:underline">Edit company profile</Link>
      </div>
    </Layout>
  );
}
