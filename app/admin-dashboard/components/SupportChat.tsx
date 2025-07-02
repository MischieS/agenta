'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

// Message interface
interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

// Chat interface representing a conversation
interface Chat {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export default function SupportChat() {
  const { user, hasPermission } = useAuth();
  const canEdit = hasPermission('support_chat', 'can_edit');
  
  // State variables
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat list
  const fetchChats = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Fetch support chats
      const { data: chatData, error: chatError } = await supabase
        .from('support_chat')
        .select('id, user_id, last_message, last_message_time, unread_count')
        .order('last_message_time', { ascending: false });
      
      if (chatError) throw new Error(`Error fetching support chats: ${chatError.message}`);
      
      // Fetch user data for each chat
      const formattedChats: Chat[] = [];
      
      for (const chat of chatData || []) {
        // First check if user is a student
        let { data: studentData } = await supabase
          .from('student')
          .select('id, name, email')
          .eq('id', chat.user_id)
          .single();
        
        if (studentData) {
          formattedChats.push({
            id: chat.id,
            user_id: chat.user_id,
            user_name: studentData.name,
            user_email: studentData.email,
            user_role: 'student',
            last_message: chat.last_message,
            last_message_time: chat.last_message_time,
            unread_count: chat.unread_count || 0
          });
          continue;
        }
        
        // If not a student, check if user is staff
        let { data: staffData } = await supabase
          .from('user')
          .select('id, name, email')
          .eq('id', chat.user_id)
          .single();
        
        if (staffData) {
          formattedChats.push({
            id: chat.id,
            user_id: chat.user_id,
            user_name: staffData.name,
            user_email: staffData.email,
            user_role: 'staff',
            last_message: chat.last_message,
            last_message_time: chat.last_message_time,
            unread_count: chat.unread_count || 0
          });
        }
      }

      setChats(formattedChats);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch chats:', err);
      setError('Failed to load chat list');
      setLoading(false);
    }
  };

  // Fetch messages for a specific chat
  const fetchMessages = async (chatId: string) => {
    try {
      const supabase = createClient();
      
      // Fetch messages for this chat
      const { data: messageData, error: messageError } = await supabase
        .from('support_chat_message')
        .select('id, sender_id, content, timestamp, is_read')
        .eq('chat_id', chatId)
        .order('timestamp', { ascending: true });
      
      if (messageError) throw new Error(`Error fetching chat messages: ${messageError.message}`);
      
      // Format messages with sender information
      const formattedMessages: Message[] = [];
      
      for (const message of messageData || []) {
        let senderName = '';
        let senderRole = '';
        
        // Check if sender is admin (current user)
        if (user && message.sender_id === user.id) {
          senderName = `${user.name || ''} ${user.surname || ''}`.trim() || user.email;
          senderRole = user.role;
        } else {
          // Check if sender is a student
          let { data: studentData } = await supabase
            .from('student')
            .select('name')
            .eq('id', message.sender_id)
            .single();
          
          if (studentData) {
            senderName = studentData.name;
            senderRole = 'student';
          } else {
            // Check if sender is staff
            let { data: staffData } = await supabase
              .from('user')
              .select('name')
              .eq('id', message.sender_id)
              .single();
            
            if (staffData) {
              senderName = staffData.name;
              senderRole = 'staff';
            }
          }
        }
        
        formattedMessages.push({
          id: message.id,
          sender_id: message.sender_id,
          sender_name: senderName,
          sender_role: senderRole,
          content: message.content,
          timestamp: message.timestamp,
          is_read: message.is_read
        });
      }

      setMessages(formattedMessages);
      
      // Mark unread messages as read in database
      if (user && formattedMessages.some(msg => !msg.is_read && msg.sender_id !== user.id)) {
        await supabase
          .from('support_chat_message')
          .update({ is_read: true })
          .eq('chat_id', chatId)
          .neq('sender_id', user.id)
          .eq('is_read', false);
      }
      
      // Update chat unread count in database
      await supabase
        .from('support_chat')
        .update({ unread_count: 0 })
        .eq('id', chatId);
      
      // Mark chat as read in the local state
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId ? { ...chat, unread_count: 0 } : chat
        )
      );
      
      // Scroll to bottom of messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!activeChat || !newMessage.trim() || !user) return;
    
    try {
      const supabase = createClient();
      
      // Get the current timestamp
      const timestamp = new Date().toISOString();
      
      // Create a new message in the database
      const { data: newMessageData, error: messageError } = await supabase
        .from('support_chat_message')
        .insert({
          chat_id: activeChat,
          sender_id: user.id,
          content: newMessage,
          timestamp: timestamp,
          is_read: false
        })
        .select('id')
        .single();
      
      if (messageError) throw new Error(`Error sending message: ${messageError.message}`);
      
      // Update the support chat with last message info
      const { error: chatError } = await supabase
        .from('support_chat')
        .update({
          last_message: newMessage,
          last_message_time: timestamp,
          unread_count: 1
        })
        .eq('id', activeChat);
      
      if (chatError) throw new Error(`Error updating chat: ${chatError.message}`);
      
      // Create a new message object for state
      const newMessageObj: Message = {
        id: newMessageData.id,
        sender_id: user.id,
        sender_name: `${user.name || ''} ${user.surname || ''}`.trim() || user.email,
        sender_role: user.role,
        content: newMessage,
        timestamp: timestamp,
        is_read: false
      };
      
      // Add to messages list
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      
      // Update chat list with new last message
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat 
            ? {
                ...chat,
                last_message: newMessage,
                last_message_time: new Date().toISOString()
              }
            : chat
        )
      );
      
      // Clear input
      setNewMessage('');
      
      // Scroll to bottom of messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    }
  };

  // Load chats on initial render
  useEffect(() => {
    fetchChats();
  }, []);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
    }
  }, [activeChat]);

  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message grouping
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && chats.length === 0) {
    return <div className="flex justify-center p-8"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-lg shadow">
      {error && (
        <div className="p-4 m-4 bg-red-50 border border-red-300 rounded text-red-700">
          {error}
          <button 
            className="ml-2 text-red-900 hover:underline"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No conversations match your search' : 'No conversations yet'}
              </div>
            ) : (
              filteredChats.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${activeChat === chat.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg">
                        {chat.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{chat.user_name}</div>
                        <div className="text-xs text-gray-500">{chat.user_email}</div>
                        <div className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 inline-block mt-1">
                          {chat.user_role === 'student' ? 'Student' : 'Staff'}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(chat.last_message_time).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 line-clamp-1">{chat.last_message}</div>
                  {chat.unread_count > 0 && (
                    <div className="mt-1 flex justify-end">
                      <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                        {chat.unread_count} new
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                {chats.find(chat => chat.id === activeChat) && (
                  <>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg">
                        {chats.find(chat => chat.id === activeChat)?.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{chats.find(chat => chat.id === activeChat)?.user_name}</div>
                        <div className="text-xs text-gray-500">{chats.find(chat => chat.id === activeChat)?.user_email}</div>
                      </div>
                    </div>
                    <div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500">No messages yet</div>
                ) : (
                  <>
                    {/* Group messages by date */}
                    {messages.map((message, index) => {
                      const isFirstMessage = index === 0;
                      const isPreviousSameSender = !isFirstMessage && messages[index - 1].sender_id === message.sender_id;
                      const showDateHeader = isFirstMessage || 
                        formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
                      
                      return (
                        <React.Fragment key={message.id}>
                          {showDateHeader && (
                            <div className="flex justify-center my-2">
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                          )}
                          
                          <div className={`flex ${message.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] ${isPreviousSameSender ? 'ml-12' : ''}`}>
                              {(!isPreviousSameSender && message.sender_role !== 'admin') && (
                                <div className="flex items-center mb-1">
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
                                    {message.sender_name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="ml-2 text-sm font-medium">{message.sender_name}</span>
                                </div>
                              )}
                              <div 
                                className={`p-3 rounded-lg ${
                                  message.sender_role === 'admin' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {message.content}
                                <div className={`text-xs mt-1 ${message.sender_role === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {formatTime(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              {/* Message input */}
              {canEdit && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
