'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { ChatListItem, type ChatListItemProps } from './chat-list-item';
import { cn } from '@/lib/utils';

type ChatListProps = {
  chats: Omit<ChatListItemProps, 'onClick' | 'isActive'>[];
  onChatSelect: (id: string) => void;
  activeChatId?: string | null;
  loading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
};

export function ChatList({
  chats,
  onChatSelect,
  activeChatId,
  loading = false,
  emptyState,
  className,
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter chats based on search term and filter
  const filteredChats = chats.filter(chat => {
    const matchesSearch = 
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && chat.unreadCount > 0);
    
    return matchesSearch && matchesFilter;
  });

  // Handle scroll for shadow effect
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      setIsScrolled(scrollTop > 10);
    }
  };

  // Add scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Default empty state
  const defaultEmptyState = (
    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
      <div className="bg-gray-800 p-4 rounded-full mb-3">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-100 mb-1">
        {searchTerm ? 'No matches found' : 'No conversations yet'}
      </h3>
      <p className="text-sm text-gray-400">
        {searchTerm 
          ? 'Try adjusting your search or filter to find what you\'re looking for.'
          : 'Start a new conversation or check back later.'}
      </p>
    </div>
  );

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search and filter bar */}
      <div 
        className={cn(
          'sticky top-0 z-10 bg-gray-800 pt-4 pb-3 px-4 transition-shadow',
          isScrolled && 'shadow-sm border-b border-gray-700'
        )}
      >
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-gray-700 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap',
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            )}
          >
            All Chats
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap flex items-center',
              filter === 'unread' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            )}
          >
            Unread
            {chats.some(chat => chat.unreadCount > 0) && (
              <span className="ml-1.5 bg-blue-900/50 text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">
                {chats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Chat list */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-4 bg-gray-900"
      >
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-800 animate-pulse h-24" />
            ))}
          </div>
        ) : filteredChats.length > 0 ? (
          <motion.div 
            layout
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence>
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChatListItem
                    id={chat.id}
                    name={chat.name}
                    email={chat.email}
                    role={chat.role}
                    lastMessage={chat.lastMessage}
                    lastMessageTime={chat.lastMessageTime}
                    unreadCount={chat.unreadCount}
                    isActive={activeChatId === chat.id}
                    onClick={onChatSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="h-full flex items-center justify-center">
            {emptyState || defaultEmptyState}
          </div>
        )}
      </div>
    </div>
  );
}
