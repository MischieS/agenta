const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test document for testing purposes
const testDocument = {
  name: 'Test Document',
  file_path: 'test-documents/test-doc.pdf',
  file_type: 'pdf',
  file_size: 1024, // in bytes
  status: 'approved',
  user_id: null, // Will be set dynamically
  document_type: 'id_verification'
};

let createdDocumentId;
let testUserId;

describe('User Documents Management Tests', () => {
  // Setup - create test user
  beforeAll(async () => {
    // Create a test user
    const { data: userData } = await supabase.auth.signUp({
      email: `test-docs-${Date.now()}@example.com`,
      password: 'Password123!',
    });
    
    testUserId = userData?.user?.id;
    
    // Update test document with user ID
    testDocument.user_id = testUserId;
  });
  
  // Cleanup - delete test data
  afterAll(async () => {
    // Delete test document
    if (createdDocumentId) {
      await supabase.from('user_document').delete().eq('id', createdDocumentId);
    }
    
    // Delete test user
    if (testUserId) {
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  // Test creating a document
  test('Create a user document', async () => {
    const { data, error } = await supabase
      .from('user_document')
      .insert([testDocument])
      .select();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data[0].name).toBe(testDocument.name);
    createdDocumentId = data[0].id;
  });

  // Test retrieving all documents
  test('Get all user documents', async () => {
    const { data, error } = await supabase
      .from('user_document')
      .select('*');
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  // Test retrieving a specific document
  test('Get user document by ID', async () => {
    const { data, error } = await supabase
      .from('user_document')
      .select('*')
      .eq('id', createdDocumentId)
      .single();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.id).toBe(createdDocumentId);
    expect(data.name).toBe(testDocument.name);
  });

  // Test retrieving documents for a specific user
  test('Get documents for a specific user', async () => {
    const { data, error } = await supabase
      .from('user_document')
      .select('*')
      .eq('user_id', testUserId);
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].user_id).toBe(testUserId);
  });

  // Test updating a document
  test('Update user document', async () => {
    const updatedName = 'Updated Test Document';
    const updatedStatus = 'rejected';
    
    const { error } = await supabase
      .from('user_document')
      .update({ 
        name: updatedName,
        status: updatedStatus 
      })
      .eq('id', createdDocumentId);
    
    expect(error).toBeNull();

    // Verify the update
    const { data, error: fetchError } = await supabase
      .from('user_document')
      .select('*')
      .eq('id', createdDocumentId)
      .single();
    
    expect(fetchError).toBeNull();
    expect(data.name).toBe(updatedName);
    expect(data.status).toBe(updatedStatus);
  });

  // Test filtering documents by status
  test('Filter documents by status', async () => {
    const { data, error } = await supabase
      .from('user_document')
      .select('*')
      .eq('status', 'rejected');
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some(doc => doc.id === createdDocumentId)).toBe(true);
  });

  // Test filtering documents by document type
  test('Filter documents by document type', async () => {
    const { data, error } = await supabase
      .from('user_document')
      .select('*')
      .eq('document_type', 'id_verification');
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.some(doc => doc.id === createdDocumentId)).toBe(true);
  });

  // Test deleting a document
  test('Delete user document', async () => {
    const { error } = await supabase
      .from('user_document')
      .delete()
      .eq('id', createdDocumentId);
    
    expect(error).toBeNull();

    // Verify deletion
    const { data, error: fetchError } = await supabase
      .from('user_document')
      .select('*')
      .eq('id', createdDocumentId);
    
    expect(fetchError).toBeNull();
    expect(data.length).toBe(0);
  });
});
