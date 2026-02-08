import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { savedJobsApi, applicationsApi, jobsApi } from '../api/client';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

const statusLabels = {
  applied: 'Applied',
  under_review: 'Under review',
  interviewed: 'Interviewed',
  rejected: 'Rejected',
  hired: 'Hired',
};

const tabs = [
  { id: 'recommended', label: 'Recommended for you' },
  { id: 'saved', label: 'Saved jobs' },
  { id: 'applications', label: 'My applications' },
];

export function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('recommended');

  const { data: jobsData } = useQuery({
    queryKey: ['jobs', { limit: 100 }],
    queryFn: () => jobsApi.list({ limit: 100, page: 1 }),
    enabled: tab === 'recommended',
  });

  const { data: savedData } = useQuery({
    queryKey: ['saved'],
    queryFn: () => savedJobsApi.list(),
    enabled: tab === 'saved',
  });
  const { data: appsData } = useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationsApi.my(),
    enabled: tab === 'applications',
  });

  // Filter jobs based on user profile
  const filterJobsByProfile = (jobs) => {
    if (!user?.profile) return jobs;
    const { skills, preferredLocations, preferredRoles } = user.profile;
    
    return jobs.filter((job) => {
      let score = 0;
      
      // Match skills
      if (skills && job.skills) {
        const matchedSkills = skills.filter((skill) =>
          job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        );
        if (matchedSkills.length > 0) score += 2;
      }
      
      // Match location
      if (preferredLocations && preferredLocations.length > 0) {
        const locationMatch = preferredLocations.some((loc) =>
          job.location?.toLowerCase().includes(loc.toLowerCase()) ||
          job.title?.toLowerCase().includes('remote')
        );
        if (locationMatch) score += 1;
      }
      
      // Return jobs with at least one match
      return score > 0;
    });
  };

  const allJobs = jobsData?.data?.jobs ?? jobsData?.jobs ?? [];
  const recommendedJobs = filterJobsByProfile(allJobs);
  const savedJobs = savedData?.data?.jobs ?? savedData?.jobs ?? [];
  const applications = appsData?.data ?? appsData ?? [];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your saved jobs and applications.</p>
        <div className="flex gap-4 mt-4">
          <Link
            to="/dashboard/profile"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Profile
          </Link>
          <Link
            to="/dashboard/resumes"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Resumes
          </Link>
        </div>
      </div>
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`pb-3 px-1 font-medium border-b-2 -mb-px ${
              tab === id
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'recommended' && (
        <div className="space-y-4">
          {recommendedJobs.length === 0 ? (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              <p>No recommended jobs yet. Complete your profile to get better recommendations.</p>
              <Link to="/dashboard/profile" className="underline mt-2 inline-block">
                Update your profile →
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {recommendedJobs.length} job{recommendedJobs.length !== 1 ? 's' : ''} matching your profile
              </p>
              {recommendedJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </>
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No saved jobs. Browse and save jobs from the home page.</p>
          ) : (
            savedJobs.map((job) => <JobCard key={job._id} job={job} />)
          )}
        </div>
      )}
      {tab === 'applications' && (
        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No applications yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Job</th>
                  <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Company</th>
                  <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3">
                      <Link
                        to={`/jobs/${app.job?._id ?? app.job}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {app.job?.title ?? 'Job'}
                      </Link>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {app.job?.company?.name ?? '—'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded ${
                          app.status === 'hired'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : app.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {statusLabels[app.status] ?? app.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 dark:text-gray-400">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Layout>
  );
}
