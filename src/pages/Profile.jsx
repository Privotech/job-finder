import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/client';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
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

  function handleCancel() {
    setIsEditing(false);
    // Reset form to current user data
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
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
            {message}
          </div>
        )}

        {!isEditing ? (
          // READ-ONLY VIEW
          <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {/* Name & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</p>
                <p className="text-lg text-gray-900 dark:text-white font-semibold">{form.name || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</p>
                <p className="text-lg text-gray-900 dark:text-white font-semibold">{form.location || '—'}</p>
              </div>
            </div>

            {/* Headline */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Headline</p>
              <p className="text-lg text-gray-900 dark:text-white font-semibold">{form.headline || '—'}</p>
            </div>

            {/* Experience Summary */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Experience Summary</p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{form.experienceSummary || '—'}</p>
            </div>

            {/* Years of Experience */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Years of Experience</p>
              <p className="text-lg text-gray-900 dark:text-white font-semibold">{form.yearsOfExperience || '—'}</p>
            </div>

            {/* Skills */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Skills</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.skills && form.skills.length > 0 ? (
                  form.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>

            {/* Preferred Locations */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preferred Locations</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.preferredLocations && form.preferredLocations.length > 0 ? (
                  form.preferredLocations.map((loc) => (
                    <span key={loc} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      {loc}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>

            {/* Preferred Roles */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Preferred Roles</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.preferredRoles && form.preferredRoles.length > 0 ? (
                  form.preferredRoles.map((role) => (
                    <span key={role} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          // EDIT VIEW
          <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="City, Country"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience summary</label>
              <textarea
                value={form.experienceSummary}
                onChange={(e) => setForm((f) => ({ ...f, experienceSummary: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="e.g. React, Node.js, TypeScript"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Years of experience</label>
              <input
                type="number"
                value={form.yearsOfExperience}
                onChange={(e) => setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))}
                min={0}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred locations (comma-separated)</label>
              <input
                type="text"
                value={preferredLocationsText}
                onChange={(e) => setPreferredLocationsText(e.target.value)}
                placeholder="e.g. Remote, London, New York"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred roles (comma-separated)</label>
              <input
                type="text"
                value={preferredRolesText}
                onChange={(e) => setPreferredRolesText(e.target.value)}
                placeholder="e.g. Frontend, Full-stack"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
