'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

type ChatInputProps = {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function ChatInput({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  className = '',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  // Auto-focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'pr-12 py-6 text-base rounded-2xl',
            'border-2 transition-all duration-200',
            isFocused 
              ? 'border-blue-400 ring-2 ring-blue-900/30' 
              : 'border-gray-700 bg-gray-800 text-white',
            'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'placeholder:text-gray-500',
            'focus:bg-gray-700',
            'text-white'
          )}
        />
        <AnimatePresence>
          {(message || isFocused) && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-2"
            >
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || disabled}
                className={cn(
                  'h-9 w-9 rounded-full',
                  'transition-all duration-200',
                  'hover:scale-105 active:scale-95',
                  'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0',
                  'shadow-md',
                  'bg-blue-600 hover:bg-blue-700',
                  'text-white',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'hover:bg-blue-500'
                )}
              >
                <PaperPlaneIcon className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
