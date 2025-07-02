// Admin role types in order of hierarchy (highest to lowest privileges)
export type AdminRoleType = 'admin' | 'chief' | 'manager' | 'sales';

// Modular feature permission types for admin dashboard
export type AdminFeature =
  | 'students' // Managing students
  | 'universities' // Managing universities
  | 'analytics' // Data charts and analytics
  | 'support_chat' // Support chat functionality
  | 'messaging' // Messaging functionality
  | 'staff' // Managing staff members
  | 'settings' // Advanced settings
  | 'student_staff_assignment' // Student-staff assignments
  | 'user_management' // User management
  | 'documents' // Student documents
  | 'student_status'; // Student status management

// Permission structure for a feature
export type AdminPermission = {
  feature: AdminFeature;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
};

// Default permissions by role
export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRoleType, AdminPermission[]> = {
  // Admin: Full access to everything
  admin: [
    { feature: 'students', can_view: true, can_edit: true, can_delete: true },
    { feature: 'universities', can_view: true, can_edit: true, can_delete: true },
    { feature: 'analytics', can_view: true, can_edit: true, can_delete: true },
    { feature: 'support_chat', can_view: true, can_edit: true, can_delete: true },
    { feature: 'messaging', can_view: true, can_edit: true, can_delete: true },
    { feature: 'staff', can_view: true, can_edit: true, can_delete: true },
    { feature: 'settings', can_view: true, can_edit: true, can_delete: true },
    { feature: 'student_staff_assignment', can_view: true, can_edit: true, can_delete: true },
    { feature: 'user_management', can_view: true, can_edit: true, can_delete: true },
    { feature: 'documents', can_view: true, can_edit: true, can_delete: true },
    { feature: 'student_status', can_view: true, can_edit: true, can_delete: true }
  ],
  // Chief: Can't delete staff or change settings
  chief: [
    { feature: 'students', can_view: true, can_edit: true, can_delete: true },
    { feature: 'universities', can_view: true, can_edit: true, can_delete: false },
    { feature: 'analytics', can_view: true, can_edit: true, can_delete: false },
    { feature: 'support_chat', can_view: true, can_edit: true, can_delete: true },
    { feature: 'messaging', can_view: true, can_edit: true, can_delete: true },
    { feature: 'staff', can_view: true, can_edit: true, can_delete: false },
    { feature: 'settings', can_view: true, can_edit: false, can_delete: false },
    { feature: 'student_staff_assignment', can_view: true, can_edit: true, can_delete: false },
    { feature: 'user_management', can_view: true, can_edit: true, can_delete: false },
    { feature: 'documents', can_view: true, can_edit: true, can_delete: false },
    { feature: 'student_status', can_view: true, can_edit: true, can_delete: false }
  ],
  // Manager: Limited edit rights, mostly viewing
  manager: [
    { feature: 'students', can_view: true, can_edit: true, can_delete: false },
    { feature: 'universities', can_view: true, can_edit: false, can_delete: false },
    { feature: 'analytics', can_view: true, can_edit: false, can_delete: false },
    { feature: 'support_chat', can_view: true, can_edit: true, can_delete: false },
    { feature: 'messaging', can_view: true, can_edit: true, can_delete: false },
    { feature: 'staff', can_view: true, can_edit: false, can_delete: false },
    { feature: 'settings', can_view: false, can_edit: false, can_delete: false },
    { feature: 'student_staff_assignment', can_view: true, can_edit: true, can_delete: false },
    { feature: 'user_management', can_view: true, can_edit: false, can_delete: false },
    { feature: 'documents', can_view: true, can_edit: true, can_delete: false },
    { feature: 'student_status', can_view: true, can_edit: true, can_delete: false }
  ],
  // Sales: Minimal permissions, mostly related to students
  sales: [
    { feature: 'students', can_view: true, can_edit: true, can_delete: false },
    { feature: 'universities', can_view: true, can_edit: false, can_delete: false },
    { feature: 'analytics', can_view: true, can_edit: false, can_delete: false },
    { feature: 'support_chat', can_view: true, can_edit: true, can_delete: false },
    { feature: 'messaging', can_view: true, can_edit: true, can_delete: false },
    { feature: 'staff', can_view: false, can_edit: false, can_delete: false },
    { feature: 'settings', can_view: false, can_edit: false, can_delete: false },
    { feature: 'student_staff_assignment', can_view: true, can_edit: false, can_delete: false },
    { feature: 'user_management', can_view: false, can_edit: false, can_delete: false },
    { feature: 'documents', can_view: true, can_edit: false, can_delete: false },
    { feature: 'student_status', can_view: true, can_edit: false, can_delete: false }
  ]
};

// Check if a user has permission for a specific feature and action
export function hasPermission(
  permissions: AdminPermission[],
  feature: AdminFeature,
  action: 'can_view' | 'can_edit' | 'can_delete'
): boolean {
  const perm = permissions.find((p) => p.feature === feature);
  return perm ? !!perm[action] : false;
}

// Get permissions based on role
export function getPermissionsByRole(role: AdminRoleType): AdminPermission[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || DEFAULT_ROLE_PERMISSIONS.sales; // Default to lowest permission
}

// Check if a role is higher in hierarchy than another
export function isRoleHigherThan(role1: AdminRoleType, role2: AdminRoleType): boolean {
  const hierarchy = ['sales', 'manager', 'chief', 'admin'];
  return hierarchy.indexOf(role1) > hierarchy.indexOf(role2);
}

// Utility to check if a user can access a specific feature
export function canAccessFeature(role: AdminRoleType, feature: AdminFeature): boolean {
  const permissions = getPermissionsByRole(role);
  return hasPermission(permissions, feature, 'can_view');
}
