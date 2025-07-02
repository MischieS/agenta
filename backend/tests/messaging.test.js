const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test message data
const testMessage = {
  subject: 'Test Message',
  content: 'This is a test message for automated testing.',
  sender_id: null,  // Will be set dynamically
  receiver_id: null,  // Will be set dynamically
  is_read: false
};

let createdMessageId;
let testSenderId;
let testReceiverId;

describe('Messaging System Tests', () => {
  // Setup - create test users
  beforeAll(async () => {
    // Create sender user
    const { data: senderData } = await supabase.auth.signUp({
      email: `test-sender-${Date.now()}@example.com`,
      password: 'Password123!',
    });
    
    testSenderId = senderData?.user?.id;
    
    // Create receiver user
    const { data: receiverData } = await supabase.auth.signUp({
      email: `test-receiver-${Date.now()}@example.com`,
      password: 'Password123!',
    });
    
    testReceiverId = receiverData?.user?.id;
    
    // Update test message with user IDs
    testMessage.sender_id = testSenderId;
    testMessage.receiver_id = testReceiverId;
  });
  
  // Cleanup - delete test data
  afterAll(async () => {
    // Delete test message
    if (createdMessageId) {
      await supabase.from('message').delete().eq('id', createdMessageId);
    }
    
    // Delete test users
    if (testSenderId) {
      await supabase.auth.admin.deleteUser(testSenderId);
    }
    
    if (testReceiverId) {
      await supabase.auth.admin.deleteUser(testReceiverId);
    }
  });

  // Test sending a message
  test('Send a message', async () => {
    const { data, error } = await supabase
      .from('message')
      .insert([testMessage])
      .select();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data[0].subject).toBe(testMessage.subject);
    createdMessageId = data[0].id;
  });

  // Test retrieving messages for a user
  test('Get user inbox messages', async () => {
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .eq('receiver_id', testReceiverId);
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].receiver_id).toBe(testReceiverId);
  });

  // Test retrieving sent messages for a user
  test('Get user sent messages', async () => {
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .eq('sender_id', testSenderId);
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].sender_id).toBe(testSenderId);
  });

  // Test retrieving a specific message
  test('Get message by ID', async () => {
    const { data, error } = await supabase
      .from('message')
      .select('*')
      .eq('id', createdMessageId)
      .single();
    
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.id).toBe(createdMessageId);
    expect(data.subject).toBe(testMessage.subject);
    expect(data.is_read).toBe(false);
  });

  // Test marking a message as read
  test('Mark message as read', async () => {
    const { error } = await supabase
      .from('message')
      .update({ is_read: true })
      .eq('id', createdMessageId);
    
    expect(error).toBeNull();

    // Verify the update
    const { data, error: fetchError } = await supabase
      .from('message')
      .select('*')
      .eq('id', createdMessageId)
      .single();
    
    expect(fetchError).toBeNull();
    expect(data.is_read).toBe(true);
  });

  // Test counting unread messages
  test('Count unread messages', async () => {
    // Create another unread message
    await supabase
      .from('message')
      .insert([{
        subject: 'Another Test Message',
        content: 'This is another test message.',
        sender_id: testSenderId,
        receiver_id: testReceiverId,
        is_read: false
      }]);
    
    // Count unread messages
    const { count, error } = await supabase
      .from('message')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', testReceiverId)
      .eq('is_read', false);
    
    expect(error).toBeNull();
    expect(count).toBeGreaterThan(0);
  });

  // Test deleting a message
  test('Delete message', async () => {
    const { error } = await supabase
      .from('message')
      .delete()
      .eq('id', createdMessageId);
    
    expect(error).toBeNull();

    // Verify deletion
    const { data, error: fetchError } = await supabase
      .from('message')
      .select('*')
      .eq('id', createdMessageId);
    
    expect(fetchError).toBeNull();
    expect(data.length).toBe(0);
  });
});
