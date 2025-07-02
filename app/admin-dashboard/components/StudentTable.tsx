"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StudentModal from "./StudentModal";
import { AnimatePresence, motion } from "framer-motion";

interface Student {
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
}

export default function StudentTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<Partial<Student>>({});
  const supabase = createClient();

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, []);

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("student").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    setStudents(data || []);
    setLoading(false);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function startEdit(student: Student) {
    setEditingStudent(student);
    setForm(student);
    setShowModal(true);
  }

  function startAdd() {
    setEditingStudent(null);
    setForm({});
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (editingStudent) {
      // Edit student
      const { error } = await supabase.from("student").update(form).eq("id", editingStudent.id);
      if (error) setError(error.message);
    } else {
      // Add student
      const { error } = await supabase.from("student").insert([form]);
      if (error) setError(error.message);
    }
    setShowModal(false);
    setEditingStudent(null);
    setForm({});
    fetchStudents();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this student?")) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("student").delete().eq("id", id);
    if (error) setError(error.message);
    fetchStudents();
  }

  return (
    <div className="admin-card w-full rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-0">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="admin-heading text-2xl font-bold">Students</h2>
        <button
          className="admin-btn-primary px-6 py-2.5 rounded-lg shadow hover:scale-105 transition"
          aria-label="Add Student"
          onClick={startAdd}
        >
          Add Student
        </button>
      </div>
      {error && <div className="admin-error mb-2 bg-red-100 text-red-700 px-3 py-2 rounded">{error}</div>}
      <StudentModal open={showModal} onClose={() => setShowModal(false)} title={editingStudent ? "Edit Student" : "Add Student"}>
        <form className="space-y-2" onSubmit={handleSubmit} aria-label="Student Form">
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
            <button type="submit" className="admin-btn-primary px-4 py-2 rounded-lg shadow" aria-label={editingStudent ? "Update Student" : "Add Student"}>
              {editingStudent ? "Update" : "Add"}
            </button>
            <button type="button" className="admin-btn-secondary px-4 py-2 rounded-lg" onClick={() => setShowModal(false)} aria-label="Cancel Student Form">
              Cancel
            </button>
          </div>
        </form>
      </StudentModal>
      <div className="w-full">
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-12 rounded-lg mb-2" />
            ))}
          </div>
        ) : (
          <table className="admin-table w-full min-w-[1200px] max-w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Surname</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Birthdate</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Profile Pic</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Updated</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <AnimatePresence initial={false}>
              <tbody>
                {students.map((student) => (
                  <motion.tr
                    key={student.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="admin-table-row bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-lg shadow-sm"
                  >
                    <td className="admin-text">{student.name}</td>
                    <td className="admin-text">{student.surname}</td>
                    <td className="admin-text">{student.email}</td>
                    <td className="admin-text">{student.status || "-"}</td>
                    <td className="admin-text">{student.birthdate ? new Date(student.birthdate).toLocaleDateString() : "-"}</td>
                    <td className="admin-text">{student.country || "-"}</td>
                    <td className="admin-text">{student.address || "-"}</td>
                    <td className="px-4 py-2">
                      {student.profile_pic ? (
                        <img src={student.profile_pic} alt="Profile" className="w-8 h-8 rounded-full object-cover border" />
                      ) : "-"}
                    </td>
                    <td className="admin-muted">{student.created_at ? new Date(student.created_at).toLocaleString() : "-"}</td>
                    <td className="admin-muted">{student.updated_at ? new Date(student.updated_at).toLocaleString() : "-"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        className="admin-btn-secondary px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                        onClick={() => startEdit(student)}
                        aria-label={`Edit ${student.name} ${student.surname}`}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn-danger px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900 transition"
                        onClick={() => handleDelete(student.id)}
                        aria-label={`Delete ${student.name} ${student.surname}`}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        )}
        {!loading && students.length === 0 && <div className="text-gray-500 mt-4">No students found.</div>}
      </div>
    </div>
  );
}
