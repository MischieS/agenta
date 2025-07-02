const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test role for testing purposes
const testRole = {
  name: 'Test Admin Role',
  description: 'A test role with admin permissions',
  permissions: ['view_dashboard', 'manage_students', 'manage_staff']
};

let createdRoleId;

describe('Role Management Tests', () => {
  // Test creating a role
  test('Create a role', async () => {
    const { data, error } = await supabase
      .from('role')
      .insert([testRole])
      .select();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data[0].name).toBe(testRole.name);
    createdRoleId = data[0].id;
  });

  // Test retrieving roles
  test('Get all roles', async () => {
    const { data, error } = await supabase
      .from('role')
      .select('*');
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  // Test retrieving a specific role
  test('Get role by ID', async () => {
    const { data, error } = await supabase
      .from('role')
      .select('*')
      .eq('id', createdRoleId)
      .single();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.id).toBe(createdRoleId);
    expect(data.name).toBe(testRole.name);
    expect(Array.isArray(data.permissions)).toBe(true);
    expect(data.permissions).toContain('manage_students');
  });

  // Test updating a role
  test('Update role', async () => {
    const updatedName = 'Updated Test Role';
    const updatedPermissions = ['view_dashboard', 'manage_students', 'manage_staff', 'manage_universities'];
    
    const { error } = await supabase
      .from('role')
      .update({ 
        name: updatedName,
        permissions: updatedPermissions 
      })
      .eq('id', createdRoleId);
    
    expect(error).toBeNull();

    // Verify the update
    const { data, error: fetchError } = await supabase
      .from('role')
      .select('*')
      .eq('id', createdRoleId)
      .single();
    
    expect(fetchError).toBeNull();
    expect(data.name).toBe(updatedName);
    expect(data.permissions).toContain('manage_universities');
  });

  // Test assigning a role to a staff member
  test('Assign role to staff', async () => {
    // Create a test staff member
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .insert([{
        first_name: 'Role',
        last_name: 'Test',
        email: 'role.test@example.com',
        role_id: createdRoleId
      }])
      .select();
    
    expect(staffError).toBeNull();
    expect(staffData).not.toBeNull();
    const staffId = staffData[0].id;
    
    // Verify the staff has the role assigned
    const { data, error } = await supabase
      .from('staff')
      .select('*, role:role_id(*)')
      .eq('id', staffId)
      .single();
    
    expect(error).toBeNull();
    expect(data.role).not.toBeNull();
    expect(data.role.id).toBe(createdRoleId);
    
    // Clean up - delete test staff
    await supabase.from('staff').delete().eq('id', staffId);
  });

  // Test deleting a role
  test('Delete role', async () => {
    const { error } = await supabase
      .from('role')
      .delete()
      .eq('id', createdRoleId);
    
    expect(error).toBeNull();

    // Verify deletion
    const { data, error: fetchError } = await supabase
      .from('role')
      .select('*')
      .eq('id', createdRoleId);
    
    expect(fetchError).toBeNull();
    expect(data.length).toBe(0);
  });
});
