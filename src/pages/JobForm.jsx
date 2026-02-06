import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerApi } from '../api/client';
import { Layout } from '../components/Layout';

const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

export function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = id && id !== 'new';

  const { data: jobsData } = useQuery({
    queryKey: ['employer', 'jobs'],
    queryFn: () => employerApi.jobs(),
    enabled: isEdit,
  });
  const jobs = jobsData?.data ?? jobsData ?? [];
  const existing = isEdit ? jobs.find((j) => j._id === id) : null;

  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    employmentType: 'full_time',
    tags: '',
    skills: '',
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title ?? '',
        description: existing.description ?? '',
        requirements: existing.requirements ?? '',
        location: existing.location ?? '',
        salaryMin: existing.salaryMin ?? '',
        salaryMax: existing.salaryMax ?? '',
        employmentType: existing.employmentType ?? 'full_time',
        tags: (existing.tags ?? []).join(', '),
        skills: (existing.skills ?? []).join(', '),
      });
    }
  }, [existing]);

  const createMutation = useMutation({
    mutationFn: (body) => employerApi.createJob(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
      navigate('/employer/jobs');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (body) => employerApi.updateJob(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
      navigate('/employer/jobs');
    },
  });

  function buildPayload() {
    return {
      title: form.title,
      description: form.description,
      requirements: form.requirements || undefined,
      location: form.location || undefined,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      employmentType: form.employmentType,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = buildPayload();
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  }

  const loading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isEdit ? 'Edit job' : 'Post a job'}
        </h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / Country</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Remote, London UK, New York USA"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment type</label>
            <select
              value={form.employmentType}
              onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            >
              {EMPLOYMENT_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary min</label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary max</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
              rows={5}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements</label>
            <textarea
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. React, Node, Remote"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              placeholder="e.g. JavaScript, Python"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Saving…' : isEdit ? 'Update job' : 'Post job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employer/jobs')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
