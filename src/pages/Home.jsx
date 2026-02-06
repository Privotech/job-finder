import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../api/client';
import { Layout } from '../components/Layout';
import { JobCard } from '../components/JobCard';
import { FilterSidebar } from '../components/FilterSidebar';

export function Home() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const limit = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', { ...filters, page, limit, q }],
    queryFn: () => jobsApi.list({ page, limit, ...filters, keyword: q || undefined }),
  });

  const jobs = data?.data?.jobs ?? data?.jobs ?? [];
  const total = data?.data?.total ?? data?.total ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find jobs worldwide</h1>
        <p className="text-gray-600 dark:text-gray-400">Search by title, company, or location in any country.</p>
      </div>
      <div className="flex gap-2 mb-6">
        <input
          type="search"
          placeholder="Job title, company, or keyword..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setFilters((f) => ({ ...f, keyword: q }))}
          className="flex-1 max-w-xl rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="button"
          onClick={() => setFilters((f) => ({ ...f, keyword: q }))}
          className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
        >
          Search
        </button>
      </div>
      <div className="flex gap-8">
        <FilterSidebar filters={filters} onChange={setFilters} />
        <div className="flex-1 min-w-0">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
            </div>
          )}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
              {error.message}
            </div>
          )}
          {!isLoading && !error && jobs.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 py-8">No jobs found. Try adjusting filters.</p>
          )}
          {!isLoading && !error && jobs.length > 0 && (
            <>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
