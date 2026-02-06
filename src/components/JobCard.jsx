import { Link } from 'react-router-dom';

const employmentLabels = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
};

export function JobCard({ job }) {
  const salary =
    job.salaryMin != null || job.salaryMax != null
      ? [job.salaryMin, job.salaryMax].filter(Boolean).join(' – ')
      : null;

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">{job.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {job.company?.name || 'Company'}
            {job.location ? ` · ${job.location}` : ''}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.employmentType && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {employmentLabels[job.employmentType] || job.employmentType}
              </span>
            )}
            {job.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                {tag}
              </span>
            ))}
          </div>
          {salary && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Salary: {salary}</p>
          )}
        </div>
        <span className="shrink-0 text-primary-600 dark:text-primary-400 font-medium text-sm">View →</span>
      </div>
    </Link>
  );
}
