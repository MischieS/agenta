'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ChatHeaderProps = {
  title: string;
  subtitle?: string;
  avatarInitial?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
};

export function ChatHeader({
  title,
  subtitle,
  avatarInitial,
  onBack,
  showBackButton = true,
  className,
}: ChatHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center justify-between p-4 border-b border-gray-800',
        'bg-gray-900/80 backdrop-blur-sm',
        'sticky top-0 z-10',
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        )}
        
        {avatarInitial && (
          <Avatar className="h-10 w-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-blue-900/30 text-blue-300">
              {avatarInitial.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex flex-col">
          <h2 className="font-semibold text-gray-100">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-9 w-9 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
      >
        <MoreVertical className="h-5 w-5" />
        <span className="sr-only">More options</span>
      </Button>
    </motion.div>
  );
}
