'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type MessageBubbleProps = {
  content: string;
  isCurrentUser: boolean;
  senderName: string;
  timestamp: string;
  showAvatar?: boolean;
  showHeader?: boolean;
  className?: string;
};

export function MessageBubble({
  content,
  isCurrentUser,
  senderName,
  timestamp,
  showAvatar = true,
  showHeader = true,
  className,
}: MessageBubbleProps) {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex w-full',
        isCurrentUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      {!isCurrentUser && showAvatar && (
        <div className="flex-shrink-0 mr-2 self-end mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-900/30 text-blue-300">
              {senderName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className={cn('flex flex-col max-w-[80%]', isCurrentUser ? 'items-end' : 'items-start')}>
        {showHeader && !isCurrentUser && (
          <div className="flex items-center mb-1">
            <span className="text-xs font-medium text-gray-300">{senderName}</span>
            <span className="mx-2 text-gray-500">·</span>
            <span className="text-xs text-gray-400">{formattedTime}</span>
          </div>
        )}
        
        <motion.div
          layout
          className={cn(
            'px-4 py-2 rounded-2xl text-sm',
            isCurrentUser
              ? 'bg-blue-600 text-white rounded-tr-none hover:bg-blue-700'
              : 'bg-gray-800 text-gray-100 rounded-tl-none hover:bg-gray-700',
            'shadow-sm',
            'transition-colors duration-200',
            'relative',
            'break-words'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content}
          {isCurrentUser && (
            <div className="absolute -bottom-1 right-0 w-3 h-3 overflow-hidden">
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 transform -rotate-45 origin-bottom-right" />
            </div>
          )}
          {!isCurrentUser && (
            <div className="absolute -bottom-1 left-0 w-3 h-3 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-gray-800 transform -rotate-45 origin-bottom-left" />
            </div>
          )}
        </motion.div>
        
        {isCurrentUser && (
          <div className="mt-1 flex items-center justify-end">
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
