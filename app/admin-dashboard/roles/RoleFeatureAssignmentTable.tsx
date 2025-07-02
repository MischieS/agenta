"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface Feature {
  id: string;
  name: string;
  description?: string;
}

interface RoleFeatureAssignmentTableProps {
  roles: Role[];
}

export default function RoleFeatureAssignmentTable({ roles }: RoleFeatureAssignmentTableProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Set<string>>>({}); // roleId -> set of featureIds
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  // Fetch features and assignments
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data: featuresData, error: featuresError } = await supabase.from("features").select("*");
        if (featuresError) throw featuresError;
        setFeatures(featuresData || []);

        const { data: roleFeaturesData, error: roleFeaturesError } = await supabase.from("role_features").select("role_id, feature_id");
        if (roleFeaturesError) throw roleFeaturesError;

        // Build assignments map
        const assignmentsMap: Record<string, Set<string>> = {};
        for (const role of roles) {
          assignmentsMap[role.id] = new Set();
        }
        for (const rf of roleFeaturesData || []) {
          if (assignmentsMap[rf.role_id]) {
            assignmentsMap[rf.role_id].add(rf.feature_id);
          }
        }
        setAssignments(assignmentsMap);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      }
      setLoading(false);
    }
    if (roles.length > 0) fetchData();
  }, [roles]);

  // Toggle assignment
  const handleToggle = async (roleId: string, featureId: string) => {
    setSaving(true);
    setError(null);
    const assigned = assignments[roleId]?.has(featureId);
    let newAssignments = { ...assignments };
    try {
      if (assigned) {
        // Remove assignment
        const { error: deleteError } = await supabase.from("role_features").delete().eq("role_id", roleId).eq("feature_id", featureId);
        if (deleteError) throw deleteError;
        newAssignments[roleId].delete(featureId);
      } else {
        // Add assignment
        const { error: insertError } = await supabase.from("role_features").insert([{ role_id: roleId, feature_id: featureId }]);
        if (insertError) throw insertError;
        newAssignments[roleId].add(featureId);
      }
      setAssignments({ ...newAssignments });
    } catch (err: any) {
      setError(err.message || "Failed to update assignment");
    }
    setSaving(false);
  };

  if (loading) return <div className="py-4 text-gray-700 dark:text-gray-300">Loading features...</div>;
  if (error) return <div className="py-4 text-red-600 dark:text-red-400">{error}</div>;
  if (features.length === 0) return <div className="py-4 text-gray-700 dark:text-gray-300">No features found.</div>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full border border-gray-200 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-gray-900 dark:text-gray-100">Feature</th>
            {roles.map(role => (
              <th key={role.id} className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-center text-gray-900 dark:text-gray-100">{role.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map(feature => (
            <tr key={feature.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 font-medium">
                {feature.name}
                {feature.description && <span className="block text-xs text-gray-500 dark:text-gray-400">{feature.description}</span>}
              </td>
              {roles.map(role => (
                <td key={role.id + feature.id} className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-center">
                  <input
                    type="checkbox"
                    checked={assignments[role.id]?.has(feature.id) || false}
                    onChange={() => handleToggle(role.id, feature.id)}
                    disabled={saving}
                    className="w-5 h-5 accent-blue-600"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {saving && <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Saving...</div>}
    </div>
  );
}
