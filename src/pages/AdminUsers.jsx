import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/client';
import { Layout } from '../components/Layout';

export function AdminUsers() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search],
    queryFn: () => adminApi.users({ search: search || undefined }),
  });
  const users = data?.data ?? data ?? [];

  const banMutation = useMutation({
    mutationFn: (id) => adminApi.banUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User management</h1>
        <input
          type="search"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 w-full max-w-md rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
        />
      </div>
      {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Email</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Name</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Role</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="pb-2 font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-gray-900 dark:text-white">{u.email}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{u.name ?? '-'}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">{u.role ?? '-'}</td>
                  <td className="py-3">{u.isActive === false ? <span className="text-red-600">Banned</span> : <span className="text-green-600">Active</span>}</td>
                  <td className="py-3">
                    {u.isActive !== false && (
                      <button type="button" onClick={() => banMutation.mutate(u._id)} disabled={banMutation.isPending} className="text-red-600 dark:text-red-400 hover:underline text-sm">
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-gray-500 dark:text-gray-400 py-4">No users found.</p>}
        </div>
      )}
    </Layout>
  );
}
