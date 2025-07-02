'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';

type Message = {
  id: string;
  content: string;
  is_from_staff: boolean;
  created_at: string;
};

type StudentMessagingModalProps = {
  studentId: string;
  open: boolean;
  onClose: () => void;
};

export function StudentMessagingModal({ 
  studentId, 
  open, 
  onClose 
}: StudentMessagingModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchMessages();
    }
  }, [open]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/messages`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/students/${studentId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          content: newMessage,
          isFromStaff: true
        })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Messages with Student</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 mb-4">
          <div className="space-y-2">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`p-3 rounded-lg ${message.is_from_staff ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`}
              >
                <p>{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
