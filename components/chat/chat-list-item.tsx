'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type ChatListItemProps = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive?: boolean;
  onClick: (id: string) => void;
  className?: string;
};

export function ChatListItem({
  id,
  name,
  email,
  role,
  lastMessage,
  lastMessageTime,
  unreadCount,
  isActive = false,
  onClick,
  className,
}: ChatListItemProps) {
  const formattedTime = new Date(lastMessageTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(id)}
      className={cn(
        'p-3 rounded-xl cursor-pointer transition-colors',
        'flex items-start space-x-3',
        isActive 
          ? 'bg-blue-900/20 border-blue-700' 
          : 'bg-gray-800 hover:bg-gray-700/80 border border-transparent hover:border-gray-600',
        'shadow-sm',
        className
      )}
    >
      <Avatar className="h-11 w-11 flex-shrink-0">
        <AvatarImage src="" alt={name} />
        <AvatarFallback className="bg-blue-900/30 text-blue-300">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-100 truncate">{name}</h3>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formattedTime}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-gray-400 truncate">
            {lastMessage.length > 40 
              ? `${lastMessage.substring(0, 40)}...` 
              : lastMessage}
          </p>
          
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="h-5 min-w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="mt-1">
          <Badge 
            variant={role === 'student' ? 'default' : 'secondary'}
            className="text-xs bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            {role === 'student' ? 'Student' : 'Staff'}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
