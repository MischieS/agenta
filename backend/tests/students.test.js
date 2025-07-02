const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test student for testing purposes
const testStudent = {
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane.smith@example.com',
  phone: '987-654-3210',
  student_id: 'STU12345',
  university_id: null, // Will be set dynamically
  is_active: true
};

let createdStudentId;
let testUniversityId;

describe('Student Management Tests', () => {
  // Setup - create test university
  beforeAll(async () => {
    // Create a test university
    const { data: uniData } = await supabase
      .from('university')
      .insert([{ name: 'Test University for Students', is_active: true }])
      .select();
    
    testUniversityId = uniData[0]?.id;
    
    // Update test student with university ID
    testStudent.university_id = testUniversityId;
  });
  
  // Cleanup - delete test data
  afterAll(async () => {
    // Delete test student
    if (createdStudentId) {
      await supabase.from('student').delete().eq('id', createdStudentId);
    }
    
    // Delete test university
    if (testUniversityId) {
      await supabase.from('university').delete().eq('id', testUniversityId);
    }
  });

  // Test creating a student
  test('Create a student', async () => {
    const { data, error } = await supabase
      .from('student')
      .insert([testStudent])
      .select();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data[0].email).toBe(testStudent.email);
    createdStudentId = data[0].id;
  });

  // Test retrieving students
  test('Get all students', async () => {
    const { data, error } = await supabase
      .from('student')
      .select('*, university:university_id(name)');
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    // Check that we're getting university data
    const testStudentRecord = data.find(student => student.id === createdStudentId);
    expect(testStudentRecord).toBeDefined();
    expect(testStudentRecord.university).toBeDefined();
  });

  // Test retrieving a specific student
  test('Get student by ID', async () => {
    const { data, error } = await supabase
      .from('student')
      .select('*, university:university_id(name)')
      .eq('id', createdStudentId)
      .single();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.id).toBe(createdStudentId);
    expect(data.email).toBe(testStudent.email);
    expect(data.university.name).toBe('Test University for Students');
  });

  // Test updating a student
  test('Update student', async () => {
    const updatedEmail = 'updated.jane.smith@example.com';
    const { error } = await supabase
      .from('student')
      .update({ email: updatedEmail })
      .eq('id', createdStudentId);
    
    expect(error).toBeNull();

    // Verify the update
    const { data, error: fetchError } = await supabase
      .from('student')
      .select('*')
      .eq('id', createdStudentId)
      .single();
    
    expect(fetchError).toBeNull();
    expect(data.email).toBe(updatedEmail);
  });

  // Test searching for students by name or ID
  test('Search students', async () => {
    // Search by first name
    const { data: firstNameResults } = await supabase
      .from('student')
      .select('*')
      .ilike('first_name', '%Jane%');
    
    expect(firstNameResults).not.toBeNull();
    expect(firstNameResults.some(s => s.id === createdStudentId)).toBe(true);

    // Search by student ID
    const { data: idResults } = await supabase
      .from('student')
      .select('*')
      .ilike('student_id', '%12345%');
    
    expect(idResults).not.toBeNull();
    expect(idResults.some(s => s.id === createdStudentId)).toBe(true);
  });

  // Test activating/deactivating a student
  test('Toggle student active status', async () => {
    // Deactivate the student
    const { error: deactivateError } = await supabase
      .from('student')
      .update({ is_active: false })
      .eq('id', createdStudentId);
    
    expect(deactivateError).toBeNull();

    // Verify deactivation
    let { data: deactivatedData } = await supabase
      .from('student')
      .select('*')
      .eq('id', createdStudentId)
      .single();
    
    expect(deactivatedData.is_active).toBe(false);

    // Activate the student
    const { error: activateError } = await supabase
      .from('student')
      .update({ is_active: true })
      .eq('id', createdStudentId);
    
    expect(activateError).toBeNull();

    // Verify activation
    let { data: activatedData } = await supabase
      .from('student')
      .select('*')
      .eq('id', createdStudentId)
      .single();
    
    expect(activatedData.is_active).toBe(true);
  });
});
