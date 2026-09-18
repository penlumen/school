'use client';

import {useMemo, useState} from 'react';
import {toast} from 'sonner';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    MoreVertical,
    Pencil,
    Search,
    Trash2,
} from 'lucide-react';

import {useStudent} from '@/hooks/student';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type {StudentRecord} from '@/components/app/student-form-sheet';

const PAGE_SIZE = 10;

interface StudentsTableProps {
    students: StudentRecord[];
    onView: (student: StudentRecord) => void;
    onEdit: (student: StudentRecord) => void;
    fetchData: () => void;
}

export function StudentsTable({students, onView, onEdit, fetchData}: StudentsTableProps) {
    const {remove} = useStudent();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pendingDelete, setPendingDelete] = useState<StudentRecord | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filtered = useMemo(() => {
        return students.filter((student) => {
            const matchesSearch =
                !search ||
                student.name.toLowerCase().includes(search.toLowerCase()) ||
                student.reg_number?.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = !statusFilter || student.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [students, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleExportCsv = () => {
        const rows = [
            ['Name', 'Reg Number', 'Parent', 'Gender', 'Class', 'Status'],
            ...filtered.map((s) => [
                s.name,
                s.reg_number,
                s.parent?.name || '',
                s.gender || '',
                s.class?.name || '',
                s.status,
            ]),
        ];
        const csv = rows.map((row) => row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'students.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            const response = await remove(pendingDelete.uuid);
            if (response.success) {
                toast.success('Student deleted successfully');
            } else {
                toast.error(response.message || 'Failed to delete student');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete student');
        } finally {
            setDeleting(false);
            setPendingDelete(null);
            fetchData();
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='relative w-full sm:max-w-xs'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground'/>
                    <Input
                        placeholder='Search'
                        className='pl-8'
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant='outline' size='sm'>
                                <Filter className='h-4 w-4'/>
                                Filters
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align='end' className='w-44 space-y-1'>
                            <p className='text-xs font-medium text-muted-foreground px-2 pb-1'>Status</p>
                            {[null, 'active', 'inactive'].map((option) => (
                                <Button
                                    key={option ?? 'all'}
                                    variant={statusFilter === option ? 'secondary' : 'ghost'}
                                    size='sm'
                                    className='w-full justify-start capitalize'
                                    onClick={() => setStatusFilter(option)}
                                >
                                    {option ?? 'All'}
                                </Button>
                            ))}
                        </PopoverContent>
                    </Popover>
                    <Button variant='outline' size='sm' onClick={handleExportCsv}>
                        <Download className='h-4 w-4'/>
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className='overflow-x-auto rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pageItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                                    No students found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageItems.map((student) => (
                                <TableRow key={student.uuid}>
                                    <TableCell className='font-medium'>
                                        <button
                                            onClick={() => onView(student)}
                                            className='flex items-center gap-2 text-left hover:underline'
                                        >
                                            <Avatar className='h-8 w-8'>
                                                <AvatarImage src={student.avatar || ''} alt={student.name}/>
                                                <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            {student.name}
                                        </button>
                                    </TableCell>
                                    <TableCell>{student.parent?.name || '—'}</TableCell>
                                    <TableCell>{student.gender || '—'}</TableCell>
                                    <TableCell>{student.class?.name || '—'}</TableCell>
                                    <TableCell>
                                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className='capitalize'>
                                            {student.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon'>
                                                    <MoreVertical className='h-4 w-4'/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => onView(student)}>
                                                    <Eye className='h-4 w-4'/>
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit(student)}>
                                                    <Pencil className='h-4 w-4'/>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className='text-destructive'
                                                    onClick={() => setPendingDelete(student)}
                                                >
                                                    <Trash2 className='h-4 w-4'/>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                    Page {page} of {totalPages}
                </span>
                <div className='flex gap-1'>
                    <Button
                        variant='outline'
                        size='icon'
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft className='h-4 w-4'/>
                    </Button>
                    <Button
                        variant='outline'
                        size='icon'
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight className='h-4 w-4'/>
                    </Button>
                </div>
            </div>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete student</DialogTitle>
                        <DialogDescription>
                            You are deleting {pendingDelete?.name} from your school. Do you want to proceed with this
                            action?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' disabled={deleting} onClick={handleConfirmDelete}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
