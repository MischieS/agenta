'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';

type StaffAssignmentModalProps = {
  studentId: string;
  open: boolean;
  onClose: () => void;
  onAssign: (staffId: string) => Promise<void>;
};

export function StaffAssignmentModal({ 
  studentId, 
  open, 
  onClose, 
  onAssign 
}: StaffAssignmentModalProps) {
  const [staffId, setStaffId] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleAssign = async () => {
    if (!staffId) return;
    
    try {
      setLoading(true);
      await onAssign(staffId);
      onClose();
    } catch (error) {
      console.error('Assignment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Staff to Student</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input 
            placeholder="Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
          />
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={loading}>
              {loading ? 'Assigning...' : 'Assign'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
