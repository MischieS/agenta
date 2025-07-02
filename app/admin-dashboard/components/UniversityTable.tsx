"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

interface University {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  is_active?: boolean;
}

export default function UniversityTable() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [form, setForm] = useState<Partial<University>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchUniversities();
    // eslint-disable-next-line
  }, []);

  async function fetchUniversities() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("university").select("*");
    if (error) setError(error.message);
    const universities = data || [];
    setUniversities(universities);
    setTotalCount(universities.length);
    setActiveCount(universities.filter(u => u.is_active).length);
    setLoading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const val = name === 'is_active' ? value === 'true' : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  }

  function startEdit(university: University) {
    setEditingUniversity(university);
    setForm(university);
    setShowAdd(true);
  }

  function startAdd() {
    setEditingUniversity(null);
    setForm({ is_active: true });
    setShowAdd(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (editingUniversity) {
      // Edit university
      const { error } = await supabase.from("university").update(form).eq("id", editingUniversity.id);
      if (error) setError(error.message);
    } else {
      // Add university
      const { error } = await supabase.from("university").insert([form]);
      if (error) setError(error.message);
    }
    setShowAdd(false);
    setEditingUniversity(null);
    setForm({});
    fetchUniversities();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this university?")) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("university").delete().eq("id", id);
    if (error) setError(error.message);
    fetchUniversities();
  }

  async function toggleUniversityStatus(id: string, currentStatus: boolean) {
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from("university")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    if (error) setError(error.message);
    fetchUniversities();
  }

  return (
    <div className="admin-card w-full rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-0">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="admin-heading text-2xl font-bold">Universities</h2>
          <p className="text-gray-500">Total: {totalCount} | Active: {activeCount}</p>
        </div>
        <button
          className="admin-btn-primary px-6 py-2.5 rounded-lg shadow hover:scale-105 transition"
          onClick={startAdd}
          aria-label="Add University"
        >
          Add University
        </button>
      </div>
      {error && <div className="admin-error mb-2 bg-red-100 text-red-700 px-3 py-2 rounded">{error}</div>}
      {showAdd && (
        <form className="mb-4 space-y-2" onSubmit={handleSubmit}>
          <div className="flex gap-2 flex-wrap">
            <input
              name="name"
              value={form.name || ""}
              onChange={handleInputChange}
              placeholder="Name"
              className="border p-2 rounded flex-1"
              required
            />
            <input
              name="email"
              value={form.email || ""}
              onChange={handleInputChange}
              placeholder="Email"
              className="border p-2 rounded flex-1"
              type="email"
            />
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleInputChange}
              placeholder="Phone"
              className="border p-2 rounded flex-1"
            />
            <input
              name="address"
              value={form.address || ""}
              onChange={handleInputChange}
              placeholder="Address"
              className="border p-2 rounded flex-1"
            />
            <input
              name="website"
              value={form.website || ""}
              onChange={handleInputChange}
              placeholder="Website"
              className="border p-2 rounded flex-1"
              type="url"
            />
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="is_active"
                value={form.is_active ? 'true' : 'false'}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              {editingUniversity ? "Update" : "Add"}
            </button>
            <button type="button" className="px-4 py-2 bg-gray-300 text-gray-800 rounded" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="w-full">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-12 rounded-lg mb-2" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full min-w-[1000px] max-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Website</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <AnimatePresence initial={false}>
                <tbody>
                  {universities.map((university) => (
                    <motion.tr
                      key={university.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.3 }}
                      className="admin-table-row bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-lg shadow-sm"
                    >
                      <td className="admin-text font-semibold">{university.name}</td>
                      <td className="admin-text">{university.email || "-"}</td>
                      <td className="admin-text">{university.phone || "-"}</td>
                      <td className="admin-text">{university.address || "-"}</td>
                      <td className="admin-text">
                        {university.website ? (
                          <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {university.website}
                          </a>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${university.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {university.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          className="admin-btn-secondary px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                          onClick={() => startEdit(university)}
                          aria-label={`Edit ${university.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className={`px-2 py-1 rounded font-medium text-sm ${university.is_active ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'} text-white transition`}
                          onClick={() => toggleUniversityStatus(university.id, !!university.is_active)}
                          aria-label={university.is_active ? `Deactivate ${university.name}` : `Activate ${university.name}`}
                        >
                          {university.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          className="admin-btn-danger px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                          onClick={() => handleDelete(university.id)}
                          aria-label={`Delete ${university.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </AnimatePresence>
            </table>
          </div>
        )}
        {!loading && universities.length === 0 && <div className="text-gray-500 mt-4">No universities found.</div>}
      </div>
    </div>
  );
}
