"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";

interface Staff {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  status?: string;
  birthdate?: string;
  country?: string;
  address?: string;
  profile_pic?: string;
  created_at?: string;
  updated_at?: string;
  role: string;
}

const ROLES = ["admin", "chief", "manager", "sales"];

export default function StaffTable() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [form, setForm] = useState<Partial<Staff>>({ role: "sales" });
  const supabase = createClient();

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line
  }, []);

  async function fetchStaff() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("user").select("*").in("role", ROLES).order("created_at", { ascending: false });
    if (error) setError(error.message);
    setStaff(data || []);
    setLoading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(staffMember: Staff) {
    setEditingStaff(staffMember);
    setForm(staffMember);
    setShowAdd(true);
  }

  function startAdd() {
    setEditingStaff(null);
    setForm({ role: "sales" });
    setShowAdd(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (editingStaff) {
      // Edit staff
      const { error } = await supabase.from("user").update(form).eq("id", editingStaff.id);
      if (error) setError(error.message);
    } else {
      // Add staff
      const { error } = await supabase.from("user").insert([form]);
      if (error) setError(error.message);
    }
    setShowAdd(false);
    setEditingStaff(null);
    setForm({ role: "sales" });
    fetchStaff();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this staff member?")) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("user").delete().eq("id", id);
    if (error) setError(error.message);
    fetchStaff();
  }

  return (
    <div className="admin-card w-full rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-0">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="admin-heading text-2xl font-bold px-4 sm:px-6">Staff</h2>
        <div className="px-4 sm:px-6">
          <button
            className="admin-btn-primary px-6 py-2.5 rounded-lg shadow hover:scale-105 transition"
            aria-label="Add Staff"
            onClick={startAdd}
          >
            Add Staff
          </button>
        </div>
      </div>
      {error && <div className="admin-error mb-2 bg-red-100 text-red-700 px-3 py-2 rounded">{error}</div>}
      {showAdd && (
        <form className="mb-4 space-y-2" onSubmit={handleSubmit} aria-label="Staff Form">
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
              name="surname"
              value={form.surname || ""}
              onChange={handleInputChange}
              placeholder="Surname"
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
              required
            />
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleInputChange}
              placeholder="Phone"
              className="border p-2 rounded flex-1"
            />
            <input
              name="status"
              value={form.status || ""}
              onChange={handleInputChange}
              placeholder="Status"
              className="border p-2 rounded flex-1"
            />
            <input
              name="birthdate"
              value={form.birthdate || ""}
              onChange={handleInputChange}
              placeholder="Birthdate"
              className="border p-2 rounded flex-1"
              type="date"
            />
            <input
              name="country"
              value={form.country || ""}
              onChange={handleInputChange}
              placeholder="Country"
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
              name="profile_pic"
              value={form.profile_pic || ""}
              onChange={handleInputChange}
              placeholder="Profile Pic URL"
              className="border p-2 rounded flex-1"
              type="url"
            />
            <select
              name="role"
              value={form.role || "sales"}
              onChange={handleInputChange}
              className="border p-2 rounded flex-1"
              required
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            <input
              name="created_at"
              value={form.created_at || ""}
              onChange={handleInputChange}
              placeholder="Created At"
              className="border p-2 rounded flex-1"
              type="datetime-local"
            />
            <input
              name="updated_at"
              value={form.updated_at || ""}
              onChange={handleInputChange}
              placeholder="Updated At"
              className="border p-2 rounded flex-1"
              type="datetime-local"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="admin-btn-primary" aria-label={editingStaff ? "Update Staff" : "Add Staff"}>
              {editingStaff ? "Update" : "Add"}
            </button>
            <button type="button" className="admin-btn-secondary" onClick={() => setShowAdd(false)} aria-label="Cancel Staff Form">
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
            <table className="admin-table w-full min-w-[1200px] max-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Surname</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Birthdate</th>
                  <th className="px-4 py-2 text-left">Country</th>
                  <th className="px-4 py-2 text-left">Address</th>
                  <th className="px-4 py-2 text-left">Profile Pic</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Updated</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <AnimatePresence initial={false}>
                <tbody>
                  {staff.map((member) => (
                    <motion.tr
                      key={member.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.3 }}
                      className="admin-table-row bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-lg shadow-sm"
                    >
                      <td className="admin-text font-semibold">{member.name}</td>
                      <td className="admin-text">{member.surname}</td>
                      <td className="admin-text">{member.email}</td>
                      <td className="admin-text">{member.phone || "-"}</td>
                      <td className="admin-text">{member.status || "-"}</td>
                      <td className="admin-text">{member.birthdate ? new Date(member.birthdate).toLocaleDateString() : "-"}</td>
                      <td className="admin-text">{member.country || "-"}</td>
                      <td className="admin-text">{member.address || "-"}</td>
                      <td className="px-4 py-2">
                        {member.profile_pic ? (
                          <img src={member.profile_pic} alt="Profile" className="w-8 h-8 rounded-full object-cover border" />
                        ) : "-"}
                      </td>
                      <td className="admin-text capitalize">{member.role}</td>
                      <td className="admin-muted">{member.created_at ? new Date(member.created_at).toLocaleString() : "-"}</td>
                      <td className="admin-muted">{member.updated_at ? new Date(member.updated_at).toLocaleString() : "-"}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          className="admin-btn-secondary px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                          onClick={() => startEdit(member)}
                          aria-label={`Edit ${member.name} ${member.surname}`}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-btn-danger px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                          onClick={() => handleDelete(member.id)}
                          aria-label={`Delete ${member.name} ${member.surname}`}
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
        {!loading && staff.length === 0 && <div className="text-gray-500 mt-4">No staff found.</div>}
      </div>
    </div>
  );
}
