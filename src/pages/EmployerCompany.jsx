import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employerApi } from "../api/client";
import { Layout } from "../components/Layout";

export function EmployerCompany() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const { data } = useQuery({
    queryKey: ["employer", "company"],
    queryFn: () => employerApi.company(),
  });

  const [form, setForm] = useState({
    name: "",
    website: "",
    description: "",
    locations: "",
  });

  useEffect(() => {
    const company = data?.data ?? data ?? {};
    setForm({
      name: company.name ?? "",
      website: company.website ?? "",
      description: company.description ?? "",
      locations: (company.locations ?? []).join(", "),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data?.name,
    data?.data?.website,
    data?.data?.description,
    data?.data?.locations,
  ]);

  const updateMutation = useMutation({
    mutationFn: (body) => employerApi.updateCompany(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer", "company"] });
      setMessage("Company profile updated.");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    updateMutation.mutate({
      name: form.name,
      website: form.website || undefined,
      description: form.description || undefined,
      locations: form.locations
        ? form.locations
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    });
  }

  function handleCancel() {
    setIsEditing(false);
    // Reset form
    const company = data?.data ?? data ?? {};
    setForm({
      name: company.name ?? "",
      website: company.website ?? "",
      description: company.description ?? "",
      locations: (company.locations ?? []).join(", "),
    });
  }

  const company = data?.data ?? data ?? {};

  return (
    <Layout>
      <div className="max-w-2xl mx-auto my-8 px-4">
        {!isEditing ? (
          // READ-ONLY VIEW
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-sky-600">Company Profile</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
              >
                Edit
              </button>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Company Name
                </label>
                <p className="text-lg text-gray-900">{company.name || "—"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Website
                </label>
                <p className="text-lg text-gray-900">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline"
                    >
                      {company.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Description
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">
                {company.description || "—"}
              </p>
            </div>

            {company.locations && company.locations.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Office Locations
                </label>
                <div className="flex flex-wrap gap-2">
                  {company.locations.map((location, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // EDIT VIEW
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-6 text-sky-600">Edit Company Profile</h1>

            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                {message}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Tell us about your company"
                rows={5}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Locations (comma-separated)
              </label>
              <input
                type="text"
                value={form.locations}
                onChange={(e) =>
                  setForm({ ...form, locations: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g. New York, San Francisco, Austin"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
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
