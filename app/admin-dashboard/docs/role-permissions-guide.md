# Role-Based Permissions Guide for Admin Dashboard

## Overview

This document outlines the feature access levels for different admin user roles in the system. The roles are structured in a hierarchy, with each higher level inheriting all permissions from lower levels plus additional privileges.

## Role Hierarchy (Highest to Lowest)

1. **Admin** - Superuser with full system access
2. **Chief** - Department head with extensive access but limited deletion rights
3. **Manager** - Team leader with moderate edit rights
4. **Sales** - Entry-level staff with basic student management permissions

## Feature Assignments by Role

### Admin Role
- **Complete access** to all features with full view, edit, and delete permissions
- Can manage other admin users of any role
- Access to advanced system settings and configurations
- Can perform global data operations and manage critical infrastructure

### Chief Role
- **Cannot delete** university records or staff accounts
- **Cannot edit** system settings
- All other features available with edit permissions
- Can manage student data comprehensively
- Can assign staff to students and manage workflows
- Has access to analytics and reporting with edit capabilities

### Manager Role
- **Limited to viewing** university records, analytics, and staff information
- **Cannot access** system settings
- Can edit and manage student records but not delete them
- Can assign staff to students but not modify assignment rules
- Can view and approve student documents
- Can update student status information
- Has messaging and support chat capabilities

### Sales Role
- **Basic student management** capabilities
- Can view student records and university information
- Can participate in support chats and messaging
- **Cannot access** staff management or user management
- **Cannot modify** staff assignments, only view them
- **Can view** but not edit document approvals
- **Can update** basic student information

## Permission Rules

1. **View Permission**: Allows users to see the feature and its data
2. **Edit Permission**: Allows users to modify existing data and create new entries
3. **Delete Permission**: Allows users to remove data from the system

## Implementation Guidelines

### Adding New Roles

When adding a new role to the system:

1. Determine where it fits in the existing hierarchy
2. Inherit permissions from the role below it in the hierarchy
3. Add specific permissions that distinguish this role
4. Update the `AdminRoleType` type and `DEFAULT_ROLE_PERMISSIONS` object

### Adding New Features

When adding a new feature to the dashboard:

1. Update the `AdminFeature` type with the new feature
2. Assign appropriate permissions for each role level
3. Consider the sensitivity of the feature when assigning permissions
4. Default to restrictive access for lower-level roles

### UI Implementation Considerations

1. Hide UI elements for features the user doesn't have access to
2. Disable editing controls when a user has view-only access
3. Remove delete buttons for users without delete permissions
4. Show appropriate messaging when permissions are insufficient

## Future Role Extensions

The system is designed to accommodate additional roles as needed. Potential future roles might include:

- **Coordinator**: Between Manager and Sales, with focused student coordination duties
- **Specialist**: Subject matter expert with specific feature permissions
- **Auditor**: Read-only access to all data for compliance purposes
- **Support**: Focused on student communications and document processing

When extending with these roles, follow the hierarchy pattern and assign permissions according to job responsibilities.

## Security Considerations

1. Always validate permissions on both client and server sides
2. Log all permission changes and sensitive operations
3. Regularly review role assignments to ensure principle of least privilege
4. Consider implementing time-bound elevation of privileges for specific tasks
