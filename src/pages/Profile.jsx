import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/client';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    location: '',
    headline: '',
    experienceSummary: '',
    skills: [],
    yearsOfExperience: '',
    preferredLocations: [],
    preferredRoles: [],
  });
  const [skillsText, setSkillsText] = useState('');
  const [preferredLocationsText, setPreferredLocationsText] = useState('');
  const [preferredRolesText, setPreferredRolesText] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? '',
        location: user.location ?? '',
        headline: user.profile?.headline ?? '',
        experienceSummary: user.profile?.experienceSummary ?? '',
        skills: user.profile?.skills ?? [],
        yearsOfExperience: user.profile?.yearsOfExperience ?? '',
        preferredLocations: user.profile?.preferredLocations ?? [],
        preferredRoles: user.profile?.preferredRoles ?? [],
      });
      setSkillsText((user.profile?.skills ?? []).join(', '));
      setPreferredLocationsText((user.profile?.preferredLocations ?? []).join(', '));
      setPreferredRolesText((user.profile?.preferredRoles ?? []).join(', '));
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (body) => profileApi.update(body),
    onSuccess: () => {
      refreshUser();
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setMessage('Profile updated.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    const skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    const preferredLocations = preferredLocationsText.split(',').map((s) => s.trim()).filter(Boolean);
    const preferredRoles = preferredRolesText.split(',').map((s) => s.trim()).filter(Boolean);
    updateMutation.mutate({
      name: form.name,
      location: form.location,
      profile: {
        headline: form.headline,
        experienceSummary: form.experienceSummary,
        skills,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
        preferredLocations,
        preferredRoles,
      },
    });
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit profile</h1>
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="City, Country"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience summary</label>
            <textarea
              value={form.experienceSummary}
              onChange={(e) => setForm((f) => ({ ...f, experienceSummary: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, Node.js, TypeScript"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of experience</label>
            <input
              type="number"
              value={form.yearsOfExperience}
              onChange={(e) => setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))}
              min={0}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred locations (comma-separated)</label>
            <input
              type="text"
              value={preferredLocationsText}
              onChange={(e) => setPreferredLocationsText(e.target.value)}
              placeholder="e.g. Remote, London, New York"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred roles (comma-separated)</label>
            <input
              type="text"
              value={preferredRolesText}
              onChange={(e) => setPreferredRolesText(e.target.value)}
              placeholder="e.g. Frontend, Full-stack"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
