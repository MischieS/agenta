import { ColumnDef } from '@tanstack/react-table';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'degreeType',
    header: 'Degree',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      const colorMap = {
        pending: 'bg-yellow-100 text-yellow-800',
        reviewed: 'bg-blue-100 text-blue-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
      };
      return (
        <span className={`px-2 py-1 rounded-md text-xs ${colorMap[status as keyof typeof colorMap]}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.alert(`Assign staff to ${student.name}`)}
          >
            Assign
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.alert(`Message ${student.name}`)}
          >
            Message
          </Button>
        </div>
      );
    },
  },
];
