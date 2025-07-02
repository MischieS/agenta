'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Message interface
interface Message {
  id: string;
  recipient_id: string;
  recipient_name: string;
  recipient_role: string;
  subject: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

export default function AdminMessaging() {
  const { user, hasPermission } = useAuth();
  const canSendMessages = hasPermission('messaging', 'can_edit');
  
  // State variables
  const [users, setUsers] = useState<User[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [subject, setSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'students' | 'staff'>('all');
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch users and sent messages
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Fetch students from student table
      const { data: studentData, error: studentError } = await supabase
        .from('student')
        .select('id, name, email')
        .order('name');
      
      if (studentError) throw new Error(`Error fetching students: ${studentError.message}`);
      
      // Fetch staff from user table
      const { data: staffData, error: staffError } = await supabase
        .from('user')
        .select('id, name, email')
        .eq('role', 'staff')
        .order('name');
      
      if (staffError) throw new Error(`Error fetching staff: ${staffError.message}`);
      
      // Format users data with role
      const formattedStudents = studentData?.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student'
      })) || [];
      
      const formattedStaff = staffData?.map(staff => ({
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: 'staff'
      })) || [];
      
      // Combine student and staff data
      setUsers([...formattedStudents, ...formattedStaff]);

      // Fetch sent messages from the messages table
      const { data: messagesData, error: messagesError } = await supabase
        .from('message')
        .select('id, recipient_id, subject, content, timestamp, is_read')
        .order('timestamp', { ascending: false });
      
      if (messagesError) throw new Error(`Error fetching messages: ${messagesError.message}`);
      
      // Format messages with recipient information
      const formattedMessages: Message[] = [];
      
      for (const msg of messagesData || []) {
        // Determine if recipient is student or staff
        let recipient: User | undefined;
        
        // Check in students
        recipient = formattedStudents.find(s => s.id === msg.recipient_id);
        
        // If not found in students, check in staff
        if (!recipient) {
          recipient = formattedStaff.find(s => s.id === msg.recipient_id);
        }
        
        // Only add message if recipient exists
        if (recipient) {
          formattedMessages.push({
            id: msg.id,
            recipient_id: msg.recipient_id,
            recipient_name: recipient.name,
            recipient_role: recipient.role,
            subject: msg.subject,
            content: msg.content,
            timestamp: msg.timestamp,
            is_read: msg.is_read || false
          });
        }
      }
      
      setSentMessages(formattedMessages);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!selectedUser || !subject.trim() || !messageContent.trim() || !user) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setSending(true);
      setError(null);
      
      const supabase = createClient();
      const timestamp = new Date().toISOString();
      
      // Insert message into the database
      const { data: insertedMessage, error: insertError } = await supabase
        .from('message')
        .insert({
          recipient_id: selectedUser.id,
          subject,
          content: messageContent,
          timestamp,
          is_read: false,
          sender_id: user.id // Assuming user object has an id
        })
        .select('id')
        .single();
      
      if (insertError) throw new Error(`Error sending message: ${insertError.message}`);
      
      // Create a new message object for the UI
      const newMessage: Message = {
        id: insertedMessage?.id || `msg-${Date.now()}`,
        recipient_id: selectedUser.id,
        recipient_name: selectedUser.name,
        recipient_role: selectedUser.role,
        subject: subject,
        content: messageContent,
        timestamp: timestamp,
        is_read: false
      };
      
      // Add to sent messages list
      setSentMessages(prevMessages => [newMessage, ...prevMessages]);
      
      // Clear form
      setSelectedUser(null);
      setSubject('');
      setMessageContent('');
      setSending(false);
      
      // Show success message
      setSuccess(`Message sent successfully to ${selectedUser.name}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
      setSending(false);
    }
  };

  // Format timestamp to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Load users on initial render
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      (filter === 'students' && user.role === 'student') ||
      (filter === 'staff' && user.role === 'staff');
    
    return matchesSearch && matchesFilter;
  });

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Show success message
  const showSuccess = (user: User) => {
    setSuccess(`Message sent successfully to ${user.name}`);
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!selectedUser || !subject.trim() || !messageContent.trim()) return;

    try {
      setSending(true);
      setError(null);
      const supabase = createClient();
      
      // Save message to database
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user?.id,
            sender_name: user?.name || 'Admin',
            recipient_id: selectedUser.id,
            recipient_name: selectedUser.name,
            recipient_role: selectedUser.role,
            subject: subject.trim(),
            content: messageContent.trim(),
            is_read: false,
            timestamp: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      // Update local state with the new message
      if (data && data[0]) {
        const newMessage: Message = {
          id: data[0].id,
          recipient_id: data[0].recipient_id,
          recipient_name: data[0].recipient_name,
          recipient_role: data[0].recipient_role,
          subject: data[0].subject,
          content: data[0].content,
          timestamp: data[0].timestamp,
          is_read: data[0].is_read
        };

        setSentMessages(prev => [...prev, newMessage]);

        // Show success and reset form
        setSuccess(`Message sent to ${selectedUser.name} successfully!`);
        setSubject('');
        setMessageContent('');
        setSelectedUser(null);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-300">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white"
              aria-label="Dismiss error"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg text-green-300">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-300 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {canSendMessages && (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4 text-gray-100">New Message</h3>
          <div className="space-y-4">
            {/* Recipient selection */}
              <label className="block text-sm font-medium text-gray-300 mb-1">Recipient</label>
              <div className="flex space-x-4 mb-2">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('students')}
                  className={`px-3 py-1 text-sm rounded ${filter === 'students' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Students
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('staff')}
                  className={`px-3 py-1 text-sm rounded ${filter === 'staff' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Staff
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white border-gray-600"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              
              {filteredUsers.length > 0 && !selectedUser && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-600 rounded bg-gray-800">
                  {filteredUsers.map(user => (
                    <div 
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50"
                    >
                      <div className="font-medium text-gray-100">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedUser && (
                <div className="mt-2 p-3 border border-blue-600/30 rounded bg-blue-900/20 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-100">{selectedUser.name}</span>
                    <span className="text-sm text-gray-400 ml-2">{selectedUser.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Subject */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject..."
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Message content */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message..."
                  rows={5}
                  className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Send button */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!selectedUser || !subject.trim() || !messageContent.trim() || sending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Sent Messages */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-100">Sent Messages</h3>
          <div className="text-sm text-gray-400">
            {sentMessages.length} message{sentMessages.length !== 1 ? 's' : ''} sent
          </div>
        </div>
        
        {sentMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="mx-auto w-16 h-16 mb-4 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400">No messages sent yet</p>
            <p className="text-sm text-gray-500 mt-1">Your sent messages will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentMessages.map(message => (
              <div key={message.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-gray-100">{message.subject}</span>
                    <button 
                      onClick={async () => {
                        try {
                          const supabase = createClient();
                          // Update message read status in the database
                          const { error } = await supabase
                            .from('messages')
                            .update({ is_read: !message.is_read })
                            .eq('id', message.id);
                          
                          if (error) throw new Error(`Error updating message status: ${error.message}`);
                          
                          // Update local state
                          setSentMessages(prevMessages => prevMessages.map(msg => 
                            msg.id === message.id ? { ...msg, is_read: !msg.is_read } : msg
                          ));
                        } catch (err: any) {
                          console.error('Failed to update message status:', err);
                          setError('Failed to update message status');
                        }
                      }}
                      className={`ml-3 text-xs px-2 py-1 rounded-md cursor-pointer transition-colors ${
                        message.is_read 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {message.is_read ? 'Read' : 'Unread'}
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                </div>
                
                <div className="mt-2 mb-3">
                  <span className="text-sm text-gray-400">To: </span>
                  <span className="text-sm text-gray-200">{message.recipient_name}</span>
                  <span className="text-xs ml-2 px-2 py-1 rounded bg-gray-700 text-gray-300">
                    {message.recipient_role === 'student' ? 'Student' : 'Staff'}
                  </span>
                </div>
                
                <div className="text-gray-300 text-sm border-t border-gray-700 pt-3">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
