import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumesApi } from '../api/client';
import { Layout } from '../components/Layout';

export function Resumes() {
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumesApi.my(),
  });
  const resumes = data?.data ?? data ?? [];

  const uploadMutation = useMutation({
    mutationFn: (formData) => resumesApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setFile(null);
      setUploadError('');
    },
    onError: (err) => setUploadError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => resumesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (id) => resumesApi.setPrimary(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });

  function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploadError('');
    const formData = new FormData();
    formData.append('resume', file);
    uploadMutation.mutate(formData);
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My resumes</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Upload resume</h2>
          <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-900/30 dark:file:text-primary-300"
              />
            </div>
            <button
              type="submit"
              disabled={!file || uploadMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {uploadMutation.isPending ? 'Uploading…' : 'Upload'}
            </button>
          </form>
          {uploadError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{uploadError}</p>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your resumes</h2>
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          ) : resumes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No resumes yet. Upload one above.</p>
          ) : (
            <ul className="space-y-3">
              {resumes.map((r) => (
                <li
                  key={r._id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {r.originalName ?? r.filePath ?? 'Resume'}
                    </span>
                    {r.isPrimary && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!r.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryMutation.mutate(r._id)}
                        disabled={setPrimaryMutation.isPending}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Set primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(r._id)}
                      disabled={deleteMutation.isPending}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
