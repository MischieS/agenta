const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test staff member for testing purposes
const testStaff = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  role_id: null, // Will be set dynamically
  university_id: null, // Will be set dynamically
  is_active: true
};

let createdStaffId;
let testRoleId;
let testUniversityId;

describe('Staff Management Tests', () => {
  // Setup - create test role and university
  beforeAll(async () => {
    // Create a test role
    const { data: roleData } = await supabase
      .from('role')
      .insert([{ name: 'Test Role', permissions: ['view_dashboard'] }])
      .select();
    
    testRoleId = roleData[0]?.id;
    
    // Create a test university
    const { data: uniData } = await supabase
      .from('university')
      .insert([{ name: 'Test University', is_active: true }])
      .select();
    
    testUniversityId = uniData[0]?.id;
    
    // Update test staff with role and university IDs
    testStaff.role_id = testRoleId;
    testStaff.university_id = testUniversityId;
  });
  
  // Cleanup - delete test data
  afterAll(async () => {
    // Delete test staff
    if (createdStaffId) {
      await supabase.from('staff').delete().eq('id', createdStaffId);
    }
    
    // Delete test role
    if (testRoleId) {
      await supabase.from('role').delete().eq('id', testRoleId);
    }
    
    // Delete test university
    if (testUniversityId) {
      await supabase.from('university').delete().eq('id', testUniversityId);
    }
  });

  // Test creating a staff member
  test('Create a staff member', async () => {
    const { data, error } = await supabase
      .from('staff')
      .insert([testStaff])
      .select();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data[0].email).toBe(testStaff.email);
    createdStaffId = data[0].id;
  });

  // Test retrieving staff members
  test('Get all staff members', async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('*, role:role_id(name), university:university_id(name)');
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    // Check that we're getting role and university data
    const testStaffMember = data.find(staff => staff.id === createdStaffId);
    expect(testStaffMember).toBeDefined();
    expect(testStaffMember.role).toBeDefined();
    expect(testStaffMember.university).toBeDefined();
  });

  // Test retrieving a specific staff member
  test('Get staff member by ID', async () => {
    const { data, error } = await supabase
      .from('staff')
      .select('*, role:role_id(name), university:university_id(name)')
      .eq('id', createdStaffId)
      .single();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.id).toBe(createdStaffId);
    expect(data.email).toBe(testStaff.email);
    expect(data.role.name).toBe('Test Role');
    expect(data.university.name).toBe('Test University');
  });

  // Test updating a staff member
  test('Update staff member', async () => {
    const updatedEmail = 'updated.john.doe@example.com';
    const { error } = await supabase
      .from('staff')
      .update({ email: updatedEmail })
      .eq('id', createdStaffId);
    
    expect(error).toBeNull();

    // Verify the update
    const { data, error: fetchError } = await supabase
      .from('staff')
      .select('*')
      .eq('id', createdStaffId)
      .single();
    
    expect(fetchError).toBeNull();
    expect(data.email).toBe(updatedEmail);
  });

  // Test activating/deactivating a staff member
  test('Toggle staff member active status', async () => {
    // Deactivate the staff member
    const { error: deactivateError } = await supabase
      .from('staff')
      .update({ is_active: false })
      .eq('id', createdStaffId);
    
    expect(deactivateError).toBeNull();

    // Verify deactivation
    let { data: deactivatedData } = await supabase
      .from('staff')
      .select('*')
      .eq('id', createdStaffId)
      .single();
    
    expect(deactivatedData.is_active).toBe(false);

    // Activate the staff member
    const { error: activateError } = await supabase
      .from('staff')
      .update({ is_active: true })
      .eq('id', createdStaffId);
    
    expect(activateError).toBeNull();

    // Verify activation
    let { data: activatedData } = await supabase
      .from('staff')
      .select('*')
      .eq('id', createdStaffId)
      .single();
    
    expect(activatedData.is_active).toBe(true);
  });
});
