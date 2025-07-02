import { AdminPermission, AdminFeature } from "./permissions";

export type AdminRole = "admin" | "chief" | "manager" | "sales";

// Role hierarchy (higher index = higher privilege)
export const ROLE_HIERARCHY: AdminRole[] = ["sales", "manager", "chief", "admin"];

// Minimum role required for each feature (can be extended)
export const FEATURE_MIN_ROLE: Record<AdminFeature, AdminRole> = {
  students: "sales",
  universities: "sales",
  analytics: "manager",
  support_chat: "manager",
  messaging: "manager",
  staff: "chief",
  settings: "admin",
  student_staff_assignment: "manager",
  user_management: "admin",
};

// Check if user role is at least the required role
export function hasRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  return (
    ROLE_HIERARCHY.indexOf(userRole) >= 0 &&
    ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(requiredRole)
  );
}

// Combined check: role + permissions
export function canAccess(
  userRole: AdminRole,
  permissions: AdminPermission[],
  feature: AdminFeature,
  action: "can_view" | "can_edit" | "can_delete"
): boolean {
  // Check minimum role
  const minRole = FEATURE_MIN_ROLE[feature];
  if (!hasRole(userRole, minRole)) return false;
  // Check explicit permissions (if any)
  if (permissions && permissions.length > 0) {
    const perm = permissions.find((p) => p.feature === feature);
    if (perm && perm[action] === false) return false;
    if (perm && perm[action] === true) return true;
  }
  // If no explicit permission, allow if role is sufficient
  return true;
}
