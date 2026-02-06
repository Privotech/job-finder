import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/client';
import { Layout } from '../components/Layout';

export function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: () => adminApi.summary(),
  });
  const summary = data?.data ?? data ?? {};

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of the platform.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{isLoading ? '-' : summary.usersCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Jobs</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{isLoading ? '-' : summary.jobsCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Applications</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{isLoading ? '-' : summary.applicationsCount ?? 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex items-center">
          <Link to="/admin/users" className="w-full py-2.5 bg-primary-600 text-white text-center font-medium rounded-lg hover:bg-primary-700">Manage users</Link>
        </div>
      </div>
      <div className="flex gap-4">
        <Link to="/admin/users" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">User management</Link>
        <Link to="/admin/jobs" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">Job moderation</Link>
      </div>
    </Layout>
  );
}
