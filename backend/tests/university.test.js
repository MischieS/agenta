const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test university created for testing purposes
const testUniversity = {
  name: 'Test University',
  email: 'test@university.edu',
  phone: '123-456-7890',
  address: '123 Campus Dr',
  website: 'https://test-university.edu',
  is_active: true
};

let createdUniversityId;

describe('University Management Tests', () => {
  // Test creating a university
  test('Create a university', async () => {
    const { data, error } = await supabase
      .from('university')
      .insert([testUniversity])
      .select();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data[0].name).toBe(testUniversity.name);
    createdUniversityId = data[0].id;
  });

  // Test retrieving universities
  test('Get all universities', async () => {
    const { data, error } = await supabase
      .from('university')
      .select('*');
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  // Test retrieving a specific university
  test('Get university by ID', async () => {
    const { data, error } = await supabase
      .from('university')
      .select('*')
      .eq('id', createdUniversityId)
      .single();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.id).toBe(createdUniversityId);
    expect(data.name).toBe(testUniversity.name);
  });

  // Test updating a university
  test('Update university', async () => {
    const updatedName = 'Updated Test University';
    const { error } = await supabase
      .from('university')
      .update({ name: updatedName })
      .eq('id', createdUniversityId);
    
    expect(error).toBeNull();

    // Verify the update
    const { data, error: fetchError } = await supabase
      .from('university')
      .select('*')
      .eq('id', createdUniversityId)
      .single();
    
    expect(fetchError).toBeNull();
    expect(data.name).toBe(updatedName);
  });

  // Test activating/deactivating a university
  test('Toggle university active status', async () => {
    // Deactivate the university
    const { error: deactivateError } = await supabase
      .from('university')
      .update({ is_active: false })
      .eq('id', createdUniversityId);
    
    expect(deactivateError).toBeNull();

    // Verify deactivation
    let { data: deactivatedData } = await supabase
      .from('university')
      .select('*')
      .eq('id', createdUniversityId)
      .single();
    
    expect(deactivatedData.is_active).toBe(false);

    // Activate the university
    const { error: activateError } = await supabase
      .from('university')
      .update({ is_active: true })
      .eq('id', createdUniversityId);
    
    expect(activateError).toBeNull();

    // Verify activation
    let { data: activatedData } = await supabase
      .from('university')
      .select('*')
      .eq('id', createdUniversityId)
      .single();
    
    expect(activatedData.is_active).toBe(true);
  });

  // Test deleting a university
  test('Delete university', async () => {
    const { error } = await supabase
      .from('university')
      .delete()
      .eq('id', createdUniversityId);
    
    expect(error).toBeNull();

    // Verify deletion
    const { data, error: fetchError } = await supabase
      .from('university')
      .select('*')
      .eq('id', createdUniversityId);
    
    expect(fetchError).toBeNull();
    expect(data.length).toBe(0);
  });
});
