import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerApi } from '../api/client';
import { Layout } from '../components/Layout';

export function EmployerCompany() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['employer', 'company'], queryFn: () => employerApi.company() });
  const company = data?.data ?? data ?? {};
  const [form, setForm] = useState({ name: '', website: '', description: '', locations: '' });

  useEffect(() => {
    setForm({
      name: company.name ?? '',
      website: company.website ?? '',
      description: company.description ?? '',
      locations: (company.locations ?? []).join(', '),
    });
  }, [company]);

  const updateMutation = useMutation({
    mutationFn: (body) => employerApi.updateCompany(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employer', 'company'] }),
  });

  function handleSubmit(e) {
    e.preventDefault();
    updateMutation.mutate({
      name: form.name,
      website: form.website || undefined,
      description: form.description || undefined,
      locations: form.locations ? form.locations.split(',').map((s) => s.trim()).filter(Boolean) : [],
    });
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Company profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
            <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Locations (comma-separated)</label>
            <input type="text" value={form.locations} onChange={(e) => setForm((f) => ({ ...f, locations: e.target.value }))} placeholder="e.g. London, New York, Remote" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2" />
          </div>
          <button type="submit" disabled={updateMutation.isPending} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50">Save</button>
        </form>
      </div>
    </Layout>
  );
}
