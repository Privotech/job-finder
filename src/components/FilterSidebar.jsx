import { useState } from 'react';

const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

export function FilterSidebar({ filters, onChange }) {
  const [location, setLocation] = useState(filters.location || '');
  const [country, setCountry] = useState(filters.country || '');
  const [employmentType, setEmploymentType] = useState(filters.employmentType || '');
  const [remoteOnly, setRemoteOnly] = useState(!!filters.remoteOnly);
  const [salaryMin, setSalaryMin] = useState(filters.salaryMin ?? '');
  const [salaryMax, setSalaryMax] = useState(filters.salaryMax ?? '');
  const [tags, setTags] = useState(filters.tags ? (Array.isArray(filters.tags) ? filters.tags.join(', ') : filters.tags) : '');

  const apply = () => {
    onChange({
      ...filters,
      location: location || undefined,
      country: country || undefined,
      employmentType: employmentType || undefined,
      remoteOnly: remoteOnly || undefined,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
    });
  };

  const clear = () => {
    setLocation('');
    setCountry('');
    setEmploymentType('');
    setRemoteOnly(false);
    setSalaryMin('');
    setSalaryMax('');
    setTags('');
    onChange({});
  };

  return (
    <aside className="w-64 shrink-0 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / City</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. New York"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Any country"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment type</label>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          {EMPLOYMENT_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={remoteOnly}
          onChange={(e) => setRemoteOnly(e.target.checked)}
          className="rounded border-gray-300 text-primary-600"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">Remote only</span>
      </label>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary min</label>
        <input
          type="number"
          value={salaryMin}
          onChange={(e) => setSalaryMin(e.target.value)}
          placeholder="e.g. 50000"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary max</label>
        <input
          type="number"
          value={salaryMax}
          onChange={(e) => setSalaryMax(e.target.value)}
          placeholder="e.g. 120000"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. React, Node"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={apply}
          className="flex-1 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clear}
          className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Clear
        </button>
      </div>
    </aside>
  );
}
