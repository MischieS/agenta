export type User = {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  degreeType: string;
  selectedDepartments: string[];
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  assignedStaffId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Message = {
  id: string;
  studentId: string;
  staffId?: string;
  content: string;
  isFromStaff: boolean;
  createdAt: Date;
};
