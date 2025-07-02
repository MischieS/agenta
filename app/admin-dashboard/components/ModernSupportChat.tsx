'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ChatList } from '@/components/chat/chat-list';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageBubble } from '@/components/chat/message-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, X, Loader2 } from 'lucide-react';

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

export default function ModernSupportChat() {
  const { user, hasPermission } = useAuth();
  const canEdit = hasPermission('support_chat', 'can_edit');
  
  // State variables
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowChatList(!activeChat);
      } else {
        setShowChatList(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [activeChat]);

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
            user_id: staffData.id,
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
      setLoading(true);
      const supabase = createClient();
      
      // Find the chat in the chats array
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setActiveChat(chat);
        if (isMobile) setShowChatList(false);
      } else {
        throw new Error('Chat not found');
      }
      
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
        
        // Check if sender is the current user
        if (user && message.sender_id === user.id) {
          senderName = user.name || user.email;
          senderRole = user.role;
        } else {
          // Use the chat user info for the other participant
          senderName = chat.user_name;
          senderRole = chat.user_role;
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
      
      // Mark unread messages as read
      if (user && formattedMessages.some(msg => !msg.is_read && msg.sender_id !== user.id)) {
        await supabase
          .from('support_chat_message')
          .update({ is_read: true })
          .eq('chat_id', chatId)
          .neq('sender_id', user.id)
          .eq('is_read', false);
        
        // Update chat unread count
        await supabase
          .from('support_chat')
          .update({ unread_count: 0 })
          .eq('id', chatId);
        
        // Update local state
        setChats(prevChats => 
          prevChats.map(c => 
            c.id === chatId ? { ...c, unread_count: 0 } : c
          )
        );
      }
      
      // Scroll to bottom of messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!activeChat || !newMessage.trim() || !user) return;
    
    try {
      setSending(true);
      const supabase = createClient();
      const timestamp = new Date().toISOString();
      
      // Create a new message in the database
      const { data: newMessageData, error: messageError } = await supabase
        .from('support_chat_message')
        .insert({
          chat_id: activeChat.id,
          sender_id: user.id,
          content: newMessage,
          timestamp: timestamp,
          is_read: true
        })
        .select('id')
        .single();
      
      if (messageError) throw new Error(`Error sending message: ${messageError.message}`);
      
      // Update the chat with last message info
      await supabase
        .from('support_chat')
        .update({
          last_message: newMessage,
          last_message_time: timestamp,
          unread_count: 0
        })
        .eq('id', activeChat.id);
      
      // Create a new message object for state
      const newMessageObj: Message = {
        id: newMessageData.id,
        sender_id: user.id,
        sender_name: user.name || user.email,
        sender_role: user.role,
        content: newMessage,
        timestamp: timestamp,
        is_read: true
      };
      
      // Update state
      setMessages(prev => [...prev, newMessageObj]);
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat.id 
            ? {
                ...chat,
                last_message: newMessage,
                last_message_time: timestamp,
                unread_count: 0
              }
            : chat
        )
      );
      
      // Clear input
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Load chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Format timestamp for MessageBubble
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach((message: Message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };

  // Handle sending a new message
  const handleSendMessage = (messageContent: string) => {
    if (!messageContent.trim() || !activeChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || '',
      sender_name: user?.email?.split('@')[0] || 'User',
      sender_role: user?.role || 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      is_read: false
    };
    
    // Add the message to the UI immediately for better UX
    setMessages(prev => [...prev, newMessage]);
    
    // Here you would typically send the message to your backend
    // For now, we'll just log it
    console.log('Sending message:', newMessage);
    
    // Clear the input
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Format chat list items for the ChatList component
  const chatListItems = chats.map(chat => ({
    id: chat.id,
    name: chat.user_name,
    email: chat.user_email,
    role: chat.user_role,
    lastMessage: chat.last_message,
    lastMessageTime: chat.last_message_time,
    unreadCount: chat.unread_count
  }));

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-gray-900 rounded-xl shadow-sm overflow-hidden">
      {/* Error message */}
      <AnimatePresence>
        {(showChatList || !isMobile) && (
          <motion.div 
            initial={isMobile ? { x: '-100%' } : {}}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', ease: 'easeInOut' }}
            className={cn(
              'w-full md:w-96 border-r border-gray-700 bg-gray-800 flex flex-col',
              isMobile ? 'absolute inset-0 z-10 bg-gray-800' : 'relative'
            )}
          >
            <ChatList
              chats={chatListItems}
              onChatSelect={(id) => fetchMessages(id)}
              activeChatId={activeChat?.id}
              loading={loading && chats.length === 0}
              emptyState={
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No conversations yet
                  </h3>
                  <p className="text-sm text-gray-500">
                    Start a new conversation or check back later.
                  </p>
                </div>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <div className={cn(
        'flex-1 flex flex-col',
        isMobile && !showChatList ? 'flex' : 'hidden md:flex',
        'bg-gray-900'
      )}>
        {activeChat ? (
          <>
            <div className="border-b border-gray-700 p-4 bg-gray-800">
              <div className="flex items-center">
                {isMobile && (
                  <button
                    onClick={() => setShowChatList(true)}
                    className="mr-2 p-1 rounded-full hover:bg-gray-700 text-gray-300"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-100 font-medium">
                    {activeChat.user_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-100">
                      {activeChat.user_name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {activeChat.user_role}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {groupMessagesByDate().map(({ date, messages: dateMessages }) => (
                        <div key={date} className="mb-4">
                          <div className="text-center mb-2">
                            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          {dateMessages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className={cn(
                                'flex',
                                message.sender_id === user?.id ? 'justify-end' : 'justify-start',
                                index < dateMessages.length - 1 ? 'mb-1' : 'mb-4'
                              )}
                            >
                              <div 
                                className={cn(
                                  'max-w-xs md:max-w-md rounded-lg px-4 py-2',
                                  message.sender_id === user?.id 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-gray-800 text-gray-100 rounded-bl-none'
                                )}
                              >
                                <div className="text-sm">{message.content}</div>
                                <div className={cn(
                                  'text-xs mt-1 text-right',
                                  message.sender_id === user?.id ? 'text-blue-200' : 'text-gray-400'
                                )}>
                                  {formatTimestamp(message.timestamp)}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t border-gray-700 p-4">
                <ChatInput
                  onSend={handleSendMessage}
                  disabled={sending}
                  placeholder="Type a message..."
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-gray-700 p-4 rounded-full mb-3">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-1">
              Select a conversation
            </h3>
            <p className="text-sm text-gray-400">
              Choose a chat from the list to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
